function adminAssign() {
  // Insert the key to connect with the Parse system
  Parse.initialize("r3WndIFb85R0lx1qhchN4nquvAQVeKVrkA3TBnpI", "Wui7puCTZpnTmA5ZLvJmlj5R044vAyDerOBXhYzq");
  // Select the table Teamdata in the database
  var Teamdata = Parse.Object.extend("Teamdata");
  // Prepare a query
  var query = new Parse.Query(Teamdata);
  // Find all the tuples in the table
  query.equalTo("type", "team");
  // Get the results set of the query
  query.find().then(function(results) { //the results set can only be accessed in this function!!!

      var timeslots = makeslots();

      var teamlist = [];

      for (var i = 0; i < results.length; i++) {
        var object = results[i];
        var name = object.get("team_name");
        var days = object.get("pref_days");
        var times = object.get("pref_times");
        var preflist = [];
        for (var j = 0; j < 3; j++) {
          var day;
          var time = times[j] - 5;

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
            case "Wedsday":
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

        }
        var team = new Team(i + 1, name, preflist);
        teamlist.push(team);

      }

      teamlist = JSON.parse(JSON.stringify(teamlist));



      Assign_Teams(teamlist, timeslots);
      var timeslot = new Time_Slot();
      for (var x = 0; x < timeslots.length; x++) {
        Games(timeslots[x]);
      }
    })
  }