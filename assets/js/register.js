var userRegisterURL = '/auth/register';
var registerUserForm = document.getElementById('registerUserForm');
var createFormDataObject = function () {
    var formDataObject = {};
    for (var pair of new FormData(registerUserForm)) {
        formDataObject[pair[0]] = pair[1]
    }
    return formDataObject;
}

var submitForm = function (e) {
    e.preventDefault();
    var data = createFormDataObject()
    fetch(userRegisterURL, {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            "Content-Type": "application/json"
        },
        body: JSON.stringify(data),
    }
    ).then(function (res) {
        if (res !== undefined) {
            if(res.redirected){
                window.location.replace(res.url)
            }
            res.json().then(function (data) {
                var errorList = document.getElementById('errorList');
                var previouslistItem;
                var messages = data.messages;
                for (var i = 0; i < messages.length; i++) {
                    var li = createNode('li')
                    li.innerHTML = messages[i];
                    console.log(li)
                    if (i === 0) {
                        clearChildNode(errorList)
                        appendNode(errorList, li);
                    } else {
                        appendNode(previouslistItem, li)
                    }
                    previouslistItem = li;
                }
                var errorModal = document.getElementById('errorModal');
                errorModal.style.display = 'block';
            })
        }
    })
}
