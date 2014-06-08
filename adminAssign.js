
/**
* Takes all the teams and timeslots from the database
* Calls Games to make the games for all timeslots
*/
function adminAssign(league) {  
  // Insert the key to connect with the Parse system
  Parse.initialize("r3WndIFb85R0lx1qhchN4nquvAQVeKVrkA3TBnpI", "Wui7puCTZpnTmA5ZLvJmlj5R044vAyDerOBXhYzq");
  //BEGIN Timeslot Import

  // Select the table Timeslots in the database
  var Timeslots = Parse.Object.extend("Timeslots");
  // Prepare a query
  var query = new Parse.Query(Timeslots);
  // Find all the tuples in the table
  query.equalTo("league", league);
  // Get the results set of the query
  var timeslots = new Array();
  query.find().then(function(results) { //the results set can only be accessed in this function!!!

    for (var i = 0; i < results.length; i++) {
      var object = results[i];
      var day = object.get("day");
      var time = object.get("time");
      var courts = object.get("courts");
      var timeslot = new Time_Slot(i, time, day, courts);
      timeslots.push(timeslot);
    }

    timeslots = JSON.parse(JSON.stringify(timeslots));
    var Teamdata = Parse.Object.extend("Teamdata");
    // Prepare a query
    var query = new Parse.Query(Teamdata);
    // Find all the tuples in the table
    query.equalTo("league", league);
    query.ascending("createdAt");
    // Get the results set of the query
    query.find().then(function(results) { //the results set can only be accessed in this function!!!

      var teamlist = [];

      for (var i = 0; i < results.length; i++) {
        var object = results[i];
        var name = object.get("team_name");
        var days = object.get("pref_days");
        var times = object.get("pref_times");
        var t = object.id;
        var preflist = [];
        j = 0;
        while (times[j] != null) {
          var xx=0;
          while(xx<timeslots.length){
            if (times[j]==timeslots[xx].time&&days[j]==timeslots[xx].day){
              preflist.push(timeslots[xx]);
            }
            xx++;
          }
          j++;
        }
        var team = new Team(t, name, preflist);
        teamlist.push(team);

      }

      teamlist = JSON.parse(JSON.stringify(teamlist));
      Assign_Teams(teamlist, timeslots);
      var updatefunc = updates(teamlist);
      if (updatefunc) {
        alert("Updating Database complete.")
      }
      //trying to find a way to update the objects in the database
      //for (var i =0; i < teamlist.length; i++){
        //var Teamdata = Parse.Object.extend("Teamdata");
        //var teamdata = new Parse.Query(Teamdata);
        //teamdata.get(teamlist[i].id);
        //var t = new Teamdata();
        //t= teamdata;
        //t.set("timeslot", teamlist[i].timeslot.day);
        //t.save({success: function(team) {
          //  alert(teamlist[i].name + "saved");
            //}});
      //}
      var timeslot = new Time_Slot();
      for (var x = 0; x < timeslots.length; x++) {
        Games(timeslots[x]);
      }
      console.log("Assign_Teams succeeded. Total games: " + totalGames);
      
      var text = document.getElementById("submissionText");
      text.innerHTML = "Submitting games to calendar";
      
      var meter = document.getElementById("submissionProgress");
      meter.max = totalGames;
      waitFunction(meter);

    });
  });
}

/*
 * Sets a timeout if all events have not yet been submitted to calendar
 * Recursively calls itself while events are still being submitted
 * On submission, alerts user to submission
 * @param   meter           The progress indicator, which gets updated on each call
 * @returns {undefined}
 */
function waitFunction(meter){
    meter.value = eventsSubmitted;
    if(eventsSubmitted != totalGames) {
          setTimeout(function(){
                waitFunction(meter);
            }, 100);
      }
      else{
          alert("Submission complete");
          submissionComplete = true;
          window.onbeforeunload = null;
      }
}


