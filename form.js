/**
 * Callback function for form submission
 * Prepares name and pref_times, pref_days arrays for local storage
 * @returns {bool}  false signals page not to reload (ie, not sending info to webserve)
 */
function sub(){
    /*  Uncomment to require 3 preferences 
   if(prefNum != 3) {
       alert("Need to add three preferences");
       return false;
   }
   */
   var pref_times = new Array();
   var pref_days = new Array();                
   var name = document.getElementById("name").value;
   
   var daySelects = document.getElementsByName("prefDay");
   var timeSelects = document.getElementsByName("prefTime");
                                 
   for(var i=0; i<daySelects.length; i++){ 
       pref_times.push(timeSelects.item(i).value);
       pref_days.push(daySelects.item(i).value);
   }
   
   // For now, I'm storing the information in local storage
   storeLocally(name, pref_times, pref_days);
   
   return false;
    
}

/**
 * Adds preference selects (time, day) to form
 * @param {string} name		Team name
 * @param pref_times	Array of times (ints)
 * @param pref_days		Array of days (strings)
 * @returns {undefined}
 */
function storeLocally(name, pref_times, pref_days){
   var teams;
   // Initialize teams arrays or load from local storage
   if(!localStorage["teams"]) {
       teams = new Array();
       console.log("Teams created");
   }
else {
        teams = JSON.parse(localStorage["teams"]);
        console.log("Teams created");
    }
    
           		
   var id = teams.length; 
   var team = {
id: id +1, 
team_name: name, 
pref_times: JSON.stringify(pref_times),
pref_days: JSON.stringify(pref_days)
};
    
    teams.push(team);
    // Print contents of teams array to console
    for(var i=0; i<teams.length; i++) {
        console.log("Team " + i + " ID: " + teams[i].id);
        console.log("Team name: " + teams[i].team_name);
    }
    //<team stored locally>
    localStorage["teams"] = JSON.stringify(teams);
}

var prefNum = 0;
var days = ["Sunday", "Monday","Tuesday","Wednesday","Thursday"];
var times = [5,6,7,8,9];

/**
 * Adds preference selects (time, day) to form
 * Limited to 3 preferences 
 * @returns {undefined}
 */
function createPref(){
    var form = document.getElementById('team_info');
    var button = document.getElementById('addpref');
    
    
    var div = document.createElement("div");
    div.style.display = 'block';
    div.appendChild(createTimeSelect(prefNum));
    div.appendChild(createDaySelect(prefNum));
    form.insertBefore(div, button);
    
    prefNum++;
    if(prefNum == 3) form.removeChild(button);
}

/**
 * Creates a select with values for each of the time preference choices
 * @param {int} prefNum                         Preference number                      
 * @returns {createTimeSelect.select|Element}   Select created
 */
function createTimeSelect(prefNum){
    var select = document.createElement("select");
    select.name = "prefTime";// + prefNum;
    
    for (var i = 0; i < times.length; i++){
        var opt = document.createElement('option');
        opt.value = times[i];
        opt.innerHTML = times[i] + " PM";
        select.appendChild(opt);
    }
    
    return select;
}

/**
 * Creates a select with values for each of the day preference choices
 * @param {int} prefNum                         Preference number                      
 * @returns {createTimeSelect.select|Element}   Select created
 */
function createDaySelect(prefNum){
    var select = document.createElement("select");
    select.name = "prefDay";// + prefNum;
    
    for (var i = 0; i < days.length; i++){
        var opt = document.createElement('option');
        opt.value = days[i];
        opt.innerHTML = days[i];
        select.appendChild(opt);
    }
    
    return select;
}

