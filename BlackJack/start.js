let player = {
    username: localStorage.getItem("name"),
    value: localStorage.getItem("funds"),
    currentBet: 0
}
let sum = 0;
let cards = [];
let game = [];
let betMade = gameInProgress = restartGame = decisionTime = doubleAce = false;
let message = bid = "";                     //0           //1         //2           //3              //4            //5         //6           //7           //8
//let container = document.querySelectorAll("#message-el", "#sum-el", "#cards-el", "#statistics-el", "#bidValue-el", "#bet-btn", "#start-btn", "#draw-btn", "#restart-btn");
const messageEl = document.querySelector("#message-el");
const sumEl = document.querySelector("#sum-el");
const cardsEl = document.querySelector("#cards-el");
const nameEl = document.querySelector("#statistics-el");
const bidEl = document.querySelector("#bidValue-el");
const historyEl = document.querySelector("#history-el");
const betBtn = document.querySelector("#bet-btn");
const startBtn = document.querySelector("#start-btn");
const drawBtn = document.querySelector("#draw-btn");
const restartBtn = document.querySelector("#restart-btn");
const clearHistoryBtn = document.querySelector("#history-btn");
const oneBtn = document.querySelector("#one-btn");
const elevenBtn = document.querySelector("#eleven-btn");


onload = function(){
    document.querySelector("#name-id").value = "";
    document.querySelector("#funds-id").value = "";
}

window.onbeforeunload = function() {
    bidEl.value = "";
}

function confirmStats(){

    const idInfo1 = document.querySelector("#name-id").value, idInfo2 = document.querySelector("#funds-id").value;

    if(!idInfo1 || !idInfo2){
        alert("You haven't entered either your name or funds");
        event.preventDefault();
    }else if(idInfo2 <= 0){
        alert("Invalid funds");
        event.preventDefault();
    }else{
        localStorage.setItem("name", idInfo1);
        localStorage.setItem("funds", idInfo2);
        localStorage.setItem("history", "[]");
    }

}
//-------------------------------------//
//-------------------------------------//

nameEl.textContent = `${player.username} ${player.value} €; Current bet: ${player.currentBet} €`;
gameHistory();

betBtn.addEventListener("click", function(){
    const bid = bidEl.value;
    
    if(decisionTime === false){
        if(bid === "" && restartGame === false){
            alert("You haven't entered any funds");

        }else if(bid <= 0){
            alert("Invalid bet");

        }else if(bid != "" && player.value - bid < 0 && restartGame === false){
            alert("You don't have the money");

        }else if(bid != "" && player.value - bid >= 0 && restartGame === false){
            player.currentBet += parseInt(bid);
            player.value -= bid;
            localStorage.setItem("funds", player.value);

            nameEl.textContent = `${player.username} ${player.value} €; Current bet: ${player.currentBet} €`;
            betMade = true;

            if(!gameInProgress){
                startBtn.style.backgroundColor = "goldenrod";
            }
            
        }else if(restartGame){
            alert("You haven't started a new game");
        }

    }else{
        alert("You haven't chosen the value");
    }

})

startBtn.addEventListener("click", function(){

    if(gameInProgress){
        alert("The game is already in progress.");
    }else if(betMade === false){
        alert("You haven't deposited any funds");
    }else if(betMade && gameInProgress === false){
        gameInProgress = true;
        cards[0] = 11 //getRandomCard();
        cards[1] = 11 //getRandomCard();
        
        sum = cards[0] + cards[1];
        bidEl.value = "";
        
        drawBtn.style.backgroundColor = restartBtn.style.backgroundColor = "goldenrod";
        startBtn.style.backgroundColor = "grey";

        if(cards[0] === 1 || cards[1] === 1 || cards[0] === 11 || cards[1] === 11){
            drawBtn.style.backgroundColor = betBtn.style.backgroundColor = "grey";
            oneBtn.style.display = elevenBtn.style.display = "inline-block";
            decisionTime = true;
        }

        if((cards[0] === 1 && cards[1] === 1) || (cards[0] === 1 && cards[1] === 11) || (cards[0] === 11 && cards[1] === 1) || (cards[0] === 11 && cards[1] === 11) && doubleAce === false){
            doubleAce = true;
        }
        
        renderGame();
        
        if(cards[0] === 1 || cards[1] === 1 || cards[0] === 11 || cards[1] === 11){
            messageEl.textContent = "You got an ACE. Choose either 1 or 11."
        }

    }

})