/**
* Takes a list of timeslots and teams and assigns them according to their prefrences.
* Populates the teams array in the timeslots based on the teams prefrences.
* @param {Team} teamL                         List of teams, stored as an array
* @param {Time_Slot} slotsL                   List of time slots, stored as an array
*/
function Assign_Teams(teaml, slotsl) {

  n = 0;
  var errorString = "";
  var div = document.createElement("div");
  var adminText = document.getElementById("adminText");

  while (n < teaml.length) {
    var cteam = teaml[n]; //cteam=current team
    var prefs = teaml[n].pref_slots.length; //prefs= number of prefrences
    var pref = 0; // iterator through the prefrences of the team. can be used with cteam[pref] or teaml[n].prefz
    var done = 0; //=0 until team is assigned or given up on
    while (done == 0) {
      if (!cteam.pref_slots[pref]) { //If this will not be put in, send in an alert
        done = 1;
        // Put error on page
        errorString = "Team " + (n + 1) + " not added.";
        var text = document.createElement("div");
        text.innerHTML = errorString;
        text.style.display = "block";
        div.appendChild(text);
      }
      var xx = 0
      while (xx < slotsl.length&&done==0) { // iterate through all time slots
        if (cteam.pref_slots[pref].day == slotsl[xx].day && cteam.pref_slots[pref].time == slotsl[xx].time && slotsl[xx].teams.length < slotsl[xx].capacity) { // check the timeslot is a prefrence. If so check if full
          slotsl[xx].teams.push(teaml[n]);
          teaml[n].timeslot = slotsl[xx];
          done = 1;
        }
        xx++;
      }
      pref++;
    }
    n++;
  }
  
  // Append div containing errors
  adminText.appendChild(div);

}


/**
* Takes a timeslot and matches the teams against eachother.
* Matches 3-5 teams against each other over 5 weeks. Includes byes if nessecary
* @param {Team} timeslot                      timeslot. Will access the group of teams
*/
function Games(timeslot) {
  var numTeams = timeslot.teams.length;
  var errorString = "";
  var div = document.createElement("div");
  var adminText = document.getElementById("adminText");
  
  timeslot.games = [];
  if (numTeams < 3) { // need at least 4 teams to start. Otherwise, timeslot will not be used. 
    errorString = "Not Enough Teams (" + numTeams + ") in " + timeslot.day+" at "+timeslot.time;
        var text = document.createElement("div");
        text.innerHTML = errorString;
        text.style.display = "block";
        div.appendChild(text);
  } else if (numTeams == 3) {
    timeslot.games[0] = new game(1, 1, 2, 1, 1)
    timeslot.games[1] = new game(2, 1, 3, 2, 1)
    timeslot.games[2] = new game(3, 2, 3, 3, 1)
    timeslot.games[3] = new game(4, 1, 2, 4, 1)
    timeslot.games[4] = new game(5, 1, 3, 5, 1)
  } else if (numTeams == 4) {
    //week one game(id, team1id, team2id, week, court)
    timeslot.games[0] = new game(1, 1, 2, 1, 1)
    timeslot.games[1] = new game(2, 3, 4, 1, 2)
    //week2
    timeslot.games[2] = new game(3, 1, 3, 2, 1)
    timeslot.games[3] = new game(4, 2, 4, 2, 2)
    //week3
    timeslot.games[4] = new game(5, 1, 4, 3, 1)
    timeslot.games[5] = new game(6, 2, 3, 3, 2)
    //week4
    timeslot.games[6] = new game(7, 1, 2, 4, 1)
    timeslot.games[7] = new game(8, 3, 4, 4, 2)
    //week5
    timeslot.games[8] = new game(9, 1, 2, 5, 1)
    timeslot.games[9] = new game(10, 3, 4, 5, 2)
  } else if (numTeams == 5) {
    //week one game(id, team1id, team2id, week, court)
    timeslot.games[0] = new game(1, 1, 2, 1, 1)
    timeslot.games[1] = new game(2, 3, 4, 1, 2)
    //week2 
    timeslot.games[2] = new game(3, 1, 2, 2, 1)
    timeslot.games[3] = new game(4, 3, 5, 2, 2)
    //week3
    timeslot.games[4] = new game(5, 1, 5, 3, 1)
    timeslot.games[5] = new game(6, 2, 4, 3, 2)
    //week4
    timeslot.games[6] = new game(7, 1, 4, 4, 1)
    timeslot.games[7] = new game(8, 3, 5, 4, 2)
    //week5
    timeslot.games[8] = new game(9, 2, 3, 5, 1)
    timeslot.games[9] = new game(10, 4, 5, 5, 2)
  }
  
  for (var x = 0; x < timeslot.games.length; x++) {
    var intTime=parseInt(timeslot.time);
    name = timeslot.teams[timeslot.games[x].team1id - 1].team_name + " vs " + timeslot.teams[timeslot.games[x].team2id - 1].team_name;
    var s = getDateTime(timeslot.games[x].week, timeslot.day, intTime, 3, 6);
    var e = getDateTime(timeslot.games[x].week, timeslot.day, intTime+1, 3, 6);
    totalGames++;
    makeApiCall(name, timeslot.games[x].court, "", s, e);
    //2014-05-19T20:00:00-06:00
  }
  
    adminText.appendChild(div);

}


