/**
 * Indicates the total number of games assigned by the scheduling function
 * @type Number|Number
 */
var totalGames = 0;
/**
 * Indicates total submissions to the calendar
 * @type Number|Number
 */
var eventsSubmitted = 0;
/**
 * Set to false to prevent user from clicking button again
 * @type Boolean|Boolean|Boolean
 */
var submissionComplete = true;

/**
 * Identifies the calendar ID used for all operations on this page
 * @type String
 */
var calendarID = 'primary';

/**
 * Autheticates our application for accessing Google API
 * More information:
 * http://googleappsdeveloper.blogspot.com/2011/12/using-new-js-library-to-unlock-power-of.html
 * @returns {undefined}
 */
function init() {

  var clientId = '480075007100.apps.googleusercontent.com';
  var scopes = 'https://www.googleapis.com/auth/calendar';


  // Load the API key from the Developer Console
  gapi.client.setApiKey('AIzaSyDWMoEWCsh4giDWiBKZSVyzIytQBc73gu4');
  checkAuth();

  function checkAuth() {
    gapi.auth.authorize({
      client_id: clientId,
      scope: scopes,
      immediate: true
    }, handleAuth);
  }

  function handleAuth(authResult) {
    if (authResult && !authResult.error) {
      console.log("Authorization succeeded");
    } else doAuth();
  }

  function doAuth() {
    // Get authorization to use private data

    gapi.auth.authorize({
      client_id: clientId,
      scope: scopes,
      immediate: false
    }, handleAuth);
    return false;
  }

}


/**
 * Clear the calendar
 * @param {type} calName    Name ("summary" in Google Calendar terms) of calendar to be cleared
 * @returns {undefined}
 */
function clearCal(calName) {


  gapi.client.load('calendar', 'v3', function() {
    var request = gapi.client.calendar.calendars.clear({
      'calendarId': calendarID
    });

    request.execute(function(resp) {
      if (resp.message) {
        console.log(resp.message);
        deleteCal(calendarID, calName);
      } else { // resp.id should be empty if succeeded
        console.log("Calendar cleared");

        var sel = document.getElementById('leagueselect');
        var league = sel.options[sel.selectedIndex].value;

        adminAssign(league);
      }

    });
  })

};

/**
 *  Creates a progress bar and text indicating status of operation
 *  Adds to page after summit button
 * @param {elementID} adminAssign       Node after which elements are to be inserted
 * @returns {undefined}
 */
function createProgressText(adminAssign) {
  removeText();

  // Create Progress meter
  var meter = document.createElement("progress");
  meter.value = eventsSubmitted;
  meter.max = 40;
  meter.id = "submissionProgress";

  var text = document.createElement("div");
  text.id = "submissionText";
  text.innerHTML = "Running scheduling routine";

  // Insert after schedule button
  var secretAdminDiv = adminAssign.parentNode;
  secretAdminDiv.insertBefore(meter, adminAssign.nextSibling);
  secretAdminDiv.insertBefore(text, meter);

}

/**
 * Removes all text or elements created by any previous calls of adminAssign
 * @returns {undefined}
 */
function removeText() {
  totalGames = 0;
  eventsSubmitted = 0;

  var secretAdminDiv = document.getElementById("secretAdminDiv");
  var adminAssign = document.getElementById("adminAssign");

  while (adminAssign.nextSibling) {
    var next = adminAssign.nextSibling;
    secretAdminDiv.removeChild(next);
  }

  var adminText = document.getElementById("adminText");
  adminText.innerHTML = "";
}


/**
 * Inserts an event into the calendar
 * @param game    Title of the game (displaces as summary in calendar interface)
 * @param loc     Location
 * @param desc    Description
 * @param start   Start time
 * @param end     End time
 * @returns {undefined}
 */
function makeApiCall(game, loc, desc, start, end) {

  // Format for the event
  // Note: can add more parameters; documentation here: 
  // https://developers.google.com/google-apps/calendar/v3/reference/events/insert
  var event = {
    "summary": game,
    "location": loc,
    "description": desc,
    "end": {
      "dateTime": end // use dateTime instead to include time
    },
    "start": {
      "dateTime": start
    }
  };

  gapi.client.load('calendar', 'v3', function() {
    var request = gapi.client.calendar.events.insert({
      'calendarId': calendarID,
      'resource': event
    });

    request.execute(function(resp) {
      if (resp.id) {
        console.log("Event added");
        eventsSubmitted++;
      } else {
        console.log(resp.message);
        //try again
        makeApiCall(game, loc, desc, start, end);
      }
    });
  });
}

var attempts = 0;

/**
 * Requests the list of the user's calendars,
 * then sets calendarID to the id of the calendar whose
 * description matches calName
 * @param   calName     Description of the calendar to be set
 * @returns {undefined}
 */
function getCalendarId(calName) {

  gapi.client.load('calendar', 'v3', function() {
    var request = gapi.client.calendar.calendarList.list({});

    request.execute(function(resp) {
      if (resp.items.length > 0) {
        var found = false;
        for (var i = 0; i < resp.items.length; i++) {
          console.log(resp.items[i].summary);
          if (resp.items[i].summary === calName) {
            found = true;
            calendarID = resp.items[i].id;
            console.log(calendarID);
          }
        }
        if (found) clearCal(calName);
        else {
          var r = window.confirm("Could not find calendar. Perhaps you are not using the admin account, or perhaps you are trying to schedule a sport that does not have a calendar initialized. \n\ \n\Add to your calendar list?");
          if (r) createCal(calName);
          else handleFail();
        }
      } else {
        console.log(resp.message);
        attempts++;
        if (attempts < 3) getCalendarId(calName);
        else {
          handleFail();
          alert("Could not retrieve calendar list");
        }
      }
    });
  });

}

