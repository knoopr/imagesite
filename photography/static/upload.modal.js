var modal = document.getElementById('upload-modal');
var stored_files = {};
var preview_pane = document.getElementById('upload-preview');


var isAdvancedUpload = function () {
    var div = document.createElement('div');
    return (('draggable' in div) || ('ondragstart' in div && 'ondrop' in div)) && 'FormData' in window && 'FileReader' in window;
}();

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
}

function uploadImages() {
    var preview_images = preview_pane.getElementsByTagName('img')
    for (i = 0; i < preview_images.length; i++) {
        preview_images[i].style.opacity = '0.4';
        preview_images[i].parentElement.classList.add('loading');
        preview_images[i].parentElement.classList.add('loading-lg');
    }
    //preview_pane.innerHTML = "";
    document.getElementById('upload-info').classList.remove('upload-option')
    modal.getElementsByClassName('modal-footer')[0].getElementsByClassName('btn-primary')[0].classList.add('upload-option')
    modal.getElementsByClassName('modal-footer')[0].getElementsByClassName('btn-primary')[1].classList.add('upload-option')

    var xhr = new XMLHttpRequest();
    xhr.open('POST', '.');
    xhr.setRequestHeader("CONTENT-TYPE", "application/javascript");
    xhr.setRequestHeader("X-CSRFToken", document.getElementsByName('csrfmiddlewaretoken')[0].value)
    xhr.onreadystatechange = function () {
        var DONE = 4; // readyState 4 means the request is done.
        var OK = 200; // status 200 is a successful return.
        if (xhr.readyState === DONE) {
            if (xhr.status === OK) {
                console.log(xhr.responseText); // 'This is the returned text.'

                document.getElementById('upload-info').classList.add('upload-option')
                document.getElementById('upload-complete').classList.remove('upload-option')

                stored_files = [];
                preview_pane.innerHTML = "";

            } else {
                console.log('Error: ' + xhr.status); // An error occurred during the request.
            }
        }
    };
    xhr.send(JSON.stringify(stored_files ));
    console.log(stored_files);
}

function imageClick(evt){
    if (evt.target.nodeName == "DIV")
        var elem = evt.target
    else
        var elem = evt.target.parentElement.parentElement

    if (elem.classList.contains('loading')){
       return;
    }

    if (elem.classList.contains('selected-image')){
        elem.classList.remove("selected-image")
        changeMetadata(elem.getElementsByTagName('img')[0])
        if (document.getElementsByClassName('selected-image').length == 0){
            document.getElementById('metadata-window').classList.add('upload-option');
            document.getElementById('input-first').value = ""
            document.getElementById('input-last').value = ""
            document.getElementById('input-email').value = ""
            document.getElementById('input-tags').value = ""

        }
    }
    
    else{
        elem.classList.add("selected-image")
        if (document.getElementsByClassName('selected-image').length == 1){
            var filename = elem.getElementsByTagName('img')[0].getAttribute('filename')
            document.getElementById('input-first').value = stored_files[filename]['photographer']['first']
            document.getElementById('input-last').value = stored_files[filename]['photographer']['last']
            document.getElementById('input-email').value = stored_files[filename]['photographer']['email']
        }
        document.getElementById('metadata-window').classList.remove('upload-option');
    }
}

function readFile(file) {
    var reader = new FileReader();

    reader.addEventListener("load", function (i) {
        //console.log(reader.result);
        modal.getElementsByClassName('modal-footer')[0].getElementsByClassName('btn-primary')[0].classList.remove('upload-option')
        modal.getElementsByClassName('modal-footer')[0].getElementsByClassName('btn-primary')[1].classList.remove('upload-option')
        
        var wrapper_border = document.createElement('div')
        var loading_wrapper = document.createElement('div')

        var new_preview = document.createElement('img')
        new_preview.setAttribute('src', reader.result);
        new_preview.setAttribute('filename', reader.fileName);
        wrapper_border.addEventListener('click',imageClick);
        new_preview.classList.add('preview-image');

        loading_wrapper.appendChild(new_preview);

        wrapper_border.appendChild(loading_wrapper);
        wrapper_border.classList.add('preview-wrapper');

        preview_pane.appendChild(wrapper_border);

        stored_files[reader.fileName]={'image':reader.result,'photographer':{'first':null,'last':null,'email':null},'tags':[]};
    }, false);

    reader.fileName = file.name;
    reader.readAsDataURL(file);
}

function handleFileSelect(evt) {
    document.getElementById('upload-complete').classList.add('upload-option')
    document.getElementById('upload-complete').classList.add('upload-error')
    document.getElementById('upload-complete').classList.add('upload-info')
    document.getElementById('upload-error-type').classList.add('upload-option')
    
    evt.stopPropagation();
    evt.preventDefault();
    try{
        var files = evt.dataTransfer.files
    }catch (e){
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

function changeMetadata(photograph){
    var filename = photograph.getAttribute('filename')
    stored_files[filename]['photographer']['first'] = document.getElementById('input-first').value
    stored_files[filename]['photographer']['last'] = document.getElementById('input-last').value
    stored_files[filename]['photographer']['email'] = document.getElementById('input-email').value
    console.log(stored_files)
}