var modal = document.getElementById('upload-modal');
var stored_files = [];
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
    console.log("TEST");
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
    xhr.send(JSON.stringify({ 'Images': stored_files }));
    console.log(stored_files);
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
        new_preview.classList.add('preview-image');

        loading_wrapper.appendChild(new_preview);

        wrapper_border.appendChild(loading_wrapper);
        wrapper_border.classList.add('preview-wrapper');

        preview_pane.appendChild(wrapper_border);

        stored_files.push(reader.result)
    }, false);

    reader.readAsDataURL(file);
}

function handleFileSelect(evt) {
    evt.stopPropagation();
    evt.preventDefault();
    var files = evt.dataTransfer.files
    for (i = 0; i < files.length; i++) {
        readFile(files[i]);
    }
}

var dragover = modal.getElementsByClassName('upload-window')[0];

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


window.addEventListener("dragover", function (e) {
    e = e || event;
    e.preventDefault();
}, false);
window.addEventListener("drop", function (e) {
    e = e || event;
    e.preventDefault();
}, false);