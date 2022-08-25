// Criteria 
// GIVEN I am taking a code quiz
// WHEN I click the start button
// THEN a timer starts and I am presented with a question
// WHEN I answer a question
// THEN I am presented with another question
// WHEN I answer a question incorrectly
// THEN time is subtracted from the clock
// WHEN all questions are answered or the timer reaches 0
// THEN the game is over
// WHEN the game is over
// THEN I can save my initials and my score

//selecting all required elements
const start_btn = document.querySelector(".start_btn button");
const info_box = document.querySelector(".info_box");
const exit_btn = info_box.querySelector(".buttons .quit");
const continue_btn = info_box.querySelector(".buttons .restart");
const quiz_box = document.querySelector(".quiz_box");
const result_box = document.querySelector(".result_box");
const option_list = document.querySelector(".option_list");
const time_line = document.querySelector("header .time_line");
const timeText = document.querySelector(".timer .time_left_txt");
const timeCount = document.querySelector(".timer .timer_sec");
const highscoreInputName = document.getElementById("initials")
const highscoreDisplayName = document.getElementById("highscore-initials");
const highscoreDisplayScore = document.getElementById("highscore-score");
const submitScoreBtn = document.getElementById("submitScore")
var time = 60; //place holder for now, testing
let que_count = 0;
let que_numb = 1;
let userScore = 0;
let counter;
let counterLine;
let widthValue = 0;
const restart_quiz = result_box.querySelector(".buttons .restart");
const quit_quiz = result_box.querySelector(".buttons .quit");

// if startQuiz button clicked 
// show info box
// Element.classList is a read-only property that returns a live DOMTokenList collection of the class attributes of the element.
// .addEventListener vs .onclick - from stackoverflow - onclick is a single property with a single value. When you assign to it, the old value is replaced by the new assignment.
start_btn.addEventListener("click", handleStart_btn); 

function handleStart_btn (){
    info_box.classList.add("activeInfo");
}

// if exitQuiz button clicked 
// hide info box 
// Elment.classList.remove 
exit_btn.addEventListener("click",handleExit_btn);

function handleExit_btn (){
    info_box.classList.remove("activeInfo")
}


// if continueQuiz button clicked 
// hide info box 
// show quiz box 
// calling showQuestion
// passing 1 parameter to queCounter
// calling startTimer function 
// calling startTimerLine function 

continue_btn.addEventListener("click",handleContinue_btn);

function handleContinue_btn(){
    info_box.classList.remove("activeInfo");
    quiz_box.classList.add("activeQuiz");
    showQuestions(0);
    queCounter(1); //because queCounter is before startTimer and startTimerLine, so we need to call it first, then it will show the startTimer function and startTimerLine 
    timeCount.textContent = time;
    startTimer(); 
    startTimerLine(0);
}



//if restartQuiz button clicked
restart_quiz.onclick = ()=>{
    quiz_box.classList.add("activeQuiz"); //show quiz box
    result_box.classList.remove("activeResult"); //hide result box
    que_count = 0;
    que_numb = 1;
    userScore = 0;
    widthValue = 0;
    showQuestions(que_count); //calling showQestions function
    queCounter(que_numb); //passing que_numb value to queCounter
    clearInterval(counter); //clear counter
    clearInterval(counterLine); //clear counterLine
    time = 60;
    timeCount.textContent = time;
    startTimer(); //calling startTimer function
    startTimerLine(widthValue); //calling startTimerLine function
    timeText.textContent = "Time Left"; //change the text of timeText to Time Left
    next_btn.classList.remove("show"); //hide the next button
}

//if quitQuiz button clicked
quit_quiz.onclick = ()=>{
    window.location.reload(); //reload the current window
}

const next_btn = document.querySelector("footer .next_btn");
const bottom_ques_counter = document.querySelector("footer .total_que");

