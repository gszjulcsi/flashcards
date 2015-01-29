var myDict = {};

// states:
// 0: starting a new game
// 1: showing a card
// 2: giving feedback
// 3: showing result, game is pending

/*global alert: false, confirm: false, console: false, Debug: false, opera: false, prompt: false, WSH: false, "_":true */

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
        showingMeaning : "show_meaning_state"
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
        $("#startGame, #feedback").hide();
        $("#show, #myFrame").show();
    }

    function showMeaning() {
        Storage.currentState = state.showingMeaning;
        $("#myFrame").html("<h1>" + Storage.wordFromSecondaryLanguage +"</h1>");
        $("#feedback, #myFrame").show();
        $("#show").hide();
    }

    function showResult() {
        $("#statsKnown").text(Storage.statisticsKnown);
        $("#statsNotSure").text(Storage.statisticsNotSure);
        $("#statsUnknown").text(Storage.statisticsUnknown);

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


    function loadBundles(lang) {
        $.i18n.properties({
            name: 'Messages',
            path: 'bundle/',
            mode: 'both',
            language: lang,
            callback: function() {
                $("#header-text").text(header_text);
                $("#game_tab").text(game_tab_title);
                $("#results_tab").text(results_tab_title);
                $("#cheatsheet_tab").text(cheatsheet_tab_title);
                $("#iKnow").text(i_know_button);
                $("#almostKnow").text(not_sure_button);
                $("#dontKnow").text(did_not_know_button);
                $("#show").text(show_meaning_button);
                $("#restart").text(restart_button);
                $("#newGameShortcut").text(new_game_shortcut_text);
                $("#showMeaningShortcut").text(new_game_shortcut_text);
                $("#iKnewShortcut").text(i_knew_shortcut_text);
                $("#almostKnewShortcut").text(almost_knew_shortcut_text);
                $("#didNotKnowShortcut").text(did_not_know_shortcut_text);
                $("#knownInTable").text(i_know_result_table);
                $("#notSureInTable").text(not_sure_result_table);
                $("#unknownInTable").text(did_not_know_result_table);
                $("#languageMenu").text(language_menu);
            }
        });}

    $(document).ready(function(){
        var lng = $.i18n.browserLang();//"hu";
        loadBundles(lng);

        // configure language combo box
        $('#lang').change(function() {
            var selection = $('#lang option:selected').val();
            loadBundles(selection !== 'browser' ? selection : $.i18n.browserLang());

        });

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

        $("")

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

        $("#restart").click(startNewGame);

        $("#backToGame").click(showWord);

        $('a[href="#results"]').click(showResult);

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

        jQuery(document).bind('keydown', 'n', startNewGame);
    });
}());