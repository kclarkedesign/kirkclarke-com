const SELECTED_CSS_CLASS = "selected";
const quizzes = document.querySelectorAll(".js-quiz");
const CORRECT_SELECTION_MSG = "Excellent, that's the right answer!";
const INCORRECT_SELECTION_MSG =
  "Sorry, that's not the right answer. Give it another shot!";

if (quizzes.length > 0) {
  quizzes.forEach((quiz, index) => {
    // quiz memory
    const quizSelections = [];
    let answered = false;
    // quiz elements
    let quizQuestion = quiz.getElementsByClassName("quiz-question")[0];
    let quizProgress = quiz.getElementsByClassName("quiz-progress")[0];
    let quizQuestionOuter = quiz.getElementsByClassName(
      "quiz-question-outer"
    )[0];
    let quizAnswersCont = quiz.getElementsByClassName(
      "quiz-answers-container"
    )[0];
    let quizItem = quiz.getElementsByClassName("Quiz-item")[0];
    let quizCheckAnswer = quiz.getElementsByClassName("quiz-check-answer")[0];
    let quizNext = quiz.getElementsByClassName("quiz-continue")[0];
    let quizPrev = quiz.getElementsByClassName("quiz-previous")[0];
    let currentQuestion = index + 1;

    // quiz data
    const quizData = quiz.firstElementChild;
    const answersStr = quizData.dataset.data;
    const questionsStr = quizData.dataset.schema;
    const answers = JSON.parse(answersStr);
    const questions = JSON.parse(questionsStr);
    let selectedAnswerIndex = 0;

    const getChoices = (current, callback) => {
      const choices = questions.properties["answer-" + current]["enum"];
      const choicesHTML = choices
        .map((choice) => {
          return `<div class="quiz-answer-container">
                    <button class="quiz-answer" aria-pressed="false">
                        <span class="quiz-answer-text">${choice}</span>
                    </button>
                    <div class="quiz-answer-icon">
                        <i class="quiz-answer-icon-correct fa fa-check"></i>
                        <i class="quiz-answer-icon-incorrect fa fa-times"></i>
                        <i class="quiz-answer-icon-missed fa fa-circle-o"></i>
                    </div>
                </div>`;
        })
        .join("");

      quizAnswersCont.innerHTML = choicesHTML;

      if (checkSelections(quizSelections, "answer", "answer-" + current)) {
        //get correct answer index
        const choiceIndex = quizSelections[current - 1]["choice"];
        // pre-select the correct choice
        quizAnswersCont
          .getElementsByClassName("quiz-answer-container")
          [choiceIndex].classList.add(SELECTED_CSS_CLASS, "correct");
      }

      if (typeof callback == "function")
        callback(quizAnswersCont, handleSelection);
    };

    const handleSelection = (e, btnIndex) => {
      if (e) {
        const selectedBtn = e.currentTarget;
        selectedAnswerIndex = btnIndex;
        const btnChoices = selectedBtn.parentElement.parentElement.childNodes;

        if (!answered) {
          btnChoices.forEach((btn, index) => {
            if (index != btnIndex) {
              btn.classList.remove(SELECTED_CSS_CLASS);

              if (
                !selectedBtn.parentElement.classList.value.includes(
                  SELECTED_CSS_CLASS
                )
              ) {
                selectedBtn.parentElement.classList.add(SELECTED_CSS_CLASS);
              }
            }
          });
        }
      }
    };

    const initChoices = (container, callback) => {
      if (!answered) {
        const choiceBtns = container.querySelectorAll(".quiz-answer");
        choiceBtns.forEach((btn, index) => {
          btn.addEventListener("click", (e) => {
            callback(e, index);
          });
        });
      }

      quizQuestionOuter.style.height = quizItem.offsetHeight + "px";

      if (typeof callback == "function") callback();
    };

    const checkSelections = (array, key, value) => {
      return array.some((object) => object[key] == value);
    };

    const buildQuiz = (current) => {
      answered = false;
      // check quiz memory
      if (quizSelections.length > 0) {
        // check if current question was answered
        console.log(quizSelections);
        if (!checkSelections(quizSelections, "answer", "answer-" + current)) {
          // reset to default
          quizNext.disabled = true;
          quizCheckAnswer.disabled = false;
          quizNext.classList.remove("is-visible");
          quizCheckAnswer.classList.add("is-visible");
        } else {
          answered = true;
          quizNext.disabled = false;
          quizCheckAnswer.disabled = true;
          quizNext.classList.add("is-visible");
          quizCheckAnswer.classList.remove("is-visible");
        }
      }
      // build quiz
      quizItem.classList.add("quiz-item-exit-active");
      setTimeout(() => {
        quizItem.classList.remove("quiz-item-exit-active");
        quizItem.classList.add("quiz-item-enter-active");
        quizItem.getElementsByClassName("quiz-selection-msg")[0].innerText = "";
        setTimeout(() => {
          quizItem.classList.remove("quiz-item-enter-active");
          quizItem.classList.add("quiz-item-enter-done");
          quizQuestion.innerHTML =
            questions.properties["answer-" + current]["title"];
          quizProgress.innerHTML = `${current} / ${questions.required.length}`;
          getChoices(current, initChoices);
        }, 150);
      }, 150);

      // handle back button
      if (current > 1) {
        quizPrev.disabled = false;
        quizPrev.classList.add("is-visible");
      } else {
        quizPrev.disabled = true;
        quizPrev.classList.remove("is-visible");
      }
    };

    // init
    buildQuiz(currentQuestion);

    // controls
    // get next question
    const nextQuestion = () => {
      if (questions.required.length >= currentQuestion + 1) {
        currentQuestion += 1;
        buildQuiz(currentQuestion);
      } else {
        console.log("build recap");
      }
    };
    // get prev question
    const prevQuestion = () => {
      if (1 <= currentQuestion - 1) {
        currentQuestion -= 1;
        buildQuiz(currentQuestion);
      }
    };

    // check selected answer against answer key
    const checkChoice = (current) => {
      const correctAnswerText = answers.answerKey["answer-" + current][0];
      const selectedAnswerText =
        questions.properties["answer-" + current]["enum"][selectedAnswerIndex];
      if (correctAnswerText == selectedAnswerText) {
        const selectedAnswerVal = {
          answer: "answer-" + current,
          choice: selectedAnswerIndex,
        };

        if (!checkSelections(quizSelections, "answer", "answer-" + current)) {
          quizSelections.push(selectedAnswerVal);
        }
        quizAnswersCont
          .getElementsByClassName(SELECTED_CSS_CLASS)[0]
          .classList.add("correct");
        quizNext.disabled = false;
        quizNext.classList.add("is-visible");
        quizCheckAnswer.setAttribute("disabled", "true");
        quizItem.getElementsByClassName("quiz-selection-msg")[0].innerText =
          CORRECT_SELECTION_MSG;
      } else {
        // console.log("wrong");
        quizItem.getElementsByClassName("quiz-selection-msg")[0].innerText =
          INCORRECT_SELECTION_MSG;
        quizCheckAnswer.classList.add("faa-horizontal", "animated");
        setTimeout(() => {
          quizCheckAnswer.classList.remove("faa-horizontal", "animated");
        }, 2000);
      }
      // TODO: use resize observer
      quizQuestionOuter.style.height = quizItem.offsetHeight + "px";
    };

    quizNext.addEventListener("click", (e) => {
      nextQuestion();
    });

    quizPrev.addEventListener("click", (e) => {
      prevQuestion();
    });

    quizCheckAnswer.addEventListener("click", (e) => {
      checkChoice(currentQuestion);
    });
  });
}
