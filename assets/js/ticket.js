var ticketURL = '/ticket';
var ticketForm = document.getElementById('ticket');

//validation , need to run with validate.js

function validateTicketInfoInput() {
    //create output messages array object
    var messages = [];

    var msgTicketSubject = validateLength('ticket-subject', 2);
    if (msgTicketSubject !== undefined) {
        messages.push(msgTicketSubject)
    }
    var msgTicketDescription = validateLength('ticket-description', 2);
    if (msgTicketDescription !== undefined) {
        messages.push(msgTicketDescription)
    }
    var msgContactName = validateLength('contact-name', 2);
    if (msgContactName !== undefined) {
        messages.push(msgContactName)
    }

    //need to put a method to control keydown of digits only.
    var phonePattern = '^[0][0-9]{9}$';
    var validatePhoneMsg = "Phone number need to follow either of these formats, 0212341234,0400000000"
    var msgContactPhone = validateWithRegex('contact-phone', phonePattern, validatePhoneMsg)
    if (msgContactPhone !== undefined) {
        messages.push(msgContactPhone)
    }

    //email
    var emailPattern = '^[a-zA-Z0-9.!#$%&’*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$';
    var validateEmailMsg = "Invalid Email"
    var msgContactEmail = validateWithRegex('contact-email', emailPattern, validateEmailMsg)
    if (msgContactEmail !== undefined) {
        messages.push(msgContactEmail)
    }
    console.log(messages)
    return messages;
}
//submit new ticket
var submitTicket = function (e) {
    e.preventDefault();
    var messages = [];
    messages = validateTicketInfoInput();
    if (messages.length != 0) {
        showErrorModal(messages);
        return;
    }

    var data = createFormDataObject(ticketForm)
    console.log('ticket ', data);
    fetch(ticketURL, {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            "Content-Type": "application/json"
        },
        body: JSON.stringify(data),
    }).then(function (res) {
        if (res !== undefined) {
            if (res.redirected) {
                window.location.replace(res.url)
            }
            res.json().then(function (data) {
                var messages = data.messages;
                showErrorModal(messages);
            })
        }
    })

}

function hasClass(el, className) {
    if (el.classList)
        return el.classList.contains(className);
    return !!el.className.match(new RegExp('(\\s|^)' + className + '(\\s|$)'));
}

// window.onload=function(){
//     document.addEventListener('DOMContentLoaded',function() {
//         document.querySelector('select[name="priority"]').onchange=changeEventHandler;
//     },false);
// }

//change priority dropdown color
function changeEventHandler(event) {
    // You can use “this” to refer to the selected element.
    if (!event.target.value) alert('Please priority level');
    else {
        var newClassName = 'priority' + event.target.value;
        var classNameArray = event.target.className.split(' ');
        console.log(classNameArray)
        var checkStr = new RegExp('priority')
        classNameArray.forEach(function (cl) {
            if (checkStr.test(cl)) {
                event.target.classList.remove(cl)
            }

        })
        event.target.classList.add(newClassName);
    };
}
function modifyTags(tagsDivId, tagToRemove) {
    var Tags = getTags(tagsDivId);
    var TagsDiv = document.getElementById(tagsDivId);
    if (Tags.indexOf(tagToRemove) > -1) {
        var newTags = []
        Tags.forEach(function (tag) {
            if (tag !== tagToRemove) {
                newTags.push(tag);
            }
        })
        TagsDiv.value = newTags.toString()
    }
}
/* handle tag change */
////need to add a check to remove duplicate tag value
function getTags(elementId) {
    var tagsInput = document.getElementById(elementId)
    var newTags = tagsInput.value.split(',');
    var tags = []
    //trim string, remove empty strings
    newTags.forEach(function (tag) {
        var tryTrim = tag.trim()
        if (tryTrim !== '' && tags.indexOf(tag) < 0) {
            tags.push(tryTrim);
        }
    })
    return tags
}
function removeTag() {
    alert('going to remove tag!')
    //get tag name
    var listItemId = event.target.title;
    var tagToRemove = listItemId != undefined || listItemId != "" ? listItemId.substring(4, listItemId.length) : ""
    console.log(listItemId)
    //get original tags
    var originalTags = getTags('ticket-original-tags')
    //get ticket Id
    var originalTagsDiv = document.getElementById("ticket-original-tags");
    var ticketId = originalTagsDiv.name;
    //modifiy original tags
    var newTags = [];
    originalTags.forEach(function (tag) {
        if (tag !== tagToRemove) {
            newTags.push(tag);
        }
    })
    //fetch post to update tags
    var data = { tags: newTags };
    var updateTagsURL = '/ticket/edit/tags/' + ticketId;
    fetch(updateTagsURL, {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            "Content-Type": "application/json"
        },
        body: JSON.stringify(data),
    }).then(function (res) {
        if (res.status === 200) {
            //remove the deleted item for li
            var itemToRemove = document.getElementById(listItemId)
            var parentItem = document.getElementById('ticket-tags-list');
            parentItem.removeChild(itemToRemove)
            //update newTags tagsInput
            modifyTags('ticket-tags-newTags', tagToRemove)
            //update original tagsInput
            modifyTags('ticket-original-tags', tagToRemove)
        } else {
            showErrorModal(['There is an error'])
        }
    }).catch(function (err) {
        showErrorModal(['There is an error']);
        console.log(err);
    })
    //handle error

}
function renderTags(tags, tagDiv) {
    var tagsDiv = document.getElementById(tagDiv)
    clearChildNode(tagsDiv);
    for (var i = 0; i < tags.length; i++) {
        var li = createNode('li');
        var a = createNode('a')
        var span = createNode('span')
        span.innerHTML = 'x';
        var listItemId = 'tag' + '-' + tags[i];
        span.title = listItemId;
        span.addEventListener('click', removeTag)
        //span.onclick=removeTag();
        a.classList.add('tag')
        a.innerHTML = tags[i];
        li.id = listItemId
        a.insertBefore(span, a.childNodes[0])
        //appendNode(a,span)
        appendNode(li, a)
        appendNode(tagsDiv, li)
    }
}

