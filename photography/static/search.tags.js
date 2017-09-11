/*var pckry = new Packery('.grid', {
    // options
    itemSelector: '.grid-item',
    gutter:0,
    transitionDuration: 0,
});*/

function tagsListener(tags_field, event) {
    //two different versions of this function for keydown and oninput as cellphones comma key -> , 
    //doesn't work with keydown but oninput doesn't pick up the enter key
    if ('keyCode' in event) {
        var key = event.keyCode;
        if (key == 44 || key == 13) {
            var entered_text = tags_field.value.trim();
            tags_field.value = "";
            if (entered_text != "")
                addChip(tags_field, entered_text)
            return false;

        }
    }
    else {
        var key = event.data.charCodeAt(0)
        if (key == 44) {
            var entered_text = tags_field.value.trim().slice(0, -1);
            tags_field.value = "";
            if (entered_text != "")
                addChip(tags_field, entered_text)
            return false;

        }
    }
}

function addChip(tags_field, chip_text) {
    var cloneable_chip = document.getElementById('cloneable-chip');
    var cloned_chip = cloneable_chip.cloneNode(true)

    cloned_chip.removeAttribute('style');
    cloned_chip.removeAttribute('id');
    cloned_chip.childNodes[0].nodeValue = chip_text;
    var chip_list = tags_field.parentNode.getElementsByClassName('chip-list')[0]
    //var chip_list = document.getElementById('chip-list');
    chip_list.append(cloned_chip);

}

//var tags_field = document.getElementById("input-tags");
///tags_field.addEventListener("keydown", tagsListener)

function deleteChip(chip) {
    chip.parentNode.parentNode.removeChild(chip.parentNode);
    document.getElementById('input-tags').focus();
}