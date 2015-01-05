var myDict = {};

var initialState = "ititial_state";
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
    newScore = parseInt(localStorage.getItem(counterName)) + 1
  }
  localStorage.setItem(counterName, newScore.toString())
}

$(document).ready(function(){
  if (localStorage.getItem("current_state")) {
    $.get("data/hun-en.json", function(data, status) {
      myDict = data;
      console.log("status was set: " + localStorage.getItem("current_state"));
      if (localStorage.getItem("current_state") === initialState) {
        console.log("setting in initialState");
      } else if (localStorage.getItem("current_state") === showingWordState) {
        console.log("showWord will be called");
        showWord();
      } else if (localStorage.getItem("current_state") === showingMeaningState) {
        console.log("showMeaning will be called");
        showMeaning();
      } else if (localStorage.getItem("current_state") === showingResultState) {
        console.log("showResult will be called.");
        showResult();
      }
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
      increaseCounter("statistics_known")
      showWord();
    }
    console.log("a was pressed");
  });

  jQuery(document).bind('keydown', 's', function(e) {
    if (localStorage.getItem("current_state") == showingMeaningState) {
      increaseCounter("statistics_notSure")
      showWord();
    }
    console.log("s was pressed");
  });

  jQuery(document).bind('keydown', 'd', function(e) {
    if (localStorage.getItem("current_state") == showingMeaningState) {
      increaseCounter("statistics_unknown")
      showWord();
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
