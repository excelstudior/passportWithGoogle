module.exports = {
    userType: {
        ADMIN: 'Admin',
        END_USER: 'End User',
        GUEST:'Guest',
        CLIENT:'Client',
        SUPERADMIN:'Super Admin',
    },
    ticketStatus:{
        OPEN:'Open',
        AWAITCLIENTRESPONSE:'Await Client Response',
        PROGRESSING:'Progressing',
        RESOLVED:'Resolve',
        
    },
    randomeString: function (length) {
        // function will return and string of random uppercase letters, length of the string is a parameter
        let charCodes = []
        for (let i = 0; i < length; i++) {
            let charCode = Math.floor(Math.random() * 25) + 65;
            charCodes.push(charCode);
        }
        let letterString = charCodes.reduce(function (arrString, el) {
            let letter = String.fromCharCode(el)
            return arrString + letter
        })
        return letterString
    },
}