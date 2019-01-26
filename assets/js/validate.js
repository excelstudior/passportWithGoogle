var getElementAndName=function(Id){
    var result={}
    var element=document.getElementById(Id);
    var elementName='';
    if (element!==undefined && Id.indexOf('-')>-1){
        elementName =Id.replace('-',' ')
    }
    result.element=element;
    result.elementName=elementName;
    return result
}

var validateLength=function(Id,requiredLen){
    var domObject=getElementAndName(Id);
    if (domObject.element.value===undefined){
        return "Length is not a property of element " + Id;
    } else if (domObject.element.value.length<requiredLen) {
        return "Length of "+domObject.elementName+" is less than require value of "+ requiredLen;
    } 
}
var validateWithRegex=function(Id,regexStr,message){
    var domObject=getElementAndName(Id);
    var content=domObject.element.value;
    var regex=new RegExp(regexStr);
    if (!regex.test(content)){
        return domObject.elementName+" has error: \n\t"+ message;
    } 
}