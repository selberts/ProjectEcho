Parse.initialize("r3WndIFb85R0lx1qhchN4nquvAQVeKVrkA3TBnpI", "Wui7puCTZpnTmA5ZLvJmlj5R044vAyDerOBXhYzq");
var prefNum = 0;
var days = ["Monday","Tuesday","Wednesday","Thursday","Friday","Saturday","Sunday"];
var times = [5,6,7,8];
var timeslots = gettimeslots();
//createLeagueSelect();

/**
* Callback function for form submission
* Prepares name and pref_times, pref_days arrays for local storage
* @returns {bool}  false signals page not to reload (ie, not sending info to webserve)
*/
function saveTeam(){
	console.log("Prefnum: " + prefNum);
	if(prefNum < 1) {
	alert("You need to add add least one preference");
	return false;
	}

	var pref_times = new Array();
	var pref_days = new Array();                
	var name = document.getElementById("name").value;

	//var daySelects = document.getElementsByName("prefDay");
	var timeSelects = document.getElementsByName("prefTime");

	for (var i=0; i<timeSelects.length; i++){
		var num = timeSelects[i].selectedIndex;
		pref_times.push(timeslots[num].time);
		pref_days.push(timeslots[num].day);
	}

	var Teamdata = Parse.Object.extend("Teamdata");
	var teamdata = new Teamdata();

	teamdata.save({team_name: name , type:"team" , pref_days:pref_days , pref_times:pref_times}).then(function(object) {
		console.log("Team successfully added.");
		var success = document.createElement("div");
		var loc = document.getElementById('dg');
		success.innerHTML = "Team successfully added.";
		success.style.display = 'block';
		loc.appendChild(success);
	});

	return false;
}


/**
* Adds preference selects (time, day) to form
* Limited to 3 preferences 
* @returns {JSON}
*/
function gettimeslots(){
	console.log("running gettimeslots");
	// Insert the key to connect with the Parse system
	Parse.initialize("r3WndIFb85R0lx1qhchN4nquvAQVeKVrkA3TBnpI", "Wui7puCTZpnTmA5ZLvJmlj5R044vAyDerOBXhYzq");
	// Select the table Timeslots in the database
	var Timeslots = Parse.Object.extend("Timeslots");
	// Prepare a query
	var query = new Parse.Query(Timeslots);
	// Find all the tuples in the table
	query.equalTo("type", "timeslot");
	// Get the results set of the query
	var timeslots = new Array();
	query.find().then(function(results){   //the results set can only be accessed in this function!!!

		for(var i=0;i<results.length;i++){
			var object = results[i];
			var day = object.get("day");
			var time = object.get("time");
			var courts = object.get("courts");
			var timeslot = new Time_Slot(i, time, day, courts);
			timeslots.push(timeslot);
		}
	
		timeslots = JSON.parse(JSON.stringify(timeslots));
		console.log(timeslots);
	});

	return timeslots;
};


/**
* Adds div into form to select one more preference.
* @param {}
* @returns {}
*/
function createPref(){
	var form = document.getElementById('team_info');
	var button = document.getElementById('addpref');

	//console.log(timeslots[1].time);
	var div = document.createElement("div");
	div.style.display = 'block';
	div.appendChild(createSelect(prefNum));
	//div.appendChild(createDaySelect(prefNum));
	div.firstChild.classList.add('form-control');
	form.insertBefore(div, button);

	prefNum++;
	// document.querySelector('#team_info > div:nth-child(2) > select').addClass('form-control')

	if(prefNum == 3) form.removeChild(button);
}

/**
* Creates a select with values for each of the time preference choices
* @param {int} prefNum                         Preference number                      
* @returns {createTimeSelect.select|Element}   Select created
*/
function createSelect(prefNum){
	var select = document.createElement("select");
	select.name = "prefTime";

	for (var i = 0; i < timeslots.length; i++){
		var opt = document.createElement('option');
		opt.value = timeslots[i].day +"s at " + timeslots[i].time;
		opt.innerHTML = timeslots[i].day +"s at " + timeslots[i].time;
		select.appendChild(opt);
	}

	// select.addClass("form-control");
	return select;
}

/**
* Creates a select with values for each of the day preference choices
* @param {int} prefNum                         Preference number                      
* @returns {createTimeSelect.select|Element}   Select created
*/
function createDaySelect(prefNum){
	var select = document.createElement("select");
	select.class= "form-control";
	select.name = "prefDay";// + prefNum;

	for (var i = 0; i < days.length; i++){
		var opt = document.createElement('option');
		opt.value = days[i];
		opt.innerHTML = days[i];
		select.appendChild(opt);
	}

	return select;
}

function createLeagueSelect(){
	var select = document.createElement("select");
        select.id = "leagueselect";
        select.class= "form-control";
        
        var div = document.getElementById("dg");
	div.appendChild(select);

        // Select the table Teamdata in the database
	var League = Parse.Object.extend("League");
	// Prepare a query
	var query = new Parse.Query(League);
	// Find all the tuples in the table
        query.equalTo("type", "league");
        // Get the results set of the query
        query.find().then(function(results) { //the results set can only be accessed in this function!!!
		  	  
        var select = document.getElementById("leagueselect");
              for(var i=0;i<results.length;i++){
              	var object = results[i];
              	
              	var opt = document.createElement("option");
			    opt.value = object.get("name");
			    opt.innerHTML = object.get("name");
			    select.appendChild(opt);

              }
              
	    
       });
}
