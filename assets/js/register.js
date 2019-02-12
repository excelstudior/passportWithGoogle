var userRegisterURL = '/auth/register';
var registerUserForm = document.getElementById('superAdmin-UserRegisterForm');

var submitForm = function (e) {
    e.preventDefault();
    var isUserNameValid=validateInput('username','text');
    var isPassworkdValid=validateInput('password','password');
    if(!isPassworkdValid||!isUserNameValid){
        showErrorModal(['Please see errors'])
        return;
    }
    var data = createFormDataObject(registerUserForm)
    console.log(data);
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
