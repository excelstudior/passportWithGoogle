var userRegisterURL = '/auth/register';
var registerUserForm = document.getElementById('registerUserForm');

var submitForm = function (e) {
    e.preventDefault();
    var data = createFormDataObject(registerUserForm)
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
