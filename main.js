let count = document.querySelector(".count span")
let bullets = document.querySelector(".bullets ")
let bullets_spans = document.querySelector(".bullets .spans")
let numberofanswer = document.querySelector(".number_of_answer")
let qui_area = document.querySelector(".quiz-area")
let answer_are = document.querySelector(".answer-are")
let submitClick = document.querySelector(".submit-botton")
let resultcontainer = document.querySelector(".results")
let countdownelement = document.querySelector(".countdown")

let currentindex = 0;
let rightanswer = 0
let countdowninterval
function getquestions() {
    let myrequest = new XMLHttpRequest()
    myrequest.onreadystatechange = function () {
        if (this.status === 200 && this.readyState === 4) {
            let jsobject = JSON.parse(this.responseText)
            let questionoCount = jsobject.length
            countq(questionoCount)
            addquestiondata(jsobject[currentindex], questionoCount)
            countdown(10, questionoCount)
            submitClick.onclick = () => {
                let therightanswer = jsobject[currentindex]["right_answer"]
                currentindex++
                checkedtheanswer(therightanswer, questionoCount)
                qui_area.innerHTML = ""
                answer_are.innerHTML = ""
                addquestiondata(jsobject[currentindex], questionoCount)
                handelbullets()
                clearInterval(countdowninterval)
                countdown(10, questionoCount)
                showresult(questionoCount)
            }
        }
    }
    myrequest.open("Get", "html_question.json", true)
    myrequest.send()
}
getquestions()
function countq(num) {
    //create bullets span
    for (let i = 1; i <= num; i++) {
        let span = document.createElement("span")
        // span.she   
        if (i === 1) {
            span.className = "on"
        }
        bullets_spans.appendChild(span)
    }
}
function addquestiondata(element, total) {
    if (currentindex < total) {
        let h2 = document.createElement("h2")
        let h2text = document.createTextNode(element.title)
        h2.appendChild(h2text)
        qui_area.appendChild(h2)
        for (let i = 1; i <= 4; i++) {
            let answer = document.createElement("div")
            answer.className = "answer"
            let input = document.createElement("input")
            input.name = "questions"
            input.type = "radio"
            input.id = `answer_${i}`
            input.dataset.answer = element[`answer_${i}`]
            // if (i === 1) {
            //     input.checked = true
            // }
            let label = document.createElement("label")
            label.htmlFor = `answer_${i}`
            let labeltext = document.createTextNode(element[`answer_${i}`])
            label.appendChild(labeltext)
            answer.appendChild(input)
            answer.append(label)
            answer_are.appendChild(answer)
        }
    }
}
function checkedtheanswer(ranswer, count) {
    let answer = document.getElementsByName("questions")
    let theChoosenAnswer
    for (let i = 0; i < answer.length; i++) {
        if (answer[i].checked)
            theChoosenAnswer = answer[i].dataset.answer
    }
    if (theChoosenAnswer === ranswer) {
        console.log("here we go")
        rightanswer++
        // console.log(rightanswer)
    } else {
        console.log("fucking")
    }
}
function handelbullets() {
    let bulletsspan = document.querySelectorAll(".bullets .spans span")
    let arrayspan = Array.from(bulletsspan)
    arrayspan.forEach((span, index) => {
        if (currentindex === index) {
            span.className = "on"
        }
    })
}
function showresult(num) {
    let theresultss
    if (currentindex === num) {
        qui_area.remove()
        answer_are.remove()
        submitClick.remove()
        bullets.remove()
        if (rightanswer > num / 2) {
            theresultss = `<span class="good"> good</span>, You answered ${rightanswer} from ${num}`
        } else if (rightanswer === num) {
            theresultss = `<span class="perfect"> perfect</span> ,All answers is good`
        } else {
            theresultss = `<span class="bad"> bad</span>, You answered ${rightanswer} from ${num}`
        }
        resultcontainer.innerHTML = theresultss
        resultcontainer.style.padding = "20px";
        resultcontainer.style.marginTop = "10px"
    }
}
function countdown(duration, count) {
    if (currentindex < count) {
        let minutes, second
        countdowninterval = setInterval(function () {
            minutes = parseInt(duration / 60)
            second = parseInt(duration % 60)
            minutes = minutes < 10 ? `0${minutes}` : `${minutes}`
            second = second < 10 ? `0${second}` : `${second}`
            countdownelement.innerHTML = `${minutes}:${second}`
            if (--duration < 0) {
                clearInterval(countdowninterval)
                submitClick.click()
            }
        }, 1000)
    }
}
