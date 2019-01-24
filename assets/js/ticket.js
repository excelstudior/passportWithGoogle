var ticketURL = '/ticket';
var ticketForm = document.getElementById('ticket');

var submitTicket = function (e) {
    e.preventDefault();
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
    ).then(function(res){console.log(res.json().then(function(data){
        console.log('response from server ',data)
    }))})
    // .then(function (res) {
    //     if (res !== undefined) {
    //         if (res.redirected) {
    //             window.location.replace(res.url)
    //         }
    //         res.json().then(function (data) {
    //             var messages = data.messages;
    //             showErrorModal(messages);
    //         })
    //     }
    // })
}