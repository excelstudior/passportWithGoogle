var ticketURL = '/ticket';
var ticketForm = document.getElementById('ticket');

//validation , need to run with validate.js

function validateTicketInfoInput(){
    //create output messages array object
    var messages=[];
    //fields to be validated
    // var contactName=document.getElementById('contact-name');
    // var contactPhone=document.getElementById('contact-phone');
    // var contactEmail=document.getElementById('contact-email');

    var msgContactName=validateLength('contact-name',2);
    if (msgContactName!==undefined){
        messages.push(msgContactName)
    }

    //need to put a method to control keydown of digits only.
    var phonePattern='^[0][0-9]{9}$';
    var validatePhoneMsg="Phone number need to follow either of these formats, 0212341234,0400000000"
    var msgContactPhone=validateWithRegex('contact-phone',phonePattern,validatePhoneMsg)
    if (msgContactPhone!==undefined){
        messages.push(msgContactPhone)
    }

    //email
    var emailPattern='^[a-zA-Z0-9.!#$%&’*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$';
    var validateEmailMsg="Invalid Email"
    var msgContactEmail=validateWithRegex('contact-email',emailPattern,validateEmailMsg)
    if (msgContactEmail!==undefined){
        messages.push(msgContactEmail)
    }
    console.log(messages)
    return messages;
}

var submitTicket = function (e) {
    e.preventDefault();
    var messages=[];
    messages=validateTicketInfoInput();
    if (messages.length!=0){
        showErrorModal(messages);
        return;
    }

    var data = createFormDataObject(ticketForm)
    console.log('ticket ',data);
    fetch(ticketURL, {
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