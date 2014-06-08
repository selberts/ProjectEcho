Parse.initialize("r3WndIFb85R0lx1qhchN4nquvAQVeKVrkA3TBnpI", "Wui7puCTZpnTmA5ZLvJmlj5R044vAyDerOBXhYzq");

//$.getScript("register.js", function(){});
createLeagueSelect2();
/**
 * Checks password against password in database
 * @param {String} pwd    Password
 * @returns {undefined}
 */
function passwordCheck(pwd) {



  Parse.initialize("r3WndIFb85R0lx1qhchN4nquvAQVeKVrkA3TBnpI", "Wui7puCTZpnTmA5ZLvJmlj5R044vAyDerOBXhYzq");

  // Select the table Teamdata in the database
  var PWT = Parse.Object.extend("Password");
  // Prepare a query
  var query = new Parse.Query(PWT);
  // Find all the tuples in the table
  query.equalTo("type", "password");
  // Get the results set of the query
  query.find().then(function(results) { //the results set can only be accessed in this function!!!
    var b = false;
    for (var i = 0; i < results.length; i++) {
      var object = results[i];
      var password = object.get("password");
      if (pwd == password) {
        b = true;
      }
    }

    if (b) {

      Succeed();

    } else {
      alert("Incorrect password");
    }

  });

}

/**
 * Called on success of password submit
 * Hides password form, unhides options available to admin
 * @returns {undefined}
 */
function Succeed() {
  showtimeslots(timeslots);
  var passform = document.getElementById('password');
  var adminDiv = document.getElementById('secretAdminDiv');
  
  passform.style.display = 'none';
  adminDiv.style.display = 'inline-block';
  
  // Authenticate for calendar access
  init();
}

/**
 * Callback function for password form submission
 * @returns {bool}  false signals page not to reload (ie, not sending info to webserver)
 */
function submitPass() {

  var pwd = document.getElementById("adminpassword").value;

  passwordCheck(pwd);

  return false;
}

/**
 * Callback function for timeslot form submission
 * Submits timeslot objects to database
 * @returns {bool}  false signals page not to reload (ie, not sending info to webserver)
 */
function submitTimeSlots() {
  /*  Uncomment to require 3 preferences 
               if(prefNum != 3) {
                   alert("Need to add three preferences");
                   return false;
               }
               */

  var daySelects = document.getElementsByName("prefDay");
  var timeSelects = document.getElementsByName("prefTime");
  var courtSelects = document.getElementsByName("courts");

  if (daySelects.length == 0 || timeSelects.length == 0) {
    alert("Must submit at least one timeslot");
    return false;
  }
  var timeslots = new Array();

  // Check for duplicates
  while (removeDuplicate(daySelects, timeSelects)) {}
  if (removed > 0) //alert("Removed " + removed + " duplicate timeslots");
  removed = 0;
  Parse.initialize("r3WndIFb85R0lx1qhchN4nquvAQVeKVrkA3TBnpI", "Wui7puCTZpnTmA5ZLvJmlj5R044vAyDerOBXhYzq");
  var Timeslots = Parse.Object.extend("Timeslots");
  var timeslots = new Timeslots();
  for (var i = 0; i < daySelects.length; i++) {
    var time = timeSelects.item(i).value;
    var day = daySelects.item(i).value;
    var co = courtSelects.item(i).value;
    timeslots.save({
      type: "timeslot",
      day: day,
      time: time,
      courts: co
    }).then(function(object) {
      alert("Timeslots successfully added.");
    });
    // timeslots.push(new Time_Slot(i, time, day, 2));
  }

  return false;

}
var removed = 0;


/**
 * Removes Duplicate for time and day 
 * @param daySelects      a list of selected day
 * @param timeSelects     a list of selected time 
 * @returns {bool}        whether the removal succeed
 */
function removeDuplicate(daySelects, timeSelects) {
  var i;
  var remove = false;

  loop1: for (i = 0; i < timeSelects.length; i++) {
    for (var j = i + 1; j < timeSelects.length; j++) {
      if (timeSelects.item(i).value === timeSelects.item(j).value) {
        if (daySelects.item(i).value === daySelects.item(j).value) {
          remove = true;
          break loop1;
        }
      }
    }
  }

  if (!remove) return false;

  var day = daySelects.item(i);
  var form = document.getElementById('team_info');
  form.removeChild(day.parentNode);
  removed++;


  return true;
}

