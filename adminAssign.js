function adminAssign() {
  /**
   * Takes all the teams and timeslots from the database.
   * Calls Games to make the games for all timeslots.
   */
  // Insert the key to connect with the Parse system
  Parse.initialize("r3WndIFb85R0lx1qhchN4nquvAQVeKVrkA3TBnpI", "Wui7puCTZpnTmA5ZLvJmlj5R044vAyDerOBXhYzq");
  //BEGIN Timeslot Import

  // Select the table Timeslots in the database
  var Timeslots = Parse.Object.extend("Timeslots");
  // Prepare a query
  var query = new Parse.Query(Timeslots);
  // Find all the tuples in the table
  query.equalTo("type", "timeslot");
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
    query.equalTo("type", "team");
    query.ascending("createdAt");
    // Get the results set of the query
    query.find().then(function(results) { //the results set can only be accessed in this function!!!

      var teamlist = [];

      for (var i = 0; i < results.length; i++) {
        var object = results[i];
        var name = object.get("team_name");
        var days = object.get("pref_days");
        var times = object.get("pref_times");
        var preflist = [];
        j = 0;
        while (times[j] != null) {
          var day;
          var time = times[j].slice(0, 1) - 5;

          switch (days[j]) {
            case "Sunday":
              day = 0;
              break;
            case "Monday":
              day = 1;
              break;
            case "Tuesday":
              day = 2;
              break;
            case "Wednesday":
              day = 3;
              break;
            case "Thursday":
              day = 4;
              break;
            default:
              break;
          }

          var id = day * 5 + time;
          preflist.push(timeslots[id]);
          j++;
        }
        var team = new Team(i + 1, name, preflist);
        teamlist.push(team);

      }

      teamlist = JSON.parse(JSON.stringify(teamlist));
      Assign_Teams(teamlist, timeslots);
      console.log("Assign_Teams succeeded");
      var timeslot = new Time_Slot();
      for (var x = 0; x < timeslots.length; x++) {
        Games(timeslots[x]);
      }
    });
  });
}


function Assign_Teams(teaml, slotsl) {
  /**
   * Takes a list of timeslots and teams and assigns them according to their prefrences.
   * Populates the teams array in the timeslots based on the teams prefrences.
   * @param {Team} teamL                         List of teams, stored as an array
   * @param {Time_Slot} slotsL                   List of time slots, stored as an array
   */
  n = 0;
  while (n < teaml.length) {
    var cteam = teaml[n]; //cteam=current team
    var prefs = teaml[n].pref_slots.length; //prefs= number of prefrences
    var pref = 0; // iterator through the prefrences of the team. can be used with cteam[pref] or teaml[n].prefz
    var done = 0; //=0 until team is assigned or given up on
    while (done == 0) {
      if (!cteam.pref_slots[pref]) { //If this will not be put in, send in an alert
        done = 1;
        alert("Team " + (n + 1) + " not added.");
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

}

function Games(timeslot) {
  /**
   * Takes a timeslot and matches the teams against eachother.
   * Matches 3-5 teams against each other over 5 weeks. Includes byes if nessecary
   * @param {Team} timeslot                      timeslot. Will access the group of teams
   */
  var numTeams = timeslot.teams.length;
  timeslot.games = [];
  if (numTeams < 3) { // need at least 4 teams to start. Otherwise, timeslot will not be used. 
    alert("Not Enough Teams in Timeslot. Only " + numTeams + " Teams");
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
    name = timeslot.teams[timeslot.games[x].team1id - 1] + " vs " + timeslot.teams[timeslot.games[x].team1id - 1];
    var s = getDateTime(timeslot.games[x].week, timeslot.day, timeslot.time);
    var e = getDateTime(timeslot.games[x].week, timeslot.day, timeslot.time + 1)
    init(name, timeslot.games[x].court, "", s, e)
    //2014-05-19T20:00:00-06:00
  }
}

function getDateTime(week, day, time) {
  /**
   * Finds the offset from the start date and uses this to find the date and time.
   * @param {int} week                          week the game is played RANGE[1-5]
   * @param {string} day                           day from the timeslot.
   * @param {int} time                          time. Will be 5-8 but refers to PM
   * @return {string}                           returns the date and time in the format needed to add to the gCal
   */

  //date is the offset from April 6, the first day of games. 
  if (day == "Monday") date = 7;
  else if (day == "Tuesday") date = 8;
  else if (day == "Wednesday") date = 9;
  else if (day == "Thursday") date = 10;
  else date = 6; // Sunday

  date = date + 7 * week; // date now has the offset from the start date

  if (date < 31) month = 4;
  else if (date < 61) {
    month = 5; //advance month
    date = date - 25 //set day to exclude the april days
  } else {
    month = 6; // June
    date = date - 55;
  }

  dateString = "2014-0" + month;
  if (date < 10) {
    dateString = dateString + "-0" + date + "T"
  } else dateString = dateString + "-" + date + "T";
  //date all set

  //start time
  dateString = dateString + (time + 12) + ":00:00-06:00"
  return dateString;
}