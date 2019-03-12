var toggle_display = function (element_id,style) {
    var e = document.getElementById(element_id);
    if (e.style.display === 'none' || e.style.display === '') {
        e.style.display = style;
    } else {
        e.style.display = 'none';
    }
}

var toggle_visibility = function (element_id) {
    var e = document.getElementById(element_id);
    if (e.style.visibility === 'hidden'||e.style.visibility==='') {
        e.style.visibility = 'visible';
    } else {
        e.style.visibility = 'hidden';
    }
}
 var hideElement=function(element_id){
    var e = document.getElementById(element_id);
    e.style.visibility='hidden';
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
            appendNode(errorList, li)
        }
        ///previouslistItem = li;
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
        formDataObject[pair[0]] = pair[1];
    };
    return formDataObject;
}
var testFormObject=function(formId){
    var form=document.getElementById(formId);
    var data=createFormDataObject(form);
    data=JSON.stringify(data);
    console.log(data);
}
//Dropdown 
////for dropdown menu/list 
var showDropdown = function (elememntId) {
    document.getElementById(elememntId).classList.toggle("dropdown-show");
}
////Close the dropdown menu if the user clicks outside of it
var toggleDropdownContent = function (dropDownId) {
    var dropdown = document.getElementById(dropDownId);
    if(dropdown!==null){
        if (dropdown.classList.contains('dropdown-show')) {
            dropdown.classList.remove('dropdown-show');
        }
    }
    
}
window.onclick = function (event) {
    var dropDownBtns = [{ btnId: '#userDropdownBtn', dropDownId: 'userDropdown' },
    { btnId: '#queueDropdownBtn', dropDownId: 'queueDropdown' },
    { btnId: '#ticketDropdownBtn', dropDownId: 'ticketDropdown' }
]
    for (var i = 0; i < dropDownBtns.length; i++) {
        if (!event.target.matches(dropDownBtns[i].btnId)) {
            toggleDropdownContent(dropDownBtns[i].dropDownId);
        }
    }
}
//End

function isArrayEqual(originalArr,newArr){
    if(originalArr.length!==newArr.length){
        return false;
    }
    for(var i=0;i<originalArr.length;i++){
        if (newArr.indexOf(originalArr[i])<0){
            return false;
        }
    }
    return true;
}

//date time formater
function formateDateTime(value){
    if (this.isDate(value)){
        var year=value.getFullYear().toString();
        var month=('0'+(value.getMonth()+1).toString()).substring(-1,2);
        var date=('0'+(value.getDate()).toString()).substring(-1,2);
        var hour=('0'+(value.getHours()).toString()).substring(-1,2);
        var minute=('0'+(value.getMinutes()).toString()).substring(-1,2);
        var second=('0'+(value.getSeconds()).toString()).substring(-1,2);
        return year+'-'+month+'-'+date+' '+hour+':'+minute+':'+second;
    }else{
        return ""
    }
}
function isDate(value){
    return !isNaN(Date.parse(value))
}

//end

//textarea
function textAreaAutoAdjust(textArea){
    textArea.style.height='auto';
    textArea.style.height= (5+textArea.scrollHeight)+"px";

}
// Observer object for audit
var Observer=function(){
    var _messages={};
    var regist=function(type,fn){
        if (typeof _messages[type]==='undefined'){
            _messages[type]=[fn];
        } else {
            _messages[type].push[fn];
        }
    }
    var fire=function(type,args){
        if(!_messages[type])
        return;
        var events={
            type:type,
            args:args||{}
        };
        var len=_messages[type].length;
        for (var i=0;i<len;i++){
            _messages[type][i].call(this,events);
        }

    }
    var remove=function(type,fn){
        if (_messages[type] instanceof Array){
            var len=_messages[type].length-1;
            for (var i=len;i>=0;i--){
                _messages[type][i]===fn && _messages[type].splice(i,1);
            }

        }
    }
    return {
        regist:regist,
        fire:fire,
        remove:remove,
    }
}