//if Next Que button clicked
next_btn.onclick = ()=>{
    if(que_count < questions.length - 1){ //if question count is less than total question length
        que_count++; //increment the que_count value
        que_numb++; //increment the que_numb value
        showQuestions(que_count); //calling showQestions function
        queCounter(que_numb); //passing que_numb value to queCounter
        timeText.textContent = "Time Left"; //change the timeText to Time Left
        next_btn.classList.remove("show"); //hide the next button
    }else{
        showResult(); //calling showResult function
    }
}

// getting questions and options from array //Question: can we pass index/answer as parameter? if so, how do the function know which one to select? 
function showQuestions(index){
    const que_text = document.querySelector(".que_text");

    // <div class = 'que_text'> 
    //      <!--Here I've inserted question from Javascript> 
    //      <span> questions[index].numb + questions[index].quesetion </span>
    // </div> 

    // <div class='option_list> 
    //      <!--Here I've inserted options from JavaScript> 
    //      <div class = 'option incorrect disable'><span> questions[index].options[0] </span></div>
    //          <div class ='icon cross'>
    //              <i class = 'fas fa-times'></i>
    //          </div>
    //
    //      <div class = 'option'><span> questions[index].options[1] </span></div>
    //
    //      <div class = 'option'><span> questions[index].options[2] </span></div>
    //
    //      <div class = 'option correct disable'><span> questions[index].options[3] </span></div>
    //          <div class ='icon tick'>
    //              <i class = 'fas fa-check></i>
    //          </div> 
    // </div> 

    //creating a new span and div tag for question and option and passing the value using array index
    let que_tag = '<span>'+ questions[index].numb + ". " + questions[index].question +'</span>';
    let option_tag = '<div class="option"><span>'+ questions[index].options[0] +'</span></div>'
    + '<div class="option"><span>'+ questions[index].options[1] +'</span></div>'
    + '<div class="option"><span>'+ questions[index].options[2] +'</span></div>'
    + '<div class="option"><span>'+ questions[index].options[3] +'</span></div>';

    que_text.innerHTML = que_tag; //adding new span tag inside que_tag
    option_list.innerHTML = option_tag; //adding new div tag inside option_tag
    
    const option = option_list.querySelectorAll(".option");
    // set onclick attribute to all available options
    for(i=0; i < option.length; i++){
        option[i].setAttribute("onclick", "optionSelected(this)"); //Question: what is this used for? can we use addEventListener? 
    }
}

//creating the new div tags which for icons
let tickIconTag = '<div class="icon tick"><i class="fas fa-check"></i></div>'; // for correct answer
let crossIconTag = '<div class="icon cross"><i class="fas fa-times"></i></div>'; // for incorrect answer 

//if user clicked on option, Question: it seems the answer parameter is randomly assigned, not the same as questions object answer. 
function optionSelected(answer){
    let userAns = answer.textContent; //getting user selected option, 
    let correcAns = questions[que_count].answer; //getting correct answer from array, que_count (variable) = 0, starting from 0; Question: why don't we use questions[index].answer 
    const allOptions = option_list.children.length; //getting all option items, which is 4
    
    if(userAns == correcAns){ //if user selected option is equal to array's correct answer
        userScore += 1; //upgrading score value with 1, userScore (variable) = 0, starting from 0
        answer.classList.add("correct"); //adding green color to correct selected option
        answer.insertAdjacentHTML("beforeend", tickIconTag); //adding tick icon to correct selected option
        console.log("Correct Answer");
        console.log("Your correct answers = " + userScore);
    }else{
        answer.classList.add("incorrect"); //adding red color to correct selected option
        answer.insertAdjacentHTML("beforeend", crossIconTag); //adding cross icon to correct selected option
        console.log("Wrong Answer");
        time = time - 5; // if answer incorrect, subtract 5 sec; time is a global variable, you could access it inside optionSelected(answer) function 
        for(i=0; i < allOptions; i++){
            if(option_list.children[i].textContent == correcAns){ //if there is an option which is matched to an array answer 
                option_list.children[i].setAttribute("class", "option correct"); //adding green color to matched option
                option_list.children[i].insertAdjacentHTML("beforeend", tickIconTag); //adding tick icon to matched option
                console.log("Auto selected correct answer.");
            }
        }
    }
    for(i=0; i < allOptions; i++){
        option_list.children[i].classList.add("disabled"); //once user select an option then disabled all options
    }
    next_btn.classList.add("show"); //show the next button if user selected any option
}


