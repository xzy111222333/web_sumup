// ===== DOM元素获取 =====
const startScreen = document.getElementById("start-screen");
const quizScreen = document.getElementById("quiz-screen");
const resultScreen = document.getElementById("result-screen");
const startButton = document.getElementById("start-btn");
const questionText = document.getElementById("question-text");
const answersContainer = document.getElementById("answers-container");
const currentQuestionSpan = document.getElementById("current-question");
const totalQuestionsSpan = document.getElementById("total-questions");
const scoreSpan = document.getElementById("score");
const finalScoreSpan = document.getElementById("final-score");
const maxScoreSpan = document.getElementById("max-score");
const resultMessage = document.getElementById("result-message");
const restartButton = document.getElementById("restart-btn");
const progressBar = document.getElementById("progress");
const accuracySpan = document.getElementById("accuracy");
const wrongAnswersSpan = document.getElementById("wrong-answers");

// ===== 题目数据 =====
const quizQuestions = [
  {
    question: "世界上最高的山峰是？",
    answers: [
      { text: "珠穆朗玛峰", correct: true },
      { text: "乔戈里峰", correct: false },
      { text: "干城章嘉峰", correct: false },
      { text: "洛子峰", correct: false },
    ],
  },
  {
    question: "哪个行星被称为红色星球？",
    answers: [
      { text: "金星", correct: false },
      { text: "火星", correct: true },
      { text: "木星", correct: false },
      { text: "土星", correct: false },
    ],
  },
  {
    question: "地球上最大的海洋是？",
    answers: [
      { text: "大西洋", correct: false },
      { text: "印度洋", correct: false },
      { text: "北冰洋", correct: false },
      { text: "太平洋", correct: true },
    ],
  },
  {
    question: "以下哪个不是编程语言？",
    answers: [
      { text: "Java", correct: false },
      { text: "Python", correct: false },
      { text: "香蕉", correct: true },
      { text: "JavaScript", correct: false },
    ],
  },
  {
    question: "黄金的化学符号是什么？",
    answers: [
      { text: "Go", correct: false },
      { text: "Gd", correct: false },
      { text: "Au", correct: true },
      { text: "Ag", correct: false },
    ],
  },
];

// ===== 状态变量 =====
let currentQuestionIndex = 0;
let score = 0;
let answersDisabled = false;

// ===== 初始化 =====
totalQuestionsSpan.textContent = quizQuestions.length;
maxScoreSpan.textContent = quizQuestions.length;

// ===== 事件监听器 =====
startButton.addEventListener("click", startQuiz);
restartButton.addEventListener("click", restartQuiz);

// ===== 开始测验 =====
function startQuiz() {
  // 重置变量
  currentQuestionIndex = 0;
  score = 0;
  scoreSpan.textContent = 0;

  // 切换屏幕
  startScreen.classList.remove("active");
  quizScreen.classList.add("active");

  // 显示第一个问题
  showQuestion();
}

// ===== 显示问题 =====
function showQuestion() {
  // 重置状态
  answersDisabled = false;
  
  const currentQuestion = quizQuestions[currentQuestionIndex];
  
  // 更新问题编号
  currentQuestionSpan.textContent = currentQuestionIndex + 1;
  
  // 更新进度条
  const progressPercent = (currentQuestionIndex / quizQuestions.length) * 100;
  progressBar.style.width = progressPercent + "%";
  
  // 显示问题文本
  questionText.textContent = currentQuestion.question;
  
  // 清空之前的答案
  answersContainer.innerHTML = "";

  // 创建答案按钮
  currentQuestion.answers.forEach((answer) => {
    const button = document.createElement("button");
    button.textContent = answer.text;
    button.classList.add("answer-btn");
    
    // 使用dataset存储答案是否正确
    button.dataset.correct = answer.correct;
    button.addEventListener("click", selectAnswer);
    
    answersContainer.appendChild(button);
  });
}

// ===== 选择答案 =====
function selectAnswer(event) {
  // 防止重复点击
  if (answersDisabled) return;
  answersDisabled = true;

  const selectedButton = event.target;
  const isCorrect = selectedButton.dataset.correct === "true";

  // 显示所有答案的正确/错误状态
  Array.from(answersContainer.children).forEach((button) => {
    if (button.dataset.correct === "true") {
      button.classList.add("correct");
    } else if (button === selectedButton) {
      button.classList.add("incorrect");
    }
    // 禁用所有按钮
    button.style.pointerEvents = "none";
  });

  // 如果答案正确，增加分数
  if (isCorrect) {
    score++;
    scoreSpan.textContent = score;
  }

  // 延迟后显示下一题或结果
  setTimeout(() => {
    currentQuestionIndex++;
    
    // 检查是否还有更多问题
    if (currentQuestionIndex < quizQuestions.length) {
      showQuestion();
    } else {
      showResults();
    }
  }, 1500);
}

// ===== 显示结果 =====
function showResults() {
  // 切换屏幕
  quizScreen.classList.remove("active");
  resultScreen.classList.add("active");

  // 显示最终分数
  finalScoreSpan.textContent = score;

  // 计算正确率
  const percentage = Math.round((score / quizQuestions.length) * 100);
  accuracySpan.textContent = percentage + "%";

  // 计算错题数
  const wrongAnswers = quizQuestions.length - score;
  wrongAnswersSpan.textContent = wrongAnswers;

  // 根据分数显示不同的消息
  if (percentage === 100) {
    resultMessage.textContent = "完美！你是天才！";
  } else if (percentage >= 80) {
    resultMessage.textContent = "太棒了！你掌握得很好！";
  } else if (percentage >= 60) {
    resultMessage.textContent = "不错的表现！继续加油！";
  } else if (percentage >= 40) {
    resultMessage.textContent = "还不错！再试一次会更好！";
  } else {
    resultMessage.textContent = "继续学习！你会进步的！";
  }
}

// ===== 重新开始 =====
function restartQuiz() {
  resultScreen.classList.remove("active");
  startQuiz();
}

// ===== 键盘快捷键支持 =====
document.addEventListener("keydown", (event) => {
  // 在题目页按数字键1-4选择答案
  if (quizScreen.classList.contains("active") && !answersDisabled) {
    const key = parseInt(event.key);
    if (key >= 1 && key <= 4) {
      const buttons = answersContainer.children;
      if (buttons[key - 1]) {
        buttons[key - 1].click();
      }
    }
  }
  
  // 按Enter键开始或重新开始
  if (event.key === "Enter") {
    if (startScreen.classList.contains("active")) {
      startQuiz();
    } else if (resultScreen.classList.contains("active")) {
      restartQuiz();
    }
  }
});

