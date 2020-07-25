'use strict';
var gTime = 0;
var gLifePic = 3;


function checkIfInfield(field, pos) {
    return (pos.i >= 0 && pos.i < gLevel.size &&
        pos.j >= 0 && pos.j < gLevel.size);
}

function getInexlusiveRandomNum(max, min) {
    return Math.floor(Math.random() * (max - min + 1) + min);
}

window.oncontextmenu = function () {
    return false;     // cancel default menu
}

function uploadModal(msg) {
    document.querySelector('.modal').style.display = 'block';
    document.querySelector('.modal h2').innerText = msg;
    clearTimeout(gTimeOut);
}

function resetSmiley() {
    var elPic = document.querySelector('.smiley');
    elPic.src = 'jpj/regular.png';
}

function getDiffrentSmiley(msg) {
    var elPic = document.querySelector('.smiley');
    if (msg === 'YOU WON!') {
        elPic.src = 'jpj/winner.png';
    } else {
        elPic.src = 'jpj/looser.png';
    }
}

function resetTime() {
    gTime = 0;
    var elTime = document.querySelector('.timer');
    elTime.innerText = 'Time: ';
}


function timer() {
    gTime += 0.33;
    var elTime = document.querySelector('.timer');
    elTime.innerText = 'Time: ' + gTime.toFixed(2);
    elTime.style.backgroundColor = '#1d89ff';
    elTime.style.color = 'white';
}



function resetLifes(diff) {
    if (diff === 4 || diff === undefined) {
        gLifePic = 2;
        gCountLifes = 2;
        var elLife = document.querySelector('.lifes3');
        elLife.style.display = 'inline';
        elLife = document.querySelector('.lifes2');
        elLife.style.display = 'inline';
        elLife = document.querySelector('.lifes1');
        elLife.style.display = 'none';
    } else {
        gCountLifes = 3;
        gLifePic = 3;
        var elLife = document.querySelector('.lifes3');
        elLife.style.display = 'inline';
        elLife = document.querySelector('.lifes2');
        elLife.style.display = 'inline';
        elLife = document.querySelector('.lifes1');
        elLife.style.display = 'inline';
    }
}



function takeLifePicOut(num) {
    if (num === 3) {
        var elLife = document.querySelector('.lifes3');
        elLife.style.display = 'none';
    } else if (num === 2) {
        var elLife = document.querySelector('.lifes2');
        elLife.style.display = 'none';
    } else {
        var elLife = document.querySelector('.lifes1');
        elLife.style.display = 'none';
    }
}

function changeMinesToBombs() {
    var htmlStr = '';
    for (var i = 0; i < gLevel.size; i++) {
        htmlStr += '<tr>';
        for (var j = 0; j < gLevel.size; j++) {
            var item = ' ';
            if (gField[i][j].isMine) {
                item = BLOWMINE;
                gField[i][j].isShown = true;
            } else if (!gField[i][j].isShown || gField[i][j].isMarked) {
                if (gField[i][j].isMarked === true) {
                    item = FLAG;
                } else if (gField[i][j].minesAroundCount !== 0) {
                    item = gField[i][j].minesAroundCount;
                } else {
                    item = EMPTY;
                }
            }
            var className = (item + '');
            var bgc = '';
            if (gField[i][j].isShown) bgc += 'cell2';
            else bgc += 'cell';
            className += `cell-${i}-${j}`;
            htmlStr += `<td class = "${bgc} ${className}" onclick = "cellClicked(this , ${i}, ${j})" data-i = "${i}" data-j = "${j}"  
                    oncontextmenu="cellMarked(${i},${j})" data-i = "${i}" data-j = "${j}">${item}</td>`;
        }
        htmlStr += '</tr>';
    }
    var elTable = document.querySelector('.field');
    elTable.innerHTML = htmlStr;
    console.table(gField);
}

function loadBestScore() {
    var elScore = document.querySelector('.score');
    switch (gLevel.size) {
        case 4: elScore.innerText = 'BEST SOCRE :' + gMaxScoreEasy;
            break;
        case 8: elScore.innerText = 'BEST SOCRE :' + gMaxScoreMedium;
            break;
        case 12: elScore.innerText = 'BEST SOCRE :' + gMaxScoreHard;
            break;
        default: elScore.innerText = '';
            break;
    }
}

function updateBestScore(number) {
    console.log(number, gLevel.size);
    if (gLevel.size === 4) {
        (gMaxScoreEasy < number) ? gMaxScoreEasy = number : gMaxScoreEasy;
        console.log(gMaxScoreEasy);
    } else if (gLevel.size === 8) {
        (gMaxScoreMedium < number) ? gMaxScoreMedium = number : gMaxScoreMedium;
        console.log(gMaxScoreMedium);
    } else {
        (gMaxScoreHard < number) ? gMaxScoreHard = number : gMaxScoreHard;
        console.log(gMaxScoreHard);
    }
    loadBestScore()
}