$(document).ready(function() {
  // Initialize Firebase

  var config = {
    apiKey: "AIzaSyCFE4KPH2hM8qc68h8zvF697NfGsDBqjbE",
    authDomain: "train-scheduler-676d5.firebaseapp.com",
    databaseURL: "https://train-scheduler-676d5.firebaseio.com",
    projectId: "train-scheduler-676d5",
    storageBucket: "train-scheduler-676d5.appspot.com",
    messagingSenderId: "270891976931"
  };
  firebase.initializeApp(config);

  // Create a variable to reference the database
  var database = firebase.database();

  $("#button").on("click", function() {
    event.preventDefault();

    // Grabs user input
    var tName = $("#name")
      .val()
      .trim();
    var tDestination = $("#destination")
      .val()
      .trim();
    var tTime = $("#time")
      .val()
      .trim();
    var tFrequency = $("#frequency")
      .val()
      .trim();

    // Creates local "temporary" object for holding employee data
    var trainValues = {
      name: tName,
      destination: tDestination,
      time: tTime,
      frequency: tFrequency
    };

    // Push new values to the database
    database.ref().push(trainValues);

    // Clear out text fields after submit
    $("#name").val("");
    $("#destination").val("");
    $("#time").val("");
    $("#frequency").val("");
  });

  // Create a listener for value changes in the database
  database.ref().on("child_added", function(childSnapshot) {
    // Snapshot of the current database
    var getData = childSnapshot.val();

    // User input data
    var tName = getData.name;
    var tDestination = getData.destination;
    var tFrequency = getData.frequency;
    var tTime = getData.time;

    // First Time (pushed back 1 year to make sure it comes before current time)
    var firstTimeConverted = moment(tTime, "hh:mm").subtract(1, "years");

    // Current time
    var currentTime = moment();
    var timeFormatted = moment(currentTime).format("hh:mm");

    // Difference between the times
    var diffTime = moment().diff(moment(firstTimeConverted), "minutes");

    // Time apart (remainder)
    var tRemainder = diffTime % tFrequency;

    // Minutes until train
    var minutesAway = tFrequency - tRemainder;

    // Next train
    var nextTrain = moment().add(minutesAway, "minutes");
    var tArrivalTime = moment(nextTrain).format("hh:mm A");

    // Append all the values to the table in the HTML
    $("#tableAdd").append(
      "<tr><td>" +
        tName +
        "</td><td>" +
        tDestination +
        "</td><td>" +
        tFrequency +
        "</td><td>" +
        tArrivalTime +
        "</td><td>" +
        minutesAway +
        "</td></tr>"
    );
  });
});