var prefNum = 0;
var days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday"];



/**
 * Adds preference selects (time, day, court, and remove button) to form
 * Unlimited number of time slots
 * @returns {undefined}
 */
function createTS() {
  var form = document.getElementById('team_info');
  var button = document.getElementById('addpref');

  var remove = document.createElement("BUTTON");
  remove.id = "remove" + prefNum;
  remove.onclick = removeEntry;
  var text = document.createTextNode("Remove");
  remove.appendChild(text);

  var div = document.createElement("div");
  div.style.display = 'block';
  div.appendChild(createTimeSelect(prefNum));
  div.appendChild(createDaySelect(prefNum));
  div.appendChild(createCourtSelect(prefNum));
  div.appendChild(remove);
  form.insertBefore(div, button);

  prefNum++;
}

var removeEntry = function(e) {
  e = e || window.event;
  e = e.target || e.srcElement;

  var form = e.parentNode.parentNode;

  form.removeChild(e.parentNode);
}

/**
 * Creates a select with values for each of the time preference choices
 * @param {int} prefNum                         Preference number
 * @returns {createTimeSelect.select|Element}   Select created
 */
function createTimeSelect(prefNum) {
  var select = document.createElement("select");
  select.name = "prefTime"; // + prefNum;
  var times = new Array();

  for (var time = 5; time < 10; time++)
    times.push(time + " PM");
  for (var i = 0; i < times.length; i++) {
    var opt = document.createElement('option');
    opt.value = times[i];
    opt.innerHTML = times[i];
    select.appendChild(opt);
  }

  return select;
}

/**
* Creates a select with values for each of the court preferenct choices
* @param {int} prefNum                         Preference number
* @returns {createCourtSelect.select|Element}   Select created
*/
function createCourtSelect(prefNum) {
  var select = document.createElement("select");
  select.name = "courts"; // + prefNum;

  for (var i = 1; i < 3; i++) {
    var opt = document.createElement('option');
    opt.value = i;
    opt.innerHTML = i;
    select.appendChild(opt);
  }

  return select;
}

/**
 * Creates a select with values for each of the day preference choices
 * @param {int} prefNum                         Preference number
 * @returns {createTimeSelect.select|Element}   Select created
 */
function createDaySelect(prefNum) {
  var select = document.createElement("select");
  select.name = "prefDay"; // + prefNum;

  for (var i = 0; i < days.length; i++) {
    var opt = document.createElement('option');
    opt.value = days[i];
    opt.innerHTML = days[i];
    select.appendChild(opt);
  }

  return select;
}
/**
 * Generates the current list of time slots for the Admin to view.
 * @returns
 */
function showtimeslots(timeslots){
  console.log("trying");
  console.log(timeslots);
  var div = document.getElementById('curts');
  var table = document.createElement("table");
  table.id = 'tab';
  var row = document.createElement("tr");
  var next = 0;
  for (var i = 0; i < timeslots.length; i++) {
    var text ="";
    text =timeslots[i].day + " at " + timeslots[i].time;
    var cell = document.createElement("td");
    cell.innerHTML = text;
    row.appendChild(cell);
    if (next == 1) {
      table.appendChild(row);
      row = document.createElement("tr");
      next = 0;
    }
    else{
      next++;
    }
  }
  table.border="1";
  table.style="width:300px"
  div.appendChild(table);
}

function createLeagueSelect2(){
  //Parse.initialize("r3WndIFb85R0lx1qhchN4nquvAQVeKVrkA3TBnpI", "Wui7puCTZpnTmA5ZLvJmlj5R044vAyDerOBXhYzq");
  //var select = document.getElementById("leagueselect");
        
        
  //var div = document.getElementById("dg");
  //div.appendChild(select);

        // Select the table Teamdata in the database
  var League = Parse.Object.extend("League");
  // Prepare a query
  var query = new Parse.Query(League);
  // Find all the tuples in the table
        query.equalTo("type", "league");
        // Get the results set of the query
        query.find().then(function(results) { //the results set can only be accessed in this function!!!
          
        var select = document.getElementById("leagueselect2");
              for(var i=0;i<results.length;i++){
                var object = results[i];
                
                var opt = document.createElement("option");
          opt.value = object.get("name");
          opt.innerHTML = object.get("name");
          select.appendChild(opt);

              }
              
      
       });
}