oneBtn.addEventListener("click", function(){valueInput(1)})
elevenBtn.addEventListener("click", function(){valueInput(11)})
function valueInput(valueChosen){

    let lastMember = cards.length - 1;
    let reverseNumber;

    if(valueChosen === 1){
        reverseNumber = 11;
    }else{
        reverseNumber = 1;
    }

    if(cards[lastMember] === reverseNumber /*&& doubleAce === false*/){
        sum = sum - cards[lastMember] + valueChosen;
        cards[lastMember] = valueChosen;
    }else if(cards[0] === reverseNumber /*&& doubleAce === true*/){
        sum = sum - cards[0] + valueChosen;
        cards[0] = valueChosen;
    }

    //Keičia tik paskutinį skaičių iš dviejų pirminių. Reikia, kad būtų
    //galima keist ir pirmą ir antrą. Ir šiaip keistai veikia, bet
    //jau į tą pusę.
    console.log(doubleAce);
    console.log(cards);

    if(doubleAce === false){
        decisionTime = false;
        messageEl.textContent = "Do you want to draw a new card?"
        oneBtn.style.display = elevenBtn.style.display = "none";
        if(sum != 21) drawBtn.style.backgroundColor = betBtn.style.backgroundColor = "goldenrod";
        renderGame();
    }else{
        doubleAce = false;
    }

    

}

drawBtn.addEventListener("click", function(){

    if(decisionTime === false){
        if(restartGame === false && gameInProgress){
            let cardValue = 1 //getRandomCard();

            if(cardValue === 1 || cardValue === 11){
                drawBtn.style.backgroundColor = betBtn.style.backgroundColor = "grey";
                oneBtn.style.display = elevenBtn.style.display = "inline-block";
                decisionTime = true;
            }

            cards.push(cardValue);
            sum += cardValue;

            renderGame();

            if(cardValue === 1 || cardValue === 11){
                messageEl.textContent = "You got an ACE. Choose either 1 or 11."
            }

        }else{
            alert("You haven't started the game");
        }
    }else{
        alert("You haven't chosen the value");
    }

})

restartBtn.addEventListener("click", function(){ 

    let k = false;

    if(gameInProgress){
        k = confirm("Are you sure? \nYour current bet will be deduced permanently.");
        k && window.location.reload();
    }else if(restartGame){
        window.location.reload();
    }else if(gameInProgress === false && k === false){
        alert("The game hasn't been started yet");
    }

})

clearHistoryBtn.addEventListener("dblclick", function(){
    localStorage.setItem("history", "[]");
    historyEl.textContent = "";
})

function getRandomCard(){
    const value = Math.floor(Math.random() * 13) + 1;

    if(value === 11) return 1;
        else if(value === 12 && value === 13){
            return 10;
        }
            else{
                return value;
            }
}

function renderGame(){

    if(sum <= 20){
        message = "Do you want to draw a new card?"
    }else if(sum === 21 && decisionTime === false){
        let betMultiplier = getRandomCard();
        player.value += player.currentBet * betMultiplier;
        gameOutcome("Blackjack!", betMultiplier, "+");
        gameHistory();

    }else if(sum > 21 && decisionTime === false){
        gameOutcome("You lost", 1, "-")
        gameHistory();
    }

    cardsEl.textContent = "Cards: ";
    for(let i = 0; i < cards.length; i++){
        cardsEl.textContent += cards[i] + " ";
    }

    sumEl.textContent = "Sum: " + sum;
    messageEl.textContent = message;
}

function gameOutcome(verdict, i, incrementSign){
    message = verdict
    betMade = false;
    gameInProgress = false;
    restartGame = true;
    localStorage.setItem("funds", player.value);
    nameEl.textContent = `${player.username} ${player.value} €; Current bet: ${incrementSign}${player.currentBet * i} €`;

    startBtn.style.backgroundColor = drawBtn.style.backgroundColor = betBtn.style.backgroundColor = "grey";
}

function gameHistory(){
    let txt_ = "";

    game = JSON.parse(localStorage.getItem("history"));

    for(let i = 0; i < cards.length; i++){
        txt_ += cards[i] + " ";
    }

    if(message === "Blackjack!"){
        game.push(`<li style="color:yellowgreen;">${txt_} ===> YOU WIN</li>`);

    }else if(cards.length != 0){
        game.push(`<li style="color:red;">${txt_} ===> YOU LOST</li>`);

    }

    if(game.length === 11){
        game.shift();
    }

    localStorage.setItem("history", JSON.stringify(game));

    historyEl.textContent = "";
    for(let i = 0; i < game.length; i++){
        historyEl.innerHTML += game[i];
    }

}