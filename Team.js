
/**
 * This method loads the teams from the database based on the league selection
 * and adds them to an array which is passed to the function to add them to the page
 * @param {function} callb              a callback function to add the teams to the page
 * @returns {function} callb(teamlist)  passes the teamlist array to the function to add them to the page 
 */
function LoadTeams(callb) {
    Parse.initialize("r3WndIFb85R0lx1qhchN4nquvAQVeKVrkA3TBnpI", "Wui7puCTZpnTmA5ZLvJmlj5R044vAyDerOBXhYzq");
    var Teamdata = Parse.Object.extend("Teamdata");
    // Prepare a query
    var query = new Parse.Query(Teamdata);
    // Find all the tuples in the table
    var leagueSelect = document.getElementById("leagueselect").value;
    query.equalTo("league", leagueSelect);
    query.ascending("name");
    // Get the results set of the query
    var teamlist = [];
    query.find().then(function(results) { //the results set can only be accessed in this function!!!
        for (var i = 0; i < results.length; i++) {
        var object = results[i];
        var name = object.get("team_name");
        var days = object.get("pref_days");
        var times = object.get("pref_times");
        var ts = object.get("timeslot");
        var preflist = [];
        var team = new Team(i + 1, name, preflist);
        team.timeslot = ts;
        teamlist.push(team);
      }
      teamlist = JSON.parse(JSON.stringify(teamlist));
      return callb(teamlist);
    });
}

createLeagueSelect();

/**
 * This method removes the first child of the curts div which contains the team table.
 * @param NA
 * @returns NA
 */
function remo() {
    var div = document.getElementById('curts');
    var child = div.firstElementChild;
    if (child !== null) {
       div.removeChild(child);
    }
}

/**
 * This method adds the teamlist array to the table of teams
 * and appends the table to the page
 * @param {array} an array of teams to be added to the page
 * @returns NA
 */
function createtable(teamlist){
    remo();
    var div = document.getElementById('curts');
    var table = document.createElement("table");
    table.id = 'tab';
    var row = document.createElement("tr");
    var head1 = document.createElement("td");
    head1.innerHTML = "Team";
    row.appendChild(head1);
    var head2 = document.createElement("td");
    head2.innerHTML = "Timeslot";
    row.appendChild(head2);
    table.appendChild(row);
    for (var i = 0; i < teamlist.length; i++) {
        row = document.createElement("tr");
        var name = document.createElement("td");
        name.innerHTML = teamlist[i].team_name;
        row.appendChild(name);
        if (teamlist[i].timeslot !== undefined) {
            var timesl = document.createElement("td");
            timesl.innerHTML = teamlist[i].timeslot;
            row.appendChild(timesl);
        }
        table.appendChild(row);
    };
    table.border="1";
    table.style="width:300px"
    div.appendChild(table);
}

/**
 * This method loads the league choices from the database and
 * adds them to a select element which it appends to the page.
 * @param NA
 * @returns NA
 */
function createLeagueSelect(){
  Parse.initialize("r3WndIFb85R0lx1qhchN4nquvAQVeKVrkA3TBnpI", "Wui7puCTZpnTmA5ZLvJmlj5R044vAyDerOBXhYzq");
  var League = Parse.Object.extend("League");
  // Prepare a query
  var query = new Parse.Query(League);
  // Find all the tuples in the table
        query.equalTo("type", "league");
        // Get the results set of the query
        query.find().then(function(results) { //the results set can only be accessed in this function!!!
            var select = document.getElementById("leagueselect");
                for(var i=0;i<results.length;i++){
                    var object = results[i];
                    var opt = document.createElement("option");
                    opt.value = object.get("name");
                    opt.innerHTML = object.get("name");
                    select.appendChild(opt);
                }
        });
}