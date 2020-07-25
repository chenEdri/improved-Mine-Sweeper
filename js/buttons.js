'use strict';

// GLOBAL VARIABLES
var gCellClueInterval = null;
var gSpecialClick = 0;
var gSafeClick = 3;
var gManualBool = false;
var gManualNumOfMines = null;
var gUndoMoves = [];

function resetHint(){
    for (var i = 1; i<=3;i++){
        var elHint = document.getElementById(`${i}`);
        elHint.style.cursor ='pointer';
        elHint.style.boxShadow = ' 0px 0px 0px 0px rgba(0,0,0,0)';
    }
}


function hint(elCell) {
    if (elCell.style.boxShadow === 'rgba(174, 232, 235, 0.4) 14px 14px 5px 0px') return;
    else {
        elCell.style.boxShadow = '14px 14px 5px 0px rgba(174,232,235,0.4)';
        elCell.style.cursor = 'none';
        gSpecialClick++;
    }
}

function hintIsActivated(pos) {
    for (var i = (pos.i - 1); i <= (pos.i + 1); i++) {
        for (var j = (pos.j - 1); j <= (pos.j + 1); j++) {
            if (!checkIfInfield(gField, { i: i, j: j })) continue;
            if (gField[i][j].isShown) {
                gField[i][j].isHint = false;
            }
            gField[i][j].isShown = true;
        }
    }
    renderField();
    setTimeout(function () {
        for (var i = pos.i - 1; i <= pos.i + 1; i++) {
            for (var j = pos.j - 1; j <= pos.j + 1; j++) {
                if (!checkIfInfield(gField, { i: i, j: j })) continue;
                if (gField[i][j].isHint === false) continue;
                gField[i][j].isShown = false;
            }
        }
        renderField();
    }, 1000);
    gSpecialClick--;
    return;
}

function safeClick(elClick) {
    if (gSafeClick === 0) return;
    gSafeClick--;
    elClick.innerHTML = 'safe clicks: ' + gSafeClick;
    for (var i = 0; i < gLevel.size; i++) {
        for (var j = 0; j < gLevel.size; j++) {
            if ((!gField[i][j].isShown) && (!gField[i][j].isMine)) {
                var id = gField[i][j].id;
                var elCell = document.getElementById(`${id}`);
                elCell.style.backgroundColor = 'rgb(137, 235, 235)';
                setTimeout(function () {
                    elCell.style.backgroundColor = 'rgb(194, 193, 190)';
                }, 1500);
                return;
            }
        }
    }
}

function manualMode() {
    gManualBool = true;
    var size = +prompt('please bring the number of cell on row/collumn you want on board');
    gManualNumOfMines = +prompt('please enter the amount of mines in board');
    init(size, gManualNumOfMines, 0);
}

function gManualFinish() {
    for (var i = 0; i < gLevel.size; i++) {
        for (var j = 0; j < gLevel.size; j++) {
            gField[i][j].minesAroundCount = setMinesNegsCount(gField, { i: i, j: j });
        }
    }
    setTimeout(function () {
        alert('Let\'s Play !!');
        gManualBool = false;
    }, 1000);
}

// function undo() {
//     var currAction = gUndoMoves.splice(0, 1);
//     var id = currAction[0].id;
//     var elCell = document.getElementById(`${id}`);
//     console.log('elcell-', elCell);
//     var dataset = elCell.dataset;
//     var pos = {i:dataset.i, j: dataset.j };

//     // option1- clicked first bottom

//     // option2 - clicked buttom with mine

//     // option 3- clicked EMPTY and go to EXPAND

//     // option 4- clickedMark

//     // option 5- clicked Number Button
//     if((!elCell.isMine) && (elCell.minesAroundCount !== 0)){
//         elCell.isShown = false;
//         gField[pos.i][pos.j] = elCell;
//         renderField();
//     }
// }