// This javascript will have to be server side in the final product,
// since it gives away the information needed to access the calendar
// Except for refreshing the calendar, it works independent of the page

var calDisplay = false;
var totalGames = 0;
var eventsSubmitted = 0;
var submissionComplete = true;
// Game parameters; presumably handed by scheduling function
var game = "Game";
var loc = "Location";
var desc = "Description";
var start = "2014-05-18";
var end = "2014-05-19";

// Note that I'm currently hosting the calendar with my email address;
// We can change this if need be
var calendarID = "lukeolney@gmail.com";


function toggleCal(){
var cal = document.getElementById("calendar");

if(calDisplay) {
    calDisplay = false;
    cal.style.display = "none";
}
else{
    calDisplay = true;
    cal.style.display = "block";
}
}

/*
* Autheticates our application for accessing Google API
* More information:
* http://googleappsdeveloper.blogspot.com/2011/12/using-new-js-library-to-unlock-power-of.html
*/
function init() {

 var clientId = '480075007100.apps.googleusercontent.com';
 var scopes = 'https://www.googleapis.com/auth/calendar';


  // Load the API key from the Developer Console
  gapi.client.setApiKey('AIzaSyDWMoEWCsh4giDWiBKZSVyzIytQBc73gu4');
  checkAuth();

  function checkAuth() {
    gapi.auth.authorize({client_id: clientId, scope: scopes, immediate: true}, handleAuth);
  }

  function handleAuth(authResult) {
  	if (authResult && !authResult.error) {
  		console.log("Authorization succeeded");
  	}
  	else doAuth();
  }
  function doAuth() {
    // Get authorization to use private data

    gapi.auth.authorize({client_id: clientId, scope: scopes, immediate: false}, handleAuth);
    return false;
  }

}


/*
Clear the calendar
*/
function clearCal(){
    // Prevent user from clicking button again until submssion complete
    if(!submissionComplete) return false;
    submissionComplete = false;
    
    // Prevent users from leaving until operation is complete
    window.onbeforeunload = function() {
            return "The events have not yet finished submitting to the calendar";
        };
     
     // Insert progress indicator
     createProgressText(document.getElementById("adminAssign"));
        
  gapi.client.load('calendar', 'v3', function() {
    var request = gapi.client.calendar.calendars.clear({
        'calendarId': calendarID,
      });
      
    request.execute(function(resp) {
    if (resp.id){
 	console.log(resp.message);
     }
     else{ // resp.id should be empty if succeeded
         console.log("Calendar cleared");
         adminAssign();
     }
     
      });
  })

};

/*
 * 
 * @param {elementID} adminAssign       Node after which elements are to be inserted
 * @returns {undefined}
 */
function createProgressText(adminAssign){
      removeText();
      
      // Create Progress meter
      var meter = document.createElement("progress");
      meter.value = eventsSubmitted;
      meter.max = 40;
      meter.id = "submissionProgress";
      
      var text = document.createElement("div");
      text.id = "submissionText";
      text.innerHTML = "Submitting games to calendar";
      
      // Insert after schedule button
      var secretAdminDiv = adminAssign.parentNode;
      secretAdminDiv.insertBefore(meter, adminAssign.nextSibling);
      secretAdminDiv.insertBefore(text, meter);

}

/*
 * Removes all text or elements created by any previous calls of adminAssign
 * @returns {undefined}
 */
function removeText(){
    totalGames = 0;
    eventsSubmitted = 0;

    var secretAdminDiv = document.getElementById("secretAdminDiv");
    var adminAssign = document.getElementById("adminAssign");
    
    while(adminAssign.nextSibling){
        var next = adminAssign.nextSibling;
        secretAdminDiv.removeChild(next);
    }
    
    var adminText = document.getElementById("adminText");
    adminText.innerHTML = "";
}


/*
* Inserts an event into the calendar
* @param game    Title of the game (displaces as summary in calendar interface)
* @param loc     Location
* @param desc    Description
* @param start   Start time
* @param end     End time
*/
function makeApiCall(game, loc, desc, start, end){

  // Format for the event
  // Note: can add more parameters; documentation here: 
  // https://developers.google.com/google-apps/calendar/v3/reference/events/insert
  var event = {
          "summary": game,
          "location": loc,
          "description": desc,
          "end": {
              "dateTime": end       // use dateTime instead to include time
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
    if (resp.id){
 	 console.log("Event added");
         eventsSubmitted++;
 }
 else{
 	console.log(resp.message);
        //try again
        makeApiCall(game, loc, desc, start, end);
 }
  });
});
}