function saveEditedTags() {
    var newTags = getTags("ticket-tags-newTags");
    var originalTagsDiv = document.getElementById("ticket-original-tags");
    var ticketId = originalTagsDiv.name;
    var data = { tags: newTags };
    var updateTagsURL = '/ticket/edit/tags/' + ticketId;
    fetch(updateTagsURL, {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            "Content-Type": "application/json"
        },
        body: JSON.stringify(data),
    }).then(function (res) {
        if (res.status === 200) {
            originalTagsDiv.value = newTags.toString();
            renderTags(newTags, 'ticket-tags-list');
            hideElement('ticket-tags-edit');
        } else {
            showErrorModal(['There is an error'])
        }
    }).catch(function (err) {
        showErrorModal(['There is an error']);
        console.log(err)
    })

}

function closeAddTagsPopup() {
    var newTags = getTags("ticket-tags-newTags");
    var originalTags = getTags("ticket-original-tags");
    var ifTagsUpdated = isArrayEqual(originalTags, newTags)
    var originalTagsDiv = document.getElementById("ticket-original-tags")
    if (!ifTagsUpdated) {
        if (confirm('Do you want to save new tags!')) {
            //need to put save new tags method below
            alert('Saving new tags')
            renderTags(newTags, 'ticket-tags-list')
            originalTagsDiv.value = newTags.toString();
            hideElement('ticket-tags-edit');
        } else {
            var editTagsDiv = document.getElementById("ticket-tags-newTags")
            editTagsDiv.value = originalTagsDiv.value;
            hideElement('ticket-tags-edit');
        }
    } else {
        hideElement('ticket-tags-edit');
    }

}
//end
function saveTicket(event) {
    event.preventDefault();
    var messages = [];
    messages = validateTicketInfoInput();
    if (messages.length != 0) {
        showErrorModal(messages);
        return;
    }
    var ticketId = event.target.parentNode.id;
    alert('saving ticket ' + ticketId);
    var data = createFormDataObject(ticketForm)
    //data.ticketId=ticketId;
    var updateTicketURL = ticketURL + '/' + ticketId;
    fetch(updateTicketURL, {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            "Content-Type": "application/json"
        },
        body: JSON.stringify(data),
    }).then(function (res) {
        if (res !== undefined) {
            if (res.status === 200) {
                window.location.replace('/ticket/LoggedInUserTickets')
                return
            }
            res.json().then(function (data) {
                var messages = data.messages;
                showErrorModal(messages);
            })
        }
    })

}
function renderUpdatesList(update){
    console.log('update obj ',update)
    var updatesDiv=document.getElementById('ticket-update-items');
    var newListItem=createNode('li');
    var newUpdateItem=createNode('div');
    newUpdateItem.id='ticket-update-item';

    var updateDivHeader=createNode('div');
    updateDivHeader.id='ticket-update-item-header';
    var updateDivContent=createNode('div')
    updateDivContent.id= 'ticket-update-item-content';
    // user name
    var updateUserNameSpan=createNode('span');
    var userName=createNode('strong');
    userName.innerHTML=update.user.userName;
    appendNode(updateUserNameSpan,userName);
    updateUserNameSpan.innerHTML+=' updated at:'
    // update date time
    var updateDateTimeSpan=createNode('span');
    var boldTextNode=createNode('b');
    var dateTimeNode=createNode('i');
    var dateTime=formateDateTime(new Date(update.date));
    // var dateTime=dateTime;
    dateTimeNode.innerHTML=dateTime;
    appendNode(updateDateTimeSpan,boldTextNode);
    appendNode(boldTextNode,dateTimeNode);
    appendNode(updateDivHeader,updateUserNameSpan);
    appendNode(updateDivHeader,updateDateTimeSpan);
    // content of update
    var updateItemContentNode=createNode('cite');
    updateItemContentNode.innerHTML=update.content;
    appendNode(updateDivContent,updateItemContentNode);
    appendNode(newUpdateItem,updateDivHeader)
    appendNode(newUpdateItem,updateDivContent);
    appendNode(newListItem,newUpdateItem);
    updatesDiv.insertBefore(newListItem,updatesDiv.childNodes[0]);
}
function addTicketUpdateText(event) {
    event.preventDefault();
    var updateTextArea=document.getElementById('ticket-update')
    var updateContent = updateTextArea.value;
    if (updateContent === "") {
        alert('Update content is empty!');
        return
    }
    var updateData = { update: updateContent };
    var ticketId = event.target.id;
    var addTicketUpdateURL = ticketURL + '/update/' + ticketId;
    fetch(addTicketUpdateURL, {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            "Content-Type": "application/json"
        },
        body: JSON.stringify(updateData),
        redirect:"manual",
    }).then(function (res) {
        if (res !== undefined) {
            if (res.status === 200) {
                res.json().then(function(data){
                    var update=data.update;
                    renderUpdatesList(update);
                    updateTextArea.value='';
                })

            } else {
                showErrorModal(['Error'])
            }
        }
    }).catch(function (err) {
        console.log(err)
    })
}

