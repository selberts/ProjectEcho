<?php

//create the DOM object
$xmlDoc=new DOMDocument();

//laod xml file
$xmlDoc->load("smalldb.xml");

//get the root element
$root=$xmlDoc->getElementsByTagName("teams")->item(0);



//Get variable para from url
$op=$_GET["op"];

if($op){   //para=1,receive data
//Receive json data from javascript
$jtext=$_GET["jtext"];
//Decode jason data
$json=json_decode($jtext);

for($i=0;$i<5;$i++){

    $idstr=$json[$i]->id;
    $namestr=$json[$i]->team_name;
    $p1str=$json[$i]->pref_days[0] . " " . $json[$i]->pref_times[0];
    $p2str=$json[$i]->pref_days[1] . " " . $json[$i]->pref_times[1];
    $p3str=$json[$i]->pref_days[2] . " " . $json[$i]->pref_times[2];

	$newnode=$xmlDoc->createElement("team");
	$id=$xmlDoc->createElement("id");$idtext=$xmlDoc->createTextNode($idstr);$id->appendChild($idtext);
	$name=$xmlDoc->createElement("team_name");$ntext=$xmlDoc->createTextNode($namestr);$name->appendChild($ntext);
	$pref1=$xmlDoc->createElement("pref1");$p1text=$xmlDoc->createTextNode($p1str);$pref1->appendChild($p1text);
	$pref2=$xmlDoc->createElement("pref2");$p2text=$xmlDoc->createTextNode($p2str);$pref2->appendChild($p2text);
	$pref3=$xmlDoc->createElement("pref3");$p3text=$xmlDoc->createTextNode($p3str);$pref3->appendChild($p3text);
    
    $newnode->appendChild($id);
    $newnode->appendChild($name);
    $newnode->appendChild($pref1);
    $newnode->appendChild($pref2);
    $newnode->appendChild($pref3);
	
	$root->appendChild($newnode);

}

$xmlDoc->save("smalldb.xml");

echo "wirte succeed!";





}else{   //para=0,need to get data from database

     $arr=array();
     $arrnum=0;

     $teams=$xmlDoc->getElementsByTagName("team");
 
     //traverse
     for($i=0;$i<$teams->length;$i++){

             $node=$teams->item($i);

             $team['id']=$node->getElementsByTagName("id")->item(0)->childNodes->item(0)->nodeValue;
             $team['team_name']=$node->getElementsByTagName("team_name")->item(0)->childNodes->item(0)->nodeValue;
             $team['pref1']=$node->getElementsByTagName("pref1")->item(0)->childNodes->item(0)->nodeValue;
             $team['pref2']=$node->getElementsByTagName("pref2")->item(0)->childNodes->item(0)->nodeValue;
             $team['pref3']=$node->getElementsByTagName("pref3")->item(0)->childNodes->item(0)->nodeValue;
             
             $arr[$arrnum]=$team;

             $arrnum=$arrnum+1;
     }



	 //Return
     echo json_encode($arr);
}
