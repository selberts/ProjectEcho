 /*
  * Inserts the calendar into the page
  */
 function insertDiv(ids){
     var div = document.getElementById("calendar");
     var colors = ["A32929","5F6B02","2952A3","7A367A","29527A","1B887A","B1440E"];
     var iframe = "<iframe src='https://www.google.com/calendar/embed?title=Schedules&amp;height=600&amp;wkst=1&amp;bgcolor=%239999ff";
     // iframe += "&amp;src=northwesternintramurals%40gmail.com&amp;color=%232952A3";
     // iframe +=  "&amp;src=7aopdoiot5ocu288p0h07e2d8g%40group.calendar.google.com&amp;color=%235F6B02";
    // Once we have the ids in the database, we can do this
       
      function randInt(min, max) {
            return Math.floor(Math.random() * (max - min + 1)) + min;
        }
      for(var i=0; i<ids.length; i++){
          iframe +="&amp;src=";
          iframe +=ids[i];
          iframe +="&amp;color=%23";
          iframe += colors[i%colors.length];
      } 
      iframe +=  "&amp;ctz=America%2FWinnipeg'";
      iframe += "style='border-width:0' width='800' height='600' frameborder='0' scrolling='no'></iframe>";
      
      div.innerHTML = iframe;
 }
 
 /*
  * Replaces @ in string with %40, so that we can put it in the calendar iFrame
  * @arg {String} string        string to be parsed
  */
 function removeAt(string){
     var subs = string.split("@");
     if(subs.length != 2){
         console.log("Error: could not parse calendar ID");
         return string;
     } else {
         return subs[0] + "%40" + subs[1];
     }
 }
  

function pullFromDatabase(){
    var ids;
    Parse.initialize("r3WndIFb85R0lx1qhchN4nquvAQVeKVrkA3TBnpI", "Wui7puCTZpnTmA5ZLvJmlj5R044vAyDerOBXhYzq");

  var Leagues = Parse.Object.extend("League");
  // Prepare a query
  var query = new Parse.Query(Leagues);
  // Find all the tuples in the table
  query.equalTo("type", "league");
  // Get the results set of the query
  query.find().then(function(results) { //the results set can only be accessed in this function!!!
    var calIDs=[]
    for (var i = 0; i < results.length; i++) {
      var object = results[i];
      calIDs.push(object.get("calID"));
    }
    insertDiv(calIDs);
  });
}

