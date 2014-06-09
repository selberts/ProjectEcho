var days = ["Sunday", "Monday","Tuesday","Wednesday","Thursday"]

/**
*@author projectcho
*@description This function generates team data for testing the functions for the scheduling app.
*@param {integer} num_teams The number of teams to generate
*@param {integer} num_prefs The number of preferences to generate per team
*@param {integer} num_slots The number of time slots to generate
*@returns {JSON}
*
*/
function maketeams(num_teams, num_prefs, slots){
	var team_list = []; //initialize empty array, this will be our output
	//create one object per team
	this.num_teams = num_teams;
	for (var i = 0; i < num_teams; i++) { 
		var preflist = [];
		for (var j = 0; j < num_prefs; j++) {
			var prefgen = Math.round(Math.random()*(slots.length-1)); //random slot choice
			var slotcheck = slots[prefgen];
			// push to time and days array
			preflist.push(slotcheck);

		}
	
		//create the team object
		var team = new Team(i+1, "Team_" + (i+1), preflist);
	    team_list.push(team)
	}
	// Turn array into json arrays
	team_list = JSON.parse(JSON.stringify(team_list));
	return team_list;
}


/**
*@author projectcho
*@description This function generates dummy timeslot data for testing the functions for the scheduling app.
*@returns {JSON}
*
*/
function makeslots() {
timeslot_list = []
i = 1;
for (var day = 0; day < 5; day ++) {
	for (var time = 5; time < 10; time ++) {
		//for (var c = 1; c <7; c++) {
			var slot = new Time_Slot(i, time+ " PM", days[day], 2);
			timeslot_list.push(slot);
			i ++;
		//};
	};
};

// Turn array into json arrays
timeslot_list = JSON.parse(JSON.stringify(timeslot_list));
console.log(timeslot_list);
return timeslot_list;
}