/**
* Finds the offset from the start date and uses this to find the date and time.
* @param {int} week                     week the game is played RANGE[1-5]
* @param {string} day                   day from the timeslot
* @param {int} time                     time will be 5-8 but refers to PM
* @param {int} startMonth               0-indexed int corresponding to month
* @param {int} startDay                 First day of games
* @return {string}                      returns the date and time in the format needed to add to the calendar
*/
function getDateTime(week, day, time, startMonth, startDay) {

  week--; // week is now zero indexed
  //date is the offset from April 6, the first day of games. 
  if (day == "Monday") date = startDay + 1;
  else if (day == "Tuesday") date = startDay + 2;
  else if (day == "Wednesday") date = startDay + 3;
  else if (day == "Thursday") date = startDay + 4;
  else date = startDay; // Sunday

  date = date + 7 * week; // date now has the offset from the start date
  
  var d = new Date(2014, startMonth, date, parseInt(time), 0, 0, 0);
  
 function add0(n){return n<10 ? '0'+n : n}
 return d.getUTCFullYear()+'-'
      + add0(d.getUTCMonth()+1)+'-'
      + add0(d.getUTCDate())+'T'
      + add0(d.getUTCHours())+':'
      + add0(d.getUTCMinutes())+':'
      + add0(d.getUTCSeconds())+'Z';

  /*
  var daysInApril = 30;
  var daysInMay = 31;
  if (date <= daysInApril) month = 4;
  else if (date <= (daysInApril + daysInMay)) {
    month = 5; //advance month
    date = date - daysInApril; //set day to exclude the april days
  } else {
    month = 6; // June
    date = date - (daysInApril + daysInMay);
  }

  dateString = "2014-0" + month;
  if (date < 10) {
    dateString = dateString + "-0" + date + "T"
  } else dateString = dateString + "-" + date + "T";
  //date all set

  //start time
  var temp = parseInt(time);
  dateString = dateString + (temp + 12) + ":00:00-06:00"
  return dateString;*/
}
function update(team){
    var Teamdata = Parse.Object.extend("Teamdata");
    var teamdata = new Parse.Query(Teamdata);
    var id = team.id;
    var name = team.team_name;
    name = JSON.parse(JSON.stringify(name));
    if (team.timeslot !== undefined) {
        var ts = team.timeslot.day;
        ts = JSON.parse(JSON.stringify(ts));
        var tst = team.timeslot.time;
        tst = JSON.parse(JSON.stringify(tst));
        ts = ts + "s at " + tst;
        teamdata.get(id, {
            success: function(Teamdata) {
                // The object was retrieved successfully.
                Teamdata.set("timeslot", ts);
                Teamdata.save({success: function(team) {
                console.log(name + " saved");
                return true;
            }});
            },
            error: function(object, error) {
                // The object was not retrieved successfully.
                // error is a Parse.Error with an error code and description.
                error =JSON.parse(JSON.stringify(error));
                console.log(error);
                return true;
                }
        });
    }
}
function updates(teamlist){
    
    for (var i =0; i < teamlist.length;i++){
        update(teamlist[i]);

    }
    return true;
}

