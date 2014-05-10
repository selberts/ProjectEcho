var num_teams = 5; // Number of teams to generate
var num_prefs = 3; // Number of preferences to generate
var team_list = []; //initialize empty array, this will be our output

var days = ["Monday","Tuesday","Wednesday","Thursday","Friday","Saturday","Sunday"]

//create one object per team
for (var i = 0; i < num_teams; i++) { 
	
	// initialize empty arrays, then push day and times
	var pref_times = [];
	var pref_days = [];
	
	for (var j = 0; j < num_prefs; j++) {
		var pref_time = Math.round(Math.random()*5) +5; //random night hour
		var pref_day = days[Math.floor(Math.random()*days.length)]; //pick random day from list
		
		// push to time and days array
		pref_times.push(pref_time + " PM");
		pref_days.push(pref_day);
	}

	//create the team object
	var team = {
				id: i +1, 
				team_name: "Team_" + (i+1), 
				pref_times: pref_times,
				pref_days: pref_days
				};

	// push the object
    team_list.push(team)
}

console.log(team_list)