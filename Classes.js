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
//takes a team object as an argument and returns a stringified version for storage, as well as prints it in the log for convenience purposes.
function Compress_Team(Team){
    var out;
    pref_slots = [];
    for (var i =0; i<Team.pref_slots.length;i++){
        pref_slots.push(Team.pref_slots[i].id);
    }

    out = {
        id: Team.id,
        name: Team.team_name,
        pref_slots: pref_slots,
        timeslot: Team.timeslot.id
    }
    JSON.parse(JSON.stringify(out));
    console.log(out);
    return out;
}
//takes a compressed team list and compressed slot list and creates two arrays of decompressed slots
// and time slots which need to be assigned to variables using var timeslots = Decompress_Data().timeslots, etc.
function Decompress_Data(Tarr, Slarr){
    var timeslots = [];
    for (var i = 0; i < Tarr.length;i++){
        
    }
}
function Time_Slot(id, time, day, courts) {
    this.id = id;
    this.time = time;
    this.day = day;
    this.courts = courts;
    this.capacity = courts*2;
    this.teams = [];
<<<<<<< HEAD
    this.games = []; // all games in this timeslot. Not sure if we should do this or one array of games for all timeslots. 
=======
<<<<<<< HEAD
}
function Compress_Time_Slot(Time_Slot){
    var out;
    teams = [];
    for (var i =0; i<Time_Slot.teams.length;i++){
        pref_slots.push(Time_Slot.teams[i].id);
    }

    out = {
        id: Time_Slot.id,
        time: Time_Slot.time,
        day: Time_Slot.time,
        courts: Time_Slot.courts,
        teams: teams
    }
    JSON.parse(JSON.stringify(out));
    console.log(out);
    return out;
>>>>>>> 27005dab8c8dd7ecb4e9e7c5d977d6854ff1b7fb
}
Time_Slot.prototype.print = function(){
<<<<<<< HEAD
    document.writeln("<PRE>id: " + this.id + "\n</PRE>");
    document.writeln("<PRE>\tDay and time: " + this.day +"s at " + this.time +"\n</PRE>");
    document.writeln("<PRE>\tTeams: "+"\n</PRE>");
    var x = 0;
    while (x<this.teams.length) {
        document.writeln("<PRE>\t\t" + this.teams[x].team_name + "\n</PRE>");
        x++;
    }
=======
=======
    this.games = []; // all games in this timeslot. Not sure if we should do this or one array of games for all timeslots. 
    this.print = function print(){
>>>>>>> a4d58931671c0047fd03011f9ee4970daab010c6
        document.writeln("<PRE>id: " + this.id + "\n</PRE>");
        document.writeln("<PRE>\tDay and time: " + this.day +"s at " + this.time +"\n</PRE>");
        document.writeln("<PRE>\tTeams: "+"\n</PRE>");
        var x = 0;
        while (x<this.teams.length) {
            document.writeln("<PRE>\t\t" + this.teams[x].team_name + "\n</PRE>");
            x++;
        }
<<<<<<< HEAD
>>>>>>> 27005dab8c8dd7ecb4e9e7c5d977d6854ff1b7fb
};
    

function game(id, team1id, team2id, week, court) {
    this.id=id;
    this.team1id = team1id;
    this.team2id = team2id;
    this.week = week;
    this.court = court;
}
<<<<<<< HEAD

game.prototype.print = function (){
    document.writeln("<PRE>id: " + this.id + "\n</PRE>");
    document.writeln("<PRE>\tTeam1: " + this.team1id + " vs Team2: "+ this.team2id + "\n </PRE>");
    document.writeln("<PRE \t Week: " + this.week + "Location: " + this.court + "\n </PRE>");
};
=======
>>>>>>> a4d58931671c0047fd03011f9ee4970daab010c6
>>>>>>> 27005dab8c8dd7ecb4e9e7c5d977d6854ff1b7fb