/**
 * Entry point for calendar submission
 * Takes value of leagueselect, then makes changes to the correct calendar
 * based on the sport selected
 * @returns {undefined}     
 */
function setCalendar() {
  // Prevent user from clicking button again until submssion complete
  if (!submissionComplete) return false;
  submissionComplete = false;

  // Prevent users from leaving until operation is complete
  window.onbeforeunload = function() {
    return "The events have not yet finished submitting to the calendar";
  };

  // Insert progress indicator
  createProgressText(document.getElementById("adminAssign"));

  // Base sport to schedule on the value of the league select
  var sel = document.getElementById('leagueselect');
  var league = sel.options[sel.selectedIndex].value;

  switch (league) {
    case "Baseball":
      getCalendarId('Baseball Schedule');
      break;
    case "Basketball":
      getCalendarId('Basketball Schedule');
      break;
  }
}

/**
 * Deletes (non-primary) calendar of the given ID, then creates another by the same name
 * Used to clear non-primary calendars
 * @param {String} calID       ID of calendar to be deleted
 * @param {String} calName     Name of calendar to pass to createCal
 * @returns {undefined}
 */
function deleteCal(calID, calName) {
  if (attempts == 3) attempts = 0;
  // Format for the event
  // Note: can add more parameters; documentation here: 
  // https://developers.google.com/google-apps/calendar/v3/reference/events/insert

  gapi.client.load('calendar', 'v3', function() {
    var request = gapi.client.calendar.calendars.delete({
      "calendarId": calID
    });

    request.execute(function(resp) {
      if (resp.message) {
        console.log(resp.message);
        //try again
        if (attempts < 3) {
          deleteCal(calID, calName);
          attempts++;
        } else handleFail();
      } else {
        console.log("Calendar deleted: " + calID);
        createCal(calName);
      }
    });
  });
}

/**
 * Creates a calendar with the given name
 * Calls admin assign to populate
 * @parma calName          Name of calendar to be created
 * @returns {undefined}
 */
function createCal(calName) {
  if (attempts == 3) attempts = 0;
  var cal = {
    "summary": calName
  };

  gapi.client.load('calendar', 'v3', function() {
    var request = gapi.client.calendar.calendars.insert({
      "resource": cal
    });

    request.execute(function(resp) {
      if (resp.id) {
        console.log("Calendar " + calName + " added");
        calendarID = resp.id;
        makePublic(calendarID);
        
        var sel = document.getElementById('leagueselect');
        var league = sel.options[sel.selectedIndex].value;

        adminAssign(league);
      } else {
        console.log(resp.message);
        //try again
        if (attempts < 3) {
          createCal(calName);
          attempts++;
        } else handleFail();
      }
    });
  });
}

/**
 * Sets tbe newly-created calendar to have public access
 * @param {type} calID      CalendarID
 * @returns {undefined}
 */
function makePublic(calID){
    var acl = {
        "role": "reader",
        "scope": {
            "type": "default"
        }
    };
    
    gapi.client.load('calendar', 'v3', function() {
    var request = gapi.client.calendar.acl.insert({
      "calendarId": calID,
      "resource": acl
    });

    request.execute(function(resp) {
      if (resp.id) {
        console.log("Calendar " + calID + " set to public");
      } else {
        console.log(resp.message);
        //try again
        if (attempts < 3) {
          makePublic(calID);
          attempts++;
        }
      }
    });
  });
}

/**
 * Called on failure of calendar upload
 * @returns {undefined}
 */
function handleFail() {
  submissionComplete = true;
  window.onbeforeunload = null;

  var text = document.getElementById("submissionText");
  text.innerHTML = "Failure to submit games";
}

/**
 * Sends a list of calendar ids to the database
 * @param {Array} ids       Calendar Ids (in the Google Calendar sense) to be added
 * @returns {undefined}
 */
function toDatabase(ids) {

  var Leagues = Parse.Object.extend("League");
  var league = new Parse.Query(Leagues);
  league.find().then(function(results) {
    for (var ii = 0; ii < ids.length; ii++) {
      object = results[ii];
      console.log("Saving " + ids[ii] + " to " + results[ii]);
      object.set("calID", ids[ii]);
      object.save(null,{success: function(object) {
                    console.log(ids[ii] + "successfully saved");
            }}
          , {error:  function(model, error) {
              console.log("Error for "  + ids[ii] + ": " + error.code);
          }});
    }
  });
}

/**
 * Retrieves the list of calendars of the user
 * @returns {undefined}
 */
function getCalendarList() {
  var ids = new Array();
  gapi.client.load('calendar', 'v3', function() {
    var request = gapi.client.calendar.calendarList.list({});

    request.execute(function(resp) {
      if (resp.items.length > 0) {
        for (var i = 0; i < resp.items.length; i++) {
          ids.push(resp.items[i].id);
        }
        toDatabase(ids);
      } else {
        console.log(resp.message);
        attempts++;
        if (attempts < 3) getCalendarId(calName);
        else {
          handleFail();
          alert("Could not retrieve calendar list");
        }
      }
    });
  });

}
