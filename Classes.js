//This javascript holds all of the classes for the application


/**
* Creates the Team Class
* @param id           
* @param team_name    
* @param pref_slots   Preference timeslots for each team  
* @return   a reference to a Team object               
*/
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


/**
* Generates a stringified version for storage
* @param Team     a team object 
* @return  a nicely formatted string representing this StringLog                 
*/
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

/**
* Creates two arrays of decompressed slots
* and time slots which need to be assigned to variables using var timeslots = Decompress_Data().timeslots, etc.
* @param Tarr       a compressed team list
* @param Slarr      a compressed timeslot list             
*/
function Decompress_Data(Tarr, Slarr){
    var timeslots = [];
    for (var i = 0; i < Tarr.length;i++){
        
    }
}


/**
* Creates the Time_Slot Class
* @param id       
* @param time     
* @param day      
* @param courts   
* @return   a reference to a Time_Slot object                  
*/
function Time_Slot(id, time, day, courts) {
    this.id = id;
    this.time = time;
    this.day = day;
    this.courts = courts;
    this.capacity = courts*2;
    this.teams = [];
    this.games = []; // all games in this timeslot.
}


/**
* Generates a stringified version for storage
* @param Time_Slot        a Time_Slot object 
* @return  a nicely formatted string representing this StringLog                 
*/
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

    this.games = []; // all games in this timeslot. Not sure if we should do this or one array of games for all timeslots. 
    this.print = function print(){
        document.writeln("<PRE>id: " + this.id + "\n</PRE>");
        document.writeln("<PRE>\tDay and time: " + this.day +"s at " + this.time +"\n</PRE>");
        document.writeln("<PRE>\tTeams: "+"\n</PRE>");
        var x = 0;
        while (x<this.teams.length) {
            document.writeln("<PRE>\t\t" + this.teams[x].team_name + "\n</PRE>");
            x++;
        }
    }
};
    
/**
* Creates the game Class
* @param id           The id for each game
* @param team1id      The id for team1 in this game
* @param team2id      The id for team2 in this game
* @param week        
* @param court 
* @return   a reference to a game object              
*/
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