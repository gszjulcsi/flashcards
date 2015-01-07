var myDict = {};

var initialState = "initial_state";
var showingWordState = "show_word_state";
var showingMeaningState = "show_meaning_state";
var showingResultState = "show_result_state";

var showingShortcutTable = "show_shortcut_table"
var showShortcutTableState = "show"
var hideShortcutTableState = "hide"

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

function keyboardShortcutTableState() {
  console.log(localStorage.getItem(showingShortcutTable))
  if (localStorage.getItem(showingShortcutTable) && localStorage.getItem(showingShortcutTable) === showShortcutTableState) {
    $("#hideKeyboardShortcutsButton, #shortcutCheatsheet").show();
    $("#showKeyboardShortcutsButton").hide();
  } else {
    console.log("else branch... hiding cheatshet")
    $("#hideKeyboardShortcutsButton, #shortcutCheatsheet").hide();
    $("#showKeyboardShortcutsButton").show();
  }
}

function showWord() {
      localStorage.setItem("current_state", showingWordState);
      pickItemFromDictionary()
      $("#myFrame").html("<h1>" + localStorage.getItem("current_word_hun") +"</h1>")
      $("#startGame, #myResult, #myResult, #feedback, #restartOrContinue").hide();
      $("#show, #myFrame, #myStats").show();
      keyboardShortcutTableState();
}

function showMeaning() {
      localStorage.setItem("current_state", showingMeaningState);
      $("#myFrame").html("<h1>" + localStorage.getItem("current_word_en") +"</h1>")
      $("#feedback, #myFrame").show();
      $("#show").hide();
      keyboardShortcutTableState();
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
    keyboardShortcutTableState();
}

function pickItemFromDictionary() {
  id = Math.floor((Math.random() * myDict.length));
  localStorage.setItem("current_word_hun", myDict[id].hun)
  localStorage.setItem("current_word_en", myDict[id].en)
}


function increaseCounter(counterName) {
  newScore = 1;
  if (localStorage.getItem(counterName)) {
    newScore = parseInt(localStorage.getItem(counterName), 10) + 1
  }
  localStorage.setItem(counterName, newScore.toString())
}


var handlers = {};
handlers[initialState] = function(){};
handlers[showingWordState] = showWord;
handlers[showingMeaningState] = showMeaning;
handlers[showingResultState] = showResult;


$(document).ready(function(){
  if (localStorage.getItem("current_state")) {
    $.get("data/hun-en.json", function(data, status) {
      myDict = data;
      console.log("status is " + localStorage.getItem("current_state"));
      handlers[localStorage.getItem("current_state")];
    });
  } else {
    console.log("status was nil.")
    localStorage.setItem("current_state", initialState)
  }
  keyboardShortcutTableState();

  $("#startGame").click(function(){
    $.get("data/hun-en.json", function(data, status) {
      myDict = data;
      startNewGame();
     });
  });

  $("#show").click(showMeaning);

  var showWordAndUpdateStats = _.compose(showWord, increaseCounter)

  $("#iKnow").click(function(){
    showWordAndUpdateStats("statistics_known");
  });  

  $("#almostKnow").click(function(){
    showWordAndUpdateStats("statistics_notSure")
  }); 

  $("#dontKnow").click(function(){
    showWordAndUpdateStats("statistics_unknown")
  }); 
  
  $("#myStats").click(showResult);

  $("#restart").click(startNewGame);

  $("#backToGame").click(showWord);

  $("#hideKeyboardShortcutsButton").click(function(){
    localStorage.setItem(showingShortcutTable, hideShortcutTableState);
    keyboardShortcutTableState();
  });

  $("#showKeyboardShortcutsButton").click(function(){
    localStorage.setItem(showingShortcutTable, showShortcutTableState);
    keyboardShortcutTableState();
  });

  jQuery(document).bind('keydown', 'w', function(e) {
    if (localStorage.getItem("current_state") == showingWordState) {
      showMeaning()
    }
    console.log("w was pressed");
  });


  jQuery(document).bind('keydown', 'a', function(e) {
    if (localStorage.getItem("current_state") == showingMeaningState) {
      showWordAndUpdateStats("statistics_known")
    }
    console.log("a was pressed");
  });

  jQuery(document).bind('keydown', 's', function(e) {
    if (localStorage.getItem("current_state") == showingMeaningState) {
      showWordAndUpdateStats("statistics_notSure")
    }
    console.log("s was pressed");
  });

  jQuery(document).bind('keydown', 'd', function(e) {
    if (localStorage.getItem("current_state") == showingMeaningState) {
      showWordAndUpdateStats("statistics_unknown")
    }
    console.log("d was pressed");
  });

  jQuery(document).bind('keydown', 'r', function(e) {
    showResult();
    console.log("r was pressed");
  });

  jQuery(document).bind('keydown', 'b', function(e) {
    if (localStorage.getItem("current_state") == showingResultState) {
       showWord();
    }
    console.log("b was pressed");
  });

  jQuery(document).bind('keydown', 'n', function(e) {
    startNewGame();
    console.log("n was pressed");
  });
 });
