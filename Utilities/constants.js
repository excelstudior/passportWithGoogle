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
    formateDateTime:function(value){
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
    },
    isDate:function(value){
        return !isNaN(Date.parse(value))
    }
}