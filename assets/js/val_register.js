// validate inputs

var updateInputColorAndCheckIconColorAndUpdateMessge=function(element,elementName,elementColor,checkIconColor,message){
    message=message||0;
    element.style.backgroundColor=elementColor;
    var checkTagId=elementName+'_check';
    var messageTagId=elementName+'_msg';
    document.getElementById(checkTagId).style.color=checkIconColor;
    if(message){
        document.getElementById(messageTagId).innerHTML=message;
    } else {
        document.getElementById(messageTagId).innerHTML=null;
    }
  
}

var validateInput=function(elementName,typeName){
    var message=''
    var elements=document.getElementsByName(elementName)
    for(i=0;i<elements.length;i++){
        if(elements[i].type===typeName){
            switch (elementName){
                case 'username':
                    if (elements[i].value.length<=3){
                        message='User name need to be longer than 3 characters'
                        updateInputColorAndCheckIconColorAndUpdateMessge(elements[i],elementName,'beige','white',message)
                        return false;
                    } else {
                        updateInputColorAndCheckIconColorAndUpdateMessge(elements[i],elementName,'white','green')
                        return true
                    }
                    
                case 'password':
                    if (elements[i].value.length<=5){
                        message='Password needs to have at least 5 characters'
                        updateInputColorAndCheckIconColorAndUpdateMessge(elements[i],elementName,'beige','white',message)
                        return false
                    } else {
                        updateInputColorAndCheckIconColorAndUpdateMessge(elements[i],elementName,'white','green')
                        return true
                    }
                    
                default:return true
            }
        }
    }
};