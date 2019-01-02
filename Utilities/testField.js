var randomNumber=Math.floor(Math.random()*25)
var charCode=randomNumber+65;
var letter=String.fromCharCode(charCode)
let charCodes=[]
for (let i=0;i<25;i++){
    let charCode=Math.floor(Math.random()*25)+65;
    charCodes.push(charCode);
}
console.log(charCodes)
let letterString=charCodes.reduce(function(arrString,el){
    let letter=String.fromCharCode(el)
    return arrString+letter
})

console.log(randomNumber,charCode,letter,letterString)