function sizeImageModal() {
    var modal = document.getElementById('display-modal');
    if (!modal.classList.contains('active'))
        return;
    var modal_image = document.getElementById('modal-image')
    var container_elem = modal.getElementsByClassName("modal-container")[0]
    var header_elem = modal.getElementsByClassName("modal-header")[0]
    //var footer_elem = modal.getElementsByClassName("modal-footer")[0]

    modal_image.style.width = "100%";
    modal_image.style.height = "auto";

    if (modal_image.naturalWidth < modal_image.clientWidth)
        modal_image.style.width = modal_image.naturalWidth + "px";

    if (modal_image.clientHeight > container_elem.clientHeight) {
        modal_image.style.height = container_elem.clientHeight - header_elem.clientHeight + "px";
        modal_image.style.width = "auto";

        if (modal_image.naturalHeight < modal_image.clientHeight)
            modal_image.style.height = modal_image.naturalHeight + "px";

    }

    //footer_elem.style.width = modal_image.clientWidth + "px";
}

function showImageModal(parent) {
    var modal = document.getElementById('display-modal');
    var modal_image = document.getElementById('modal-image')
    var container_elem = modal.getElementsByClassName("modal-container")[0]
    var header_elem = modal.getElementsByClassName("modal-header")[0]
    //var footer_elem = modal.getElementsByClassName("modal-footer")[0]
    //console.log(footer_elem.getElementsByClassName("form-input")[0]);

    modal.classList.add('active');

    var photographer = parent.getAttribute('photographer')
    var contact_email = parent.getAttribute('contactemail')
    //var tags = parent.getAttribute('tags')
    var image = parent.getAttribute('src')

    /*if (tags.indexOf("'") > -1) {
        tags = tags.split("'").join('"');
    }
    tags = JSON.parse(tags);*/

    document.getElementById('photographer-link').innerText = photographer;
    document.getElementById('photographer-link').setAttribute('href', "mailto:" + contact_email);

    modal_image.setAttribute('src', image);

    /*for (i in tags) {
        addChip(footer_elem.getElementsByClassName("form-input")[0], tags[i]);
    }*/

    sizeImageModal();
}

function changeImage(event){
    var modal = document.getElementById('display-modal');  
    if (modal.classList.contains('active')){
        var key = event.keyCode;
        
        if (key == 27){
            hideModal('display-modal')
        }else if (key == 37){
            var src = document.getElementById('modal-image').getAttribute('src')
            var grid_elem = document.getElementById('grid-container').getElementsByClassName('grid')[0];
            var node = grid_elem.querySelector('[src="' + src + '"]').parentNode
            var parent = node.parentNode
            var i = 0;
            var index = Array.prototype.indexOf.call(parent.children, node);
            if (index != 0){
                showImageModal(parent.children[index-1].children[0])
            }
            else{
                showImageModal(parent.children[parent.children.length-1].children[0])
            }
        }else if (key == 39){
            var src = document.getElementById('modal-image').getAttribute('src')
            var grid_elem = document.getElementById('grid-container').getElementsByClassName('grid')[0];
            var node = grid_elem.querySelector('[src="' + src + '"]').parentNode
            var parent = node.parentNode
            var i = 0;
            var index = Array.prototype.indexOf.call(parent.children, node);
            if (index != (parent.children.length-1)){
                showImageModal(parent.children[index+1].children[0])
            }
            else{
                showImageModal(parent.children[0].children[0])
            }
        }
    }
}

document.addEventListener("keydown",changeImage);
window.addEventListener("resize", sizeImageModal);