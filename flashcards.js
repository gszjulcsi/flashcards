var myDict = {};
var id = 0;

var initialState = "ititial_state";
var showingWordState = "show_word_state";
var showingMeaningState = "show_meaning_state";
var showingResultState = "show_result_state";


// states:
// 0: starting a new game
// 1: showing a card
// 2: giving feedback
// 3: showing result, game is pending

function startNewGame() {
  localStorage.setItem("statistics_known", "0")
  localStorage.setItem("statistics_notSure", "0")
  localStorage.setItem("statistics_unknown", "0")
  showWord();
}

function showWord() {
      localStorage.setItem("current_state", showingWordState);
      $("#myFrame").html("<h1>" + pickItemFromDictionary() +"</h1>")
      $("#startGame, #myResult, #myResult, #feedback, #restartOrContinue").hide();
      $("#show, #myFrame, #myStats").show();
}

function showMeaning() {
      localStorage.setItem("current_state", showingMeaningState);
      $("#myFrame").html("<h1>" +pickWordInEnglish(id)+"</h1>")
      $("#feedback, #myFrame").show();
      $("#show").hide();
}

function showResult() {
    localStorage.setItem("current_state", showingResultState);
    $("#myFrame, #feedback, #show, #myStats, #startGame").hide();

    htmlSrc = '<ul class="list-group">' +
  '<li class="list-group-item list-group-item-success"><span class="badge">' + localStorage.getItem("statistics_known") +'</span> You knew</li>' +
  '<li class="list-group-item list-group-item-warning"><span class="badge"> '+ localStorage.getItem("statistics_notSure") +'</span> You were not sure</li> '+
  '<li class="list-group-item list-group-item-danger"><span class="badge">' + localStorage.getItem("statistics_unknown") +'</span> You didn\'t know </li> ' +
'</ul>'
    $("#myResult").html(htmlSrc);
    $("#myResult, #restartOrContinue").show();
}

function pickItemFromDictionary() {
	id = Math.floor((Math.random() * myDict.length));
	return pickWordInHungarian(id);
}

function pickWordInHungarian(id) {
  return myDict[id].hun;
}

function pickWordInEnglish(id) {
  return myDict[id].en;
}

function increaseCounter(counterName) {
  newScore = 1;
  if (localStorage.getItem(counterName)) {
    newScore = parseInt(localStorage.getItem(counterName)) + 1
  }
  localStorage.setItem(counterName, newScore.toString())
}

$(document).ready(function(){
  $("#startGame").click(function(){
    $.get("data/hun-en.json", function(data, status) {
      myDict = data;
      startNewGame();
     });
  });

  $("#show").click(showMeaning);

  $("#iKnow").click(function(){
    increaseCounter("statistics_known")
    showWord();
  });  

  $("#almostKnow").click(function(){
    increaseCounter("statistics_notSure")
    showWord();
  }); 

  $("#dontKnow").click(function(){
    increaseCounter("statistics_unknown")
    showWord();
  }); 
  
  $("#myStats").click(showResult);

  $("#restart").click(startNewGame);

  $("#backToGame").click(showWord);

 });