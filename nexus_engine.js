var $jscomp = $jscomp || {};
$jscomp.scope = {};
$jscomp.findInternal = function(a, b, c) {
    a instanceof String && (a = String(a));
    for (var d = a.length, e = 0; e < d; e++) {
        var f = a[e];
        if (b.call(c, f, e, a))
            return {
                i: e,
                v: f
            }
    }
    return {
        i: -1,
        v: void 0
    }
}
;
$jscomp.ASSUME_ES5 = !1;
$jscomp.ASSUME_NO_NATIVE_MAP = !1;
$jscomp.ASSUME_NO_NATIVE_SET = !1;
$jscomp.defineProperty = $jscomp.ASSUME_ES5 || "function" == typeof Object.defineProperties ? Object.defineProperty : function(a, b, c) {
    a != Array.prototype && a != Object.prototype && (a[b] = c.value)
}
;
$jscomp.getGlobal = function(a) {
    return "undefined" != typeof window && window === a ? a : "undefined" != typeof global && null != global ? global : a
}
;
$jscomp.global = $jscomp.getGlobal(this);
$jscomp.polyfill = function(a, b, c, d) {
    if (b) {
        c = $jscomp.global;
        a = a.split(".");
        for (d = 0; d < a.length - 1; d++) {
            var e = a[d];
            e in c || (c[e] = {});
            c = c[e]
        }
        a = a[a.length - 1];
        d = c[a];
        b = b(d);
        b != d && null != b && $jscomp.defineProperty(c, a, {
            configurable: !0,
            writable: !0,
            value: b
        })
    }
}
;
$jscomp.polyfill("Array.prototype.find", function(a) {
    return a ? a : function(a, c) {
        return $jscomp.findInternal(this, a, c).v
    }
}, "es6", "es3");
$jscomp.SYMBOL_PREFIX = "jscomp_symbol_";
$jscomp.initSymbol = function() {
    $jscomp.initSymbol = function() {}
    ;
    $jscomp.global.Symbol || ($jscomp.global.Symbol = $jscomp.Symbol)
}
;
$jscomp.Symbol = function() {
    var a = 0;
    return function(b) {
        return $jscomp.SYMBOL_PREFIX + (b || "") + a++
    }
}();
$jscomp.initSymbolIterator = function() {
    $jscomp.initSymbol();
    var a = $jscomp.global.Symbol.iterator;
    a || (a = $jscomp.global.Symbol.iterator = $jscomp.global.Symbol("iterator"));
    "function" != typeof Array.prototype[a] && $jscomp.defineProperty(Array.prototype, a, {
        configurable: !0,
        writable: !0,
        value: function() {
            return $jscomp.arrayIterator(this)
        }
    });
    $jscomp.initSymbolIterator = function() {}
}
;
$jscomp.arrayIterator = function(a) {
    var b = 0;
    return $jscomp.iteratorPrototype(function() {
        return b < a.length ? {
            done: !1,
            value: a[b++]
        } : {
            done: !0
        }
    })
}
;
$jscomp.iteratorPrototype = function(a) {
    $jscomp.initSymbolIterator();
    a = {
        next: a
    };
    a[$jscomp.global.Symbol.iterator] = function() {
        return this
    }
    ;
    return a
}
;
$jscomp.iteratorFromArray = function(a, b) {
    $jscomp.initSymbolIterator();
    a instanceof String && (a += "");
    var c = 0
      , d = {
        next: function() {
            if (c < a.length) {
                var e = c++;
                return {
                    value: b(e, a[e]),
                    done: !1
                }
            }
            d.next = function() {
                return {
                    done: !0,
                    value: void 0
                }
            }
            ;
            return d.next()
        }
    };
    d[Symbol.iterator] = function() {
        return d
    }
    ;
    return d
}
;
$jscomp.polyfill("Array.prototype.keys", function(a) {
    return a ? a : function() {
        return $jscomp.iteratorFromArray(this, function(a) {
            return a
        })
    }
}, "es6", "es3");
var Engine = {
    CARD_WIDTH: 177,
    CARD_HEIGHT: 254,
    ASSETS_PATH: "assets/",
    alternativeImageUrl: !1,
    init: function(a) {
        Engine.ui = new Engine.UI;
        Engine.storage = new Engine.Storage;
        Engine.audio = new Engine.Audio;
        I18n.init();
        Engine.banlists = new Engine.BanlistsManager;
        Engine.banlists.load(function() {
            Engine.database.load(function() {
                Engine.detectImageUrl(a)
            })
        })
    },
    getAssetPath: function(a) {
        return Engine.ASSETS_PATH + a
    },
    textToHtml: function(a) {
        return a.replace(/\n/g, "<br>")
    },
    getCardData: function(a) {
        return Engine.database.cards[a]
    },
    cleanText: function(a) {
        return a.toUpperCase().replace(/[\n\- :\.]/g, "")
    },
    detectImageUrl: function(a) {
        var b = !1
          , c = new Image
          , d = function() {
            b || (b = !0,
            a())
        };
        c.onload = d;
        c.onerror = function() {
            b || (b = !0,
            Engine.alternativeImageUrl = !0,
            a())
        }
        ;
        c.src = Engine.getCardPicturePath(89631139);
        c.complete && d()
    },
    setCardImageElement: function(a, b) {
        a.off("error");
        a.attr("src", Engine.getCardPicturePath(b));
        if (0 < b)
            a.one("error", function() {
                $(this).attr("src", Engine.getCardPicturePath(-1))
            })
    },
    setCardImageElementToSleeve: function(a, b) {
        a.off("error");
        a.one("error", function() {
            $(this).attr("src", Engine.getCardPicturePath(0))
        });
        a.attr("src", b)
    },
    getCardPicturePath: function(a) {
        return 0 == a ? Engine.getAssetPath("images/cover.png") : -1 == a ? Engine.getAssetPath("images/unknown.png") : Engine.alternativeImageUrl ? "https://raw.githubusercontent.com/DuelingNexus/images/6f96661/" + a + ".jpg" : "https://cdn.jsdelivr.net/gh/DuelingNexus/images@6f96661/" + a + ".jpg"
    },
    pluralize: function(a, b) {
        return 1 === b ? a : a + "s"
    }
};
var Game = {
    fields: [],
    phaseButtons: null,
    phase: -1,
    hoveredCard: null,
    optionButtonTemplate: null,
    selectionCardTemplate: null,
    announceTemplate: null,
    announceCardTemplate: null,
    lifePoints: [0, 0],
    playerTimers: [0, 0],
    currentTimer: -1,
    timerIntervalId: -1,
    isWaiting: !1,
    isSelecting: !1,
    selectionIsTribute: !1,
    selectionIsSorting: !1,
    selectionIsSelectUnselect: !1,
    isCancellable: !1,
    isSubmittable: !1,
    isZoneSummonable: {},
    isZoneActivable: {},
    isSelectingChain: !1,
    isAdvancedSummoning: !1,
    isAdvancedActivating: !1,
    isAdvancedSelectionOpen: !1,
    isSelectingActivationOption: !1,
    isAdvancedChaining: !1,
    isSelectingCounters: !1,
    selectingCounterType: null,
    selectingCounterCount: -1,
    selectingCounterRemaining: -1,
    isConnected: !1,
    hasGameEnded: !1,
    selectableSummon: [],
    selectableSpSummon: [],
    selectableRepos: [],
    selectableSetMonster: [],
    selectableSetSpell: [],
    selectableActivate: [],
    selectableEffects: [],
    selectableAttack: [],
    selectableCards: [],
    chainableCards: [],
    selectedCards: [],
    mustSelectCards: [],
    selectionMin: -1,
    selectionMax: -1,
    selectionSum: -1,
    isSelectingPlace: !1,
    selectableFieldCount: -1,
    selectableFieldFilter: -1,
    selectedPlaces: [],
    declarableType: 0,
    declarableOpcodes: [],
    chainingMode: 0,
    isHost: !1,
    isStarted: !1,
    isSpectator: !1,
    position: 0,
    players: [],
    selectedDeck: -1,
    deckTemplate: null,
    tagPlayer: null,
    messageQueue: [],
    isTaskActive: !1,
    animationSpeedMultiplier: 1,
    lastFrames: [],
    init: function() {
        Game.isInitialized ? Game.clearTheField() : (Game.startDate = Date.now(),
        Engine.audio.loadGame(),
        Game.fields.push(new Game.Field("player")),
        Game.fields.push(new Game.Field("opponent")),
        $(window).resize(Game.updateSizes),
        Game.updateSizes(),
        $("#game-navbar").remove(),
        $(window.document).contextmenu(function(a) {
            Game.cancelSelection();
            return !1
        }),
        $("#game-cancel-button").click(function(a) {
            Game.cancelSelection()
        }),
        $(".game-field-zone").mouseenter(function() {
            var a = $(this).data("player")
              , b = $(this).data("location")
              , c = $(this).data("index");
            Game.onCardHovered(a, b, c)
        }).mouseleave(function() {
            var a = $(this).data("player")
              , b = $(this).data("location")
              , c = $(this).data("index");
            Game.onCardLeft(a, b, c)
        }).click(function() {
            var a = $(this).data("player")
              , b = $(this).data("location")
              , c = $(this).data("index");
            Game.onCardClicked(a, b, c)
        }),
        $("#game-surrender-button").click(function() {
            Game.closeActionMenu();
            Game.sendSurrender()
        }),
        Game.phaseButtons = {},
        Game.phaseButtons[GamePhase.DRAW] = $("#game-dp-button"),
        Game.phaseButtons[GamePhase.STANDBY] = $("#game-sp-button"),
        Game.phaseButtons[GamePhase.MAIN1] = $("#game-mp1-button"),
        Game.phaseButtons[GamePhase.BATTLE_START] = $("#game-bp-button"),
        Game.phaseButtons[GamePhase.MAIN2] = $("#game-mp2-button"),
        Game.phaseButtons[GamePhase.END] = $("#game-ep-button"),
        Game.phaseButtons[GamePhase.BATTLE_START].click(function() {
            Game.isSelecting && (Game.sendAction(MainPhaseAction.TO_BATTLE_PHASE),
            Game.endSelection())
        }),
        Game.phaseButtons[GamePhase.MAIN2].click(function() {
            Game.isSelecting && (Game.sendAction(BattlePhaseAction.TO_MAIN_PHASE_2),
            Game.endSelection())
        }),
        Game.phaseButtons[GamePhase.END].click(function() {
            Game.isSelecting && (Game.phase == GamePhase.BATTLE_START ? Game.sendAction(BattlePhaseAction.TO_END_PHASE) : Game.sendAction(MainPhaseAction.TO_END_PHASE),
            Game.endSelection())
        }),
        Game.optionButtonTemplate = $("#game-option-button-template").remove().removeAttr("id"),
        Game.selectionCardTemplate = $("#game-selection-card-template").remove().removeAttr("id"),
        Game.announceTemplate = $("#game-announce-template").remove().removeAttr("id"),
        Game.announceCardTemplate = $("#game-announce-card-template").remove().removeAttr("id"),
        $("#game-action-menu").mouseleave(function() {
            Game.closeActionMenu()
        }),
        $("#game-action-view").click(function() {
            Game.closeActionMenu();
            Game.openAdvancedSelection(Game.fields[Game.selectedCard.controller].cards[Game.selectedCard.location], !0);
            Game.isViewingLocation = !0
        }),
        $("#game-action-view-materials").click(function() {
            Game.closeActionMenu();
            Game.openAdvancedSelection(Game.selectedCard.overlays, !0);
            Game.isViewingLocation = !0
        }),
        $("#game-action-summon").click(function() {
            Game.sendAction(MainPhaseAction.SUMMON, Game.selectableSummon.indexOf(Game.selectedCard));
            Game.endSelection()
        }),
        $("#game-action-sp-summon").click(function() {
            if (Game.selectedCard.location === CardLocation.DECK || Game.selectedCard.location === CardLocation.EXTRA || Game.selectedCard.location === CardLocation.GRAVEYARD || Game.selectedCard.location === CardLocation.BANISHED) {
                Game.isAdvancedSummoning = !0;
                for (var a = [], b = 0; b < Game.selectableSpSummon.length; ++b)
                    Game.selectableSpSummon[b].location === Game.selectedCard.location && a.push(Game.selectableSpSummon[b]);
                Game.closeActionMenu();
                Game.openAdvancedSelection(a, !0)
            } else
                Game.sendAction(MainPhaseAction.SP_SUMMON, Game.selectableSpSummon.indexOf(Game.selectedCard)),
                Game.endSelection()
        }),
        $("#game-action-repos").click(function() {
            Game.sendAction(MainPhaseAction.REPOS, Game.selectableRepos.indexOf(Game.selectedCard));
            Game.endSelection()
        }),
        $("#game-action-set-monster").click(function() {
            Game.sendAction(MainPhaseAction.SET_MONSTER, Game.selectableSetMonster.indexOf(Game.selectedCard));
            Game.endSelection()
        }),
        $("#game-action-set-spell").click(function() {
            Game.sendAction(MainPhaseAction.SET_SPELL, Game.selectableSetSpell.indexOf(Game.selectedCard));
            Game.endSelection()
        }),
        $("#game-action-activate").click(function() {
            if (Game.selectedCard.location === CardLocation.DECK || Game.selectedCard.location === CardLocation.EXTRA || Game.selectedCard.location === CardLocation.GRAVEYARD || Game.selectedCard.location === CardLocation.BANISHED) {
                Game.isAdvancedActivating = !0;
                for (var a = [], b = 0; b < Game.selectableActivate.length; ++b)
                    Game.selectableActivate[b].location === Game.selectedCard.location && a.push(Game.selectableActivate[b]);
                Game.closeActionMenu();
                Game.openAdvancedSelection(a, !0)
            } else
                Game.closeActionMenu(),
                Game.activateCard(Game.selectedCard)
        }),
        $("#game-action-attack").click(function() {
            Game.sendAction(BattlePhaseAction.ATTACK, Game.selectableAttack.indexOf(Game.selectedCard));
            Game.endSelection()
        }),
        $("#game-position-atk-up").click(function() {
            Game.sendResponse(CardPosition.FACEUP_ATTACK);
            Game.endSelection()
        }),
        $("#game-position-atk-down").click(function() {
            Game.sendResponse(CardPosition.FACEDOWN_ATTACK);
            Game.endSelection()
        }),
        $("#game-position-def-up").click(function() {
            Game.sendResponse(CardPosition.FACEUP_DEFENCE);
            Game.endSelection()
        }),
        $("#game-position-def-down").click(function() {
            Game.sendResponse(CardPosition.FACEDOWN_DEFENCE);
            Game.endSelection()
        }),
        $("#game-yesno-yes-button").click(function() {
            Game.isSelectingChain ? (Game.selectChainInternal(),
            $("#game-yesno-window").hide()) : (Game.sendResponse(1),
            Game.endSelection())
        }),
        $("#game-yesno-no-button").click(function() {
            Game.sendResponse(Game.isSelectingChain ? -1 : 0);
            Game.endSelection()
        }),
        $("#game-announce-card-text").on("input", Game.onAnnounceCardTextInput),
        $("#game-timer-bar-player").hide(),
        $("#game-timer-player").hide(),
        $("#game-timer-bar-opponent").hide(),
        $("#game-timer-opponent").hide(),
        Game.audio = new Audio(Engine.audio.getRandomMusic()),
        Game.audio.loop = !0,
        Game.updateOption("music"),
        $("#game-field").on("dragstart", function() {
            return !1
        }),
        $("#game-force-chain-button").click(function() {
            Game.chainingMode = (Game.chainingMode + 1) % 3;
            0 === Game.chainingMode ? $("#game-force-chain-button").text("Chaining: Auto").removeClass("engine-button-success").removeClass("engine-button-danger").addClass("engine-button-default") : 1 === Game.chainingMode ? $("#game-force-chain-button").text("Chaining: Manual").removeClass("engine-button-default").removeClass("engine-button-danger").addClass("engine-button-success") : 2 === Game.chainingMode && $("#game-force-chain-button").text("Chaining: Off").removeClass("engine-button-default").removeClass("engine-button-success").addClass("engine-button-danger")
        }),
        $(window).mousemove(function(a) {
            Game.mouseX = a.pageX;
            Game.mouseY = a.pageY;
            Game.isSiding ? Game.sidingUpdateSelectionPosition() : Game.updateTooltipPosition()
        }),
        Game.isInitialized = !0)
    },
    clearTheField: function() {
        for (var a = 0; 2 > a; ++a)
            Game.fields[a].clear();
        Game.refreshDisabledZones(null)
    },
    playSound: function(a) {
        var b = Date.now() - Game.startDate;
        5E3 > b ? Engine.audio.play(a, (b + 1E3) / 6E3) : Engine.audio.play(a)
    },
    preloadImage: function(a, b) {
        if (0 >= a)
            b();
        else {
            var c = !1
              , d = function() {
                c || (c = !0,
                b())
            }
              , e = new Image;
            e.onload = d;
            e.onerror = d;
            e.src = Engine.getCardPicturePath(a);
            e.complete && d()
        }
    },
    preloadImages: function(a, b) {
        var c = function(d) {
            d == a.length ? b() : Game.preloadImage(a[d], function() {
                c(d + 1)
            })
        };
        c(0)
    },
    preloadCardImages: function(a, b, c) {
        var d = function(e) {
            e == a.length ? c() : Game.preloadImage(a[e][b], function() {
                d(e + 1)
            })
        };
        d(0)
    },
    updateTooltipPosition: function() {
        null !== Game.hoveredCard && $("#game-tooltip").css("left", Game.mouseX + 10).css("top", Game.mouseY + 10)
    },
    cancelSelection: function() {
        if (!Game.cancelViewingLocation())
            if (Game.isAdvancedSummoning || Game.isAdvancedActivating)
                Game.isAdvancedSelectionOpen = !1,
                Game.isAdvancedActivating = !1,
                Game.isAdvancedSummoning = !1,
                $("#game-selection-list").empty(),
                $("#game-selection-window").hide();
            else if (Game.isSelectingActivationOption)
                Game.isSelectingActivationOption = !1,
                $("#game-option-list").empty(),
                $("#game-option-window").hide();
            else if (Game.selectionIsSelectUnselect) {
                if (Game.isSubmittable || Game.isCancellable)
                    Game.sendResponse(-1),
                    Game.endSelection()
            } else if (Game.isSelecting) {
                var a = !1;
                !Game.isAdvancedChaining && Game.sendSelectedCards() ? a = !1 : Game.isCancellable && (Game.sendResponse(-1),
                a = !0);
                a && Game.endSelection()
            } else
                Game.isAdvancedChaining && Game.isCancellable && (Game.sendResponse(-1),
                Game.endSelection())
    },
    openActionMenu: function(a, b, c) {
        Game.isAdvancedSelectionOpen || Game.isSelectingActivationOption || (Game.isMenuOpened = !0,
        Game.selectedCard = a,
        null !== a ? Game.fillActionMenu(a) : Game.emptyActionMenu(),
        a = 0 === b && c === CardLocation.DECK && !Game.isSpectator,
        $("#game-surrender-button").css("display", a ? "block" : "none"),
        $("#game-action-menu").css("left", Game.mouseX - 10).css("top", Game.mouseY - 10).show())
    },
    fillActionMenu: function(a) {
        a.location == CardLocation.GRAVEYARD || a.location == CardLocation.BANISHED || a.location == CardLocation.EXTRA ? $("#game-action-view").css("display", "block") : $("#game-action-view").hide();
        0 < a.overlays.length ? $("#game-action-view-materials").css("display", "block") : $("#game-action-view-materials").hide();
        Game.isZoneSummonable[a.location] || Game.isZoneActivable[a.location] ? ($("#game-action-sp-summon").css("display", Game.isZoneSummonable[a.location] ? "block" : "none"),
        $("#game-action-activate").css("display", Game.isZoneActivable[a.location] ? "block" : "none"),
        $("#game-action-summon").hide(),
        $("#game-action-repos").hide(),
        $("#game-action-set-monster").hide(),
        $("#game-action-set-spell").hide(),
        $("#game-action-attack").hide(),
        $("#game-action-menu").css("left", Game.mouseX - 10).css("top", Game.mouseY - 10).show()) : (Game.phase !== GamePhase.BATTLE_START ? ($("#game-action-summon").css("display", -1 !== Game.selectableSummon.indexOf(a) ? "block" : "none"),
        $("#game-action-sp-summon").css("display", -1 !== Game.selectableSpSummon.indexOf(a) ? "block" : "none"),
        $("#game-action-repos").css("display", -1 !== Game.selectableRepos.indexOf(a) ? "block" : "none"),
        $("#game-action-set-monster").css("display", -1 !== Game.selectableSetMonster.indexOf(a) ? "block" : "none"),
        $("#game-action-set-spell").css("display", -1 !== Game.selectableSetSpell.indexOf(a) ? "block" : "none"),
        $("#game-action-attack").hide()) : ($("#game-action-summon").hide(),
        $("#game-action-sp-summon").hide(),
        $("#game-action-repos").hide(),
        $("#game-action-set-monster").hide(),
        $("#game-action-set-spell").hide(),
        $("#game-action-attack").css("display", -1 !== Game.selectableAttack.indexOf(a) ? "block" : "none")),
        $("#game-action-activate").css("display", -1 !== Game.selectableActivate.indexOf(a) ? "block" : "none"))
    },
    emptyActionMenu: function() {
        $("#game-action-view").hide();
        $("#game-action-view-materials").hide();
        $("#game-action-summon").hide();
        $("#game-action-sp-summon").hide();
        $("#game-action-repos").hide();
        $("#game-action-set-monster").hide();
        $("#game-action-set-spell").hide();
        $("#game-action-attack").hide();
        $("#game-action-activate").hide()
    },
    closeActionMenu: function() {
        Game.isMenuOpened = !1;
        $("#game-action-menu").hide()
    },
    addCard: function(a, b, c, d, e) {
        Game.fields[b].addCard(a, c, void 0 === d ? -1 : d, e)
    },
    getCard: function(a, b, c, d) {
        return -1 === a ? (a = Game.getCard(0, b, c, d),
        null !== a ? a : Game.getCard(1, b, 5 == c ? 6 : 5, d)) : Game.fields[a].getCard(b, c, d)
    },
    removeCard: function(a, b) {
        return Game.fields[a.controller].removeCard(a, b)
    },
    getLinkedPositions: function(a, b, c, d) {
        var e = []
          , f = a.linkArrows;
        -1 !== b ? (f & LinkMarker.LEFT && 0 < d && e.push({
            player: b,
            location: c,
            index: d - 1
        }),
        f & LinkMarker.RIGHT && 4 > d && e.push({
            player: b,
            location: c,
            index: d + 1
        }),
        4 <= Game.masterRule && ((f & LinkMarker.TOP_LEFT && 2 === d || f & LinkMarker.TOP && 1 === d || f & LinkMarker.TOP_RIGHT && 0 === d) && e.push({
            player: b,
            location: c,
            index: 5
        }),
        (f & LinkMarker.TOP_LEFT && 4 === d || f & LinkMarker.TOP && 3 === d || f & LinkMarker.TOP_RIGHT && 2 === d) && e.push({
            player: b,
            location: c,
            index: 6
        }))) : (b = a.controller,
        a = 5 === d ? 0 : 2,
        1 === b && (a = 2 - a),
        f & LinkMarker.BOTTOM_LEFT && e.push({
            player: b,
            location: c,
            index: 0 + a
        }),
        f & LinkMarker.BOTTOM && e.push({
            player: b,
            location: c,
            index: 1 + a
        }),
        f & LinkMarker.BOTTOM_RIGHT && e.push({
            player: b,
            location: c,
            index: 2 + a
        }),
        f & LinkMarker.TOP_LEFT && e.push({
            player: 1 - b,
            location: c,
            index: 4 - a
        }),
        f & LinkMarker.TOP && e.push({
            player: 1 - b,
            location: c,
            index: 3 - a
        }),
        f & LinkMarker.TOP_RIGHT && e.push({
            player: 1 - b,
            location: c,
            index: 2 - a
        }));
        return e
    },
    onCardHovered: function(a, b, c) {
        var d = Game.getCard(a, b, c);
        if (d && 0 !== d.code) {
            var e = $("#game-tooltip");
            null === Game.hoveredCard && e.show();
            Game.hoveredCard = d;
            Engine.ui.setCardInfo(d.code);
            Engine.ui.setCardTooltip(e, d);
            Game.updateTooltipPosition();
            if (b & CardLocation.MONSTER_ZONE && d.type & CardType.LINK)
                for (a = Game.getLinkedPositions(d, a, b, c),
                b = 0; b < a.length; ++b)
                    c = Game.getZoneHtmlId(a[b].player, a[b].location, a[b].index),
                    $(c).addClass("game-field-zone-linked")
        }
    },
    onCardLeft: function(a, b, c) {
        (a = Game.getCard(a, b, c)) && Game.hoveredCard === a && (Game.hideTooltip(),
        $(".game-field-zone-linked").removeClass("game-field-zone-linked"))
    },
    hideTooltip: function() {
        Game.hoveredCard = null;
        Engine.ui.setCardTooltip(null, null);
        $("#game-tooltip").hide()
    },
    getZoneHtmlId: function(a, b, c) {
        if (b === CardLocation.MONSTER_ZONE && 5 <= c) {
            if (5 === c && 0 === a || 6 === c && 1 === a)
                return "#game-field-extra-monster1";
            if (6 === c && 0 === a || 5 === c && 1 === a)
                return "#game-field-extra-monster2"
        }
        return Game.fields[a].namespace + (b === CardLocation.MONSTER_ZONE ? "monster" : "spell") + (c + 1)
    },
    onCardClicked: function(a, b, c) {
        if (Game.isSelectingPlace && (-1 === a && b === CardLocation.MONSTER_ZONE && 5 <= c && (a = 0,
        Game.isFieldSelectable(a, CardLocation.MONSTER_ZONE, c) || (a = 1,
        c = 5 === c ? 6 : 5)),
        b === CardLocation.MONSTER_ZONE || b === CardLocation.SPELL_ZONE)) {
            var d = $(Game.getZoneHtmlId(a, b, c));
            if (d.hasClass("game-field-zone-selectable"))
                d.removeClass("game-field-zone-selectable").addClass("game-field-zone-selected"),
                Game.selectedPlaces.push({
                    player: a,
                    location: b,
                    sequence: c
                }),
                Game.selectedPlaces.length === Game.selectableFieldCount && (Game.sendMessage({
                    type: "GameSendZones",
                    zones: Game.selectedPlaces
                }),
                Game.endSelection());
            else if (d.hasClass("game-field-zone-selected"))
                for (d.removeClass("game-field-zone-selected").addClass("game-field-zone-selectable"),
                d = 0; d < Game.selectedPlaces.length; ++d)
                    Game.selectedPlaces[d].player === a && Game.selectedPlaces[d].location === b && Game.selectedPlaces[d].sequence === c && Game.selectedPlaces.splice(d, 1);
            return
        }
        c = Game.getCard(a, b, c);
        if (Game.isSelecting)
            d = 0 === a && b === CardLocation.DECK && !Game.isSpectator,
            c ? -1 !== Game.selectionMin ? Game.validCardSelected(c) : Game.openActionMenu(c, a, b) : d && Game.openActionMenu(null, a, b);
        else if (Game.isSelectingCounters) {
            if (c)
                Game.onCounterSelectedOnCard(c)
        } else
            d = 0 === a && b === CardLocation.DECK && !Game.isSpectator,
            (c || d) && Game.openActionMenu(c, a, b)
    },
    onCounterSelectedOnCard: function(a) {
        var b = Game.selectableCards.indexOf(a);
        -1 < b && 0 < a.usableCounterCount && (a.usableCounterCount--,
        Game.selectingCounterRemaining--,
        Game.usedCounters[b]++,
        0 === Game.selectingCounterRemaining ? (Game.sendMessage({
            type: "GameSendCounters",
            counters: Game.usedCounters
        }),
        Game.endSelection()) : Game.displayRemainingCounters())
    },
    onCardSelected: function(a, b, c, d) {
        (a = Game.getCard(a, b, c, d)) && Game.validCardSelected(a)
    },
    validCardSelected: function(a) {
        if (-1 !== Game.selectionMin) {
            if (-1 !== Game.selectableCards.indexOf(a)) {
                var b = Game.selectedCards.indexOf(a);
                -1 !== b ? (Game.selectedCards.splice(b, 1),
                Game.isAdvancedSelectionOpen ? a.advancedSelectionImage.removeClass("game-selected-card") : (a.imgElement.removeClass("game-selected-card"),
                a.imgElement.addClass("game-selectable-card")),
                Game.selectionIsSelectUnselect || -1 === Game.selectionSum || Game.sendSelectedCards()) : (Game.selectedCards.push(a),
                Game.isAdvancedSelectionOpen ? a.advancedSelectionImage.addClass("game-selected-card") : (a.imgElement.addClass("game-selected-card"),
                a.imgElement.removeClass("game-selectable-card")),
                Game.selectionIsSelectUnselect || Game.getCurrentSelectionValue() !== Game.selectionMax && -1 === Game.selectionSum || Game.sendSelectedCards());
                Game.selectionIsSelectUnselect && Game.sendSelectionSingleCard(a)
            }
        } else if (Game.isAdvancedChaining)
            Game.selectSingleCardFinal(a);
        else if (Game.isAdvancedSummoning || Game.isAdvancedActivating)
            Game.isAdvancedSummoning ? (Game.sendAction(MainPhaseAction.SP_SUMMON, Game.selectableSpSummon.indexOf(a)),
            Game.endSelection()) : Game.activateCard(a)
    },
    activateCard: function(a) {
        var b = []
          , c = -1;
        do
            c = Game.selectableActivate.indexOf(a, c + 1),
            -1 !== c && b.push({
                index: c,
                effect: Game.selectableEffects[c]
            });
        while (-1 !== c);1 == b.length ? (Game.sendAction(Game.phase === GamePhase.BATTLE_START ? BattlePhaseAction.ACTIVATE : MainPhaseAction.ACTIVATE, Game.selectableActivate.indexOf(a)),
        Game.endSelection()) : 1 < b.length && (Game.isSelectingActivationOption = !0,
        Game.openOptionsWindow(b, !0, !0))
    },
    sendSelectedCards: function() {
        if (Game.isSelecting) {
            if (-1 !== Game.selectionSum)
                return Game.sendSumSelectedCards();
            var a = Game.getCurrentSelectionValue();
            if (a >= Game.selectionMin && a <= Game.selectionMax)
                return Game.isSelectingChain ? Game.selectSingleCardFinal(Game.selectedCards[0]) : (Game.sendSelectionIndexesFinal(),
                Game.endSelection()),
                !0
        }
        return !1
    },
    getCurrentSelectionValue: function() {
        if (Game.selectionIsTribute) {
            for (var a = 0, b = 0; b < Game.selectedCards.length; ++b)
                a += Game.selectedCards[b].sumValue;
            return a
        }
        return Game.selectedCards.length
    },
    sendResponseSelectSingleCardFinal: function(a) {
        a = Game.selectableCards.indexOf(a);
        Game.sendResponse(a);
        Game.endSelection()
    },
    selectSingleCardFinal: function(a) {
        if (Game.isSelectingChain) {
            var b = []
              , c = -1;
            do
                c = Game.chainableCards.indexOf(a, c + 1),
                -1 !== c && b.push({
                    index: c,
                    effect: Game.selectableEffects[c]
                });
            while (-1 !== c);1 === b.length ? Game.sendResponseSelectSingleCardFinal(a) : 1 < b.length && (Game.isSelectingActivationOption = !0,
            Game.openOptionsWindow(b, !0, !0))
        } else
            Game.sendResponseSelectSingleCardFinal(a)
    },
    sendSelectionIndexesFinal: function() {
        var a = [];
        if (Game.selectionIsSorting) {
            for (var b = 0; b < Game.selectableCards.length; ++b) {
                var c = Game.selectedCards.indexOf(Game.selectableCards[b]);
                a.push(0 > c ? 0 : c)
            }
            Game.sendMessage({
                type: "GameSendOrder",
                indexes: a
            })
        } else {
            for (b = 0; b < Game.selectedCards.length; ++b)
                c = Game.selectableCards.indexOf(Game.selectedCards[b]),
                a.push(0 > c ? 0 : c);
            Game.sendMessage({
                type: "GameSendSelection",
                indexes: a
            })
        }
        Game.endSelection()
    },
    sendSelectionSingleCard: function(a) {
        var b = [];
        a = Game.selectableCards.indexOf(a);
        b.push(0 > a ? 0 : a);
        Game.sendMessage({
            type: "GameSendSelection",
            indexes: b
        });
        Game.endSelection()
    },
    sendSumSelectedCards: function() {
        return Game.canSendSumSelectedCards() ? (Game.sendSelectionIndexesFinal(),
        !0) : !1
    },
    canSendSumSelectedCards: function() {
        var a = Game.selectedCards.length
          , b = Game.selectionMin
          , c = Game.selectionMax
          , d = Game.mustSelectCards.length
          , e = [];
        if (0 < Game.selectionMax) {
            if (a < b + d || a > c + d)
                return !1;
            b = [];
            for (c = 0; c < d; ++c)
                b[c] = Game.mustSelectCards[c].sumValue;
            for (c = d; c < a; ++c) {
                var f = Game.selectableCards.indexOf(Game.selectedCards[c]);
                if (0 > f || e[f])
                    return !1;
                e[f] = !0;
                b[c] = Game.selectableCards[f].sumValue
            }
            return Game.selectSumCheck(b, a, 0, Game.selectionSum) ? !0 : !1
        }
        c = b = 0;
        f = 2147483647;
        for (var g = 0; g < d; ++g) {
            var h = Game.mustSelectCards[g].sumValue
              , k = h & 65535;
            h >>= 16;
            var l = 0 < h && h < k ? h : k;
            b += l;
            c += h > k ? h : k;
            l < f && (f = l)
        }
        for (; d < a; ++d) {
            g = Game.selectableCards.indexOf(Game.selectedCards[d]);
            if (0 > g || e[g])
                return !1;
            e[g] = !0;
            k = Game.selectableCards[g].sumValue;
            g = k & 65535;
            k >>= 16;
            h = 0 < k && k < g ? k : g;
            b += h;
            c += k > g ? k : g;
            h < f && (f = h)
        }
        return c < Game.selectionSum || b - f >= Game.selectionSum ? !1 : !0
    },
    selectSumCheck: function(a, b, c, d) {
        if (0 == d || c == b)
            return !1;
        var e = a[c] & 65535
          , f = a[c] >> 16;
        return c == b - 1 ? d == e || d == f : d > e && Game.selectSumCheck(a, b, c + 1, d - e) || 0 < f && d > f && Game.selectSumCheck(a, b, c + 1, d - f)
    },
    updateSizes: function() {
        var a = $("#card-column").position().top;
        $("#card-column").css("max-height", $(window).height() - a - 24);
        $("#game-siding-column").css("max-height", $(window).height() - a - 24);
        a = 4 <= Game.masterRule ? 7 : 6;
        var b = $(window).width() - $("#card-column").width() - 50
          , c = $(window).height() - $("#game-chat-area").height() - 8 - 48;
        9 * c / a < b ? ($("#game-field").css("height", c + "px"),
        b = c / a,
        $("#game-field").css("width", 9 * b + "px")) : ($("#game-field").css("width", b + "px"),
        b /= 9,
        $("#game-field").css("height", b * a + "px"));
        $(".game-field-zone").css("width", b + "px").css("height", b + "px");
        $(".game-field-hand").css("width", 5 * b + "px").css("height", b + "px");
        Game.zoneWidth = b;
        Game.cardHeight = Math.floor(.95 * b);
        Game.cardWidth = Game.cardHeight * Engine.CARD_WIDTH / Engine.CARD_HEIGHT;
        Game.fields[0].resizeHand();
        Game.fields[1].resizeHand();
        $("#game-position-atk-up").css("width", Game.cardWidth);
        $("#game-position-atk-up").css("height", Game.cardHeight);
        $("#game-position-atk-up").css("margin-right", Game.cardHeight - Game.cardWidth + 3);
        $("#game-position-atk-down").css("width", Game.cardWidth);
        $("#game-position-atk-down").css("height", Game.cardHeight);
        $("#game-position-atk-down").css("margin-right", Game.cardHeight - Game.cardWidth + 3);
        $("#game-position-def-up").css("width", Game.cardWidth);
        $("#game-position-def-up").css("height", Game.cardHeight);
        $("#game-position-def-up").css("margin-right", Game.cardHeight - Game.cardWidth + 3);
        $("#game-position-def-down").css("width", Game.cardWidth);
        $("#game-position-def-down").css("height", Game.cardHeight);
        $(".game-selection-card-image").css("width", Game.cardWidth);
        Game.isSiding && Game.sidingResize()
    },
    sidingResize: function() {
        var a = $("#siding-main-deck").width() / 10 * (Engine.CARD_HEIGHT / Engine.CARD_WIDTH);
        $("#siding-main-deck").css("height", 4 * a + "px");
        $("#siding-extra-deck").css("height", a + "px");
        $("#siding-side-deck").css("height", a + 3 + "px")
    },
    updatePlayerNames: function() {
        if (Game.isTag)
            if (2 > Game.position || 4 <= Game.position) {
                var a = Game.tagPlayer[0];
                var b = Game.tagPlayer[1] + 2
            } else
                a = Game.tagPlayer[0] + 2,
                b = Game.tagPlayer[1];
        else
            a = 2 > Game.position ? Game.position : 0,
            b = 1 - a;
        if (Game.isSpectator) {
            var c = a;
            a = b;
            b = c
        }
        $("#game-player-name").text(Game.players[a].name);
        $("#game-opponent-name").text(Game.players[b].name);
        null !== Game.players[a].customAvatarPath ? $("#game-avatar-player-image").attr("src", "uploads/avatars/" + Game.players[a].customAvatarPath) : $("#game-avatar-player-image").attr("src", Engine.getAssetPath("images/avatars/" + Game.players[a].avatar + ".jpg"));
        null !== Game.players[b].customAvatarPath ? $("#game-avatar-opponent-image").attr("src", "uploads/avatars/" + Game.players[b].customAvatarPath) : $("#game-avatar-opponent-image").attr("src", Engine.getAssetPath("images/avatars/" + Game.players[b].avatar + ".jpg"))
    },
    getSleevePath: function(a) {
        return !Game.isTag && (a = Game.isSpectator ? a : 0 == a ? Game.position : 1 - Game.position,
        Game.players[a].customSleevePath) ? "uploads/sleeves/" + Game.players[a].customSleevePath : Engine.getCardPicturePath(0)
    },
    updateOption: function(a) {
        "sounds" === a ? Engine.audio.volume = Options.getValue("sounds") / 100 : "music" === a ? Game.audio && (a = Options.getValue("music") / 100,
        Game.isInitialized ? ($(Game.audio).stop(),
        $(Game.audio).animate({
            volume: a
        }, 300)) : (Game.audio.volume = .01,
        $(Game.audio).animate({
            volume: a
        }, 5E3)),
        0 < a ? Game.audio.paused && Game.audio.play() : Game.audio.paused || Game.audio.pause()) : "speed" === a && (Game.animationSpeedMultiplier = 1 / (Options.getValue("speed") / 100))
    },
    initRoom: function() {
        Engine.audio.loadRoom();
        Options.init();
        Game.updateOption("sounds");
        Game.updateOption("speed");
        Options.onOptionChanged = Game.updateOption;
        void 0 === Engine.storage.game && (Engine.storage.game = {});
        $("#game-start-button").hide();
        $("#game-ready-button").hide();
        $("#game-not-ready-button").click(function() {
            -1 === Game.selectedDeck ? Game.displayAlertWindow("Ready check", "Please select a deck first, using the drop-down list on the left.") : (Game.sendMessage({
                type: "SelectDeck",
                deckId: Game.selectedDeck
            }),
            Game.sendMessage({
                type: "RoomReadyChange",
                isReady: !0
            }))
        });
        $("#game-ready-button").click(function() {
            Game.sendMessage({
                type: "RoomReadyChange",
                isReady: !1
            })
        });
        $("#game-start-button").click(function() {
            Game.sendMessage({
                type: "StartDuel"
            })
        });
        $("#game-room-player1-kick-button").click(function() {
            Game.roomKickPlayer(0)
        });
        $("#game-room-player2-kick-button").click(function() {
            Game.roomKickPlayer(1)
        });
        $("#game-room-player3-kick-button").click(function() {
            Game.roomKickPlayer(2)
        });
        $("#game-room-player4-kick-button").click(function() {
            Game.roomKickPlayer(3)
        });
        $("#game-to-duelist-button").click(function() {
            Game.sendMessage({
                type: "RoomMoveToDuelist"
            })
        });
        $("#game-to-spectator-button").click(function() {
            Game.sendMessage({
                type: "RoomMoveToObserver"
            })
        });
        setInterval(function() {
            Game.sendMessage({
                type: "KeepAlive"
            })
        }, 21500);
        $("#game-alert-button").click(Game.hideAlertWindow);
        $("#game-alert-darkener").click(Game.hideAlertWindow);
        Game.deckTemplate = $("#game-deck-template").remove().removeAttr("id");
        Game.roomInitDecks();
        Game.createSocket()
    },
    roomInitDecks: function() {
        $("#game-deck-dropdown").click(function() {
            $("#game-deck-selection").toggle()
        });
        if (Engine.storage.game.lastDeck)
            for (var a = 0; a < window.Decks.length; ++a)
                window.Decks[a].id === Engine.storage.game.lastDeck && (Game.selectedDeck = window.Decks[a].id,
                $("#game-selected-deck-name").text("Deck: " + window.Decks[a].name));
        var b = $("#game-deck-selection");
        for (a = 0; a < window.Decks.length; ++a) {
            var c = Game.deckTemplate.clone();
            c.find(".template-button").text(window.Decks[a].name).click(window.Decks[a], function(a) {
                a.preventDefault();
                Game.selectedDeck = a.data.id;
                $("#game-selected-deck-name").text("Deck: " + a.data.name);
                $("#game-deck-selection").hide();
                Engine.storage.game.lastDeck = Game.selectedDeck;
                Engine.storage.save()
            });
            b.append(c)
        }
    },
    roomKickPlayer: function(a) {
        Game.sendMessage({
            type: "RoomKickPlayer",
            position: a
        })
    },
    createSocket: function() {
        $("#game-loading-text").text("Connecting to the server...");
        Game.socket = new WebSocket("wss://" + window.Host + "/gameserver/");
        Game.socket.onopen = function() {
            Game.onSocketOpen()
        }
        ;
        Game.socket.onclose = function() {
            Game.onSocketClose()
        }
        ;
        Game.socket.onerror = function() {
            Game.onSocketError()
        }
        ;
        Game.socket.onmessage = function(a) {
            a = JSON.parse(a.data);
            Game.onSocketMessage(a)
        }
    },
    onSocketOpen: function() {
        $("#game-loading-text").text("Connected, authenticating...");
        Game.isConnected = !0;
        Game.sendMessage({
            type: "Authenticate",
            token: window.GameInfo.token
        })
    },
    onSocketClose: function() {
        Game.socket = null;
        Game.isConnected && (Game.isConnected = !1,
        Game.endSelection(),
        Game.displayEndWindow("Error!", "You have been disconnected from the server."),
        $("#game-chat-textbox").remove())
    },
    onSocketError: function() {
        $("#game-loading-text").text("Could not connect to the server. Please check your internet connection or try again later.")
    },
    onSocketMessage: function(a) {
        window.Debug && console.log(a);
        Game.immediateHandlers || (Game.immediateHandlers = {
            ChatMessageReceived: Game.onChatMessageReceived,
            TimeLimit: Game.onTimeLimit,
            KeepAlive: Game.onKeepAlive
        });
        var b = Game.immediateHandlers[a.type];
        b ? b(a) : (Game.messageQueue.push(a),
        Game.isTaskActive || Game.parseNextMessage())
    },
    onChatMessageReceived: function(a) {
        Game.playSound("chat-message");
        var b = a.playerId;
        a = a.message;
        0 <= b && 3 >= b ? Game.appendChatMessage("[" + Game.players[b].name + "]: " + a) : Game.appendChatMessage(a, "yellow")
    },
    appendChatMessage: function(a, b) {
        a = $("<p>").text(a);
        $("#game-chat-content").append(a);
        b && a.css("color", b);
        10 < $("#game-chat-content").children().length && $("#game-chat-content").find("p:first").remove();
        setTimeout(function(a) {
            a.remove()
        }, 1E4, a)
    },
    onTimeLimit: function(a) {
        Game.currentTimer = a.player;
        Game.playerTimers[a.player] = a.time;
        Game.updateTimerDisplay();
        -1 !== Game.timerIntervalId && clearInterval(Game.timerIntervalId);
        Game.timerIntervalId = setInterval(function() {
            -1 !== Game.currentTimer && (--Game.playerTimers[Game.currentTimer],
            Game.updateTimerDisplay())
        }, 1E3)
    },
    onKeepAlive: function(a) {},
    parseNextMessage: function() {
        Game.isTaskActive = !0;
        if (0 === Game.messageQueue.length)
            Game.isTaskActive = !1;
        else {
            Game.isSelecting && Game.endSelection();
            var a = Game.messageQueue.shift();
            Game.messageHandlers || (Game.messageHandlers = {
                Authenticated: Game.onAuthenticated,
                Disconnected: Game.onDisconnected,
                RoomJoined: Game.onRoomJoined,
                RoomTypeChanged: Game.onRoomTypeChanged,
                RoomPlayerJoined: Game.onRoomPlayerJoined,
                RoomPlayerLeft: Game.onRoomPlayerLeft,
                RoomPlayerReadyChanged: Game.onRoomPlayerReadyChanged,
                DuelStarted: Game.onDuelStarted,
                DuelEnded: Game.onDuelEnded,
                RequestRpsMove: Game.onRequestRpsMove,
                RpsMoveResult: Game.onRpsMoveResult,
                RequestStartingPlayer: Game.onRequestStartingPlayer,
                DeckError: Game.onDeckError,
                SidingRequested: Game.onSidingRequested,
                WaitingForSide: Game.onWaitingForSide,
                GameStart: Game.onGameStart,
                GameDraw: Game.onGameDraw,
                GameUpdateData: Game.onGameUpdateData,
                GameUpdateCard: Game.onGameUpdateCard,
                GameNewTurn: Game.onGameNewTurn,
                GameNewPhase: Game.onGameNewPhase,
                GameMove: Game.onGameMove,
                GamePosChange: Game.onGamePosChange,
                GameShuffleDeck: Game.onGameShuffleDeck,
                GameSet: Game.onGameSet,
                GameSummoning: Game.onGameSummoning,
                GameSpSummoning: Game.onGameSpSummoning,
                GameFlipSummoning: Game.onGameFlipSummoning,
                GameChaining: Game.onGameChaining,
                GameDamage: Game.onGameDamage,
                GameRecover: Game.onGameRecover,
                GamePayLpCost: Game.onGamePayLpCost,
                GameLpUpdate: Game.onGameLpUpdate,
                GameAttack: Game.onGameAttack,
                GameBattle: Game.onGameBattle,
                GameReloadField: Game.onReloadField,
                GameTagSwap: Game.onGameTagSwap,
                GameFieldDisabled: Game.onGameFieldDisabled,
                GameWaiting: Game.onWaiting,
                GameEquip: Game.onGameEquip,
                GameBecomeTarget: Game.onGameBecomeTarget,
                GameWin: Game.onGameWin,
                GameTossCoin: Game.onGameTossCoin,
                GameTossDice: Game.onGameTossDice,
                GameAddCounter: Game.onGameAddCounter,
                GameRemoveCounter: Game.onGameRemoveCounter,
                GameConfirmCards: Game.onGameConfirmCards,
                GameConfirmDeckTop: Game.onGameConfirmDeckTop,
                GameDeckTop: Game.onGameDeckTop,
                GameRetry: Game.onGameRetry,
                GameSelectIdleCommand: Game.onGameSelectIdleCommand,
                GameSelectBattleCommand: Game.onGameSelectBattleCommand,
                GameSelectCard: Game.onGameSelectCard,
                GameSelectUnselect: Game.onGameSelectUnselect,
                GameSortCards: Game.onGameSortCards,
                GameSelectTribute: Game.onGameSelectTribute,
                GameSelectYesNo: Game.onGameSelectYesNo,
                GameSelectEffectYesNo: Game.onGameSelectEffectYesNo,
                GameSelectChain: Game.onGameSelectChain,
                GameSelectPosition: Game.onGameSelectPosition,
                GameSelectOption: Game.onGameSelectOption,
                GameSelectSum: Game.onGameSelectSum,
                GameSelectPlace: Game.onGameSelectPlace,
                GameSelectCounter: Game.onGameSelectCounter,
                GameAnnounceAttrib: Game.onGameAnnounceAttrib,
                GameAnnounceRace: Game.onGameAnnounceRace,
                GameAnnounceNumber: Game.onGameAnnounceNumber,
                GameAnnounceCard: Game.onGameAnnounceCard
            });
            Game.isWaiting && "TimeLimit" !== a.type && (Game.isWaiting = !1,
            $("#game-waiting-window").hide());
            Game.lastFrames.push(a);
            10 < Game.lastFrames.length && Game.lastFrames.splice(0, 1);
            var b = Game.messageHandlers[a.type];
            b || window.Debug && console.warn(a);
            var c = 0;
            try {
                c = !b || !b(a)
            } catch (d) {
                a = JSON.stringify(Game.lastFrames),
                b = d.name + ": " + d.message + " at " + d.stack + " frames : " + a,
                b = btoa(b),
                Game.sendMessage({
                    type: "Error",
                    content: b
                }),
                $("html").css("background-color", "#153f84").css("background-image", "none"),
                $("body").empty().css("overflow", "auto"),
                $("<div>").css("color", "white").css("font-family", "monospace").css("margin", "5px").css("word-wrap", "break-word").html("Sorry, an error occurred. It was not your fault.<br>The error report below was automatically sent to the developers and this problem will hopefully get fixed soon.<br>Meanwhile, you should try to play using another browser or different cards to see if it helps.<br>You can now close this tab.<br><br>Error: " + d.name + "<br><br>Stack: " + d.stack + "<br><br>Frames: " + a).appendTo($("body"))
            }
            c && Game.parseNextMessage()
        }
    },
    onRoomJoined: function(a) {
        Game.isMatch = 1 == a.mode;
        Game.isTag = 2 == a.mode;
        Game.isRanked = a.isRanked;
        Game.players = Game.isTag ? [null, null, null, null] : [null, null];
        Game.isTag || $(".game-room-tag-element").remove();
        for (var b = 1; b <= Game.players.length; ++b)
            $("#game-room-player" + b + "-ready").hide();
        Game.updateKickButtons();
        $("#game-loading-container").remove();
        $("#game-room-container").css("display", "flex");
        $("#game-room-menu-container").show();
        $("#game-room-info-gameid").text(window.GameInfo.gameid);
        b = Engine.banlists.getIndexFromHash(a.banlist);
        var c = "???";
        -1 !== b && (c = Engine.banlists.banlists[b].name);
        $("#game-room-info-banlist").text(c);
        Game.setMasterRule(a.masterRule);
        b = a.format;
        2 !== b ? ($("#game-room-info-has-custom-format").show(),
        $("#game-room-info-format").text(Game.formatToString(b))) : $("#game-room-info-has-custom-format").hide();
        $("#game-room-info-mode").text((Game.isRanked ? "Ranked " : "") + Game.modeToString(a.mode));
        $("#game-room-info-startlp").text(a.startingLife);
        $("#game-room-info-timelimit").text(a.timeLimit + " seconds");
        a.noCheckDeck ? $("#game-room-info-deck-not-checked").show() : $("#game-room-info-deck-not-checked").hide();
        a.noShuffleDeck ? $("#game-room-info-deck-not-shuffled").show() : $("#game-room-info-deck-not-shuffled").hide();
        b = a.startingHand;
        5 !== b ? ($("#game-room-info-has-custom-starting-hand").show(),
        $("#game-room-info-starting-hand").text(b)) : $("#game-room-info-has-custom-starting-hand").hide();
        a = a.drawQuantity;
        1 !== a ? ($("#game-room-info-has-custom-cards-per-draw").show(),
        $("#game-room-info-cards-per-draw").text(a)) : $("#game-room-info-has-custom-cards-per-draw").hide();
        $("#game-chat-area").show();
        $("#game-chat-textbox").keyup(function(a) {
            13 == a.keyCode && (a = $("#game-chat-textbox").val(),
            $("#game-chat-textbox").val(""),
            Game.sendMessage({
                type: "SendChatMessage",
                message: a
            }),
            a = "[" + Game.username + "]: " + a,
            4 > Game.position ? Game.appendChatMessage(a) : Game.appendChatMessage(a, "yellow"))
        });
        Game.isRanked && $("#game-room-left-buttons").hide()
    },
    formatToString: function(a) {
        switch (a) {
        case 0:
            return "OCG cards only";
        case 1:
            return "TCG cards only"
        }
        return a
    },
    modeToString: function(a) {
        switch (a) {
        case 0:
            return "Single";
        case 1:
            return "Match";
        case 2:
            return "Tag"
        }
        return a
    },
    setMasterRule: function(a) {
        Game.masterRule = a;
        $("#game-room-info-rule").text(Game.ruleToString(Game.masterRule));
        3 === Game.masterRule ? ($(".if-rule4").remove(),
        $(".game-field-zone-if-rule3").addClass("game-field-zone")) : 4 <= Game.masterRule && ($(".if-rule3").remove(),
        $(".game-field-zone-if-rule3").removeAttr("id"))
    },
    ruleToString: function(a) {
        switch (a) {
        case 1:
            return "Master Rules 1 (2008)";
        case 2:
            return "Master Rules 2 (2011)";
        case 3:
            return "Master Rules 3 (2014)";
        case 4:
            return "Master Rules 4 (2017)";
        case 5:
            return "Master Rules 5 (2020)"
        }
        return a
    },
    onAuthenticated: function(a) {
        Game.username = a.username;
        $("#game-loading-text").text("Authenticated, joining room...");
        Game.sendMessage({
            type: "RoomJoin",
            name: window.GameInfo.gameid
        })
    },
    onDisconnected: function() {
        $("#game-chat-textbox").remove();
        null !== Game.socket && Game.socket.close()
    },
    onRoomTypeChanged: function(a) {
        Game.isHost = a.isHost;
        Game.position = a.position;
        Game.isSpectator = 7 == a.position;
        Game.isHost && !Game.isRanked ? $("#game-start-button").show() : $("#game-start-button").hide();
        Game.updateKickButtons();
        Game.isSpectator ? ($("#game-to-spectator-button").hide(),
        $("#game-to-duelist-button").show(),
        $("#game-ready-button").hide(),
        $("#game-not-ready-button").hide()) : ($("#game-to-spectator-button").show(),
        $("#game-to-duelist-button").hide(),
        $("#game-ready-button").hide(),
        $("#game-not-ready-button").show());
        Game.isRanked && !Game.isSpectator && Game.appendChatMessage("This is a ranked match. Your rating will be updated.", "yellow")
    },
    updateKickButtons: function() {
        for (var a = 0; a < Game.players.length; ++a) {
            var b = $("#game-room-player" + (a + 1) + "-kick-button");
            !Game.isRanked && Game.isHost && Game.position !== a && null !== Game.players[a] ? b.show() : b.hide()
        }
    },
    onRoomPlayerJoined: function(a) {
        Game.players[a.position] = {
            name: a.name,
            avatar: Number(a.avatar),
            customAvatarPath: a.customAvatarPath,
            customSleevePath: a.customSleevePath,
            ready: !1
        };
        $("#game-room-player" + (a.position + 1) + "-username").text(a.name);
        Game.updateKickButtons()
    },
    onRoomPlayerLeft: function(a) {
        Game.players[a.position] = null;
        a = a.position + 1;
        $("#game-room-player" + a + "-username").text("---");
        $("#game-room-player" + a + "-ready").hide();
        $("#game-room-player" + a + "-not-ready").show();
        Game.updateKickButtons()
    },
    onRoomPlayerReadyChanged: function(a) {
        Game.players[a.position].ready = a.isReady;
        var b = a.position + 1;
        a.isReady ? ($("#game-room-player" + b + "-ready").show(),
        $("#game-room-player" + b + "-not-ready").hide()) : ($("#game-room-player" + b + "-ready").hide(),
        $("#game-room-player" + b + "-not-ready").show());
        a.position == Game.position && (a.isReady ? ($("#game-ready-button").show(),
        $("#game-not-ready-button").hide(),
        $("#game-deck-dropdown").addClass("engine-button-disabled"),
        $("#game-to-spectator-button").addClass("engine-button-disabled"),
        $("#game-deck-selection").hide()) : ($("#game-ready-button").hide(),
        $("#game-not-ready-button").show(),
        $("#game-deck-dropdown").removeClass("engine-button-disabled"),
        $("#game-to-spectator-button").removeClass("engine-button-disabled")));
        Game.isEveryoneReady() ? $("#game-start-button").removeClass("engine-button-disabled") : $("#game-start-button").addClass("engine-button-disabled")
    },
    isEveryoneReady: function() {
        for (var a = 0; a < Game.players.length; ++a)
            if (!Game.players[a] || !Game.players[a].ready)
                return !1;
        return !0
    },
    onDuelStarted: function() {
        Game.isSiding && ($("#game-siding-column").hide(),
        $("#game-siding-column-2").hide(),
        $("#game-container").hide(),
        $("#game-column").show(),
        Game.sidingClear());
        $("#game-room-container").remove();
        $("#game-room-menu-container").remove()
    },
    onDuelEnded: function() {
        $("#game-end-button").text("End the duel").off("click").one("click", Game.showDuelResult).show()
    },
    showDuelResult: function() {
        null !== Game.socket && Game.socket.close();
        $("#game-chat-textbox").remove();
        $("#game-container").remove();
        $("#game-end-window").remove();
        $("#game-result-container").show()
    },
    onRequestRpsMove: function() {
        Game.rpsInitialized ? ($("#game-rps-rock").show(),
        $("#game-rps-paper").show(),
        $("#game-rps-scissors").show()) : (Game.rpsInitialized = !0,
        $("#game-rps-container").show(),
        $("#game-rps-first").hide(),
        $("#game-rps-second").hide(),
        $("#game-rps-rock").click(function() {
            Game.hideRpsButtons();
            Game.sendRpsMove(2)
        }),
        $("#game-rps-paper").click(function() {
            Game.hideRpsButtons();
            Game.sendRpsMove(3)
        }),
        $("#game-rps-scissors").click(function() {
            Game.hideRpsButtons();
            Game.sendRpsMove(1)
        }))
    },
    onRpsMoveResult: function(a) {
        Game.rpsInitialized || (Game.rpsInitialized = !0,
        $("#game-rps-container").show(),
        $("#game-rps-first").hide(),
        $("#game-rps-second").hide());
        Game.hideRpsButtons();
        var b = Engine.getAssetPath("images/scissors.png");
        2 === a.move ? b = Engine.getAssetPath("images/rock.png") : 3 === a.move && (b = Engine.getAssetPath("images/paper.png"));
        var c = Engine.getAssetPath("images/scissors.png");
        2 === a.opponentMove ? c = Engine.getAssetPath("images/rock.png") : 3 === a.opponentMove && (c = Engine.getAssetPath("images/paper.png"));
        $("#game-rps-move-player").attr("src", b);
        $("#game-rps-move-opponent").attr("src", c);
        $("#game-rps-result").fadeIn();
        setTimeout(function() {
            $("#game-rps-result").hide();
            Game.parseNextMessage()
        }, 1500);
        return !0
    },
    onRequestStartingPlayer: function() {
        $("#game-rps-container").show();
        $("#game-rps-rock").hide();
        $("#game-rps-paper").hide();
        $("#game-rps-scissors").hide();
        $("#game-rps-first").show();
        $("#game-rps-second").show();
        $("#game-rps-first").click(function() {
            Game.sendStartingPlayer(!0)
        });
        $("#game-rps-second").click(function() {
            Game.sendStartingPlayer(!1)
        })
    },
    hideRpsButtons: function() {
        $("#game-rps-rock").hide();
        $("#game-rps-paper").hide();
        $("#game-rps-scissors").hide()
    },
    sendRpsMove: function(a) {
        Game.sendMessage({
            type: "SendRpsMove",
            move: a
        })
    },
    sendStartingPlayer: function(a) {
        Game.sendMessage({
            type: "SendStartingPlayer",
            isStarting: a
        })
    },
    onDeckError: function(a) {
        (a = Engine.getCardData(a.cardId)) ? Game.displayAlertWindow("Invalid deck", "This deck cannot be used because the card <i>" + a.name + "</i> is banned or limited.") : Game.displayAlertWindow("Invalid deck", "This deck is invalid and cannot be used. Please make sure it has the correct amount of cards and is not using an invalid card.")
    },
    onSidingRequested: function(a) {
        Game.isSiding = !0;
        Game.hasGameEnded = !1;
        Game.sidingDeck = {
            main: a.main,
            extra: a.extra,
            side: a.side
        };
        Game.sidingOriginalDeck = {
            main: a.main.slice(0),
            extra: a.extra.slice(0),
            side: a.side.slice(0)
        };
        Game.sidingImages = {
            main: [],
            extra: [],
            side: []
        };
        Game.sidingMargins = {
            main: 0,
            extra: 0,
            side: 0
        };
        Game.sidingSelection = null;
        $("#game-end-button").text("Play the next round").off("click").one("click", Game.startSiding).show();
        $("#game-siding-done").off("click").on("click", function() {
            Game.sendMessage({
                type: "UpdateDeck",
                main: Game.sidingDeck.main,
                extra: Game.sidingDeck.extra,
                side: Game.sidingDeck.side
            })
        })
    },
    startSiding: function() {
        $("#game-end-window").hide();
        $("#game-end-button").hide();
        $("#game-column").hide();
        $("#game-siding-column").show();
        $("#game-siding-column-2").show();
        Game.sidingCreateDeck("main");
        Game.sidingCreateDeck("extra");
        Game.sidingCreateDeck("side");
        Game.sidingResize();
        Game.isSidingInitialized || (Game.isSidingInitialized = !0,
        $(window).on("mouseup", function(a) {
            if (1 === a.which && Game.sidingSelection)
                return Game.sidingRestoreSelection(),
                !1
        }))
    },
    sidingCreateDeck: function(a) {
        for (var b = 0; b < Game.sidingDeck[a].length; ++b)
            Game.sidingAddCard(Game.sidingDeck[a][b], a, -1);
        b = $("#siding-" + a + "-deck");
        b.data("location", a);
        b.mouseup(function(a) {
            if (Game.sidingSelection && 1 == a.which) {
                a = Game.sidingSelection.data("id");
                var b = $(this).data("location");
                Game.sidingCanAddCard(a, b) ? (Game.sidingAddCard(a, b, -1),
                Game.sidingClearSelection(),
                Game.updateSidingDeck()) : Game.sidingRestoreSelection();
                return !1
            }
        })
    },
    updateSidingDeck: function() {
        for (var a = ["main", "extra", "side"], b = 0; b < a.length; ++b) {
            var c = a[b];
            Game.sidingDeck[c] = [];
            for (var d = 0; d < Game.sidingImages[c].length; ++d)
                Game.sidingDeck[c].push(Game.sidingImages[c][d].data("id"))
        }
        Game.updateSidingButton()
    },
    updateSidingButton: function() {
        Game.sidingIsValid() ? $("#game-siding-done").removeClass("engine-button-disabled") : $("#game-siding-done").addClass("engine-button-disabled")
    },
    sidingIsValid: function() {
        return Game.sidingOriginalDeck.main.length === Game.sidingDeck.main.length && Game.sidingOriginalDeck.extra.length === Game.sidingDeck.extra.length && Game.sidingOriginalDeck.side.length === Game.sidingDeck.side.length ? !0 : !1
    },
    sidingCanAddCard: function(a, b) {
        a = Engine.getCardData(a);
        if (a.type & CardType.TOKEN)
            return !1;
        var c = !1;
        if (a.type & CardType.FUSION || a.type & CardType.SYNCHRO || a.type & CardType.XYZ || a.type & CardType.LINK)
            c = !0;
        return c && "main" === b || !c && "extra" === b || Game.sidingImages[b].length >= ("main" === b ? 64 : 18) ? !1 : !0
    },
    sidingAddCard: function(a, b, c) {
        var d = Engine.getCardData(a)
          , e = Game.sidingImages[b]
          , f = $("#siding-" + b + "-deck")
          , g = $("<img>").css("margin-right", Game.sidingMargins[b]).addClass("editor-card-small");
        Engine.setCardImageElement(g, a);
        g.mouseover(function() {
            Engine.ui.setCardInfo($(this).data("id"))
        });
        g.mousedown(function(a) {
            if (1 == a.which) {
                a = $(this).data("id");
                var b = $(this).data("location")
                  , c = $(this).parent().children().index($(this));
                Game.sidingRemoveCard(b, c);
                Game.sidingSelectCard(a, b);
                Game.updateSidingDeck();
                return !1
            }
            if (3 == a.which)
                return !1
        });
        g.mouseup(function(a) {
            if (1 == a.which && Game.sidingSelection) {
                a = Game.sidingSelection.data("id");
                var b = $(this).data("location")
                  , c = $(this).parent().children().index($(this));
                Game.sidingCanAddCard(a, b) ? (Game.sidingAddCard(a, b, c),
                Game.sidingClearSelection(),
                Game.updateSidingDeck()) : Game.sidingRestoreSelection();
                return !1
            }
        });
        g.on("contextmenu", function() {
            if (null !== Game.sidingSelection)
                return !1;
            var a = $(this).data("id")
              , b = $(this).data("location")
              , c = Engine.getCardData(a)
              , d = !1;
            if (c.type & CardType.FUSION || c.type & CardType.SYNCHRO || c.type & CardType.XYZ || c.type & CardType.LINK)
                d = !0;
            c = "side" === b ? d ? "extra" : "main" : "side";
            Game.sidingCanAddCard(a, c) && (d = $(this).parent().children().index($(this)),
            Game.sidingRemoveCard(b, d),
            Game.sidingAddCard(a, c, -1),
            Game.updateSidingDeck());
            return !1
        });
        g.data("id", a);
        g.data("alias", d.alias);
        g.data("location", b);
        -1 === c ? (f.append(g),
        e.push(g)) : (0 === c && 0 == f.children().length ? f.append(g) : f.children().eq(c).before(g),
        e.splice(c, 0, g));
        Game.sidingUpdateMargins(b)
    },
    sidingSelectCard: function(a, b) {
        Game.sidingRestoreSelection();
        var c = Game.sidingCalculateCardSize();
        Game.sidingSelection = $("<img>").css("position", "absolute").css("left", 0).css("top", 0).css("width", c.width + "px").css("height", c.height + "px").data("id", a).data("oldLocation", b);
        Engine.setCardImageElement(Game.sidingSelection, a);
        Game.sidingSelection.appendTo($("body"));
        Game.sidingUpdateSelectionPosition()
    },
    sidingUpdateSelectionPosition: function() {
        Game.sidingSelection && Game.sidingSelection.css("left", Game.mouseX + 3).css("top", Game.mouseY + 3)
    },
    sidingCalculateCardSize: function() {
        var a = $("#siding-main-deck").width() / 10;
        return {
            width: a,
            height: Engine.CARD_HEIGHT / Engine.CARD_WIDTH * a
        }
    },
    sidingClearSelection: function() {
        Game.sidingSelection && (Game.sidingSelection.remove(),
        Game.sidingSelection = null)
    },
    sidingRestoreSelection: function() {
        if (Game.sidingSelection) {
            var a = Game.sidingSelection.data("id")
              , b = Game.sidingSelection.data("oldLocation");
            Game.sidingSelection.remove();
            Game.sidingSelection = null;
            Game.sidingAddCard(a, b, -1);
            Game.updateSidingDeck()
        }
    },
    sidingRemoveCard: function(a, b) {
        var c = Game.sidingImages[a];
        c[b].remove();
        c.splice(b, 1);
        Game.sidingUpdateMargins(a)
    },
    sidingUpdateMargins: function(a) {
        var b = "0";
        Game.sidingImages[a].length > ("main" == a ? 60 : 15) ? b = "main" == a ? "-4.05%" : "-4.72%" : Game.sidingImages[a].length > ("main" == a ? 40 : 10) && (b = "-3.6%");
        if (Game.sidingMargins[a] !== b) {
            Game.sidingMargins[a] = b;
            for (var c = 0; c < Game.sidingImages[a].length; ++c)
                Game.sidingImages[a][c].css("margin-right", b)
        }
    },
    sidingClear: function() {
        Game.isSiding = !1;
        for (var a = ["main", "extra", "side"], b = 0; b < a.length; ++b) {
            for (var c = a[b], d = 0; d < Game.sidingImages[c].length; ++d)
                Game.sidingImages[c][d].remove();
            Game.sidingImages[c] = []
        }
    },
    onGameStart: function(a) {
        Game.hasSurrendered = !1;
        $("#game-rps-container").hide();
        $("#game-container").show();
        $("#game-menu-container").show();
        Game.init();
        Game.isStarted = !0;
        Game.isTag && (Game.tagPlayer = [0, 0]);
        Game.updatePlayerNames();
        for (var b = 0; 2 > b; ++b) {
            for (var c = 0; c < a.deckSize[b]; ++c)
                Game.addCard((new Game.Card).setOwner(b), b, CardLocation.DECK, -1);
            for (c = 0; c < a.extraDeckSize[b]; ++c)
                Game.addCard((new Game.Card).setOwner(b), b, CardLocation.EXTRA, -1)
        }
        Game.lifePoints[0] = a.lifePoints[0];
        Game.lifePoints[1] = a.lifePoints[1];
        Game.updateLifeDisplay()
    },
    onGameDraw: function(a) {
        Game.preloadImages(a.cards, function() {
            Game.onGameDrawInternal(a)
        });
        return !0
    },
    onGameDrawInternal: function(a) {
        var b = function(c) {
            if (c == a.count)
                Game.parseNextMessage();
            else {
                Game.playSound("draw");
                var d = Game.getCard(a.player, CardLocation.DECK, -1);
                d.prepareMovement();
                Game.removeCard(d, !0);
                Game.addCard(d, a.player, CardLocation.HAND, -1, !0);
                d.applyMovement(a.cards[c], d.position, 200 * Game.animationSpeedMultiplier, function() {
                    b(c + 1)
                })
            }
        };
        b(0)
    },
    onGameUpdateData: function(a) {
        for (var b = 0; b < a.cards.length; ++b)
            null !== a.cards[b] && Game.getCard(a.controller, a.location, b).setData(a.cards[b])
    },
    onGameUpdateCard: function(a) {
        Game.getCard(a.controller, a.location, a.sequence).setData(a.card)
    },
    displayNextTurnText: function(a, b) {
        $("#game-next-turn-text").text(a);
        $("#game-next-turn").css("left", "0%");
        $("#game-next-turn").css("opacity", 0);
        $("#game-next-turn").show();
        $("#game-next-turn").animate({
            left: "50%",
            opacity: 1
        }, {
            duration: 150 * Game.animationSpeedMultiplier
        }).delay(300 * Game.animationSpeedMultiplier).animate({
            left: "100%",
            opacity: 0
        }, {
            duration: 150 * Game.animationSpeedMultiplier,
            complete: function() {
                $("#game-next-turn").hide();
                b()
            }
        })
    },
    onGameNewTurn: function(a) {
        Game.playSound("next-turn");
        Game.displayNextTurnText(0 == a.player ? "Your turn" : "Opponent turn", Game.parseNextMessage);
        return !0
    },
    onGameNewPhase: function(a) {
        if (Game.phase !== a.phase)
            return -1 !== Game.phase && Game.phaseButtons[Game.phase] && Game.phaseButtons[Game.phase].removeClass("engine-button-success").addClass("engine-button-default"),
            Game.phase = a.phase,
            Game.phaseButtons[Game.phase] && Game.phaseButtons[Game.phase].addClass("engine-button-default").addClass("engine-button-success"),
            Game.playSound("next-phase"),
            (a = I18n.phases[Game.phase]) && Game.displayNextTurnText(a, Game.parseNextMessage),
            !0
    },
    onGameMove: function(a) {
        Game.preloadImage(a.cardCode, function() {
            Game.onGameMoveInternal(a)
        });
        return !0
    },
    onGameMoveInternal: function(a) {
        if (0 === a.previousLocation) {
            var b = new Game.Card(a.cardCode,a.currentPosition);
            Game.addCard(b, a.currentController, a.currentLocation, a.currentSequence);
            b.fadeIn(300 * Game.animationSpeedMultiplier, Game.parseNextMessage)
        } else
            0 === a.currentLocation ? (b = Game.getCard(a.previousController, a.previousLocation, a.previousSequence, a.previousPosition),
            b.fadeOut(300 * Game.animationSpeedMultiplier, function() {
                Game.removeCard(b);
                Game.parseNextMessage()
            })) : (b = Game.getCard(a.previousController, a.previousLocation, a.previousSequence, a.previousPosition),
            a.previousLocation & CardLocation.ON_FIELD && a.previousLocation != a.currentLocation && (b.counters = {}),
            b.prepareMovement(),
            Game.removeCard(b, !0),
            Game.addCard(b, a.currentController, a.currentLocation, a.currentSequence, !0),
            b.applyMovement(a.cardCode, a.currentPosition, 300 * Game.animationSpeedMultiplier, Game.parseNextMessage))
    },
    onGamePosChange: function(a) {
        Game.preloadImage(a.cardCode, function() {
            Game.onGamePosChangeInternal(a)
        });
        return !0
    },
    onGamePosChangeInternal: function(a) {
        var b = Game.getCard(a.controller, a.location, a.sequence);
        b.prepareMovement();
        b.applyMovement(a.cardCode, a.currentPosition, 250 * Game.animationSpeedMultiplier, Game.parseNextMessage)
    },
    onGameShuffleDeck: function(a) {
        Game.fields[a.player].shuffleDeck();
        Game.playSound("shuffle")
    },
    onGameSet: function(a) {
        Game.playSound("set")
    },
    onGameSummoning: function(a) {
        Game.preloadImage(a.cardCode, function() {
            Game.playSound("summon");
            Game.highlightCard(a.cardCode, Game.parseNextMessage)
        });
        return !0
    },
    onGameSpSummoning: function(a) {
        Game.preloadImage(a.cardCode, function() {
            Game.playSound("summon-special");
            Game.highlightCard(a.cardCode, Game.parseNextMessage)
        });
        return !0
    },
    onGameFlipSummoning: function(a) {
        Game.preloadImage(a.cardCode, function() {
            Game.playSound("summon-flip");
            Game.highlightCard(a.cardCode, Game.parseNextMessage)
        });
        return !0
    },
    onGameChaining: function(a) {
        Game.preloadImage(a.cardCode, function() {
            Game.playSound("activate");
            Game.highlightCard(a.cardCode, Game.parseNextMessage)
        });
        return !0
    },
    highlightCard: function(a, b) {
        Engine.setCardImageElement($("#game-highlight-card-img"), a);
        $("#game-highlight-card").show().css("opacity", 0).animate({
            opacity: 1
        }, {
            duration: 150 * Game.animationSpeedMultiplier
        }).delay(250 * Game.animationSpeedMultiplier).animate({
            opacity: 0
        }, {
            duration: 150 * Game.animationSpeedMultiplier,
            complete: function() {
                $("#game-highlight-card").hide();
                $("#game-highlight-card-img").attr("src", Engine.getCardPicturePath(0));
                b()
            }
        })
    },
    updateLifeDisplay: function() {
        0 > Game.lifePoints[0] && (Game.lifePoints[0] = 0);
        0 > Game.lifePoints[1] && (Game.lifePoints[1] = 0);
        $("#game-life-player").text(Game.lifePoints[0]);
        $("#game-life-opponent").text(Game.lifePoints[1]);
        var a = 100 * Game.lifePoints[0] / 8E3;
        100 < a && (a = 100);
        $("#game-life-bar-player").css("width", a + "%");
        a = 100 * Game.lifePoints[1] / 8E3;
        100 < a && (a = 100);
        $("#game-life-bar-opponent").css("width", a + "%")
    },
    updateTimerDisplay: function() {
        0 == Game.currentTimer ? ($("#game-timer-bar-player").show(),
        $("#game-timer-player").show(),
        $("#game-timer-bar-opponent").hide(),
        $("#game-timer-opponent").hide()) : 1 == Game.currentTimer && ($("#game-timer-bar-player").hide(),
        $("#game-timer-player").hide(),
        $("#game-timer-bar-opponent").show(),
        $("#game-timer-opponent").show());
        0 > Game.playerTimers[0] && (Game.playerTimers[0] = 0);
        0 > Game.playerTimers[1] && (Game.playerTimers[1] = 0);
        $("#game-timer-player").text(Game.playerTimers[0]);
        $("#game-timer-opponent").text(Game.playerTimers[1]);
        var a = 100 * Game.playerTimers[0] / 240;
        100 < a && (a = 100);
        $("#game-timer-bar-player-part").css("width", a + "%");
        a = 100 * Game.playerTimers[1] / 240;
        100 < a && (a = 100);
        $("#game-timer-bar-opponent-part").css("width", a + "%")
    },
    displayLifeChange: function(a, b, c) {
        0 != b && ($("#game-life-change-text").text(b),
        0 < b ? $("#game-life-change-text").removeClass("game-life-change-bad").addClass("game-life-change-good") : $("#game-life-change-text").removeClass("game-life-change-good").addClass("game-life-change-bad"),
        $("#game-life-change").css("top", 0 == a ? "70%" : "30%"),
        $("#game-life-change").css("opacity", 0),
        $("#game-life-change").show(),
        $("#game-life-change").animate({
            opacity: 1
        }, {
            duration: 150 * Game.animationSpeedMultiplier
        }).delay(700 * Game.animationSpeedMultiplier).animate({
            opacity: 0
        }, {
            duration: 150 * Game.animationSpeedMultiplier,
            complete: function() {
                $("#game-life-change").hide();
                c()
            }
        }))
    },
    onGameDamage: function(a) {
        Game.lifePoints[a.player] -= a.amount;
        Game.updateLifeDisplay();
        Game.playSound("life-damage");
        Game.displayLifeChange(a.player, -a.amount, Game.parseNextMessage);
        return !0
    },
    onGameRecover: function(a) {
        Game.lifePoints[a.player] += a.amount;
        Game.updateLifeDisplay();
        Game.playSound("life-recover");
        Game.displayLifeChange(a.player, a.amount, Game.parseNextMessage);
        return !0
    },
    onGamePayLpCost: function(a) {
        return Game.onGameDamage(a)
    },
    onGameLpUpdate: function(a) {
        Game.lifePoints[a.player] = a.amount;
        Game.updateLifeDisplay()
    },
    onGameAttack: function(a) {
        Game.playSound("attack");
        var b = $("<img>").attr("src", Engine.getAssetPath("images/attack.png")).addClass("game-attack-animation");
        var c = 0 !== a.attackerLocation ? Game.fields[a.attackerController].getZone(a.attackerLocation, a.attackerSequence) : Game.fields[a.attackerController].getZone(CardLocation.SPELL_ZONE, 2);
        (0 !== a.defenderLocation ? Game.fields[a.defenderController].getZone(a.defenderLocation, a.defenderSequence) : Game.fields[1 - a.attackerController].getZone(CardLocation.SPELL_ZONE, 2)).append(b);
        a = b.offset();
        b.detach();
        c.append(b);
        c = b.offset();
        var d = a.left - c.left
          , e = a.top - c.top
          , f = 180 / Math.PI * Math.atan2(e, d) + 90;
        $("<div />").animate({
            height: 1
        }, {
            duration: 500 * Game.animationSpeedMultiplier,
            step: function(a, c) {
                a = c.pos;
                a = "translate(" + d * a + "px, " + e * a + "px)";
                a += " rotate(" + f + "deg)";
                b.css("transform", a)
            },
            complete: function() {
                b.remove();
                Game.parseNextMessage()
            }
        });
        return !0
    },
    onGameBattle: function(a) {},
    onReloadField: function(a) {
        for (var b = 0; 2 > b; ++b) {
            var c = a.players[b];
            Game.lifePoints[b] = c.lifePoints;
            for (var d = 0; d < c.monsters.length; ++d)
                if (null !== c.monsters[d]) {
                    var e = new Game.Card;
                    e.setPosition(c.monsters[d].position);
                    Game.addCard(e, b, CardLocation.MONSTER_ZONE, d)
                }
            for (d = 0; d < c.spells.length; ++d)
                -1 !== c.spells[d] && (e = new Game.Card,
                e.setPosition(c.spells[d]),
                Game.addCard(e, b, CardLocation.SPELL_ZONE, d));
            for (d = 0; d < c.deckSize; ++d)
                Game.addCard(new Game.Card, b, CardLocation.DECK, -1);
            for (d = 0; d < c.handSize; ++d)
                Game.addCard(new Game.Card, b, CardLocation.HAND, -1);
            for (d = 0; d < c.graveyardSize; ++d)
                Game.addCard(new Game.Card, b, CardLocation.GRAVEYARD, -1);
            for (d = 0; d < c.banishedSize; ++d)
                Game.addCard(new Game.Card, b, CardLocation.BANISHED, -1);
            for (d = 0; d < c.extraSize; ++d)
                Game.addCard(new Game.Card, b, CardLocation.EXTRA, -1)
        }
        Game.updateLifeDisplay()
    },
    onGameFieldDisabled: function(a) {
        Game.refreshDisabledZones(a.fields)
    },
    refreshDisabledZones: function(a) {
        $(".game-field-zone-disabled").removeClass("game-field-zone-disabled");
        if (null !== a)
            for (var b = 0; 2 > b; ++b) {
                for (var c = a[b], d = 0; 5 > d; ++d)
                    c & 1 << d && $(Game.fields[b].namespace + "monster" + (d + 1)).addClass("game-field-zone-disabled");
                for (d = 0; 8 > d; ++d)
                    c & 256 << d && $(Game.fields[b].namespace + "spell" + (d + 1)).addClass("game-field-zone-disabled")
            }
    },
    onGameTagSwap: function(a) {
        Game.preloadImages(a.extraCodes.concat(a.handCodes), function() {
            Game.onInternalGameTagSwap(a)
        });
        return !0
    },
    onInternalGameTagSwap: function(a) {
        var b = a.player;
        Game.tagPlayer[b] = 1 - Game.tagPlayer[b];
        Game.updatePlayerNames();
        Game.fields[b].removeAllCardsAtLocation(CardLocation.DECK, !0);
        Game.fields[b].removeAllCardsAtLocation(CardLocation.EXTRA, !0);
        Game.fields[b].removeAllCardsAtLocation(CardLocation.HAND, !0);
        setTimeout(function() {
            for (var c = 0; c < a.deckSize; ++c)
                Game.addCard(new Game.Card, b, CardLocation.DECK, -1);
            for (c = 0; c < a.extraSize; ++c)
                Game.addCard(new Game.Card(a.extraCodes[c]), b, CardLocation.EXTRA, -1);
            for (c = 0; c < a.handSize; ++c)
                Game.addCard(new Game.Card(a.handCodes[c]), b, CardLocation.HAND, -1);
            Game.parseNextMessage()
        }, 320 * Game.animationSpeedMultiplier)
    },
    onWaiting: function(a) {
        Game.isWaiting = !0;
        Game.isSpectator ? $("#game-waiting-text").text("Waiting for a player...") : Game.isTag ? $("#game-waiting-text").text("Waiting for another player...") : $("#game-waiting-text").text("Waiting for the opponent...");
        $("#game-waiting-window").show()
    },
    onWaitingForSide: function(a) {
        Game.hasGameEnded = !1;
        $("#game-end-window").hide();
        $("#game-end-button").hide();
        Game.isWaiting = !0;
        $("#game-waiting-text").text("Waiting for the players to side...");
        $("#game-waiting-window").show()
    },
    onGameEquip: function(a) {
        Game.playSound("equip")
    },
    onGameBecomeTarget: function(a) {
        var b = function(c) {
            if (c == a.cards.length)
                Game.parseNextMessage();
            else {
                var d = a.cards[c];
                !d.location & CardLocation.ON_FIELD ? b(c + 1) : Game.getCard(d.controller, d.location, d.sequence).animateSelection(function() {
                    b(c + 1)
                })
            }
        };
        b(0);
        return !0
    },
    onGameWin: function(a) {
        var b = "No winner.";
        0 === a.player ? b = "You win!" : 1 === a.player && (b = "You lose!");
        Game.hasGameEnded = !1;
        Game.displayEndWindow(b, "Reason: " + I18n.victory[a.reason])
    },
    onGameRetry: function(a) {
        Game.endSelection();
        Game.displayAlertWindow("An error occurred", "An invalid action occurred on the server.")
    },
    displayEndWindow: function(a, b) {
        Game.endSelection();
        Game.hasGameEnded || (Game.hasGameEnded = !0,
        $("#game-end-title").text(a),
        $("#game-end-text").text(b),
        $("#game-end-button").hide(),
        $("#game-end-window").show())
    },
    displayAlertWindow: function(a, b) {
        Game.isAlertWindowVisible || (Game.isAlertWindowVisible = !0,
        $("#game-alert-title").text(a),
        $("#game-alert-text").html(b),
        $("#game-alert-window").show(),
        $("#game-alert-darkener").show())
    },
    hideAlertWindow: function() {
        Game.isAlertWindowVisible && (Game.isAlertWindowVisible = !1,
        $("#game-alert-window").hide(),
        $("#game-alert-darkener").hide())
    },
    onGameTossCoin: function(a) {
        Game.playSound("coin-flip");
        for (var b = Engine.pluralize("Coin", a.coins.length) + " landed on:<br>", c = 0; c < a.coins.length; ++c)
            0 !== c && (b += ", "),
            b += I18n.core[a.coins[c] ? 60 : 61];
        Game.displayMessageWindow(b, 1500 * Game.animationSpeedMultiplier, Game.parseNextMessage);
        return !0
    },
    onGameTossDice: function(a) {
        Game.playSound("dice-roll");
        for (var b = (1 == a.dice.length ? "Die" : "Dice") + " landed on:<br>", c = 0; c < a.dice.length; ++c)
            0 !== c && (b += ", "),
            b += "[" + a.dice[c] + "]";
        Game.displayMessageWindow(b, 1500 * Game.animationSpeedMultiplier, Game.parseNextMessage);
        return !0
    },
    onGameAddCounter: function(a) {
        return Game.onCounterChanged(a, !1)
    },
    onGameRemoveCounter: function(a) {
        return Game.onCounterChanged(a, !0)
    },
    onGameConfirmCards: function(a) {
        Game.preloadCardImages(a.cards, "code", function() {
            Game.onGameConfirmCardsInternal(a)
        });
        return !0
    },
    onGameConfirmCardsInternal: function(a) {
        var b = function(c) {
            if (c == a.cards.length)
                Game.parseNextMessage();
            else {
                var d = a.cards[c]
                  , e = Game.getCard(d.controller, d.location, d.sequence);
                !e || d.location & CardLocation.DECK || d.location & CardLocation.EXTRA ? b(c + 1) : (e.prepareMovement(),
                e.applyMovement(1 === d.controller || Game.isSpectator ? d.code : 0, e.position, 200 * Game.animationSpeedMultiplier, function() {
                    setTimeout(function() {
                        e.prepareMovement();
                        e.applyMovement(1 === d.controller || Game.isSpectator ? 0 : d.code, e.position, 200 * Game.animationSpeedMultiplier, function() {
                            b(c + 1)
                        })
                    }, 600 * Game.animationSpeedMultiplier)
                }))
            }
        };
        b(0)
    },
    onGameConfirmDeckTop: function(a) {
        Game.preloadImages(a.cards, function() {
            Game.onGameConfirmDeckTopInternal(a)
        });
        return !0
    },
    onGameDeckTop: function(a) {
        Game.preloadImage(a.cardId, function() {
            Game.onGameDeckTopInternal(a)
        });
        return !0
    },
    onGameDeckTopInternal: function(a) {
        var b = a.player
          , c = a.cardId
          , d = 0 < c ? CardPosition.FACEUP_ATTACK : CardPosition.FACEDOWN_ATTACK;
        (a = Game.getCard(b, CardLocation.DECK, Game.fields[b].cards[CardLocation.DECK].length - 1 - a.index)) ? (a.prepareMovement(),
        a.setCode(c),
        a.applyMovement(c, d, 200 * Game.animationSpeedMultiplier, Game.parseNextMessage)) : Game.parseNextMessage()
    },
    onGameConfirmDeckTopInternal: function(a) {
        var b = Game.getCard(a.player, CardLocation.DECK, -1)
          , c = function(d) {
            d == a.cards.length ? Game.parseNextMessage() : (b.prepareMovement(),
            b.applyMovement(a.cards[d], b.position, 200 * Game.animationSpeedMultiplier, function() {
                setTimeout(function() {
                    b.prepareMovement();
                    b.applyMovement(0, b.position, 200 * Game.animationSpeedMultiplier, function() {
                        c(d + 1)
                    })
                }, 600 * Game.animationSpeedMultiplier)
            }))
        };
        c(0)
    },
    onCounterChanged: function(a, b) {
        var c = Game.getCard(a.controller, a.location, a.sequence)
          , d = null
          , e = Engine.getCardData(c.code);
        e && (d = e.name);
        c.animateSelection();
        a.counterType in c.counters ? (c.counters[a.counterType] += b ? -a.counterCount : a.counterCount,
        0 >= c.counters[a.counterType] && delete c.counters[a.counterType]) : b || (c.counters[a.counterType] = a.counterCount);
        a = (b ? "Removed " : "Placed ") + (a.counterCount + " \u00d7 " + I18n.counter[a.counterType]);
        d && (a += (b ? " from " : " on ") + d);
        Game.playSound("counter");
        Game.displayMessageWindow(a, 1500 * Game.animationSpeedMultiplier, Game.parseNextMessage);
        return !0
    },
    displayMessageWindow: function(a, b, c) {
        $("#game-message-content").html(a);
        $("#game-message-window").stop(!0, !0).show("fast").delay(b).hide("fast", c)
    },
    onGameSelectIdleCommand: function(a) {
        Game.cancelViewingLocation();
        Game.isSelecting = !0;
        a.canBattlePhase && Game.phaseButtons[GamePhase.BATTLE_START].removeClass("engine-button-disabled").addClass("engine-button-primary");
        a.canEndPhase && Game.phaseButtons[GamePhase.END].removeClass("engine-button-disabled").addClass("engine-button-primary");
        for (var b = 0; b < a.summonableCards.length; ++b) {
            var c = a.summonableCards[b];
            Game.selectableSummon.push(Game.getCard(c.controller, c.location, c.sequence))
        }
        for (b = 0; b < a.specialSummonableCards.length; ++b) {
            c = a.specialSummonableCards[b];
            if (c.location === CardLocation.GRAVEYARD || c.location === CardLocation.BANISHED || c.location === CardLocation.EXTRA || c.location === CardLocation.DECK)
                Game.isZoneSummonable[c.location] = !0;
            var d = Game.getCard(c.controller, c.location, c.sequence);
            d.setCode(c.code);
            Game.selectableSpSummon.push(d)
        }
        for (b = 0; b < a.repositionableCards.length; ++b)
            c = a.repositionableCards[b],
            Game.selectableRepos.push(Game.getCard(c.controller, c.location, c.sequence));
        for (b = 0; b < a.monsterSetableCards.length; ++b)
            c = a.monsterSetableCards[b],
            Game.selectableSetMonster.push(Game.getCard(c.controller, c.location, c.sequence));
        for (b = 0; b < a.spellSetableCards.length; ++b)
            c = a.spellSetableCards[b],
            Game.selectableSetSpell.push(Game.getCard(c.controller, c.location, c.sequence));
        for (b = 0; b < a.activableCards.length; ++b) {
            c = a.activableCards[b];
            if (c.location === CardLocation.GRAVEYARD || c.location === CardLocation.BANISHED || c.location === CardLocation.EXTRA || c.location === CardLocation.DECK)
                Game.isZoneActivable[c.location] = !0;
            d = Game.getCard(c.controller, c.location, c.sequence);
            d.setCode(c.code);
            Game.selectableActivate.push(d);
            Game.selectableEffects.push(c.effect)
        }
        (Game.isZoneSummonable[CardLocation.GRAVEYARD] || Game.isZoneActivable[CardLocation.GRAVEYARD]) && $("#game-field-player-graveyard-activate").show();
        (Game.isZoneSummonable[CardLocation.BANISHED] || Game.isZoneActivable[CardLocation.BANISHED]) && $("#game-field-player-banished-activate").show();
        (Game.isZoneSummonable[CardLocation.EXTRA] || Game.isZoneActivable[CardLocation.EXTRA]) && $("#game-field-player-extra-activate").show();
        (Game.isZoneSummonable[CardLocation.DECK] || Game.isZoneActivable[CardLocation.DECK]) && $("#game-field-player-deck-activate").show();
        for (a = 0; a < Game.selectableSummon.length; ++a)
            Game.selectableSummon[a].imgElement.addClass("game-selectable-card");
        for (a = 0; a < Game.selectableSpSummon.length; ++a)
            b = Game.selectableSpSummon[a].location,
            b !== CardLocation.GRAVEYARD && b !== CardLocation.BANISHED && b !== CardLocation.EXTRA && b !== CardLocation.DECK && Game.selectableSpSummon[a].imgElement.addClass("game-selectable-card");
        for (a = 0; a < Game.selectableRepos.length; ++a)
            Game.selectableRepos[a].imgElement.addClass("game-selectable-card");
        for (a = 0; a < Game.selectableSetMonster.length; ++a)
            Game.selectableSetMonster[a].imgElement.addClass("game-selectable-card");
        for (a = 0; a < Game.selectableSetSpell.length; ++a)
            Game.selectableSetSpell[a].imgElement.addClass("game-selectable-card");
        for (a = 0; a < Game.selectableActivate.length; ++a)
            b = Game.selectableActivate[a].location,
            b !== CardLocation.GRAVEYARD && b !== CardLocation.BANISHED && b !== CardLocation.EXTRA && b !== CardLocation.DECK && Game.selectableActivate[a].imgElement.addClass("game-selectable-card")
    },
    onGameSelectBattleCommand: function(a) {
        Game.cancelViewingLocation();
        Game.isSelecting = !0;
        a.canMainPhase2 && Game.phaseButtons[GamePhase.MAIN2].removeClass("engine-button-disabled").addClass("engine-button-primary");
        a.canEndPhase && Game.phaseButtons[GamePhase.END].removeClass("engine-button-disabled").addClass("engine-button-primary");
        for (var b = 0; b < a.attackingCards.length; ++b) {
            var c = a.attackingCards[b];
            Game.selectableAttack.push(Game.getCard(c.controller, c.location, c.sequence))
        }
        for (b = 0; b < a.activableCards.length; ++b)
            c = a.activableCards[b],
            Game.selectableActivate.push(Game.getCard(c.controller, c.location, c.sequence)),
            Game.selectableEffects.push(c.effect);
        for (b = 0; b < Game.selectableAttack.length; ++b)
            Game.selectableAttack[b].imgElement.addClass("game-selectable-card");
        for (b = 0; b < Game.selectableActivate.length; ++b)
            Game.selectableActivate[b].imgElement.addClass("game-selectable-card")
    },
    onGameSelectCard: function(a) {
        return Game.onGameSelectCardInternal(a, !1, !1)
    },
    onGameSelectTribute: function(a) {
        return Game.onGameSelectCardInternal(a, !0, !1)
    },
    onGameSelectUnselect: function(a) {
        return Game.onGameSelectCardInternal(a, !1, !0)
    },
    onGameSelectCardInternal: function(a, b, c) {
        Game.cancelViewingLocation();
        Game.isSelecting = !0;
        Game.isSubmittable = c ? a.isSubmittable : !1;
        Game.isCancellable = a.isCancellable;
        Game.selectionMin = a.min;
        Game.selectionMax = a.max;
        Game.selectionIsTribute = b;
        Game.selectionIsSelectUnselect = c;
        var d = c ? Game.containsOutOfViewCard(a.selectableCards) || Game.containsOutOfViewCard(a.selectedCards) : Game.containsOutOfViewCard(a.cards);
        if (c) {
            c = [];
            for (var e = 0; e < a.selectableCards.length; ++e)
                c.push(a.selectableCards[e]);
            for (e = 0; e < a.selectedCards.length; ++e) {
                var f = a.selectedCards[e];
                f.isAlreadySelected = !0;
                c.push(f)
            }
            d ? Game.openAdvancedSelection(c, !1) : Game.openBasicSelection(c, b)
        } else
            d ? Game.openAdvancedSelection(a.cards, !1) : Game.openBasicSelection(a.cards, b)
    },
    containsOutOfViewCard: function(a) {
        for (var b = 0; b < a.length; ++b) {
            var c = a[b].location;
            if (c === CardLocation.DECK || c === CardLocation.EXTRA || c === CardLocation.GRAVEYARD || c === CardLocation.BANISHED || c & CardLocation.OVERLAY)
                return !0
        }
        return !1
    },
    onGameSortCards: function(a) {
        a.isChain && 1 !== Game.chainingMode ? Game.sendResponse(-1) : (Game.cancelViewingLocation(),
        Game.isSelecting = !0,
        Game.isCancellable = !0,
        Game.selectionMin = a.cards.length,
        Game.selectionMax = Game.selectionMin,
        Game.selectionIsSorting = !0,
        Game.openAdvancedSelection(a.cards, !1))
    },
    openBasicSelection: function(a, b) {
        for (var c = 0; c < a.length; ++c) {
            var d = a[c]
              , e = Game.getCard(d.controller, d.location, d.sequence);
            d.code && e.setCode(d.code);
            b && d.sumValue && (e.sumValue = d.sumValue);
            Game.selectableCards.push(e);
            d.isAlreadySelected ? (e.imgElement.addClass("game-selected-card"),
            Game.selectedCards.push(e)) : e.imgElement.addClass("game-selectable-card")
        }
    },
    openAdvancedSelection: function(a, b) {
        Game.isAdvancedSelectionOpen = !0;
        for (var c = $("#game-selection-list"), d = 0; d < a.length; ++d) {
            var e = a[d]
              , f = void 0
              , g = !1;
            b ? f = a[d] : (f = Game.getCard(e.controller, e.location, e.sequence, e.position),
            e.sumValue && (f.sumValue = e.sumValue),
            e.isAlreadySelected && (g = !0));
            var h = Game.selectionCardTemplate.clone().data("card-controller", f.controller).data("card-location", f.location).data("card-sequence", f.sequence).data("card-subsequence", e.position).mouseenter(function() {
                var a = $(this).data("card-controller")
                  , b = $(this).data("card-location")
                  , c = $(this).data("card-sequence");
                Game.onCardHovered(a, b, c)
            }).mouseleave(function() {
                var a = $(this).data("card-controller")
                  , b = $(this).data("card-location")
                  , c = $(this).data("card-sequence");
                Game.onCardLeft(a, b, c)
            }).click(function() {
                Game.onCardSelected($(this).data("card-controller"), $(this).data("card-location"), $(this).data("card-sequence"), $(this).data("card-subsequence"))
            });
            b ? e = f.code : (e = 0 !== e.code ? e.code : f.code,
            f.setCode(e));
            Engine.setCardImageElement(h.find(".game-selection-card-image"), e);
            h.find(".game-selection-card-text").text(I18n.locations[f.location & ~CardLocation.OVERLAY] + " (" + f.sequence + ")");
            h.appendTo(c);
            f.advancedSelectionImage = h.find(".game-selection-card-image");
            Game.selectableCards.push(f);
            g && (Game.selectedCards.push(f),
            f.advancedSelectionImage.addClass("game-selected-card"))
        }
        $(".game-selection-card-image").css("width", Game.cardWidth);
        $("#game-selection-window").show()
    },
    getEffectText: function(a) {
        if (1E4 > a)
            return I18n.core[a];
        var b = a & 15;
        if (a = Engine.getCardData(a >> 4))
            if (b = a.getEffectText(b))
                return b;
        return ""
    },
    onGameSelectYesNo: function(a) {
        Game.cancelViewingLocation();
        a = Game.getEffectText(a.effect);
        $("#game-yesno-title").text(a);
        $("#game-yesno-window").fadeIn(250)
    },
    onGameSelectEffectYesNo: function(a) {
        Game.cancelViewingLocation();
        var b = ""
          , c = Engine.getCardData(a.card.code);
        c && (b = "Do you want to activate " + c.name + " (" + I18n.locations[a.card.location] + ")?");
        $("#game-yesno-title").text(b);
        $("#game-yesno-window").fadeIn(250)
    },
    onGameSelectChain: function(a) {
        Game.cancelViewingLocation();
        if (a.forced || 2 !== Game.chainingMode)
            if (0 !== Game.chainingMode || a.forced || 0 !== a.cards.length && 0 !== a.specialCount)
                if (a.forced && 1 === a.cards.length)
                    Game.sendResponse(0);
                else {
                    Game.isSelectingChain = !0;
                    Game.isAdvancedSelection = !1;
                    for (var b = 0; b < a.cards.length; ++b)
                        if (a.cards[b].location === CardLocation.DECK || a.cards[b].location === CardLocation.EXTRA || a.cards[b].location === CardLocation.GRAVEYARD || a.cards[b].location === CardLocation.BANISHED || a.cards[b].location & CardLocation.OVERLAY) {
                            Game.isAdvancedSelection = !0;
                            break
                        }
                    for (b = 0; b < a.cards.length; ++b) {
                        var c = a.cards[b];
                        Game.chainableCards.push(Game.getCard(c.controller, c.location, c.sequence));
                        Game.selectableEffects.push(c.effect)
                    }
                    a.forced ? Game.selectChainInternal() : (Game.isCancellable = !0,
                    $("#game-yesno-title").text("Activate a card? " + a.cards.length + " " + Engine.pluralize("effect", a.cards.length) + " can be chained."),
                    $("#game-yesno-window").fadeIn(250))
                }
            else
                Game.sendResponse(-1);
        else
            Game.sendResponse(-1)
    },
    selectChainInternal: function() {
        if (Game.isAdvancedSelection)
            Game.isAdvancedChaining = !0,
            Game.openAdvancedSelection(Game.chainableCards, !0);
        else {
            Game.isSelecting = !0;
            Game.selectionMin = 1;
            Game.selectionMax = 1;
            for (var a = 0; a < Game.chainableCards.length; ++a)
                Game.selectableCards.push(Game.chainableCards[a]),
                Game.chainableCards[a].imgElement.addClass("game-selectable-card")
        }
    },
    onGameSelectPosition: function(a) {
        Game.cancelViewingLocation();
        a.positions & CardPosition.FACEUP_ATTACK ? ($("#game-position-atk-up").show(),
        $("#game-position-atk-up").show(),
        Engine.setCardImageElement($("#game-position-atk-up"), a.cardCode)) : $("#game-position-atk-up").hide();
        a.positions & CardPosition.FACEDOWN_ATTACK ? ($("#game-position-atk-down").show(),
        $("#game-position-atk-down").attr("src", Engine.getCardPicturePath(0))) : $("#game-position-atk-down").hide();
        a.positions & CardPosition.FACEUP_DEFENCE ? ($("#game-position-def-up").show(),
        Engine.setCardImageElement($("#game-position-def-up"), a.cardCode)) : $("#game-position-def-up").hide();
        a.positions & CardPosition.FACEDOWN_DEFENCE ? ($("#game-position-def-down").show(),
        $("#game-position-def-down").attr("src", Engine.getCardPicturePath(0))) : $("#game-position-def-down").hide();
        $("#game-position-window").fadeIn(250)
    },
    onGameSelectOption: function(a) {
        Game.cancelViewingLocation();
        Game.isSelecting = !0;
        Game.openOptionsWindow(a.options, !0, !1)
    },
    openOptionsWindow: function(a, b, c) {
        for (var d = $("#game-option-list"), e = 0; e < a.length; ++e) {
            var f = c ? a[e].index : e
              , g = c ? a[e].effect : a[e];
            Game.optionButtonTemplate.clone().data("option-index", f).text(b ? Game.getEffectText(g) : g).click(function() {
                Game.selectOption($(this).data("option-index"))
            }).appendTo(d)
        }
        $("#game-option-window").fadeIn(250)
    },
    onGameSelectSum: function(a) {
        Game.cancelViewingLocation();
        Game.isSelecting = !0;
        Game.selectionSum = a.sumValue;
        Game.selectionMin = a.selectMin;
        Game.selectionMax = a.selectMax;
        for (var b = !1, c = 0; c < a.cards.length; ++c)
            if (a.cards[c].location === CardLocation.DECK || a.cards[c].location === CardLocation.EXTRA || a.cards[c].location === CardLocation.GRAVEYARD || a.cards[c].location === CardLocation.BANISHED || a.cards[c].location & CardLocation.OVERLAY) {
                b = !0;
                break
            }
        for (c = 0; c < a.mustSelectCards.length; ++c) {
            var d = a.mustSelectCards[c]
              , e = Game.getCard(d.controller, d.location, d.sequence);
            d.code && e.setCode(d.code);
            e.sumValue = d.sumValue;
            e.imgElement.addClass("game-selected-card");
            Game.selectedCards.push(e);
            Game.mustSelectCards.push(e)
        }
        if (b)
            Game.openAdvancedSelection(a.cards, !1);
        else
            for (c = 0; c < a.cards.length; ++c)
                d = a.cards[c],
                e = Game.getCard(d.controller, d.location, d.sequence),
                d.code && e.setCode(d.code),
                e.sumValue = d.sumValue,
                e.imgElement.addClass("game-selectable-card"),
                Game.selectableCards.push(e)
    },
    onGameSelectPlace: function(a) {
        Game.selectableFieldCount = a.count;
        Game.selectableFieldFilter = a.filter;
        if (!a.isDisfield && 1 === a.count && Game.tryToAutoSelectPlace())
            Game.selectableFieldCount = -1,
            Game.selectableFieldFilter = -1;
        else
            for (Game.cancelViewingLocation(),
            Game.isSelectingPlace = !0,
            a = 0; 2 > a; ++a) {
                for (var b = 0; b < (4 <= Game.masterRule ? 7 : 5); ++b)
                    if (Game.isFieldSelectable(a, CardLocation.MONSTER_ZONE, b)) {
                        var c = Game.getZoneHtmlId(a, CardLocation.MONSTER_ZONE, b);
                        $(c).addClass("game-field-zone-selectable")
                    }
                for (b = 0; 8 > b; ++b)
                    Game.isFieldSelectable(a, CardLocation.SPELL_ZONE, b) && $(Game.fields[a].namespace + "spell" + (b + 1)).addClass("game-field-zone-selectable")
            }
    },
    tryToAutoSelectPlace: function() {
        for (var a = !1, b = !1, c = 0; 2 > c; ++c) {
            for (var d = 0; d < (4 <= Game.masterRule ? 7 : 5); ++d)
                if (Game.isFieldSelectable(c, CardLocation.MONSTER_ZONE, d)) {
                    a = !0;
                    break
                }
            for (d = 0; 8 > d; ++d)
                if (Game.isFieldSelectable(c, CardLocation.SPELL_ZONE, d)) {
                    b = !0;
                    break
                }
        }
        return a && !b && Options.getValue("auto-place-monsters") || !a && b && Options.getValue("auto-place-spells") ? Game.selectPlaceAutomatically() : !1
    },
    selectPlaceAutomatically: function() {
        var a = Game.selectableFieldFilter
          , b = -1
          , c = -1
          , d = -1
          , e = !1;
        if (a & 127) {
            b = 0;
            c = CardLocation.MONSTER_ZONE;
            var f = a & 127
        } else
            a & 7936 ? (b = 0,
            c = CardLocation.SPELL_ZONE,
            f = a >> 8 & 31) : a & 49152 ? (b = 0,
            c = CardLocation.SPELL_ZONE,
            f = a >> 14 & 3,
            e = !0) : a & 8323072 ? (b = 1,
            c = CardLocation.MONSTER_ZONE,
            f = a >> 16 & 127) : a & 520093696 ? (b = 1,
            c = CardLocation.SPELL_ZONE,
            f = a >> 24 & 31) : a & 3221225472 && (b = 1,
            c = CardLocation.SPELL_ZONE,
            f = a >> 30 & 3,
            e = !0);
        e ? f & 1 ? d = 6 : f & 2 && (d = 7) : f & 64 ? d = 6 : f & 32 ? d = 5 : f & 4 ? d = 2 : f & 2 ? d = 1 : f & 8 ? d = 3 : f & 1 ? d = 0 : f & 16 && (d = 4);
        if (-1 === b || -1 === c || -1 === d)
            return !1;
        Game.sendMessage({
            type: "GameSendZones",
            zones: [{
                player: b,
                location: c,
                sequence: d
            }]
        });
        return !0
    },
    isFieldSelectable: function(a, b, c) {
        return Game.selectableFieldFilter & 1 << c + 16 * a + (b === CardLocation.MONSTER_ZONE ? 0 : 8)
    },
    onGameSelectCounter: function(a) {
        var b = a.counterType
          , c = a.counterCount;
        a = a.cards;
        Game.cancelViewingLocation();
        Game.isSelectingCounters = !0;
        Game.selectingCounterType = b;
        Game.selectingCounterCount = c;
        Game.selectingCounterRemaining = c;
        Game.usedCounters = [];
        for (b = 0; b < a.length; ++b) {
            c = a[b];
            var d = Game.getCard(c.controller, c.location, c.sequence);
            c.effect && (d.usableCounterCount = c.effect);
            Game.selectableCards.push(d);
            Game.usedCounters.push(0);
            d.imgElement.addClass("game-selectable-card")
        }
        Game.displayRemainingCounters()
    },
    displayRemainingCounters: function() {
        if (Game.selectingCounterRemaining === Game.selectingCounterCount)
            Game.displayMessageWindow("Please select " + (Game.selectingCounterCount + " \u00d7 " + I18n.counter[Game.selectingCounterType]), 2E3 * Game.animationSpeedMultiplier, null);
        else {
            var a = "Selecting " + I18n.counter[Game.selectingCounterType] + ": ";
            a += Game.selectingCounterRemaining + " / " + Game.selectingCounterCount;
            Game.displayMessageWindow(a, 1E3 * Game.animationSpeedMultiplier, null)
        }
    },
    onGameAnnounceAttrib: function(a) {
        Game.cancelViewingLocation();
        Game.isSelecting = !0;
        Game.announceCount = a.count;
        Game.announcedValues = {};
        $("#game-announce-title").text("Select " + (1 == a.count ? "an " : a.count + " ") + Engine.pluralize("attribute", a.count));
        Game.openAnnounceWindow(a.availableAttributes, !1)
    },
    onGameAnnounceRace: function(a) {
        Game.cancelViewingLocation();
        Game.isSelecting = !0;
        Game.selectingRace = a.availableRaces;
        Game.announceCount = a.count;
        Game.announcedValues = {};
        $("#game-announce-title").text("Select " + (1 == a.count ? "a " : a.count + " ") + Engine.pluralize("race", a.count));
        Game.openAnnounceWindow(a.availableRaces, !0)
    },
    openAnnounceWindow: function(a, b) {
        for (var c = $("#game-announce-list"), d = 0; d < (b ? 24 : 7); ++d) {
            var e = 1 << d;
            if (e & a) {
                var f = Game.announceTemplate.clone();
                f.find(".game-announce-label").text(b ? I18n.races[e] : I18n.attributes[e]);
                f.find(".game-announce-input").data("option-value", e).change(function() {
                    Game.announcedValues[$(this).data("option-value")] = this.checked;
                    Game.selectAnnounces()
                });
                f.appendTo(c)
            }
        }
        $("#game-announce-window").fadeIn(250)
    },
    selectAnnounces: function() {
        var a = 0, b = 0, c;
        for (c in Game.announcedValues)
            Game.announcedValues[c] && (a |= c,
            ++b);
        b === Game.announceCount && (Game.sendResponse(a),
        Game.endSelection())
    },
    onGameAnnounceNumber: function(a) {
        Game.cancelViewingLocation();
        Game.isSelecting = !0;
        Game.openOptionsWindow(a.numbers, !1, !1)
    },
    onGameAnnounceCard: function(a) {
        Game.cancelViewingLocation();
        Game.isSelecting = !0;
        Game.declarableType = a.declarableType;
        Game.declarableOpcodes = a.opcodes;
        $("#game-announce-card-window").fadeIn(250)
    },
    onAnnounceCardTextInput: function(a) {
        a = $("#game-announce-card-list");
        a.empty();
        var b = Engine.cleanText($("#game-announce-card-text").val());
        if (0 !== b.length) {
            var c = []
              , d = parseInt(b, 10);
            isNaN(d) || (d = Engine.database.cards[d]) && Game.isDeclarable(d) && c.push(d);
            if (0 === c.length)
                for (var e in Engine.database.cards)
                    d = Engine.database.cards[e],
                    Game.isDeclarable(d) && (d.cleanName === b ? c.unshift(d) : 3 <= b.length && -1 !== d.cleanName.indexOf(b) && c.push(d));
            for (e = 0; e < c.length && 10 > e; ++e)
                Game.addAnnounceCardButton(a, c[e])
        }
    },
    isDeclarable: function(a) {
        return 0 < a.alias || a.type & CardType.TOKEN || 0 !== Game.declarableType && !(a.type & Game.declarableType) || Game.declarableOpcodes && 0 < Game.declarableOpcodes.length && (a = Game.executeOpcodes(a, Game.declarableOpcodes),
        1 !== a.length || 0 === a[0]) ? !1 : !0
    },
    executeOpcodes: function(a, b) {
        for (var c = [], d = 0; d < b.length; ++d) {
            var e = b[d];
            switch (e) {
            case OpCode.ADD:
                if (2 <= c.length) {
                    e = c.pop();
                    var f = c.pop();
                    c.push(f + e)
                }
                break;
            case OpCode.SUB:
                2 <= c.length && (e = c.pop(),
                f = c.pop(),
                c.push(f + e));
                break;
            case OpCode.MUL:
                2 <= c.length && (e = c.pop(),
                f = c.pop(),
                c.push(f + e));
                break;
            case OpCode.DIV:
                2 <= c.length && (e = c.pop(),
                f = c.pop(),
                c.push(f + e));
                break;
            case OpCode.AND:
                2 <= c.length && (e = c.pop(),
                f = c.pop(),
                c.push(f & e));
                break;
            case OpCode.OR:
                2 <= c.length && (e = c.pop(),
                f = c.pop(),
                c.push(f | e));
                break;
            case OpCode.NEG:
                1 <= c.length && (e = c.pop(),
                c.push(-e));
                break;
            case OpCode.NOT:
                1 <= c.length && (e = c.pop(),
                c.push(0 === e ? 1 : 0));
                break;
            case OpCode.IS_CODE:
                1 <= c.length && (e = c.pop(),
                c.push(a.id === e ? 1 : 0));
                break;
            case OpCode.IS_SET_CARD:
                if (1 <= c.length) {
                    f = c.pop();
                    e = f & 4095;
                    f &= 61440;
                    for (var g = !1, h = 0; h < a.setcodes.length; ++h) {
                        var k = a.setcodes[h]
                          , l = k & 61440;
                        if ((k & 4095) === e && (0 === f || l & f)) {
                            g = !0;
                            break
                        }
                    }
                    c.push(g ? 1 : 0)
                }
                break;
            case OpCode.IS_TYPE:
                1 <= c.length && (e = c.pop(),
                c.push(a.type & e ? 1 : 0));
                break;
            case OpCode.IS_RACE:
                1 <= c.length && (e = c.pop(),
                c.push(a.race & e ? 1 : 0));
                break;
            case OpCode.IS_ATTRIBUTE:
                1 <= c.length && (e = c.pop(),
                c.push(a.attribute & e ? 1 : 0));
                break;
            default:
                c.push(e)
            }
        }
        return c
    },
    addAnnounceCardButton: function(a, b) {
        Game.announceCardTemplate.clone().data("card-id", b.id).text(b.name).click(function() {
            Game.sendResponse($(this).data("card-id"));
            Game.endSelection()
        }).appendTo(a)
    },
    selectOption: function(a) {
        Game.isSelectingActivationOption ? Game.isSelectingChain ? Game.sendResponse(a) : Game.sendAction(Game.phase === GamePhase.BATTLE_START ? BattlePhaseAction.ACTIVATE : MainPhaseAction.ACTIVATE, a) : Game.sendResponse(a);
        Game.endSelection()
    },
    cancelViewingLocation: function() {
        return Game.isViewingLocation ? (Game.isAdvancedSelectionOpen = !1,
        Game.isViewingLocation = !1,
        Game.selectableCards = [],
        $("#game-selection-list").empty(),
        $("#game-selection-window").hide(),
        Game.hideTooltip(),
        !0) : !1
    },
    endSelection: function() {
        if (Game.isAdvancedSelectionOpen)
            for (var a = 0; a < Game.selectableCards.length; ++a)
                Game.selectableCards[a].advancedSelectionImage = null;
        Game.hideTooltip();
        Game.isSelecting = !1;
        Game.selectionIsTribute = !1;
        Game.selectionIsSelectUnselect = !1;
        Game.selectionIsSorting = !1;
        Game.isSubmittable = !1;
        Game.isCancellable = !1;
        Game.isSelectingChain = !1;
        Game.isAdvancedSummoning = !1;
        Game.isAdvancedActivating = !1;
        Game.isAdvancedSelectionOpen = !1;
        Game.isAdvancedChaining = !1;
        Game.isSelectingActivationOption = !1;
        Game.isViewingLocation = !1;
        for (var b in Game.phaseButtons)
            Game.phaseButtons[b].addClass("engine-button-disabled").removeClass("engine-button-primary");
        Game.isZoneSummonable = {};
        Game.isZoneActivable = {};
        Game.closeActionMenu();
        $(".game-field-zone-content img").removeClass("game-selectable-card").removeClass("game-selected-card");
        $("#game-yesno-window").hide();
        $("#game-position-window").hide();
        $("#game-option-list").empty();
        $("#game-option-window").hide();
        $("#game-selection-list").empty();
        $("#game-selection-window").hide();
        $("#game-announce-list").empty();
        $("#game-announce-window").hide();
        $("#game-announce-card-list").empty();
        $("#game-announce-card-text").val("");
        $("#game-announce-card-window").hide();
        $("#game-field-player-graveyard-activate").hide();
        $("#game-field-player-banished-activate").hide();
        $("#game-field-player-extra-activate").hide();
        $("#game-field-player-deck-activate").hide();
        Game.selectableSummon = [];
        Game.selectableSpSummon = [];
        Game.selectableRepos = [];
        Game.selectableSetMonster = [];
        Game.selectableSetSpell = [];
        Game.selectableActivate = [];
        Game.selectableEffects = [];
        Game.selectableAttack = [];
        Game.selectableCards = [];
        Game.selectedCards = [];
        Game.mustSelectCards = [];
        Game.chainableCards = [];
        Game.selectionMin = -1;
        Game.selectionMax = -1;
        Game.selectionSum = -1;
        Game.isSelectingPlace = !1;
        Game.selectableFieldCount = -1;
        Game.selectableFieldFilter = -1;
        Game.selectedPlaces = [];
        $(".game-field-zone-selectable").removeClass("game-field-zone-selectable");
        $(".game-field-zone-selected").removeClass("game-field-zone-selected");
        Game.isSelectingCounters = !1;
        Game.selectingCounterType = null;
        Game.selectingCounterCount = -1;
        Game.selectingCounterRemaining = -1
    },
    sendAction: function(a, b) {
        Game.sendMessage({
            type: "GameSendAction",
            action: a,
            index: b || 0
        })
    },
    sendResponse: function(a) {
        Game.sendMessage({
            type: "GameSendResponse",
            response: a
        })
    },
    sendSurrender: function() {
        Game.hasSurrendered || (Game.hasSurrendered = !0,
        Game.sendMessage({
            type: "Surrender"
        }))
    },
    sendMessage: function(a) {
        window.Debug && console.log(a);
        null !== Game.socket && Game.socket.send(JSON.stringify(a))
    }
}
  , Options = {
    init: function() {
        Options.options = {};
        $("#options-show-button").click(Options.showWindow);
        $("#options-hide-button").click(Options.hideWindow);
        $("#options-reset-button").click(Options.reset);
        void 0 === Engine.storage.options && (Engine.storage.options = {});
        Options.registerBarOption("sounds", 0, 100, 50);
        Options.registerBarOption("music", 0, 100, 25);
        Options.registerBarOption("speed", 20, 300, 100);
        Options.registerCheckOption("auto-place-monsters", !1);
        Options.registerCheckOption("auto-place-spells", !0);
        Engine.storage.save()
    },
    showWindow: function() {
        $("#options-area").hide();
        $("#options-window").show()
    },
    hideWindow: function() {
        $("#options-area").show();
        $("#options-window").hide()
    },
    reset: function() {
        for (var a in Options.options) {
            var b = Options.options[a].defaultValue;
            "bar" === Options.options[a].type ? ($("#options-" + a + "-range").val(b),
            $("#options-" + a + "-value").text(b + "%")) : "check" === Options.options[a].type && $("#options-" + a).prop("checked", b);
            Engine.storage.options[a] = b;
            if (Options.onOptionChanged)
                Options.onOptionChanged(a, b)
        }
        Engine.storage.save()
    },
    registerBarOption: function(a, b, c, d) {
        void 0 === Engine.storage.options[a] && (Engine.storage.options[a] = d);
        var e = Engine.storage.options[a];
        Options.options[a] = {
            type: "bar",
            min: b,
            max: c,
            defaultValue: d,
            value: e
        };
        $("#options-" + a + "-range").attr("min", b).attr("max", c).attr("value", e).data("option", a).on("change", function() {
            var a = $(this).data("option")
              , b = $(this).val();
            $("#options-" + a + "-value").text(b + "%");
            Engine.storage.options[a] = b;
            Engine.storage.save();
            if (Options.onOptionChanged)
                Options.onOptionChanged(a, b)
        });
        $("#options-" + a + "-value").text(e + "%")
    },
    registerCheckOption: function(a, b) {
        void 0 === Engine.storage.options[a] && (Engine.storage.options[a] = b);
        var c = Engine.storage.options[a];
        Options.options[a] = {
            type: "check",
            defaultValue: b,
            value: c
        };
        $("#options-" + a).prop("checked", c).data("option", a).on("change", function() {
            var a = $(this).data("option")
              , b = $(this).prop("checked");
            Engine.storage.options[a] = b;
            Engine.storage.save();
            if (Options.onOptionChanged)
                Options.onOptionChanged(a, b)
        })
    },
    getValue: function(a) {
        return Engine.storage.options[a]
    }
};
$(function() {
    window.GameInfo && Engine.init(Game.initRoom)
});
var Editor = {
    main: [],
    extra: [],
    side: [],
    margins: {
        main: 0,
        extra: 0,
        side: 0
    },
    selection: null,
    updateDeck: function() {
        for (var a = ["main", "extra", "side"], b = 0; b < a.length; ++b) {
            var c = a[b];
            window.Deck[c] = [];
            for (var d = 0; d < Editor[c].length; ++d)
                window.Deck[c].push(Editor[c][d].data("id"))
        }
    },
    init: function() {
        Editor.searchResultTemplateHtml = $("#editor-search-result-template").removeAttr("id")[0].outerHTML;
        Editor.searchResultsElement = $("#editor-search-results").empty();
        Editor.createDeck("main");
        Editor.createDeck("extra");
        Editor.createDeck("side");
        $("#editor-save-button").click(Editor.save);
        $("#editor-clear-button").click(Editor.clear);
        $("#editor-sort-button").click(Editor.sort);
        $("#editor-shuffle-button").click(Editor.shuffle);
        $("#editor-search-text").on("input", Editor.updateSearch);
        $(window).on("mouseup", function(a) {
            if (1 === a.which && Editor.selection)
                return Editor.clearSelection(),
                !1
        });
        $(window).mousemove(function(a) {
            Editor.mouseX = a.pageX;
            Editor.mouseY = a.pageY;
            Editor.updateSelectionPosition()
        });
        $(window).resize(Editor.updateSizes);
        Editor.updateSizes()
    },
    calculateCardSize: function() {
        var a = $("#editor-main-deck").width() / 10;
        return {
            width: a,
            height: Engine.CARD_HEIGHT / Engine.CARD_WIDTH * a
        }
    },
    getCardCount: function(a) {
        for (var b = 0, c = ["main", "extra", "side"], d = 0; d < c.length; ++d)
            for (var e = c[d], f = 0; f < Editor[e].length; ++f)
                Editor[e][f].data("id") !== a && Editor[e][f].data("alias") !== a || ++b;
        return b
    },
    addCard: function(a, b, c, d) {
        var e = Engine.getCardData(a);
        if (e && !(e.type & CardType.TOKEN)) {
            var f = !1;
            if (e.type & CardType.FUSION || e.type & CardType.SYNCHRO || e.type & CardType.XYZ || e.type & CardType.LINK)
                f = !0;
            if (!(f && "main" === b || !f && "extra" === b || Editor[b].length >= ("main" === b ? 60 : 15) || (f = d ? 3 : Engine.banlists.getCardQuantity(0, 0 !== e.alias ? e.alias : e.id),
            f = 3,
            Editor.getCardCount(e.alias ? e.alias : e.id) >= f))) {
                f = Editor[b];
                var g = $("#editor-" + b + "-deck");
                d = $("<img>").css("margin-right", Editor.margins[b]).addClass("editor-card-small");
                Engine.setCardImageElement(d, a);
                d.mouseover(function() {
                    Engine.ui.setCardInfo($(this).data("id"))
                });
                d.mousedown(function(a) {
                    if (1 == a.which) {
                        a = $(this).data("id");
                        var b = $(this).data("location")
                          , c = $(this).parent().children().index($(this));
                        Editor.removeCard(b, c);
                        Editor.selectCard(a);
                        return !1
                    }
                    if (3 == a.which)
                        return !1
                });
                d.mouseup(function(a) {
                    if (1 == a.which && Editor.selection) {
                        a = $(this).data("location");
                        var b = $(this).parent().children().index($(this));
                        Editor.addCard(Editor.selection.data("id"), a, b);
                        Editor.clearSelection();
                        return !1
                    }
                });
                d.on("contextmenu", function() {
                    var a = $(this).data("location")
                      , b = $(this).parent().children().index($(this));
                    Editor.removeCard(a, b);
                    return !1
                });
                d.data("id", a);
                d.data("alias", e.alias);
                d.data("location", b);
                -1 === c ? (g.append(d),
                f.push(d)) : (0 === c && 0 == g.children().length ? g.append(d) : g.children().eq(c).before(d),
                f.splice(c, 0, d));
                f = Engine.banlists.getCardQuantity(0, 0 !== e.alias ? e.alias : e.id);
                3 !== f ? (a = 2 === f ? "banlist-semilimited.png" : 1 === f ? "banlist-limited.png" : "banlist-banned.png",
                a = $("<img>").attr("src", "assets/images/" + a),
                d.data("banlist", a),
                $("#editor-banlist-icons").append(a)) : d.data("banlist", null);
                1 == e.ot ? (e = $("<img>").attr("src", "assets/images/ocg.png"),
                d.data("region", e),
                $("#editor-region-icons").append(e)) : 2 == e.ot ? (e = $("<img>").attr("src", "assets/images/tcg.png"),
                d.data("region", e),
                $("#editor-region-icons").append(e)) : d.data("region", null);
                Editor.updateMargins(b);
                Editor.updateBanlist(b)
            }
        }
    },
    removeCard: function(a, b) {
        var c = Editor[a]
          , d = c[b].data("banlist");
        d && d.remove();
        (d = c[b].data("region")) && d.remove();
        c[b].remove();
        c.splice(b, 1);
        Editor.updateMargins(a);
        Editor.updateBanlist(a)
    },
    selectCard: function(a) {
        Editor.clearSelection();
        var b = Editor.calculateCardSize();
        Editor.selection = $("<img>").css("position", "absolute").css("left", 0).css("top", 0).css("width", b.width + "px").css("height", b.height + "px").data("id", a);
        Engine.setCardImageElement(Editor.selection, a);
        Editor.selection.appendTo($("body"));
        Editor.updateSelectionPosition()
    },
    updateSelectionPosition: function() {
        Editor.selection && Editor.selection.css("left", Editor.mouseX + 3).css("top", Editor.mouseY + 3)
    },
    clearSelection: function() {
        Editor.selection && (Editor.selection.remove(),
        Editor.selection = null)
    },
    createDeck: function(a) {
        for (var b = 0; b < Deck[a].length; ++b)
            Editor.addCard(Deck[a][b], a, -1, !0);
        b = $("#editor-" + a + "-deck");
        b.data("location", a);
        b.mouseup(function(a) {
            if (Editor.selection && 1 == a.which)
                return a = $(this).data("location"),
                Editor.addCard(Editor.selection.data("id"), a, -1),
                Editor.clearSelection(),
                !1
        })
    },
    updateSearch: function() {
        Editor.clearSearch();
        var a = Engine.cleanText($("#editor-search-text").val());
        if (0 !== a.length) {
            var b = []
              , c = []
              , d = parseInt(a, 10);
            isNaN(d) || (d = Engine.database.cards[d]) && Editor.isCardFiltered(d) && c.push(d);
            if (0 === c.length)
                for (var e in Engine.database.cards)
                    d = Engine.database.cards[e],
                    Editor.isCardFiltered(d) && (d.cleanName === a ? b.push(d) : 3 <= a.length && -1 !== d.cleanName.indexOf(a) && c.push(d));
            b.sort(Editor.compareCards);
            c.sort(Editor.compareCards);
            for (a = 0; a < b.length && 30 > a; ++a)
                Editor.addSearchResult(b[a].id);
            for (b = 0; b < c.length && 30 > b; ++b)
                Editor.addSearchResult(c[b].id)
        }
    },
    isCardFiltered: function(a) {
        return a.type & CardType.TOKEN ? !1 : !0
    },
    addSearchResult: function(a) {
        a = Engine.getCardData(a);
        var b = $(Editor.searchResultTemplateHtml);
        b.find(".template-name").text(a.name);
        Engine.setCardImageElement(b.find(".template-picture"), a.id);
        if (a.type & CardType.MONSTER)
            b.find(".template-if-spell").remove(),
            b.find(".template-level").text(a.level),
            b.find(".template-atk").text(a.attack),
            b.find(".template-def").text(a.defence),
            0 == a.lscale && 0 == a.rscale || b.find(".template-scales").text(a.lscale + "/" + a.rscale),
            b.find(".template-race").text(I18n.races[a.race]),
            b.find(".template-attribute").text(I18n.attributes[a.attribute]);
        else {
            b.find(".template-if-monster").remove();
            var c = [];
            for (e in CardType) {
                var d = CardType[e];
                a.type & d && c.push(I18n.types[d])
            }
            b.find(".template-types").text(c.join("|"))
        }
        b.data("id", a.id);
        b.mouseover(function() {
            Engine.ui.setCardInfo($(this).data("id"))
        });
        b.mousedown(function(a) {
            if (1 == a.which)
                return a = $(this).data("id"),
                Editor.selectCard(a),
                !1;
            if (3 == a.which)
                return !1
        });
        b.on("contextmenu", function() {
            var a = $(this).data("id");
            a = Engine.getCardData(a);
            var b = "main";
            if (a.type & CardType.FUSION || a.type & CardType.SYNCHRO || a.type & CardType.XYZ || a.type & CardType.LINK)
                b = "extra";
            Editor.addCard($(this).data("id"), b, -1);
            return !1
        });
        var e = b.find(".editor-search-banlist-icon");
        c = Engine.banlists.getCardQuantity(0, 0 !== a.alias ? a.alias : a.id);
        3 !== c ? e.attr("src", "assets/images/" + (2 === c ? "banlist-semilimited.png" : 1 === c ? "banlist-limited.png" : "banlist-banned.png")) : e.remove();
        e = b.find(".editor-search-region-icon");
        1 == a.ot ? e.attr("src", "assets/images/ocg.png") : 2 == a.ot ? e.attr("src", "assets/images/tcg.png") : e.remove();
        Editor.searchResultsElement.append(b)
    },
    updateSizes: function() {
        var a = $("#card-column").position().top;
        $("#card-column").css("max-height", $(window).height() - a - 25);
        $("#editor-decks-column").css("max-height", $(window).height() - a - 25);
        $("#editor-search-column").css("max-height", $(window).height() - a - 25);
        a = Editor.calculateCardSize().height;
        $("#editor-main-deck").css("height", 4 * a + "px");
        $("#editor-extra-deck").css("height", a + "px");
        $("#editor-side-deck").css("height", a + 3 + "px");
        Editor.updateBanlist("main");
        Editor.updateBanlist("extra");
        Editor.updateBanlist("side")
    },
    updateMargins: function(a) {
        var b = "0";
        Editor[a].length > ("main" == a ? 60 : 15) ? b = "main" == a ? "-4.05%" : "-4.72%" : Editor[a].length > ("main" == a ? 40 : 10) && (b = "-3.6%");
        if (Editor.margins[a] !== b) {
            Editor.margins[a] = b;
            for (var c = 0; c < Editor[a].length; ++c)
                Editor[a][c].css("margin-right", b)
        }
    },
    updateBanlist: function(a) {
        var b = "main" === a ? 40 : 10
          , c = $("#editor-" + a + "-deck")
          , d = Editor.calculateCardSize()
          , e = Editor[a].length > b ? 15 : 10;
        b = Editor[a].length > b ? -.036 * $("#editor-main-deck").width() : 0;
        for (var f = 0; f < Editor[a].length; ++f) {
            var g = Editor[a][f]
              , h = g.data("banlist");
            h && (h.css("left", c.offset().left + f % e * (d.width + b) + "px"),
            h.css("top", c.offset().top + d.height * Math.floor(f / e) + "px"),
            h.css("width", .33 * d.width + "px"));
            if (g = g.data("region"))
                g.css("left", c.offset().left + f % e * (d.width + b) + "px"),
                g.css("top", c.offset().top + d.height * Math.floor(f / e) + (d.height - .33 * d.width) + "px"),
                g.css("width", .66 * d.width + "px")
        }
    },
    clear: function() {
        for (var a = ["main", "extra", "side"], b = 0; b < a.length; ++b) {
            for (var c = a[b], d = 0; d < Editor[c].length; ++d) {
                var e = Editor[c][d].data("banlist");
                e && e.remove();
                (e = Editor[c][d].data("region")) && e.remove();
                Editor[c][d].remove()
            }
            Editor[c] = []
        }
    },
    save: function() {
        Editor.updateDeck();
        $("#editor-save-button").addClass("engine-button-disabled");
        $.post("api/update-deck.php", {
            id: window.Deck.id,
            deck: JSON.stringify({
                main: window.Deck.main,
                extra: window.Deck.extra,
                side: window.Deck.side
            })
        }, function(a) {
            a.success || "no_changes" === a.error ? $("#editor-save-button").text("Saved!").delay(2E3).queue(function() {
                $(this).removeClass("engine-button-disabled").text("Save").dequeue()
            }) : $("#editor-save-button").text("Error while saving: " + a.error).delay(5E3).queue(function() {
                $(this).removeClass("engine-button-disabled").text("Save").dequeue()
            })
        }, "json")
    },
    sort: function() {
        Editor.detachCards();
        for (var a = ["main", "extra", "side"], b = 0; b < a.length; ++b) {
            var c = a[b];
            Editor[c].sort(function(a, b) {
                return Editor.compareCards(Engine.getCardData(a.data("id")), Engine.getCardData(b.data("id")))
            });
            Editor.updateBanlist(c)
        }
        Editor.attachCards()
    },
    compareCards: function(a, b) {
        if ((a.type & 7) != (b.type & 7))
            return (a.type & 7) - (b.type & 7);
        if (a.type & CardType.MONSTER) {
            var c = a.type & 75505856 ? a.type & 75505857 : a.type & 49
              , d = b.type & 75505856 ? b.type & 75505857 : b.type & 49;
            if (c != d)
                return c - d;
            if (a.level != b.level)
                return b.level - a.level;
            if (a.attack != b.attack)
                return b.attack - a.attack;
            if (a.defence != b.defence)
                return b.defence - a.defence
        } else if ((a.type & 4294967288) != (b.type & 4294967288))
            return (a.type & 4294967288) - (b.type & 4294967288);
        return a.id - b.id
    },
    shuffle: function() {
        Editor.detachCards();
        for (var a = ["main", "extra", "side"], b = 0; b < a.length; ++b) {
            var c = a[b];
            Editor.shuffleArray(Editor[c]);
            Editor.updateBanlist(c)
        }
        Editor.attachCards()
    },
    shuffleArray: function(a) {
        for (var b = a.length; 0 < b; ) {
            var c = Math.floor(Math.random() * b);
            b--;
            var d = a[b];
            a[b] = a[c];
            a[c] = d
        }
    },
    attachCards: function() {
        for (var a = ["main", "extra", "side"], b = 0; b < a.length; ++b)
            for (var c = a[b], d = $("#editor-" + c + "-deck"), e = 0; e < Editor[c].length; ++e)
                Editor[c][e].appendTo(d)
    },
    detachCards: function() {
        for (var a = ["main", "extra", "side"], b = 0; b < a.length; ++b)
            for (var c = a[b], d = 0; d < Editor[c].length; ++d)
                Editor[c][d].detach()
    },
    clearSearch: function() {
        Editor.searchResultsElement.empty()
    }
};
$(function() {
    window.Deck && Engine.init(Editor.init)
});
Engine.Audio = function() {
    this.sounds = {};
    this.volume = 1;
    this.musics = "3574-cut-trance-by-kevin-macleod.ogg 3859-harmful-or-fatal-by-kevin-macleod.ogg 3953-killing-time-by-kevin-macleod.ogg 3998-long-time-coming-by-kevin-macleod.ogg 4596-voltaic-by-kevin-macleod.ogg 5004-severe-tire-damage-by-kevin-macleod.ogg".split(" ")
}
;
Engine.Audio.prototype.loadRoom = function() {
    this.loadSound("chat-message", 2)
}
;
Engine.Audio.prototype.loadGame = function() {
    this.loadSound("activate", 2);
    this.loadSound("attack");
    this.loadSound("draw", 5);
    this.loadSound("life-damage", 2);
    this.loadSound("life-recover", 2);
    this.loadSound("next-phase");
    this.loadSound("next-turn");
    this.loadSound("set", 2);
    this.loadSound("shuffle");
    this.loadSound("summon");
    this.loadSound("summon-flip");
    this.loadSound("summon-special", 2);
    this.loadSound("equip", 2);
    this.loadSound("dice-roll");
    this.loadSound("coin-flip");
    this.loadSound("counter", 2)
}
;
Engine.Audio.prototype.getRandomMusic = function() {
    return Engine.getAssetPath("musics/" + this.musics[Math.floor(Math.random() * this.musics.length)])
}
;
Engine.Audio.prototype.play = function(a, b) {
    b = void 0 === b ? 1 : b;
    if (!(.001 > this.volume) && a in this.sounds)
        for (var c = 0; c < this.sounds[a].length; ++c)
            if (this.sounds[a][c].paused) {
                this.sounds[a][c].volume = this.volume * b;
                this.sounds[a][c].play();
                break
            }
}
;
Engine.Audio.prototype.loadSound = function(a, b) {
    b = void 0 !== b ? b : 1;
    this.sounds[a] = [];
    for (var c = 0; c < b; ++c) {
        var d = new Audio(Engine.getAssetPath("sounds/" + a + ".wav"));
        this.sounds[a].push(d)
    }
}
;
Engine.BanlistsManager = function() {
    this.banlists = []
}
;
Engine.BanlistsManager.VERSION = 30;
Engine.BanlistsManager.prototype.load = function(a) {
    jQuery.ajaxSetup({
        beforeSend: function(a) {
            a.overrideMimeType && a.overrideMimeType("application/json")
        }
    });
    var b = this;
    



    //banlist path

    jQuery.getJSON(Engine.getAssetPath("https://raw.githubusercontent.com/sunx2/service-api/master/banlists.json"), function(c) {
        b.banlists = c.banlists;
        a && a()
    })






}
;
Engine.BanlistsManager.prototype.getIndexFromHash = function(a) {
    for (var b = 0; b < this.banlists.length; ++b)
        if (this.banlists[b].hash == a)
            return b;
    return -1
}
;
Engine.BanlistsManager.prototype.getCardQuantity = function(a, b) {
    return -1 !== this.banlists[a].bannedIds.indexOf(b) ? 0 : -1 !== this.banlists[a].limitedIds.indexOf(b) ? 1 : -1 !== this.banlists[a].semiLimitedIds.indexOf(b) ? 2 : 3
}
;
Engine.CardData = function(a) {
    this.id = a.id;
    this.ot = a.ot || 0;
    this.alias = a.als || 0;
    this.setcodes = a.sc || [];
    this.type = a.typ || 0;
    this.attack = a.atk || 0;
    this.defence = a.def || 0;
    var b = a.lvl || 0;
    this.race = a.rac || 0;
    this.attribute = a.att || 0;
    this.category = a.cat || 0;
    this.level = b & 255;
    this.lscale = b >> 24 & 255;
    this.rscale = b >> 16 & 255
}
;
Engine.CardData.prototype.setTexts = function(a) {
    this.name = a.n;
    this.description = a.d;
    this.effects = a.s || [];
    this.cleanName = Engine.cleanText(this.name)
}
;
Engine.CardData.prototype.getEffectText = function(a) {
    return 0 <= a && a < this.effects.length ? this.effects[a] : null
}
;
Engine.database = {
    VERSION: 99
};
Engine.database.load = function(a) {
    jQuery.ajaxSetup({
        beforeSend: function(a) {
            a.overrideMimeType && a.overrideMimeType("application/json")
        }
    });
    jQuery.getJSON(Engine.getAssetPath("data/cards.json?v=" + Engine.database.VERSION), function(b) {
        Engine.database.cards = {};
        for (var c = 0; c < b.cards.length; ++c) {
            var d = b.cards[c];
            Engine.database.cards[d.id] = new Engine.CardData(d)
        }
        jQuery.getJSON(Engine.getAssetPath("data/cards_en.json?v=" + Engine.database.VERSION), function(b) {
            Engine.database.texts = {};
            for (var c = 0; c < b.texts.length; ++c) {
                var d = b.texts[c];
                Engine.database.cards[d.id] && Engine.database.cards[d.id].setTexts(d)
            }
            a && a()
        })
    })
}
;
var CardLocation = {
    DECK: 1,
    HAND: 2,
    MONSTER_ZONE: 4,
    SPELL_ZONE: 8,
    GRAVEYARD: 16,
    BANISHED: 32,
    EXTRA: 64,
    OVERLAY: 128,
    ON_FIELD: 12,
    FZONE: 256,
    PZONE: 512
}
  , CardPosition = {
    FACEUP_ATTACK: 1,
    FACEDOWN_ATTACK: 2,
    FACEUP_DEFENCE: 4,
    FACEDOWN_DEFENCE: 8,
    FACEUP: 5,
    FACEDOWN: 10,
    ATTACK: 3,
    DEFENCE: 12
}
  , CardType = {
    MONSTER: 1,
    SPELL: 2,
    TRAP: 4,
    NORMAL: 16,
    EFFECT: 32,
    FUSION: 64,
    RITUAL: 128,
    TRAPMONSTER: 256,
    SPIRIT: 512,
    UNION: 1024,
    DUAL: 2048,
    TUNER: 4096,
    SYNCHRO: 8192,
    TOKEN: 16384,
    QUICKPLAY: 65536,
    CONTINUOUS: 131072,
    EQUIP: 262144,
    FIELD: 524288,
    COUNTER: 1048576,
    FLIP: 2097152,
    TOON: 4194304,
    XYZ: 8388608,
    PENDULUM: 16777216,
    SPSUMMON: 33554432,
    LINK: 67108864
}
  , CardAttribute = {
    EARTH: 1,
    WATER: 2,
    FIRE: 4,
    WIND: 8,
    LIGHT: 16,
    DARK: 32,
    DIVINE: 64
}
  , CardRace = {
    WARRIOR: 1,
    SPELLCASTER: 2,
    FAIRY: 4,
    FIEND: 8,
    ZOMBIE: 16,
    MACHINE: 32,
    AQUA: 64,
    PYRO: 128,
    ROCK: 256,
    WINDBEAST: 512,
    PLANT: 1024,
    INSECT: 2048,
    THUNDER: 4096,
    DRAGON: 8192,
    BEAST: 16384,
    BEASTWARRIOR: 32768,
    DINOSAUR: 65536,
    FISH: 131072,
    SEASERPENT: 262144,
    REPTILE: 524288,
    PSYCHO: 1048576,
    DIVINEBEAST: 2097152,
    CREATORGOD: 4194304,
    WYRM: 8388608,
    CYBERSE: 16777216
}
  , LinkMarker = {
    BOTTOM_LEFT: 1,
    BOTTOM: 2,
    BOTTOM_RIGHT: 4,
    LEFT: 8,
    RIGHT: 32,
    TOP_LEFT: 64,
    TOP: 128,
    TOP_RIGHT: 256
}
  , GamePhase = {
    DRAW: 1,
    STANDBY: 2,
    MAIN1: 4,
    BATTLE_START: 8,
    BATTLE_STEP: 16,
    DAMAGE: 32,
    DAMAGE_CAL: 64,
    BATTLE: 128,
    MAIN2: 256,
    END: 512
}
  , OpCode = {
    ADD: 1073741824,
    SUB: 1073741825,
    MUL: 1073741826,
    DIV: 1073741827,
    AND: 1073741828,
    OR: 1073741829,
    NEG: 1073741830,
    NOT: 1073741831,
    IS_CODE: 1073742080,
    IS_SET_CARD: 1073742081,
    IS_TYPE: 1073742082,
    IS_RACE: 1073742083,
    IS_ATTRIBUTE: 1073742084
}
  , MainPhaseAction = {
    SUMMON: 0,
    SP_SUMMON: 1,
    REPOS: 2,
    SET_MONSTER: 3,
    SET_SPELL: 4,
    ACTIVATE: 5,
    TO_BATTLE_PHASE: 6,
    TO_END_PHASE: 7
}
  , BattlePhaseAction = {
    ACTIVATE: 0,
    ATTACK: 1,
    TO_MAIN_PHASE_2: 2,
    TO_END_PHASE: 3
};
var I18n = {
    types: {},
    attributes: {},
    races: {},
    core: {},
    locations: {},
    phases: {},
    init: function() {
        for (var a in CardType) {
            var b = CardType[a];
            I18n.types[b] = I18n.en.types[a]
        }
        I18n.types[0] = "?";
        for (a in CardAttribute)
            b = CardAttribute[a],
            I18n.attributes[b] = I18n.en.attributes[a];
        I18n.attributes[0] = "?";
        for (a in CardRace)
            b = CardRace[a],
            I18n.races[b] = I18n.en.races[a];
        I18n.races[0] = "?";
        for (a in CardLocation)
            b = CardLocation[a],
            I18n.locations[b] = I18n.en.locations[a];
        for (a in GamePhase)
            b = GamePhase[a],
            I18n.phases[b] = I18n.en.phases[a];
        I18n.core = I18n.en.core;
        I18n.victory = I18n.en.victory;
        I18n.counter = I18n.en.counter
    },
    en: {}
};
I18n.en.types = {
    MONSTER: "Monster",
    SPELL: "Spell",
    TRAP: "Trap",
    NORMAL: "Normal",
    EFFECT: "Effect",
    FUSION: "Fusion",
    RITUAL: "Ritual",
    TRAPMONSTER: "Trap-Monster",
    SPIRIT: "Spirit",
    UNION: "Union",
    DUAL: "Dual",
    TUNER: "Tuner",
    SYNCHRO: "Synchro",
    TOKEN: "Token",
    QUICKPLAY: "Quick-Play",
    CONTINUOUS: "Continuous",
    EQUIP: "Equip",
    FIELD: "Field",
    COUNTER: "Counter",
    FLIP: "Flip",
    TOON: "Toon",
    XYZ: "Xyz",
    PENDULUM: "Pendulum",
    SPSUMMON: "SpSummon",
    LINK: "Link"
};
I18n.en.attributes = {
    EARTH: "Earth",
    WATER: "Water",
    FIRE: "Fire",
    WIND: "Wind",
    LIGHT: "Light",
    DARK: "Dark",
    DIVINE: "Divine"
};
I18n.en.races = {
    WARRIOR: "Warrior",
    SPELLCASTER: "Spellcaster",
    FAIRY: "Fairy",
    FIEND: "Fiend",
    ZOMBIE: "Zombie",
    MACHINE: "Machine",
    AQUA: "Aqua",
    PYRO: "Pyro",
    ROCK: "Rock",
    WINDBEAST: "Winged Beast",
    PLANT: "Plant",
    INSECT: "Insect",
    THUNDER: "Thunder",
    DRAGON: "Dragon",
    BEAST: "Beast",
    BEASTWARRIOR: "Beast-Warrior",
    DINOSAUR: "Dinosaur",
    FISH: "Fish",
    SEASERPENT: "Sea Serpent",
    REPTILE: "Reptile",
    PSYCHO: "Psychic",
    DIVINEBEAST: "Divine-Beast",
    CREATORGOD: "Creator God",
    WYRM: "Wyrm",
    CYBERSE: "Cyberse"
};
I18n.en.locations = {
    DECK: "Deck",
    HAND: "Hand",
    MONSTER_ZONE: "Monster Zone",
    SPELL_ZONE: "Spell/Trap Zone",
    GRAVEYARD: "Graveyard",
    BANISHED: "Banished Zone",
    EXTRA: "Extra Deck"
};
I18n.en.phases = {
    DRAW: "Draw Phase",
    STANDBY: "Standby Phase",
    MAIN1: "Main Phase 1",
    BATTLE_START: "Battle Phase",
    MAIN2: "Main Phase 2",
    END: "End Phase"
};
I18n.en.core = {
    1: "Normal Summon",
    2: "Special Summon",
    3: "Flip Summon",
    4: "Normal Summoned",
    5: "Special Summoned",
    6: "Flip Summoned",
    7: "Activate",
    10: "Remove the Counter(s)",
    11: "Pay LP",
    12: "Remove the Material(s)",
    20: "Draw Phase",
    21: "Standby Phase",
    22: "Main Phase",
    23: "End of Main Phase",
    24: "Battle Phase",
    25: "End of Battle Phase",
    26: "End Phase",
    27: "Before the Draw",
    28: "Start Step of Battle Phase",
    30: "Replay, do you want to continue the Battle?",
    31: "Do you want to Attack Directly?",
    40: "Damage Step",
    41: "Calculating Damage",
    42: "End of Damage Step",
    43: "At the start of the Damage Step",
    60: "Heads",
    61: "Tails",
    62: "Heads\u00a0effect",
    63: "Tails\u00a0effect",
    64: "Gemini",
    70: "Monster Cards",
    71: "Spell Cards",
    72: "Trap Cards",
    80: "Entering the Battle Phase",
    81: "Entering the End Phase",
    90: "Normal Summon without tribute(s)?",
    91: "Use your additional Special Summon?",
    92: "Use Opponent Monster",
    93: "Do you want to continue to choose the material?",
    1050: "Monster",
    1051: "Spell",
    1052: "Trap",
    1054: "Normal",
    1055: "Effect",
    1056: "Fusion",
    1057: "Ritual",
    1058: "Trap\u00a0Monsters",
    1059: "Spirit",
    1060: "Union",
    1061: "Gemini",
    1062: "Tuner",
    1063: "Synchro",
    1066: "Quick-Play",
    1067: "Continuous",
    1068: "Equip",
    1069: "Field",
    1070: "Counter",
    1071: "Flip",
    1072: "Toon",
    1073: "Xyz",
    1074: "Pendulum",
    1075: "Special summon",
    1076: "Link",
    1064: "Token",
    1150: "Activate",
    1151: "Normal\u00a0Summon",
    1152: "Special\u00a0Summon",
    1153: "Set",
    1154: "Flip\u00a0Summon",
    1155: "To\u00a0Defense",
    1156: "To\u00a0Attack",
    1157: "Attack",
    1158: "View",
    1159: "S/T\u00a0Set",
    1160: "Put\u00a0in\u00a0Pendulum\u00a0Zone",
    1161: "Resolve\u00a0effect",
    1162: "Reset\u00a0effect",
    1163: "Spiritual call",
    1213: "Yes",
    1214: "No"
};
I18n.en.victory = {
    0: "Surrendered",
    1: "LP reached 0",
    2: "Cards can't be drawn",
    3: "Time limit up",
    4: "Lost connection",
    16: "Victory by the effect of Exodia",
    17: "Victory by the effect of Final Countdown",
    18: "Victory by the effect of Vennominaga",
    19: "Victory by the effect of Horakhty",
    20: "Victory by the effect of Exodius",
    21: "Victory by the effect of Destiny Board",
    22: "Victory by the effect of Last Turn",
    23: "Victory by the effect of Number 88: Gimmick Puppet - Destiny Leo",
    24: "Victory by the effect of Number C88: Gimmick Puppet Disaster Leo",
    25: "Victory by the effect of Jackpot 7",
    26: "Victory by the effect of Relay Soul",
    27: "Victory by the effect of Ghostrick Angel of Mischief",
    28: "Victory by the effect of Phantasm Spiral Assault",
    73: "Victory by the effect of Deuce"
};
I18n.en.counter = {
    1: "Spell\u00a0Counter",
    4098: "Wedge\u00a0Counter",
    3: "Bushido\u00a0Counter",
    4: "Psychic\u00a0Counter",
    5: "Shine\u00a0Counter",
    6: "Gem\u00a0Counter",
    7: "Counter(Colosseum\u00a0Cage\u00a0of\u00a0the\u00a0Gladiator\u00a0Beasts)",
    8: "D\u00a0Counter",
    4105: "Venom\u00a0Counter",
    10: "Genex\u00a0Counter",
    11: "Counter(Ancient\u00a0Gear\u00a0Castle)",
    12: "Thunder\u00a0Counter",
    13: "Greed\u00a0Counter",
    4110: "A-Counter",
    15: "Worm\u00a0Counter",
    16: "Black\u00a0Feather\u00a0Counter",
    17: "Hyper\u00a0Venom\u00a0Counter",
    18: "Karakuri\u00a0Counter",
    19: "Chaos\u00a0Counter",
    20: "Counter(Miracle\u00a0Jurassic\u00a0Egg)",
    4117: "Ice\u00a0Counter",
    22: "Spellstone\u00a0Counter",
    23: "Nut\u00a0Counter",
    24: "Flower\u00a0Counter",
    4121: "Fog\u00a0Counter",
    26: "Double\u00a0Counter",
    27: "Clock\u00a0Counter",
    28: "D\u00a0Counter",
    29: "Junk\u00a0Counter",
    30: "Gate\u00a0Counter",
    31: "Counter(B.E.S.)",
    32: "Plant\u00a0Counter",
    4129: "Guard\u00a0Counter",
    34: "Dragonic\u00a0Counter",
    35: "Ocean\u00a0Counter",
    4132: "String\u00a0Counter",
    37: "Chronicle\u00a0Counter",
    38: "Counter(Metal\u00a0Shooter)",
    39: "Counter(Des\u00a0Mosquito)",
    40: "Counter\u00a0(Dark\u00a0Catapulter)",
    41: "Counter(Balloon\u00a0Lizard)",
    4138: "Counter(Magic\u00a0Reflector)",
    43: "Destiny\u00a0Counter",
    44: "You\u00a0Got\u00a0It\u00a0Boss!\u00a0Counter",
    45: "Counter(Kickfire)",
    46: "Shark\u00a0Counter",
    47: "Pumpkin\u00a0Counter",
    48: "Feel\u00a0the\u00a0Flow\u00a0Counter",
    49: "Rising\u00a0Sun\u00a0Counter",
    50: "Balloon\u00a0Counter",
    51: "Yosen\u00a0Counter",
    52: "Counter(BOXer)",
    53: "Symphonic\u00a0Counter",
    54: "Performage\u00a0Counter",
    55: "Kaiju\u00a0Counter",
    4152: "Cubic\u00a0Counter",
    4153: "Zushin\u00a0Counter",
    64: "Counter(Number\u00a051:\u00a0Finish\u00a0Hold\u00a0the\u00a0Amazing)",
    4161: "Predator\u00a0Counter",
    66: "Counter(Fire\u00a0Cracker)",
    67: "Defect Counter",
    144: "Maiden Counter",
    145: "Speed Counter",
    146: "Plasma Counter",
    147: "Sacred Counter",
    148: "Pumpkin Counter",
    149: "Rising Sun Counter"
};
Engine.Storage = function() {
    this.load()
}
;
Engine.Storage.prototype.load = function() {
    var a = localStorage.getItem("engine-storage");
    if (a) {
        a = JSON.parse(a);
        for (var b in a)
            this[b] = a[b]
    }
}
;
Engine.Storage.prototype.save = function() {
    var a = JSON.stringify(this);
    localStorage.setItem("engine-storage", a)
}
;
Engine.UI = function() {
    this.currentCardId = 0;
    this.currentCard = null
}
;
Engine.UI.prototype.setCardInfo = function(a) {
    if (!(0 >= a) && this.currentCardId !== a && (this.currentCardId = a,
    a = Engine.getCardData(a))) {
        $("#card-name").text(a.name);
        $("#card-description").html(Engine.textToHtml(a.description));
        $("#card-id").text(a.alias ? a.id + " [" + a.alias + "]" : a.id);
        Engine.setCardImageElement($("#card-picture"), a.id);
        var b = [];
        for (d in CardType) {
            var c = CardType[d];
            a.type & c && b.push(I18n.types[c])
        }
        $(".card-types").text(b.join("|"));
        if (a.type & CardType.MONSTER)
            if ($("#card-if-monster").show(),
            $("#card-if-spell").hide(),
            $("#card-race").text(I18n.races[a.race]),
            $("#card-attribute").text(I18n.attributes[a.attribute]),
            $("#card-atk").text(a.attack),
            a.type & CardType.LINK) {
                $("#card-def").text("LINK-" + a.level);
                var d = "";
                a.defence & LinkMarker.TOP_LEFT && (d += "&#8598;");
                a.defence & LinkMarker.TOP && (d += "&#8593;");
                a.defence & LinkMarker.TOP_RIGHT && (d += "&#8599;");
                a.defence & LinkMarker.LEFT && (d += "&#8592;");
                a.defence & LinkMarker.RIGHT && (d += "&#8594;");
                a.defence & LinkMarker.BOTTOM_LEFT && (d += "&#8601;");
                a.defence & LinkMarker.BOTTOM && (d += "&#8595;");
                a.defence & LinkMarker.BOTTOM_RIGHT && (d += "&#8600;");
                $("#card-level").html(d)
            } else {
                $("#card-def").text(a.defence);
                d = "";
                for (b = 0; b < a.level; ++b)
                    d += "&#9733;";
                $("#card-level").html(d)
            }
        else
            $("#card-if-monster").hide(),
            $("#card-if-spell").show()
    }
}
;
Engine.UI.prototype.setCardTooltip = function(a, b) {
    if (this.currentCard !== b && (this.currentCard = b,
    null !== b)) {
        var c = Engine.getCardData(b.code);
        c ? a.find(".card-name").text(c.name) : a.find(".card-name").text("id: " + b.code);
        b.type & CardType.MONSTER ? (a.find(".card-if-monster").show(),
        a.find(".card-race").text(I18n.races[b.race]),
        a.find(".card-attribute").text(I18n.attributes[b.attribute]),
        a.find(".card-attack").text(b.attack),
        a.find(".card-defence").text(b.type & CardType.LINK ? "LINK-" + b.linkRating : b.defence),
        a.find(".card-level").html(b.type & CardType.XYZ ? b.rank : b.level)) : a.find(".card-if-monster").hide();
        b.type & CardType.LINK ? a.find(".card-if-not-link").hide() : a.find(".card-if-not-link").show();
        if (0 < Object.keys(b.counters).length) {
            c = "";
            var d = !0, e;
            for (e in b.counters)
                d || (c += "<br>"),
                d = !1,
                c += b.counters[e] + " \u00d7 " + I18n.counter[e];
            a.find(".card-counters").text(c).show()
        } else
            a.find(".card-counters").hide()
    }
}
;
Game.Card = function(a, b) {
    this.code = a || 0;
    this.alias = 0;
    this.type = CardType.MONSTER;
    this.controller = this.owner = this.rightScale = this.leftScale = this.baseDefence = this.baseAttack = this.defence = this.attack = this.race = this.attribute = this.rank = this.level = 0;
    this.location = CardLocation.DECK;
    this.sequence = 0;
    this.position = b || CardPosition.FACEUP_ATTACK;
    this.isDisabled = !1;
    this.overlays = [];
    this.counters = {};
    this.linkArrows = this.linkRating = 0;
    this.zoneElement = null;
    this.imgElement = $("<img>").addClass("game-field-card");
    this.negatedElement = this.levelElement = this.textElement = null;
    this.sumValue = 0
}
;
Game.Card.prototype.setOwner = function(a) {
    this.owner = a;
    return this
}
;
Game.Card.calculateRotation = function(a, b, c) {
    a = 1 == a ? 180 : 0;
    b & CardLocation.MONSTER_ZONE && c & CardPosition.DEFENCE && (a -= 90);
    return a
}
;
Game.Card.calculateVisibleCode = function(a, b, c) {
    return a & CardLocation.HAND || b & CardPosition.FACEUP ? c : 0
}
;
Game.Card.prototype.prepareMovement = function() {
    this.previousPictureOffset = this.imgElement.offset();
    this.previousPictureRotation = this.currentPictureRotation;
    this.previousPictureCode = this.currentPictureCode
}
;
Game.Card.prototype.applyMovement = function(a, b, c, d) {
    var e = this.imgElement.offset()
      , f = Game.Card.calculateRotation(this.controller, this.location, b)
      , g = Game.Card.calculateVisibleCode(this.location, b, a)
      , h = f - this.previousPictureRotation
      , k = !1;
    this.previousPictureCode !== g && (k = !0);
    null !== this.textElement && (this.textElement.hide(),
    this.levelElement.hide());
    this.code = a;
    this.position = b;
    var l = this;
    $("<div />").animate({
        height: 1
    }, {
        duration: c,
        step: function(a, b) {
            a = b.pos;
            b = "translate(" + (l.previousPictureOffset.left - e.left) * (1 - a) + "px, " + (l.previousPictureOffset.top - e.top) * (1 - a) + "px)";
            b += " rotate(" + (l.previousPictureRotation + h * a) + "deg)";
            k && (.5 < a && l.setPicture(g),
            b += " scalex(" + Math.abs(1 - 2 * a) + ")");
            l.imgElement.css("transform", b)
        },
        complete: function() {
            null !== l.textElement && (l.textElement.show(),
            l.levelElement.show());
            l.imgElement.css("position", "");
            l.updatePosition();
            d()
        }
    })
}
;
Game.Card.prototype.fadeIn = function(a, b) {
    this.imgElement.css("opacity", 0).animate({
        opacity: 1
    }, {
        duration: a,
        complete: b
    })
}
;
Game.Card.prototype.fadeOut = function(a, b) {
    this.imgElement.css("opacity", 1).animate({
        opacity: 0
    }, {
        duration: a,
        complete: b
    })
}
;
Game.Card.prototype.setCode = function(a) {
    this.code = a;
    (a = Engine.getCardData(a)) ? (this.type = a.type,
    this.level = this.type & CardType.XYZ ? 0 : a.level,
    this.rank = this.type & CardType.XYZ ? a.level : 0,
    this.linkRating = this.type & CardType.LINK ? a.level : 0,
    this.attribute = a.attribute,
    this.race = a.race,
    this.attack = a.attack,
    this.defence = a.defence,
    this.baseAttack = a.attack,
    this.baseDefence = a.defence,
    this.leftScale = a.lscale,
    this.rightScale = a.rscale) : (this.type = CardType.MONSTER,
    this.rightScale = this.leftScale = this.baseDefence = this.baseAttack = this.defence = this.attack = this.race = this.attribute = this.linkRating = this.rank = this.level = 0)
}
;
Game.Card.prototype.setPosition = function(a) {
    this.position = a;
    this.updatePosition()
}
;
Game.Card.prototype.animateSelection = function(a) {
    this.imgElement.animate({
        opacity: .5
    }, {
        duration: 100 * Game.animationSpeedMultiplier
    }).animate({
        opacity: 1
    }, {
        duration: 100 * Game.animationSpeedMultiplier
    }).animate({
        opacity: .5
    }, {
        duration: 100 * Game.animationSpeedMultiplier
    }).animate({
        opacity: 1
    }, {
        duration: 100 * Game.animationSpeedMultiplier
    }).animate({
        opacity: .5
    }, {
        duration: 100 * Game.animationSpeedMultiplier
    }).animate({
        opacity: 1
    }, {
        duration: 100 * Game.animationSpeedMultiplier,
        complete: a
    })
}
;
Game.Card.prototype.setData = function(a) {
    this.alias = a.alias;
    this.attack = a.attack;
    this.defence = a.defence;
    this.baseAttack = a.baseAttack;
    this.baseDefence = a.baseDefence;
    this.level = a.level;
    this.rank = a.rank;
    this.leftScale = a.leftScale;
    this.rightScale = a.rightScale;
    this.attribute = a.attribute;
    this.race = a.race;
    this.owner = a.owner;
    this.type = a.type;
    this.isDisabled = a.isDisabled;
    this.linkRating = a.link;
    this.linkArrows = a.linkMarkers;
    this.code !== a.code && (this.code = a.code,
    this.updateCode());
    null !== a.locationInfo && this.position !== a.locationInfo.position && (this.position = a.locationInfo.position,
    this.updatePosition());
    this.updateText();
    this.updateNegated()
}
;
Game.Card.prototype.setSequence = function(a) {
    this.sequence = a;
    this.updateSequence();
    for (var b = 0; b < this.overlays.length; ++b)
        this.overlays[b].setSequence(a)
}
;
Game.Card.prototype.updateSequence = function() {
    this.imgElement.data("sequence", this.sequence);
    if (this.location & CardLocation.DECK || this.location & CardLocation.GRAVEYARD || this.location & CardLocation.BANISHED || this.location & CardLocation.EXTRA) {
        var a = 0 == this.controller ? 1 : -1;
        a *= this.location & CardLocation.EXTRA ? -1 : 1;
        this.imgElement.css("left", a * this.sequence * .3 + "%");
        this.imgElement.css("top", .3 * -this.sequence + "%")
    } else
        this.imgElement.css("left", ""),
        this.imgElement.css("top", "")
}
;
Game.Card.prototype.removeFromField = function(a) {
    if (null !== this.zoneElement)
        if (this.zoneElement = null,
        a) {
            var b = this;
            this.imgElement.fadeOut(300 * Game.animationSpeedMultiplier, "linear", function() {
                b.detachFieldElements()
            })
        } else
            this.detachFieldElements();
    for (a = 0; a < this.overlays.length; ++a)
        this.overlays[a].removeFromField()
}
;
Game.Card.prototype.detachFieldElements = function() {
    this.imgElement.off("mouseover");
    this.imgElement.off("mouseleave");
    this.imgElement.off("click");
    this.imgElement.detach();
    null !== this.textElement && (this.textElement.detach(),
    this.levelElement.detach());
    null !== this.negatedElement && (this.negatedElement.remove(),
    this.negatedElement = null)
}
;
Game.Card.prototype.updateLocation = function(a) {
    this.removeFromField(!1);
    if (-1 !== this.controller) {
        this.zoneElement = Game.fields[this.controller].getZone(this.location & ~CardLocation.OVERLAY, this.sequence);
        this.zoneElement.append(this.imgElement);
        this.location === CardLocation.MONSTER_ZONE && (null === this.textElement && (this.textElement = $("<p>").addClass("game-field-stats-text"),
        this.levelElement = $("<p>")),
        this.zoneElement.append(this.textElement),
        this.zoneElement.append(this.levelElement),
        1 == this.controller ? (this.textElement.css("top", "0px").css("bottom", "auto"),
        this.levelElement.css("top", "auto").css("bottom", "-10px").css("left", "35%").css("right", "auto")) : (this.textElement.css("top", "auto").css("bottom", "-10px"),
        this.levelElement.css("top", "0px").css("bottom", "auto").css("left", "-35%").css("right", "auto")));
        this.updateSequence();
        this.imgElement.data("controller", this.controller).data("location", this.location);
        this.imgElement.off("mouseover").off("mouseleave");
        if (this.location & CardLocation.HAND)
            this.imgElement.on("mouseover", function() {
                var a = $(this).data("controller")
                  , c = $(this).data("location")
                  , d = $(this).data("sequence");
                Game.onCardHovered(a, c, d)
            }).on("mouseleave", function() {
                var a = $(this).data("controller")
                  , c = $(this).data("location")
                  , d = $(this).data("sequence");
                Game.onCardLeft(a, c, d)
            }).on("click", function() {
                var a = $(this).data("controller")
                  , c = $(this).data("location")
                  , d = $(this).data("sequence");
                Game.onCardClicked(a, c, d)
            });
        else
            this.imgElement.css("margin-left", ""),
            this.imgElement.css("height", "");
        this.imgElement.css("z-index", this.location & CardLocation.OVERLAY ? "1" : this.location & CardLocation.HAND ? "3" : "2");
        a || (this.updatePosition(),
        this.updateText())
    }
}
;
Game.Card.prototype.updatePosition = function() {
    var a = 1 == this.controller ? 180 : 0;
    this.location & CardLocation.MONSTER_ZONE && this.position & CardPosition.DEFENCE && (a -= 90);
    this.currentPictureRotation = a;
    this.imgElement.data("rotation", a);
    this.imgElement.css("transform", "rotate(" + a + "deg)");
    this.updateCode()
}
;
Game.Card.prototype.updateCode = function() {
    var a = this.location & CardLocation.HAND || this.position & CardPosition.FACEUP ? this.code : 0;
    this.imgElement.data("code") !== a && (this.imgElement.data("code", a),
    this.setPicture(a))
}
;
Game.Card.prototype.updateText = function() {
    this.location === CardLocation.MONSTER_ZONE && 0 !== this.code && (this.textElement.text(this.attack + "/" + (this.type & CardType.LINK ? "L-" + this.linkRating : this.defence)),
    this.levelElement.text(this.type & CardType.XYZ ? "R" + this.rank : this.type & CardType.LINK ? "" : "L" + this.level))
}
;
Game.Card.prototype.updateNegated = function() {
    this.isDisabled && this.location & CardLocation.ON_FIELD ? null === this.negatedElement && (this.negatedElement = $("<img>").addClass("game-card-negated").attr("src", Engine.getAssetPath("images/negated.png")),
    this.zoneElement.append(this.negatedElement)) : null !== this.negatedElement && (this.negatedElement.remove(),
    this.negatedElement = null)
}
;
Game.Card.prototype.setPicture = function(a) {
    this.currentPictureCode = a;
    0 === a ? Engine.setCardImageElementToSleeve(this.imgElement, Game.getSleevePath(this.owner)) : Engine.setCardImageElement(this.imgElement, a)
}
;
Game.Field = function(a) {
    this.player = "player" == a ? 0 : 1;
    this.namespace = "#game-field-" + a + "-";
    this.zones = {};
    this.cards = {};
    this.numbers = {};
    this.addZone(CardLocation.HAND, "hand");
    this.addZone(CardLocation.DECK, "deck");
    this.addZone(CardLocation.EXTRA, "extra");
    this.addZone(CardLocation.GRAVEYARD, "graveyard");
    this.addZone(CardLocation.BANISHED, "banished");
    this.addBigZone(CardLocation.MONSTER_ZONE, "monster", 4 <= Game.masterRule ? 7 : 5);
    this.addBigZone(CardLocation.SPELL_ZONE, "spell", 4 <= Game.masterRule ? 6 : 8)
}
;
Game.Field.prototype.clear = function() {
    this.removeAllCardsAtLocation(CardLocation.HAND, !1);
    this.removeAllCardsAtLocation(CardLocation.DECK, !1);
    this.removeAllCardsAtLocation(CardLocation.EXTRA, !1);
    this.removeAllCardsAtLocation(CardLocation.GRAVEYARD, !1);
    this.removeAllCardsAtLocation(CardLocation.BANISHED, !1);
    this.removeAllCardsAtLocation(CardLocation.MONSTER_ZONE, !1);
    this.removeAllCardsAtLocation(CardLocation.SPELL_ZONE, !1)
}
;
Game.Field.prototype.addCard = function(a, b, c, d) {
    a.controller = this.player;
    a.location = b;
    for (var e = 0; e < a.overlays.length; ++e)
        a.overlays[e].controller = a.controller,
        a.overlays[e].location = a.location | CardLocation.OVERLAY;
    b & CardLocation.OVERLAY ? (b &= ~CardLocation.OVERLAY,
    this.cards[b][c].overlays.push(a)) : b & CardLocation.MONSTER_ZONE || b & CardLocation.SPELL_ZONE ? this.cards[b][c] = a : -1 === c ? this.cards[b].push(a) : this.cards[b].splice(c, 0, a);
    this.resetSequences(b);
    a.updateLocation(d);
    for (e = 0; e < a.overlays.length; ++e)
        a.overlays[e].updateLocation();
    this.relocateSequences(b);
    b & CardLocation.HAND && this.resizeHand();
    this.updateLocationNumber(b)
}
;
Game.Field.prototype.removeCard = function(a, b) {
    var c = a.location
      , d = a.sequence;
    a.controller = -1;
    a.sequence = -1;
    a.location = -1;
    if (c & CardLocation.OVERLAY) {
        c &= ~CardLocation.OVERLAY;
        var e = this.cards[c][d].overlays.indexOf(a);
        -1 < e && this.cards[c][d].overlays.splice(e, 1)
    } else
        for (c & CardLocation.MONSTER_ZONE || c & CardLocation.SPELL_ZONE ? this.cards[c][d] = null : (this.cards[c].splice(d, 1),
        this.resetSequences(c)),
        d = 0; d < a.overlays.length; ++d)
            a.overlays[d].controller = -1,
            a.overlays[d].sequence = -1,
            a.overlays[d].location = -1,
            a.overlays[d].updateLocation();
    a.updateLocation(b);
    c & CardLocation.HAND && this.resizeHand();
    this.updateLocationNumber(c)
}
;
Game.Field.prototype.removeAllCardsAtLocation = function(a, b) {
    for (var c = 0; c < this.cards[a].length; ++c) {
        var d = this.cards[a][c];
        d && (d.controller = -1,
        d.sequence = -1,
        d.location = -1,
        d.removeFromField(b));
        if (a === CardLocation.MONSTER_ZONE || a === CardLocation.SPELL_ZONE)
            this.cards[a][c] = null
    }
    a !== CardLocation.MONSTER_ZONE && a !== CardLocation.SPELL_ZONE && (this.cards[a] = []);
    a & CardLocation.HAND && this.resizeHand();
    this.updateLocationNumber(a)
}
;
Game.Field.prototype.resetSequences = function(a) {
    for (var b = 0; b < this.cards[a].length; ++b)
        null !== this.cards[a][b] && this.cards[a][b].setSequence(b)
}
;
Game.Field.prototype.relocateSequences = function(a) {
    if (a != CardLocation.MONSTER_ZONE && a != CardLocation.SPELL_ZONE) {
        var b = 1 == this.player && a == CardLocation.HAND
          , c = this.zones[a].children().sort(function(a, c) {
            a = $(a).data("sequence") || -1;
            c = $(c).data("sequence") || -1;
            return b ? c - a : a - c
        });
        this.zones[a].append(c)
    }
}
;
Game.Field.prototype.updateLocationNumber = function(a) {
    if (a == CardLocation.DECK || a == CardLocation.EXTRA || a == CardLocation.GRAVEYARD || a == CardLocation.BANISHED) {
        this.numbers[a] || (this.numbers[a] = $("<p>").appendTo(this.zones[a]).css("bottom", "-10px"));
        var b = this.cards[a].length;
        this.numbers[a].text(0 == b ? "" : b)
    }
}
;
Game.Field.prototype.getZone = function(a, b) {
    return a & CardLocation.MONSTER_ZONE || a & CardLocation.SPELL_ZONE ? this.zones[a][b] : this.zones[a]
}
;
Game.Field.prototype.getCard = function(a, b, c) {
    -1 === b && (b = this.cards[a].length - 1);
    return a & CardLocation.OVERLAY ? (a &= ~CardLocation.OVERLAY,
    this.cards[a][b].overlays[c]) : this.cards[a][b]
}
;
Game.Field.prototype.addZone = function(a, b) {
    this.cards[a] = [];
    b = $(this.namespace + b).data("player", this.player).data("location", a).data("index", -1);
    this.zones[a] = $("<div>").addClass("game-field-zone-content").appendTo(b)
}
;
Game.Field.prototype.addBigZone = function(a, b, c) {
    this.zones[a] = [];
    this.cards[a] = [];
    for (var d = 0; d < c; ++d)
        if (this.cards[a][d] = null,
        "monster" === b && 5 <= d) {
            var e = d - 5;
            1 === this.player && (e = 1 - e);
            e = $("#game-field-extra-monster" + (e + 1));
            0 === this.player ? (e.data("player", -1).data("location", a).data("index", d),
            this.zones[a].push($("<div>").addClass("game-field-zone-content").appendTo(e))) : this.zones[a].push(e.children())
        } else
            e = $(this.namespace + b + (d + 1)).data("player", this.player).data("location", a).data("index", d),
            this.zones[a].push($("<div>").addClass("game-field-zone-content").appendTo(e))
}
;
Game.Field.prototype.shuffleDeck = function() {
    for (var a = 0; a < this.cards[CardLocation.DECK].length; ++a)
        this.cards[CardLocation.DECK][a].setCode(0)
}
;
Game.Field.prototype.resizeHand = function() {
    var a = Math.floor(5 * Game.zoneWidth / (this.cards[CardLocation.HAND].length + 1)) - Game.cardWidth - 1;
    3 < a && (a = 3);
    for (var b = 0; b < this.cards[CardLocation.HAND].length; ++b)
        this.cards[CardLocation.HAND][b].imgElement.css("margin-left", (b == (0 == this.player ? 0 : this.cards[CardLocation.HAND].length - 1) ? 0 : a) + "px"),
        this.cards[CardLocation.HAND][b].imgElement.css("height", Math.floor(Game.cardHeight) + "px")
}
;