function showResult(){
    info_box.classList.remove("activeInfo"); //hide info box
    quiz_box.classList.remove("activeQuiz"); //hide quiz box
    result_box.classList.add("activeResult"); //show result box
    const scoreText = result_box.querySelector(".score_text");
    if (userScore > 3){ // if user scored more than 3
        //creating a new span tag and passing the user score number and total question number
        let scoreTag = '<span>and congrats! , You got <p>'+ userScore +'</p> out of <p>'+ questions.length +'</p></span>';
        scoreText.innerHTML = scoreTag;  //adding new span tag inside score_Text
    }
    else if(userScore > 1){ // if user scored more than 1
        let scoreTag = '<span>and nice , You got <p>'+ userScore +'</p> out of <p>'+ questions.length +'</p></span>';
        scoreText.innerHTML = scoreTag;
    }
    else{ // if user scored less than 1
        let scoreTag = '<span>and sorry , You got only <p>'+ userScore +'</p> out of <p>'+ questions.length +'</p></span>';
        scoreText.innerHTML = scoreTag;
    }
}


function startTimer(){
    counter = setInterval(timer, 1000);
    function timer(){
        time--;
        

        if (time < 0) {
            clearInterval(counter);
            timeText.textContent = 'Time Off'
            showResult(); //calling showResult function
            //return; //break the timer()function, when 
        }else{
            timeCount.textContent = time;
        }
        
    }
}


function startTimerLine(time){
    counterLine = setInterval(timer, 550/60);
    function timer(){
        time += 1; //upgrading time value with 1
        time_line.style.width = time + "px"; //increasing width of time_line with px by time value
        if(time > 549){ //if time value is greater than 549, because the total width is 550px 
            clearInterval(counterLine); //clear counterLine
        }
    }
}


function queCounter(index){
    //creating a new span tag and passing the question number and total question
    let totalQueCounTag = '<span><p>'+ index +'</p> of <p>'+ questions.length +'</p> Questions</span>';
    bottom_ques_counter.innerHTML = totalQueCounTag;  //adding new span tag inside bottom_ques_counter
}


// const highscoreInputName = document.getElementById("initials")
// const highscoreDisplayName = document.getElementById("highscore-initials");
// const highscoreDisplayScore = document.getElementById("highscore-score");

submitScoreBtn.addEventListener("click", function highscore(){
    if(highscoreInputName ==='') {
        alert("initials cannot be blank");
        return false;
    } else{
        var savedHighscores = JSON.parse(localStorage.getItem("savedHighscores")) || [];
        var currentUser = highscoreInputName.value.trim();
        var currentHighscore = {
            name: currentUser,
            score: userScore
        };

        savedHighscores.push(currentHighscore);
        localStorage.setItem("savedHighscores", JSON.stringify(savedHighscores));
        generateHighscores();
    }
})

function generateHighscores(){
    highscoreDisplayName.innerHTML = "";
    highscoreDisplayScore.innerHTML = "";
    var highscores = JSON.parse(localStorage.getItem("savedHighscores")) || [];
    for (i=0; i<highscores.length; i++){
        var newNameSpan = document.createElement("li");
        var newScoreSpan = document.createElement("li");
        newNameSpan.textContent = highscores[i].name;
        newScoreSpan.textContent = highscores[i].score;
        highscoreDisplayName.appendChild(newNameSpan);
        highscoreDisplayScore.appendChild(newScoreSpan);
    }
}

var clearScoreBtn = document.getElementById("clearScore")

clearScoreBtn.addEventListener("click", clearScore)

function clearScore(){
    console.log('inside the clear function');
    window.localStorage.clear();
    highscoreDisplayName.textContent = "";
    highscoreDisplayScore.textContent = "";
    
}

// You've completed the Quiz! 
// and sorry, you got only 0 out of 10
// Enter your initial          submit Score 


// Display the score 
// Initial                   Score 
//    XL                        5

