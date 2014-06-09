Parse.initialize("r3WndIFb85R0lx1qhchN4nquvAQVeKVrkA3TBnpI", "Wui7puCTZpnTmA5ZLvJmlj5R044vAyDerOBXhYzq");
var prefNum = 0;
createLeagueSelect();
var TimeSlots;

/**
 * Checks to see if the team being registered has entered preferences. If
 * not, returns with an error messsage. Otherwise it
 * Saves the team that is being registered to the database.
 * 
 * @returns boolean false
*/
function saveTeam(){
	console.log("Prefnum: " + prefNum);
	if(prefNum < 1) {
	alert("You need to add add least one preference");
	return false;
	}
	var leagueSelect = document.getElementById("leagueselect").value;
	var pref_times = new Array();
	var pref_days = new Array();                
	var name = document.getElementById("name").value;
	var timeSelects = document.getElementsByName("prefTime");

	for (var i=0; i<timeSelects.length; i++){
		var num = timeSelects[i].selectedIndex;
		pref_times.push(TimeSlots[num].time);
		pref_days.push(TimeSlots[num].day);
	}

	var Teamdata = Parse.Object.extend("Teamdata");
	var teamdata = new Teamdata();
        teamdata.set("team_name",name);
        teamdata.set("type","team");
        teamdata.set("pref_days",pref_days);
        teamdata.set("pref_times",pref_times);
        teamdata.set("league",leagueSelect);
        var query=new Parse.Query(Teamdata);
        query.equalTo("team_name", teamdata.get("team_name"));
        query.find().then(function(results) {
        	if(results.length>0){
        		alert("Team name already exists!")
        	}else{
        		console.log("Team successfully added.");
			var success = document.createElement("div");
			var loc = document.getElementById('dg');
			success.innerHTML = "Team successfully added.";
			success.style.display = 'block';
			loc.appendChild(success);
        		
        	}
        });
	teamdata.save({team_name: name , type:"team" , pref_days:pref_days , pref_times:pref_times, league: leagueSelect}).then(function(object) {
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
* Retrieves the timeslots from the database based on selection of league for the purposes of generating
* a selection dropdown for timeslot preferences
* @argument callb a callback function to be executed after this function, Create Select.
* 
* @returns callb a callback function with prefNum, timeslots, and the creatPref function as an input 
*/
function gettimeslots(callb){
	console.log("running gettimeslots");
	// Insert the key to connect with the Parse system
	Parse.initialize("r3WndIFb85R0lx1qhchN4nquvAQVeKVrkA3TBnpI", "Wui7puCTZpnTmA5ZLvJmlj5R044vAyDerOBXhYzq");
	// Select the table Timeslots in the database
	var Timeslots = Parse.Object.extend("Timeslots");
	// Prepare a query
	var query = new Parse.Query(Timeslots);
	var leagueSelect = document.getElementById("leagueselect").value;
	// Find all the tuples in the table
	query.equalTo("league", leagueSelect);
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
		TimeSlots = timeslots;
		return callb(prefNum, timeslots, createPref);
	});

	
};


/**
* Adds div into form to select one more preference.
* @param {element} add the selection element to be added to the page 
* 
*/
function createPref(add, timeslots){
	var form = document.getElementById('team_info');
	var button = document.getElementById('addpref');
            
	var div = document.createElement("div");
        div.className = 'selectsDiv';
	div.style.display = 'block';
	div.appendChild(add);
	div.firstChild.classList.add('form-control');
	form.insertBefore(div, button);

	prefNum++;
	if(prefNum>=timeslots.length) button.style.display = 'none';
}

/**
* Creates a select with values for each of the timeslot preference choices
* @param {int} prefNum                         Preference number
* @param {array} timeslots		       Array of timeslots to be added to selection
* @param {function} callb		       A call back function, createPref
* @returns {function} callb(select, timeslots) A function to add the element to the page
*/
function createSelect(prefNum, timeslots, callb){
	var select = document.createElement("select");
	select.name = "prefTime";
	select.classList.add('form-control');

	for (var i = 0; i < timeslots.length; i++){
		var opt = document.createElement('option');
		opt.value = timeslots[i].day +"s at " + timeslots[i].time;
		opt.innerHTML = timeslots[i].day +"s at " + timeslots[i].time;
		select.appendChild(opt);
	}
	return callb(select, timeslots);
}

/**
 * Loads the options for league and appends them to a select HTML element
 * which is then added to the page
 * @argument NA
 * @returns NA
 */
function createLeagueSelect(){
	var form = document.getElementById('team_info');
	var button = form.firstElementChild;	
	var select = document.createElement("select");
        select.id = "leagueselect";
        select.classList.add('form-control');
        select.style = "margin-bottom: 10px;";
        select.onchange = removeTimeSlotSelects;
	form.insertBefore(select, button);

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

/**
 * Removes all the time selects and re-adds the button if it is hidden
 * @returns {undefined}
 */
function removeTimeSlotSelects(){
	prefNum = 0;
        var selects = document.getElementsByClassName("selectsDiv");
        
        var elem;
	while(selects.length != 0){
                elem = selects[0];
		elem.parentNode.removeChild(elem);
	}
        
        var button = document.getElementById('addpref');
        button.style.display = 'inline';
        
}

