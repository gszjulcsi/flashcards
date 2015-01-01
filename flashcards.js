var myDict = {};
var id = 0;
var stats = {
  known : 0,
  notSure : 0,
  unknown :0
}

// states:
// 0: starting a new game
// 1: showing a card
// 2: giving feedback
// 3: showing result, game is pending

function startNewGame() {
      stats.known = 0;
      stats.notSure = 0;
      stats.unknown = 0;
      showWord();
}

function showWord() {
      $("#startGame").hide();
      $("#myResult").hide();
      $("#show").show();
      $("#myFrame").html("<h1>" + pickItemFromDictionary() +"</h1>")
      $("#myFrame").show();
      $("#myStats").show();
      $("#myResult").hide();
      $("#feedback").hide();
      $("#restartOrContinue").hide();
}

function showMeaning() {
     $("#myFrame").html("<h1>" +pickWordInEnglish(id)+"</h1>")
     $("#feedback").show();
     $("#show").show();
     $("#myFrame").show();
}

function showResult(){
    $("#myFrame").hide();
    $("#feedback").hide();
    $("#show").hide();
    $("#myStats").hide();
    $("#startGame").hide();
    htmlSrc = '<ul class="list-group">' +
  '<li class="list-group-item list-group-item-success"><span class="badge">' + stats.known  +'</span> You knew</li>' +
  '<li class="list-group-item list-group-item-warning"><span class="badge"> '+ stats.notSure +'</span> You were not sure</li> '+
  '<li class="list-group-item list-group-item-danger"><span class="badge">' + stats.unknown +'</span> You didn\'t know </li> ' +
'</ul>'
    $("#myResult").html(htmlSrc);
    $("#myResult").show();
    $("#restartOrContinue").show();
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

$(document).ready(function(){
  $("#startGame").click(function(){
    $.get("data/hun-en.json", function(data, status) {
      myDict = data;
      startNewGame();
     });
  });

  $("#show").click(function(){
    showMeaning();
  });

  $("#iKnow").click(function(){
    stats.known++;
    showWord();
  });  

  $("#almostKnow").click(function(){
    stats.notSure++;
    showWord();
  }); 

  $("#dontKnow").click(function(){
    stats.unknown++;
    showWord();
  }); 
  
  $("#myStats").click(function(){
    showResult();
  });

  $("#restart").click(function(){
    startNewGame();
  });
  $("#backToGame").click(function(){
    showWord();
  });

 });