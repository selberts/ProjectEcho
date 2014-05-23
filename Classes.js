//This javascript holds all of the classes for the application


function Team(id, team_name, pref_slots) {
    this.id = id;
    this.team_name = team_name;
    this.pref_slots = pref_slots;
    this.timeslot;
}

Team.prototype.print = function(){
        document.writeln("<PRE>id: " + this.id + "\n</PRE>");
        document.writeln("<PRE>\tName: " + this.team_name+ "\n</PRE>");
        var ts = this.timeslot.day +"s at " + this.timeslot.time;
        document.writeln("<PRE>\tTime Slot: " + ts+ "\n</PRE>");        
};

function Time_Slot(id, time, day, courts) {
    this.id = id;
    this.time = time;
    this.day = day;
    this.courts = courts;
    this.capacity = courts*2;
    this.teams = [];
    this.games = []; // all games in this timeslot. Not sure if we should do this or one array of games for all timeslots. 
}
Time_Slot.prototype.print = function(){
    document.writeln("<PRE>id: " + this.id + "\n</PRE>");
    document.writeln("<PRE>\tDay and time: " + this.day +"s at " + this.time +"\n</PRE>");
    document.writeln("<PRE>\tTeams: "+"\n</PRE>");
    var x = 0;
    while (x<this.teams.length) {
        document.writeln("<PRE>\t\t" + this.teams[x].team_name + "\n</PRE>");
        x++;
    }
};
    

function game(id, team1id, team2id, week, court) {
    this.id=id;
    this.team1id = team1id;
    this.team2id = team2id;
    this.week = week;
    this.court = court;
}

game.prototype.print = function (){
    document.writeln("<PRE>id: " + this.id + "\n</PRE>");
    document.writeln("<PRE>\tTeam1: " + this.team1id + " vs Team2: "+ this.team2id + "\n </PRE>");
    document.writeln("<PRE \t Week: " + this.week + "Location: " + this.court + "\n </PRE>");
};