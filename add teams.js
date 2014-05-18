

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
//while(timeslot_list[n].slot_full==false && n<=slot.length){
//    for(var m=1;m<=timeslot_list[n].court.length;m++){
//        for(var i=1;i<=team.length;i++){
//        flag=false;
//            for(var j=1;j<=num_prefs;j++){
//                if (slot[n].time==team[i].pref_times[j]&&slot[n].days==team[i].pref_days[j]) {
//                    document.write("team "+i+" is using time slot "+n+" in court #"+m);
//                    num_court++;
//                    flag=true;
//                    break;      //if find a slot for this team
//                }
//            }
//            if (flag==true) {
//                break;
//            }
//        }
//    }
//    if (num_court==slot[n].court.length) {
//        slot[n].slot_full==true;
//    }
//    n++;
//}