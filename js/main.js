'use strict';

//CONST VARIABLES

const MINE = '💣';
const BLOWMINE = '💥';
const FLAG = '🚩';
const EMPTY = ' ';

// GLOBAL VARIABLES
var gMaxScoreEasy = 0;
var gMaxScoreMedium = 0;
var gMaxScoreHard = 0;
var gNextId = 100;
var gSmiley = null;
var gCountLifes = null;
var gField;
var gGame = null;
var gGameCount = 0;
var gLevel = {
    size: 4,
    mines: 2
}


// LOADDING FUNCTIONS

function init(diff, NumOfMines) {
    clearInterval(gTimeInterval);
    loadBestScore();
    resetTime();
    resetSmiley();
    resetHint();
    resetLifes(diff);
    gGameCount = 0;
    document.querySelector('.modal').style.display = 'none';
    gUndoMoves = [];
    gGame = {
        isOn: true,
        shownCount: 0,
        markedCount: 0,
        secsPassed: 0
    }
    if (gManualBool) {
        gLevel = {
            size: diff,
            mines: NumOfMines
        }
        creatBoard(gLevel.size);
        renderField();
    } else if (diff === undefined) {
        gLevel = {
            size: 4,
            mines: 2
        }
        creatField(gLevel.size, gLevel.mines);
    } else {
        gLevel = {
            size: diff,
            mines: NumOfMines
        }
        creatField(gLevel.size, gLevel.mines);
    }
    renderField();
}

function creatField(diff, NumOfMines) {
    creatBoard(diff);
    getMinesOnBoard(NumOfMines);
    for (var i = 0; i < gLevel.size; i++) {
        for (var j = 0; j < gLevel.size; j++) {
            var pos = { i: i, j: j };
            if (gField[i][j] === MINE) continue;
            gField[i][j].minesAroundCount = setMinesNegsCount(gField, pos);
        }
    }
}

function renderField() {
    if (!gGame.isOn) { return };
    var htmlStr = '';
    for (var i = 0; i < gLevel.size; i++) {
        htmlStr += '<tr>';
        for (var j = 0; j < gLevel.size; j++) {
            var item = ' ';
            if (gField[i][j].isShown || gField[i][j].isMarked) {
                if (gField[i][j].isMarked === true) {
                    item = FLAG;
                } else if (gField[i][j].isMine === true) {
                    item = MINE;
                } else if (gField[i][j].minesAroundCount !== 0) {
                    item = gField[i][j].minesAroundCount;
                } else {
                    item = EMPTY;
                }
            }
            var id = gField[i][j].id;
            var className = (item + '');
            var bgc = '';
            if (gField[i][j].isShown) bgc += 'cell2';
            else bgc += 'cell';
            className += `cell-${i}-${j}`;
            htmlStr += `<td class = "${bgc} ${className}" id = "${id}" onclick = "cellClicked(this , ${i}, ${j})" data-i = "${i}" data-j = "${j}"  
            oncontextmenu="cellMarked(${i},${j})" data-i = "${i}" data-j = "${j}">${item}</td>`;
        }
        htmlStr += '</tr>';
    }
    var elTable = document.querySelector('.field');;
    elTable.innerHTML = htmlStr;
}


function getMinesOnBoard(NumOfMines) {
    while (NumOfMines !== 0) {
        var idx1 = getInexlusiveRandomNum(gLevel.size - 1, 0);
        var idx2 = getInexlusiveRandomNum(gLevel.size - 1, 0);
        if (gField[idx1][idx2].isMine) {
            continue;
        } else {
            gField[idx1][idx2].isMine = true;
            NumOfMines--;
        }
    }
}

function setMinesNegsCount(field, pos) {
    var count = 0;
    for (var i = pos.i - 1; i <= pos.i + 1; i++) {
        for (var j = pos.j - 1; j <= pos.j + 1; j++) {
            if (i === pos.i && j === pos.j) continue;
            if (!checkIfInfield(field, { i: i, j: j })) continue;
            if (field[i][j].isMine === true) count++;
        }
    }
    return count;
}


function creatBoard(diff) {
    gField = [];
    gLevel.size = diff;
    for (var i = 0; i < gLevel.size; i++) {
        gField[i] = [];
        for (var j = 0; j < gLevel.size; j++) {
            gField[i][j] = {
                id: gNextId++,
                minesAroundCount: 0,
                isShown: false,
                isMine: false,
                isMarked: false,
                isRec: false
            };
            // isHint: true
        }
    }
}


