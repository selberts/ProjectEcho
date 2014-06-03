

function Assign_Teams(teaml, slotsl) {
	n=0;
	while(n<teaml.length){
		var cteam = teaml[n];
		var prefs = teaml[n].pref_slots.length;
		var pref = 0;
		var done = 0;
		while (done == 0) {
			if (!teaml[n].pref_slots[pref]) {
				alert(n + "and" + pref + "and" + prefs);
			}
			var id = teaml[n].pref_slots[pref].id;
			if (slotsl[id-1].teams.length < slotsl[id-1].capacity) {
				slotsl[id-1].teams.push(teamlist[n]);
				teaml[n].timeslot = slotsl[id-1];
				done = 1;
			}
			pref ++;
			if (pref==prefs) {
				done = 1;
				alert("Team " + (n+1) + " not added.");
			}
		}
		n++;
	}
}

function Games(timeslot){
	var numTeams = timeslot.teams.length;
	timeslot.games=[];
	if (numTeams<3){ // need at least 4 teams to start. Otherwise, timeslot will not be used. 
		alert("Not Enough Teams in Timeslot. Only " + numTeams + " Teams");
	}else if (numTeams==3){
		var id1 = timeslot.teams[0].id
		var id2 = timeslot.teams[1].id
		var id3 = timeslot.teams[2].id


		timeslot.games[0] = new game(1,id1,ide,1,1)
		timeslot.games[1] = new game(2,id1,ide,2,1)
		timeslot.games[2] = new game(3,id1,ide,3,1)
		timeslot.games[3] = new game(4,id1,ide,4,1)
		timeslot.games[4] = new game(5,id1,ide,5,1)
	}else if (numTeams==4) {
		var id1 = timeslot.teams[0].id
		var id2 = timeslot.teams[1].id
		var id3 = timeslot.teams[2].id
		var id4 = timeslot.teams[3].id
		//week one game(id, team1id, team2id, week, court)
		timeslot.games[0] = new game(1,id1,id2,1,1)
		timeslot.games[1] = new game(2,id3,id4,1,2)
		//week2
		timeslot.games[2] = new game(3,id1,id3,2,1)
		timeslot.games[3] = new game(4,id2,id4,2,2)
		//week3
		timeslot.games[4] = new game(5,id1,id4,3,1)
		timeslot.games[5] = new game(6,id2,id3,3,2)
		//week4
		timeslot.games[6] = new game(7,id1,id2,4,1)
		timeslot.games[7] = new game(8,id3,id4,4,2)
		//week5
		timeslot.games[8] = new game(9,id1,id2,5,1)
		timeslot.games[9] = new game(10,id3,id4,5,2)
	} else if (numTeams==5) {
		var id1 = timeslot.teams[1].id
		var id2 = timeslot.teams[2].id
		var id3 = timeslot.teams[3].id
		var id4 = timeslot.teams[4].id
		var id5 = timeslot.teams[5].id
		//week one game(id, team1id, team2id, week, court)
		timeslot.games[0] = new game(1,id1,id2,1,1)
		timeslot.games[1] = new game(2,id3,id4,1,2)
		//week2 
		timeslot.games[2] = new game(3,id1,id3,2,1)
		timeslot.games[3] = new game(4,id2,id5,2,2)
		//week3
		timeslot.games[4] = new game(5,id1,id5,3,1)
		timeslot.games[5] = new game(6,id2,id4,3,2)
		//week4
		timeslot.games[6] = new game(7,id1,id4,4,1)
		timeslot.games[7] = new game(8,id3,id5,4,2)
		//week5
		timeslot.games[8] = new game(9,id2,id3,5,1)
		timeslot.games[9] = new game(10,id4,id5,5,2)
	}
	for(var x=0; x<timeslot.games.length; x++){
		name="Team "+ timeslot.games[x].team1id + " vs Team " +timeslot.games[x].team1id;
		s=getDateTime(timeslot.games[x].week, timeslot.day, timeslot.time);
		e=getDateTime(timeslot.games[x].week, timeslot.day, timeslot.time+1)
		function makeApiCall(name, timeslot.games[x].court, "", s, e)
		//2014-05-19T20:00:00-06:00
	}
}

function getDateTime(week, day, time){
	//date is the offset from April 6, the first day of games. 
	if (day=="Monday") date=1;
	else if (day=="Tuesday") date=2;
	else if (day=="Wednesday") date=3;
	else if (day=="Thursday") date=4;
	else date=0; // Sunday

	date=date+7*week; // date now has the offset from the start date

	if (date<25) month=4;
	else if (date<55) {
		month=5;		//advance month
		date=date-25	//set day to exclude the april days
	} else {
		month=6; // June
		date=date-55;
	}

	dateString= "2014-0" + month;
	if (date< 10) {
		dateString= dateString+"-0" + date +"T"
	} else dateString= dateString+ "-"+ date +"T";
	//date all set

	//start time
	dateString=dateString+(time+12)+":00:00-06:00"
	return dateString;
}