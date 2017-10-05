var modal = document.getElementById('upload-modal');
var stored_files = {};
var preview_pane = document.getElementById('upload-preview');
var ctrl_pressed = false;
var a_pressed = false;

var isAdvancedUpload = function () {
    var div = document.createElement('div');
    return (('draggable' in div) || ('ondragstart' in div && 'ondrop' in div)) && 'FormData' in window && 'FileReader' in window;
}();

document.onselectstart = new Function("return false");
document.addEventListener("keydown", function(event){
    var i = 0;

    if (document.getElementById('upload-modal').classList.contains('active'))
        var key = event.keyCode;
        if (key == 17)
            ctrl_pressed = true;
        else if (key == 65)
            a_pressed = true;

        if (ctrl_pressed && a_pressed){
            var wrappers = preview_pane.getElementsByClassName('preview-wrapper');
            var selected = preview_pane.getElementsByClassName('selected-image');
            if (selected.length == 0 || selected.length == wrappers.length){
               for (i = 0; i < wrappers.length; i++){
                   setSelected(wrappers[i]);
                }
            }
            else{
                for (i = 0; i < wrappers.length; i++){
                    if (!wrappers[i].classList.contains('selected-image'))
                        setSelected(wrappers[i]);
                }
            }
        }

});

document.addEventListener("keyup", function(event){
    if (document.getElementById('upload-modal').classList.contains('active'))
        var key = event.keyCode;
        if (key == 17)
            ctrl_pressed = false;
        else if (key == 65)
            a_pressed = false;
});



function showUploadModal() {
    modal.classList.add('active');
    if (isAdvancedUpload)
        document.getElementById('upload-drag').style.display = 'inline';
}

function clearUploads() {
    stored_files = [];
    preview_pane.innerHTML = "";
    modal.getElementsByClassName('modal-footer')[0].getElementsByClassName('btn-primary')[0].classList.add('upload-option')
    modal.getElementsByClassName('modal-footer')[0].getElementsByClassName('btn-primary')[1].classList.add('upload-option')
    
    var toasts = modal.getElementsByClassName('modal-footer')[0].getElementsByClassName('toast')
    for (i = 0; i < toasts.length; i++) {
        toasts[i].classList.add('upload-option')
    }

    document.getElementById('metadata-window').classList.add('upload-option');
    document.getElementById('input-first').value = ""
    document.getElementById('input-last').value = ""
    document.getElementById('input-email').value = ""
    document.getElementById('input-tags').value = ""
    var chips = modal.getElementsByClassName('chip')
    while(chips.length>1) {
        chips[1].parentElement.removeChild(chips[1]);
    }
}

function sendRequest(photo) {
    var xhr = new XMLHttpRequest();
    xhr.open('POST', '/');
    xhr.setRequestHeader("CONTENT-TYPE", "application/javascript");
    xhr.setRequestHeader("X-CSRFToken", document.getElementsByName('csrfmiddlewaretoken')[0].value)
    xhr.onreadystatechange = function () {
        var DONE = 4; // readyState 4 means the request is done.
        var OK = 200; // status 200 is a successful return.
        if (xhr.readyState === DONE) {
            if (xhr.status === OK) {
                response = JSON.parse(xhr.responseText)

                document.getElementById('upload-info').classList.add('upload-option')
                document.getElementById('upload-complete').classList.remove('upload-option')

                var imgdiv = preview_pane.querySelector('[filename="' + response['filename'] + '"]')

                var success_icon = document.createElement('i');
                success_icon.classList.add('icon', 'icon-check', 'bg-success', 'text-dark');

                imgdiv.parentElement.appendChild(success_icon);
                imgdiv.parentElement.classList.remove('loading', 'loading-lg');

                delete stored_files[response['filename']];

            } else {
                document.getElementById('upload-info').classList.add('upload-option')
                document.getElementById('upload-error').classList.remove('upload-option')

                var imgdiv = preview_pane.querySelector('[filename="' + photo + '"]')

                var error_icon = document.createElement('i');
                error_icon.classList.add('icon', 'icon-cross', 'bg-error', 'text-dark');

                imgdiv.parentElement.appendChild(error_icon);
                imgdiv.parentElement.classList.remove('loading', 'loading-lg');
            }
        }
    };
    xhr.send(JSON.stringify({ "filename": photo, "data": stored_files[photo] }));
}

function uploadImages() {
    var preview_images = preview_pane.getElementsByTagName('img')
    for (i = 0; i < preview_images.length; i++) {
        if (preview_images[i].parentElement.getElementsByClassName("icon").length == 0) {
            preview_images[i].parentElement.classList.add('loading');
            preview_images[i].parentElement.classList.add('loading-lg');
            if (preview_images[i].parentElement.parentElement.classList.contains('selected-image')) {
                preview_images[i].parentElement.parentElement.classList.remove('selected-image')
                changeMetadata(preview_images[i])
            }
        }
    }
    //preview_pane.innerHTML = "";
    document.getElementById('upload-info').classList.remove('upload-option')
    modal.getElementsByClassName('modal-footer')[0].getElementsByClassName('btn-primary')[0].classList.add('upload-option')
    //modal.getElementsByClassName('modal-footer')[0].getElementsByClassName('btn-primary')[1].classList.add('upload-option')




    //send each photo as individual request so if one fails it can be handled individually, additionally maximum size requirements per request
    for (var photo in stored_files) {
        sendRequest(photo)
    }
}

