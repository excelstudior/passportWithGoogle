var toggle_visibility=function(element_id){
    var e=document.getElementById(element_id);
    if (e.style.display==='block'||e.style.display===''){
        e.style.display='none';
    } else {
        e.style.display='block';
    }
}