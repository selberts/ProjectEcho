var xmlhttp;

if (window.XMLHttpRequest)
  {// code for IE7+, Firefox, Chrome, Opera, Safari
  xmlhttp=new XMLHttpRequest();
  }
else
  {// code for IE6, IE5
  xmlhttp=new ActiveXObject("Microsoft.XMLHTTP");
  }




/*xmlhttp.onreadystatechange=function()
  {
  if (xmlhttp.readyState)
    {
    str=xmlhttp.responseText;
    }
  }*/

//Json data need to be passed to php
var json=
'{"team":[{"name":"Brett","pref1":"1,1","pref2":"2,2","pref3":"3,3"},'+
'{"name":"Jason","pref1":"4,4","pref2":"5,5","pref3":"6,6"},'+
'{"name":"Elliotte","pref1":"7,7","pref2":"8,8","pref3":"9,9"}]}';

//Access php and pass json and a parameter: 0 request data, 1 send data
xmlhttp.open("GET","will_project.php?p="+json+"&para=0",false);

//xmlhttp.setRequestHeader("Content-Type","application/x-www-form-urlencoded");

xmlhttp.send(null);

//Get the response from php
var str=xmlhttp.responseText;

//Evaluate json
//var obj=eval( "(" + str + ")" );


alert(str);
