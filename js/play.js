'use strict';

var gTimeOut = null;
var gTimeInterval = null;
var gCountEasy = 0;
var gCountMedium = 0;
var gCountHard = 0;


function cellClicked(elCell, i, j) {
    // check if gameover
    if (gGame.isOn === false || gField[i][j].isMarked) {
        return;
    }
    var dataset = elCell.dataset;
    var pos = { i: +dataset.i, j: +dataset.j };
    var cell = gField[pos.i][pos.j];

    // IF MANUAL IS PUSHED ENTER MANUALY THE MINES TO THE GAME
    if (gManualBool && gManualNumOfMines >= 0) {
        gField[i][j].isMine = true;
        gField[i][j].isShown = true;
        gUndoMoves.push(cell);
        renderField();
        setTimeout(function () {
            gField[i][j].isShown = false;
            renderField();
        }, 1000);
        gManualNumOfMines--;
        if (gManualNumOfMines === 0) {
            gManualFinish();
        }
        // if hint buttom is played

    } else {
        if (gSpecialClick !== 0) return hintIsActivated(pos);

        // if it's first click
        if (checkIfFirstClick() === true) {
            gTimeInterval = setInterval(timer, 333);
            firstClickPass(cell, pos);
            //regular play
        } else if (cell.isShown === false) {
                gUndoMoves.push(gField[i][j]);
                cell.isShown = true;
                if(!cell.isMine) gGameCount++;
            } if(!cell.isMine && cell.minesAroundCount === 0) {
                cell.isShown = true;
                expandShown2(gField, i, j);
            }
        }
        // expandShown(gField, elCell, i, j);
        renderField();
        if (!checkGameOver(i, j)) {
            gGame.isOn = false;
        }
        return;
    }

function cellMarked(i, j) {
    if (gGame.isOn === false) {
        return;
    }
    var cell = gField[i][j];
    if (cell.isShown && !cell.isMarked) return;
    if (!cell.isMarked) {
        cell.isMarked = true;
        gGame.markedCount++;
        gUndoMoves.push(cell);
    } else {
        cell.isShown = false;
        cell.isMarked = false;
        gGame.markedCount--;
        gUndoMoves.push(cell);
    }
    renderField();
    if (!checkGameOver(i, j)) {
        gGame.isOn = false;
    }
    return;
}

// first option:

/*
function expandShown(field, elCell, i, j) {
    var undoExpand = [];
    if (gGame.isOn === false) {
        return;
    }
    var dataset = elCell.dataset;
    var pos = { i: +dataset.i, j: +dataset.j };
    if (field[i][j].isMine) return;
    if (!field[i][j].isMine && field[i][j].minesAroundCount === 0) {  //if EMPTY open evrything around except mines
        for (var i = pos.i - 1; i <= pos.i + 1; i++) {
            for (var j = pos.j - 1; j <= pos.j + 1; j++) {
                if (i === pos.i && j === pos.j) continue;
                if (!checkIfInfield(field, { i: i, j: j })) continue;
                if (field[i][j].isMarked) continue;
                if (field[i][j].isMine !== true) {
                    field[i][j].isShown = true;
                    undoExpand.push(gField[i][j]);
                }
            }
        }
        gUndoMoves.push(undoExpand);
        renderField();
    } else return; //if number open only the number
}
// if mine- open all mines around
// if (field[i][j].isMine) {
//     for (var i = pos.i - 1; i <= pos.i + 1; i++) {
//         for (var j = pos.j - 1; j <= pos.j + 1; j++) {
//             if (i === pos.i && j === pos.j) continue;
//             if (!checkIfInfield(field, { i: i, j: j })) continue;
//             if (field[i][j].isMarked) continue;
//             if (field[i][j].isMine) {
//                 field[i][j].isShown = true;
//             }
//         }
//     }
//     renderField();
*/


// second option recursion:

function expandShown2(field, i, j) {
    // debugger
    for (var idx1 = i - 1; idx1 <= (i + 1); idx1++) {
        for (var idx2 = j - 1; idx2 <= (j + 1); idx2++) {
            if (!checkIfInfield(field, { i: idx1, j: idx2 })) continue;
            if (idx2 === j && idx1 === i) continue;
            if (field[idx1][idx2].isRec) continue;
            field[idx1][idx2].isShown = true;
            gGameCount++;
        }
    }
    for (var idx1 = i - 1; idx1 <= (i + 1); idx1++) {
        for (var idx2 = j - 1; idx2 <= (j + 1); idx2++) {
            if (!checkIfInfield(field, { i: idx1, j: idx2 })) continue;
            // if (idx2 === j && idx1 === i) continue;
            if (field[idx1][idx2].isRec) continue;
            field[idx1][idx2].isRec = true;
            if (gField[idx1][idx2].minesAroundCount === 0) return expandShown2(field, idx1, idx2);
        }
    }
    return;
}


// game-over function
function checkGameOver(idx1, idx2) {
    var currCell = gField[idx1][idx2];
    if (!gGame.isOn) return true;

    if ((!currCell.isShown) && (currCell.isMarked) && (currCell.isMine)) {
        gLevel.mines--;
    }
    // check if won
    if (gLevel.mines === 0 && (checkOpenCells())) {
        clearInterval(gTimeInterval);
         updateBestScore(gGameCount);
        setTimeout(function () {
            getDiffrentSmiley('YOU WON!');
            gTimeOut = uploadModal('YOU WON!');
        }, 500);
        return false;
        // check if lost
    } else if (currCell.isShown && currCell.isMine) {
        takeLifePicOut(gCountLifes);
        gCountLifes--;
        if (gCountLifes === 0) {
            clearInterval(gTimeInterval);
            updateBestScore(gGameCount);
            gTimeOut = setTimeout(function () {
                changeMinesToBombs();
                getDiffrentSmiley('GAME OVER!');
                uploadModal('GAME OVER!');
            }, 500);
            return false;
        }
    }// got hurt but finished 
    else if (checkOpenCells() && gCountLifes !== gLifePic) {
        clearInterval(gTimeInterval);
        updateBestScore(gGameCount);
        setTimeout(function () {
            gTimeOut = uploadModal('you won, but...you can do better..');
        }, 1000);
        return false;
    }
    return true;
}

function checkOpenCells() {
    for (var i = 0; i < gLevel.size; i++) {
        for (var j = 0; j < gLevel.size; j++) {
            if (!gField[i][j].isShown && !gField[i][j].isMine && !gField[i][j].isMarked) return false;
        }
    }
    return true;
}

function checkIfFirstClick() {
    for (var i = 0; i < gLevel.size; i++) {
        for (var j = 0; j < gLevel.size; j++) {
            if (gField[i][j].isShown) return false;
        }
    }
    return true;
}

function firstClickPass(cell, pos) {
    if (cell.isMine) {
        cell.isMine = false;
        cell.isShown = true;
        gLevel.mines--;
        gField = changSmallFieldMinesCount(gField, pos);
        renderField();
    } else {
        cell.isShown = true;
        gUndoMoves.push(cell);
    }
}

function changSmallFieldMinesCount(field, pos) {
    var undoExpand = [];
    for (var i = pos.i - 1; i <= pos.i + 1; i++) {
        for (var j = pos.j - 1; j <= pos.j + 1; j++) {
            if (i === pos.i && j === pos.j) continue;
            if (checkIfInfield(gField, { i: i, j: j })) {
                field[i][j].minesAroundCount = setMinesNegsCount(field, { i: i, j: j });
                gGameCount++;
                undoExpand.push(field[i][j]);
            }
        }
    }
    gUndoMoves.push(undoExpand);
    return field;
}