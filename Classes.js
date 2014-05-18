//This javascript holds all of the classes for the application


function Team(id, team_name, pref_slots) {
    this.id = id;
    this.team_name = team_name;
    this.pref_slots = pref_slots;
    this.timeslot;
    this.print = function print(){
        document.writeln("<PRE>id: " + this.id + "\n</PRE>");
        document.writeln("<PRE>\tName: " + this.team_name+ "\n</PRE>");
        var ts = this.timeslot.day +"s at " + this.timeslot.time;
        document.writeln("<PRE>\tTime Slot: " + ts+ "\n</PRE>");        
    };
}

function Time_Slot(id, time, day, courts) {
    this.id = id;
    this.time = time;
    this.day = day;
    this.courts = courts;
    this.capacity = courts*2;
    this.teams = [];
    this.print = function print(){
        document.writeln("<PRE>id: " + this.id + "\n</PRE>");
        document.writeln("<PRE>\tDay and time: " + this.day +"s at " + this.time +"\n</PRE>");
        document.writeln("<PRE>\tTeams: "+"\n</PRE>");
        var x = 0;
        while (x<this.teams.length) {
            document.writeln("<PRE>\t\t" + this.teams[x].team_name + "\n</PRE>");
            x++;
        }
    };
    
}
