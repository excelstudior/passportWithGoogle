var toggle_visibility=function(element_id){
    var e=document.getElementById(element_id);
    if (e.style.display==='block'||e.style.display===''){
        e.style.display='none';
    } else {
        e.style.display='block';
    }
}

var clearChildNode=function(elememnt){
    while (elememnt.firstChild){
        elememnt.removeChild(elememnt.firstChild)
    }
}

//create an new element
var createNode=function(elememnt){
    return document.createElement(elememnt);
} 
// add a child node to parent node
var appendNode=function(parentNode,childNode){
    return parentNode.appendChild(childNode);
}