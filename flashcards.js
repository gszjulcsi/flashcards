var myDict = {};

var showShortcutTableState = "show"
var hideShortcutTableState = "hide"

// states:
// 0: starting a new game
// 1: showing a card
// 2: giving feedback
// 3: showing result, game is pending

var localStorageKeys = {
  statistics : {
    known: "statistics_known",
    notSure: "statistics_notSure",
    unknown: "statistics_unknown"
  },
  showingShortcutTable : "show_shortcut_table",
  currentState : "current_state"
}

var state = {
  initial : "initial_state",
  showingWord : "show_word_state",
  showingMeaning : "show_meaning_state",
  showingResult : "show_result_state"
}

// TODO
// It's just a single step to create your own wrapper around localStorage with functions like getStatisticsKnown,
// leading to a nice architecture where you can easily pass in your mock storage implementation during tests later
// (or your newer better storage implementation that uses a backend service for storing data).
// If you want to be future-proof, make the API async (with callbacks) :)

function startNewGame() {
  localStorage.setItem(localStorageKeys.statistics.known, "0")
  localStorage.setItem(localStorageKeys.statistics.notSure, "0")
  localStorage.setItem(localStorageKeys.statistics.unknown, "0")
  showWord();
}

function keyboardShortcutTableState() {
  console.log(localStorage.getItem(localStorageKeys.showingShortcutTable))
  if (localStorage.getItem(localStorageKeys.showingShortcutTable) && localStorage.getItem(localStorageKeys.showingShortcutTable) === showShortcutTableState) {
    $("#hideKeyboardShortcutsButton, #shortcutCheatsheet").show();
    $("#showKeyboardShortcutsButton").hide();
  } else {
    console.log("else branch... hiding cheatshet")
    $("#hideKeyboardShortcutsButton, #shortcutCheatsheet").hide();
    $("#showKeyboardShortcutsButton").show();
  }
}

function showWord() {
      localStorage.setItem(localStorageKeys.currentState, state.showingWord);
      pickItemFromDictionary()
      $("#myFrame").html("<h1>" + localStorage.getItem("current_word_hun") +"</h1>")
      $("#startGame, #myResult, #myResult, #feedback, #restartOrContinue").hide();
      $("#show, #myFrame, #myStats").show();
      keyboardShortcutTableState();
}

function showMeaning() {
      localStorage.setItem(localStorageKeys.currentState, state.showingMeaning);
      $("#myFrame").html("<h1>" + localStorage.getItem("current_word_en") +"</h1>")
      $("#feedback, #myFrame").show();
      $("#show").hide();
      keyboardShortcutTableState();
}

function showResult() {
    localStorage.setItem(localStorageKeys.currentState, state.showingResult);
    $("#myFrame, #feedback, #show, #myStats, #startGame").hide();

    htmlSrc = '<ul class="list-group">' +
  '<li class="list-group-item list-group-item-success"><span class="badge">' + localStorage.getItem(localStorageKeys.statistics.known) +'</span> You knew</li>' +
  '<li class="list-group-item list-group-item-warning"><span class="badge"> '+ localStorage.getItem(localStorageKeys.statistics.notSure) +'</span> You were not sure</li> '+
  '<li class="list-group-item list-group-item-danger"><span class="badge">' + localStorage.getItem(localStorageKeys.statistics.unknown) +'</span> You didn\'t know </li> ' +
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
handlers[state.initial] = function(){};
handlers[state.showingWord] = showWord;
handlers[state.showingMeaning] = showMeaning;
handlers[state.showingResult] = showResult;


$(document).ready(function(){
  if (localStorage.getItem(localStorageKeys.currentState)) {
    $.get("data/hun-en.json", function(data, status) {
      myDict = data;
      console.log("status is " + localStorage.getItem(localStorageKeys.currentState));
      handlers[localStorage.getItem(localStorageKeys.currentState)];
    });
  } else {
    console.log("status was nil.")
    localStorage.setItem(localStorageKeys.currentState, state.initial)
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
    showWordAndUpdateStats(localStorageKeys.statistics.known);
  });  

  $("#almostKnow").click(function(){
    showWordAndUpdateStats(localStorageKeys.statistics.notSure)
  }); 

  $("#dontKnow").click(function(){
    showWordAndUpdateStats(localStorageKeys.statistics.unknown)
  }); 
  
  $("#myStats").click(showResult);

  $("#restart").click(startNewGame);

  $("#backToGame").click(showWord);

  $("#hideKeyboardShortcutsButton").click(function(){
    localStorage.setItem(localStorageKeys.showingShortcutTable, hideShortcutTableState);
    keyboardShortcutTableState();
  });

  $("#showKeyboardShortcutsButton").click(function(){
    localStorage.setItem(localStorageKeys.showingShortcutTable, showShortcutTableState);
    keyboardShortcutTableState();
  });

  jQuery(document).bind('keydown', 'w', function(e) {
    if (localStorage.getItem(localStorageKeys.currentState) == state.showingWord) {
      showMeaning()
    }
    console.log("w was pressed");
  });


  jQuery(document).bind('keydown', 'a', function(e) {
    if (localStorage.getItem(localStorageKeys.currentState) == state.showingMeaning) {
      showWordAndUpdateStats(localStorageKeys.statistics.known)
    }
    console.log("a was pressed");
  });

  jQuery(document).bind('keydown', 's', function(e) {
    if (localStorage.getItem(localStorageKeys.currentState) == state.showingMeaning) {
      showWordAndUpdateStats(localStorageKeys.statistics.notSure)
    }
    console.log("s was pressed");
  });

  jQuery(document).bind('keydown', 'd', function(e) {
    if (localStorage.getItem(localStorageKeys.currentState) == state.showingMeaning) {
      showWordAndUpdateStats(localStorageKeys.statistics.unknown)
    }
    console.log("d was pressed");
  });

  jQuery(document).bind('keydown', 'r', function(e) {
    showResult();
    console.log("r was pressed");
  });

  jQuery(document).bind('keydown', 'b', function(e) {
    if (localStorage.getItem(localStorageKeys.currentState) == state.showingResult) {
       showWord();
    }
    console.log("b was pressed");
  });

  jQuery(document).bind('keydown', 'n', function(e) {
    startNewGame();
    console.log("n was pressed");
  });
 });
