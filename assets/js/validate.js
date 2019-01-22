var validateLength=function(Id,requiredLen){
    var element=document.getElementById(Id);
    if (element.length===undefined){
        console.log('Length is not a valid property')
        return;
    } else if (element.length>=requiredLen) {
        return true;
    } else {
        return false;
    }
}