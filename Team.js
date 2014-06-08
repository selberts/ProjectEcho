
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
function remo() {
    var div = document.getElementById('curts');
    var child = div.firstElementChild;
    if (child !== null) {
       div.removeChild(child);
    }
    
}
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