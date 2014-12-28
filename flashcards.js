var myDict = {};
var id = 0;
var stats = {
  known : 0,
  notSure : 0,
  unknown :0
}
function pickItemFromDictionary() {

	id = Math.floor((Math.random() * myDict.length));
  console.log(id)
  console.log(myDict)
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
      myDict = data
      stats.known = 0;
      stats.notSure = 0;
      stats.unknown = 0; 
      $("#startGame").hide();
      $("#myResult").hide();
      $("#show").show();
      $("#myFrame").html("<h1>" + pickItemFromDictionary() +"</h1>" )
      $("#myFrame").show();
      $("#myStats").show();
     });
  });

  $("#show").click(function(){
     $("#myFrame").html("<h1>" +pickWordInEnglish(id)+"</h1>" ) 
     $("#feedback").show();
  });

  $("#iKnow").click(function(){
    stats.known++;
    $("#feedback").hide();

    $("#show").show();
    $("#myFrame").html("<h1>" + pickItemFromDictionary() +"</h1>")
    $("#myFrame").show();  
  });  

  $("#almostKnow").click(function(){
    stats.notSure++;
    $("#feedback").hide();

    $("#show").show();
    $("#myFrame").html("<h1>" + pickItemFromDictionary()+"</h1>")
    $("#myFrame").show();  
  }); 

  $("#dontKnow").click(function(){
    stats.unknown++;
    $("#feedback").hide();

    $("#show").show();
    $("#myFrame").html("<h1>" + pickItemFromDictionary()+"</h1>")
    $("#myFrame").show();  
  }); 
  
  $("#myStats").click(function(){
    $("#myFrame").hide();
    $("#feedback").hide();
    $("#show").hide();
    $("#myStats").hide();
    $("#startGame").show();
    htmlSrc = '<ul class="list-group">' +
  '<li class="list-group-item list-group-item-success"><span class="badge">' + stats.known  +'</span> You knew</li>' +
  '<li class="list-group-item list-group-item-warning"><span class="badge"> '+ stats.notSure +'</span> You were not sure</li> '+
  '<li class="list-group-item list-group-item-danger"><span class="badge">' + stats.unknown +'</span> You didn\'t know </li> ' +
'</ul>'
    console.log(htmlSrc);
    $("#myResult").html(htmlSrc);
    $("#myResult").show();
  });
 });