function setSelected(elem){    
    if (elem.classList.contains('selected-image')) {
        //console.log("Selected:");
        //console.log(elem);
        elem.classList.remove("selected-image")
        changeMetadata(elem.getElementsByTagName('img')[0])
        if (document.getElementsByClassName('selected-image').length == 0) {
            document.getElementById('metadata-window').classList.add('upload-option');
            document.getElementById('input-first').value = ""
            document.getElementById('input-last').value = ""
            document.getElementById('input-email').value = ""
            document.getElementById('input-tags').value = ""
            chips = modal.getElementsByClassName('chip')
            while(chips.length > 1) {
                chips[1].parentElement.removeChild(chips[1]);
            }
        }
    }

    else {
        //console.log("Not SELECTED:");
        //console.log(elem);
        elem.classList.add("selected-image")
        if (document.getElementsByClassName('selected-image').length == 1) {
            var filename = elem.getElementsByTagName('img')[0].getAttribute('filename')
            document.getElementById('input-first').value = stored_files[filename]['photographer']['first']
            document.getElementById('input-last').value = stored_files[filename]['photographer']['last']
            document.getElementById('input-email').value = stored_files[filename]['photographer']['email']
            var tags_field = document.getElementById('input-tags')
            for (var i = 0; i < stored_files[filename]['tags'].length;i++)
            addChip(tags_field, stored_files[filename]['tags'][i])
            
        }
        document.getElementById('metadata-window').classList.remove('upload-option');
    }
}

function imageClick(evt) {
    if (evt.target.nodeName == "DIV") {
        var elem = evt.target
        if (!elem.classList.contains("preview-wrapper"))
            elem = elem.parentElement;
    } else
        var elem = evt.target.parentElement.parentElement

    if (elem.classList.contains('loading') || elem.getElementsByClassName('loading').length != 0 || elem.getElementsByTagName('i').length != 0) {
        return;
    }

    setSelected(elem);
    
}

function readFile(file) {
    var reader = new FileReader();

    reader.addEventListener("load", function (i) {
        modal.getElementsByClassName('modal-footer')[0].getElementsByClassName('btn-primary')[0].classList.remove('upload-option')
        modal.getElementsByClassName('modal-footer')[0].getElementsByClassName('btn-primary')[1].classList.remove('upload-option')

        var wrapper_border = document.createElement('div')
        var loading_wrapper = document.createElement('div')

        var new_preview = document.createElement('img')
        new_preview.setAttribute('src', reader.result);
        new_preview.setAttribute('filename', reader.fileName);
        wrapper_border.addEventListener('click', imageClick);
        new_preview.classList.add('preview-image');

        loading_wrapper.appendChild(new_preview);

        wrapper_border.appendChild(loading_wrapper);
        wrapper_border.classList.add('preview-wrapper');

        preview_pane.appendChild(wrapper_border);

        stored_files[reader.fileName] = { 'image': reader.result, 'photographer': { 'first': null, 'last': null, 'email': null }, 'tags': [] };
    }, false);

    if (preview_pane.querySelectorAll('[filename="' + file.name + '"]').length == 0){
        reader.fileName = file.name;
    }
    else{
        //console.log(preview_pane.querySelectorAll('[filename="' + file.name + '"]').length)
        var i = 1;
        do
            i++
        while(preview_pane.querySelectorAll('[filename="' + i + '-' + file.name + '"]').length != 0);
            reader.fileName = i +'-' + file.name;
    }
    reader.readAsDataURL(file);
}

function handleFileSelect(evt) {
    document.getElementById('upload-complete').classList.add('upload-option')
    document.getElementById('upload-complete').classList.add('upload-error')
    document.getElementById('upload-complete').classList.add('upload-info')
    document.getElementById('upload-error-type').classList.add('upload-option')

    evt.stopPropagation();
    evt.preventDefault();
    try {
        var files = evt.dataTransfer.files
    } catch (e) {
        var files = document.getElementById('upload-choose').files
    }

    for (i = 0; i < files.length; i++) {

        if (files[i].type.match(/image\/*/))
            readFile(files[i]);
        else
            document.getElementById('upload-error-type').classList.remove('upload-option')
    }
}

var dragover = document.getElementById('upload-window');

dragover.addEventListener("dragover", function () {
    this.classList.add('is-dragover');
});
dragover.addEventListener("dragenter", function () {
    this.classList.add('is-dragover');
});
dragover.addEventListener("dragleave", function () {
    this.classList.remove('is-dragover');
});
dragover.addEventListener("dragend", function () {
    this.classList.remove('is-dragover');
});
dragover.addEventListener("drop", handleFileSelect, true);
document.getElementById('upload-choose').addEventListener('change', handleFileSelect, true);



window.addEventListener("dragover", function (e) {
    e = e || event;
    e.preventDefault();
}, false);
window.addEventListener("drop", function (e) {
    e = e || event;
    e.preventDefault();
}, false);

function hideToast(toast) {
    toast.parentElement.classList.add("upload-option");
}

function changeMetadata(photograph) {
    var filename = photograph.getAttribute('filename')
    stored_files[filename]['photographer']['first'] = document.getElementById('input-first').value
    stored_files[filename]['photographer']['last'] = document.getElementById('input-last').value
    stored_files[filename]['photographer']['email'] = document.getElementById('input-email').value
    stored_files[filename]['tags'] = []
    var chips = modal.getElementsByClassName('chip')
    for (i = 1; i < chips.length; i++) {
        stored_files[filename]['tags'].push(chips[i].childNodes[0].nodeValue)
    }
}
