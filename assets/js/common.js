var toggle_visibility = function (element_id) {
    var e = document.getElementById(element_id);
    if (e.style.display === 'block' || e.style.display === '') {
        e.style.display = 'none';
    } else {
        e.style.display = 'block';
    }
}

// clear child element
var clearChildNode = function (elememnt) {
    while (elememnt.firstChild) {
        elememnt.removeChild(elememnt.firstChild)
    }
}

//create an new element
var createNode = function (elememnt) {
    return document.createElement(elememnt);
}
// add a child node to parent node
var appendNode = function (parentNode, childNode) {
    return parentNode.appendChild(childNode);
}

var createErrorListItems = function (errorMessages) {
    var errorList = document.getElementById('errorList');
    var previouslistItem;
    for (var i = 0; i < errorMessages.length; i++) {
        var li = createNode('li')
        li.innerHTML = errorMessages[i];
        console.log(li)
        if (i === 0) {
            clearChildNode(errorList)
            appendNode(errorList, li);
        } else {
            appendNode(previouslistItem, li)
        }
        previouslistItem = li;
    }

}
//Error Modal
var showErrorModal = function (errorMessages) {
    createErrorListItems(errorMessages);
    var errorModal = document.getElementById('errorModal');
    errorModal.style.display = 'block';
}
//Form Data Object
var createFormDataObject = function (form) {
    var formDataObject = {};
    for (var pair of new FormData(form)) {
        formDataObject[pair[0]] = pair[1]
    }
    return formDataObject;
}
