<?php

//Build the link between php and MySQL
$link=MySQL_connect("localhost","root","fyq27810069");

//Select the database
mysql_select_db("imsports",$link);

//Get variable para from url
$para=$_GET["para"];

if($para){   //para=1,receive data
//Receive json data from javascript
$p=$_GET["p"];
//Decode jason data
$json=json_decode($p);

for($i=0;$i<5;$i++){
	$id=$json[$i]->id;
	$name=$json[$i]->team_name;
	for($j=0;$j<3;$j++){
		$time=$json[$i]->pref_times[$j];
        $day=$json[$i]->pref_days[$j]; 
        $day_time[$j]=$day . "," . $time;
	}
	$pref1=$day_time[0];
	$pref2=$day_time[1];
	$pref3=$day_time[2];
    mysql_query("insert into team_pref values('$id','$name','$pref1','$pref2','$pref3')");
}

//Prepare the query
//$query=null;

//Execute SQL query
//mysql_query($query);



}else{   //para=0,need to get data from database

		//Initialize the array which is the response to js
		$arr=array();
		$arrnum=0;

		//Execute the query and get the result set
		$rs=mysql_query("select * from team_pref");

		//Traverse the result set
		while($row=mysql_fetch_array($rs)){

		    //Push the result to the prepared array
			$team['id']=$row[0];
			$team['name']=$row[1];
			$team['pref1']=$row[2];
			$team['pref2']=$row[3];
			$team['pref3']=$row[4];
		    $arr[$arrnum]=$team;
		    $arrnum=$arrnum+1;
	 }

	 //Return
     echo json_encode($arr);
}



//Close the link
MySQL_close();



?>
