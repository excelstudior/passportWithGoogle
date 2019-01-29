var ticketURL = '/ticket';
var ticketForm = document.getElementById('ticket');

//validation , need to run with validate.js

function validateTicketInfoInput(){
    //create output messages array object
    var messages=[];

    var msgTicketSubject=validateLength('ticket-subject',2);
    if (msgTicketSubject!==undefined){
        messages.push(msgTicketSubject)
    }
    var msgTicketDescription=validateLength('ticket-description',2);
    if (msgTicketDescription!==undefined){
        messages.push(msgTicketDescription)
    }
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

function hasClass(el, className)
{
    if (el.classList)
        return el.classList.contains(className);
    return !!el.className.match(new RegExp('(\\s|^)' + className + '(\\s|$)'));
}
document.addEventListener('DOMContentLoaded',function() {
    document.querySelector('select[name="priority"]').onchange=changeEventHandler;
},false);

function changeEventHandler(event) {
    // You can use “this” to refer to the selected element.
    if(!event.target.value) alert('Please priority level');
    else {
        var newClassName='priority'+event.target.value;
        var classNameArray=event.target.className.split(' ');
        console.log(classNameArray)
        var checkStr=new RegExp('priority')
        classNameArray.forEach(function(cl){
            if (checkStr.test(cl)){
                event.target.classList.remove(cl)
            }
            
        })
        event.target.classList.add(newClassName);
        // var v=hasClass(event.target,newClassName)
        // alert (v)
    }; 
}