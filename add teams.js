n=1;
num_court=0;
while(slot[n].slot_full==false && n<=slot.length){
    for(var m=1;m<=slot[n].court.length;m++){
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