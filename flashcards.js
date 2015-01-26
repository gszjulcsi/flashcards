var myDict = {};

// states:
// 0: starting a new game
// 1: showing a card
// 2: giving feedback
// 3: showing result, game is pending

/*global alert: false, confirm: false, console: true, Debug: false, opera: false, prompt: false, WSH: false, "_":true */

(function() {
    "use strict";
    var localStorageKeys = {
        statistics : {
            known: "statistics_known",
            notSure: "statistics_notSure",
            unknown: "statistics_unknown"
        },
        showingShortcutTable : "show_shortcut_table",
        currentState : "current_state",

        currentWordPrimaryLanguage : "current_word_hun",
        currentWordSecondaryLanguage : "current_word_en"
    };

    var state = {
        initial : "initial_state",
        showingWord : "show_word_state",
        showingMeaning : "show_meaning_state",
        showingResult : "show_result_state"
    };

    var Storage = {
        get statisticsKnown() {
            return localStorage.getItem(localStorageKeys.statistics.known);
        },
        set statisticsKnown(value) {
            localStorage.setItem(localStorageKeys.statistics.known, value.toString());
        },

        get statisticsNotSure()  {
            return localStorage.getItem(localStorageKeys.statistics.notSure);
        },

        set statisticsNotSure(value) {
            localStorage.setItem(localStorageKeys.statistics.notSure, value.toString());
        },

        get statisticsUnknown() {
            return localStorage.getItem(localStorageKeys.statistics.unknown);
        },
        set statisticsUnknown(value) {
            return localStorage.setItem(localStorageKeys.statistics.unknown, value.toString());
        },

        get currentState() {
            return localStorage.getItem(localStorageKeys.currentState);
        },
        set currentState(value) {
            return localStorage.setItem(localStorageKeys.currentState, value.toString());
        },
        increaseCounter: function(counterName) {
            var newScore = 1;
            if (localStorage.getItem(counterName)) {
                newScore = parseInt(localStorage.getItem(counterName), 10) + 1;
            }
            localStorage.setItem(counterName, newScore.toString());
        },
        get wordFromPrimaryLanguage() {
            return localStorage.getItem(localStorageKeys.currentWordPrimaryLanguage);
        },
        set wordFromPrimaryLanguage(value) {
            return localStorage.setItem(localStorageKeys.currentWordPrimaryLanguage, value);
        },
        get wordFromSecondaryLanguage() {
            return localStorage.getItem(localStorageKeys.currentWordSecondaryLanguage);
        },
        set wordFromSecondaryLanguage(value) {
            return localStorage.setItem(localStorageKeys.currentWordSecondaryLanguage, value);
        }
    };

// TODO
// It's just a single step to create your own wrapper around localStorage with functions like getStatisticsKnown,
// leading to a nice architecture where you can easily pass in your mock storage implementation during tests later
// (or your newer better storage implementation that uses a backend service for storing data).
// If you want to be future-proof, make the API async (with callbacks) :)

    function startNewGame() {
        Storage.statisticsKnown = 0;
        Storage.statisticsNotSure = 0;
        Storage.statisticsUnknown = 0;

        showWord();
    }

    function showWord() {
        Storage.currentState = state.showingWord;
        pickItemFromDictionary();
        $("#myFrame").html("<h1>" + Storage.wordFromPrimaryLanguage +"</h1>");
        $("#startGame, #myResult, #feedback, #restartOrContinue").hide();
        $("#show, #myFrame, #myStats").show();
    }

    function showMeaning() {
        Storage.currentState = state.showingMeaning;
        $("#myFrame").html("<h1>" + Storage.wordFromSecondaryLanguage +"</h1>");
        $("#feedback, #myFrame").show();
        $("#show").hide();
    }

    function showResult() {
        Storage.currentState = state.showingResult;
        $("#myFrame, #feedback, #show, #myStats, #startGame, #shortcutCheatsheet" ).hide();

        var htmlSrc = '<ul class="list-group">' +
            '<li class="list-group-item list-group-item-success"><span class="badge">' + Storage.statisticsKnown +'</span> You knew</li>' +
            '<li class="list-group-item list-group-item-warning"><span class="badge"> '+ Storage.statisticsNotSure +'</span> You were not sure</li> '+
            '<li class="list-group-item list-group-item-danger"><span class="badge">' + Storage.statisticsUnknown +'</span> You didn\'t know </li> ' +
            '</ul>';
        $("#myResult").html(htmlSrc);
        $("#myResult, #restartOrContinue").show();
    }

    function pickItemFromDictionary() {
        var id = Math.floor((Math.random() * myDict.length));
        Storage.wordFromPrimaryLanguage = myDict[id].hun;
        Storage.wordFromSecondaryLanguage = myDict[id].en;
    }

    var handlers = {};
    handlers[state.initial] = function(){};
    handlers[state.showingWord] = showWord;
    handlers[state.showingMeaning] = showMeaning;
    handlers[state.showingResult] = showResult;


    $(document).ready(function(){
        if (Storage.currentState) {
            $.get("data/hun-en.json", function(data, status) {
                myDict = data;
                console.log("status is " + Storage.currentState);
                handlers[Storage.currentState]();
            });
        } else {
            console.log("status was nil.");
            Storage.currentState = state.initial;
        }

        $("#startGame").click(function(){
            $.get("data/hun-en.json", function(data, status) {
                myDict = data;
                startNewGame();
            });
        });

        $("#show").click(showMeaning);

        var showWordAndUpdateStats = _.compose(showWord, Storage.increaseCounter);

        $("#iKnow").click(function(){
            showWordAndUpdateStats(localStorageKeys.statistics.known);
        });

        $("#almostKnow").click(function(){
            showWordAndUpdateStats(localStorageKeys.statistics.notSure);
        });

        $("#dontKnow").click(function(){
            showWordAndUpdateStats(localStorageKeys.statistics.unknown);
        });

        // $("#myStats").click(showResult);

        $("#restart").click(startNewGame);

        $("#backToGame").click(showWord);

        $('#myTab').find('#game').click(function (e) {
            e.preventDefault();
            console.log("game tab clicked");
            $(this).tab('show');
        });

        $('#myTab #cheatsheet').click(function (e) {
            e.preventDefault();
            console.log("cheatsheet tab clicked");
            $(this).tab('show');
        });

        $('#myTab #results').click(function (e) {
            e.preventDefault();
            console.log("result tab clicked");
            showResult();
            $(this).tab('show');
        });

        jQuery(document).bind('keydown', 'w', function() {
            if (Storage.currentState === state.showingWord) {
                showMeaning();
            }
        });


        jQuery(document).bind('keydown', 'a', function() {
            if (Storage.currentState === state.showingMeaning) {
                showWordAndUpdateStats(localStorageKeys.statistics.known);
            }
        });

        jQuery(document).bind('keydown', 's', function() {
            if (Storage.currentState === state.showingMeaning) {
                showWordAndUpdateStats(localStorageKeys.statistics.notSure);
            }
        });

        jQuery(document).bind('keydown', 'd', function() {
            if (Storage.currentState === state.showingMeaning) {
                showWordAndUpdateStats(localStorageKeys.statistics.unknown);
            }
        });

        // jQuery(document).bind('keydown', 'r', showResult);

        jQuery(document).bind('keydown', 'b', function() {
            if (Storage.currentState === state.showingResult) {
                showWord();
            }
        });

        jQuery(document).bind('keydown', 'n', startNewGame);
    });
}());