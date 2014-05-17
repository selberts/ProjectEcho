var num_teams = 5; // Number of teams to generate
var num_prefs = 3; // Number of preferences to generate
var num_slots = 20;
var team_list = []; //initialize empty array, this will be our output

var days = ["Monday","Tuesday","Wednesday","Thursday","Sunday"]

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

timeslot_list = []
i = 1;

for (var day = 0; day < 5; day ++) {
	for (var time = 5; time < 8; time ++) {
		for (var c = 1; c <2; c++) {
			var slot = {
						id: i,
						time: time +" PM", //random night hour
						day: days[day], //pick random day from list
						court: "Court #" + c,
                        slot_full: false
						};
			timeslot_list.push(slot);
			i ++;
		};
	};
};

// Turn array into json arrays
team_list = JSON.parse(JSON.stringify(team_list));
timeslot_list = JSON.parse(JSON.stringify(timeslot_list));

console.log(team_list);
console.log(timeslot_list);


n=1;
num_court=0;
//slot should be timeslot_list. I changed this, but I'm not sure what slot.length is supposed to be, it is false so this entire loop is skipped over. 
//Could you comment out the code a little more and debug it
//Peter
while(timeslot_list[n].slot_full==false && n<=slot.length){
    for(var m=1;m<=timeslot_list[n].court.length;m++){
        for(var i=1;i<=team.length;i++){
        flag=false;
            for(var j=1;j<=num_prefs;j++){
                if (slot[n].time==team[i].pref_times[j]&&slot[n].days==team[i].pref_days[j]) {
                    document.write("team "+i+" is using time slot "+n+" in court #"+m);
                    num_court++;
                    flag=true;
                    break;      //if find a slot for this team
                }
            }
            if (flag==true) {
                break;
            }
        }
    }
    if (num_court==slot[n].court.length) {
        slot[n].slot_full==true;
    }
    n++;
}