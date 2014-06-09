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
    this.capacity = courts*2+1;
    this.teams = [];
    this.games = []; // all games in this timeslot.
}

    
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