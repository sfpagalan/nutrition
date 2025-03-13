const startButton = document.getElementById('start-btn');
const modalScreen = document.getElementById('modal-screen');
const gameContainer = document.querySelector('.game-container');
const gameBoard = document.getElementById('game-board');
const questionContainer = document.getElementById('question-container');
const questionElement = document.getElementById('question');
const answerButtonsElement = document.getElementById('answer-buttons');
const scoreElement = document.getElementById('score');
const healthElement = document.getElementById('health');
const statisticsScreen = document.getElementById('statistics-screen');
const correctSound = document.getElementById('correct-sound');
const wrongSound = document.getElementById('wrong-sound');

let score = 0;
let health = 100;
let currentQuestionIndex = 0;
let goodFoodCount = 0;
let badFoodCount = 0;

// Define enemy and ally images
const enemyImages = [
    'images/enemies/bread.png',
    'images/enemies/cookies.png',
    'images/enemies/fries.png',
    'images/enemies/icecream.png',
    'images/enemies/soda.png',
    'images/enemies/donut.png',
    'images/enemies/liquior.png',
    'images/enemies/canned.png',
    'images/enemies/pork.png'
];

const allyImages = [
    'images/allies/broccoli.png',
    'images/allies/almonds.png',
    'images/allies/apple.png',
    'images/allies/avocado.png',
    'images/allies/banana.png',
    'images/allies/salmon.png',
    'images/allies/oatmeal.png',
    'images/allies/eggs.png',
    'images/allies/berries.png'

];

// Define questions
const questions = [
    { question: "Which is a complex carbohydrate?", answers: [{ text: "White bread", correct: false }, { text: "Brown rice", correct: true }] },
    { question: "Which type of fat is healthy?", answers: [{ text: "Trans fat", correct: false }, { text: "Monounsaturated fat", correct: true }] },
    { question: "Which food is high in fiber?", answers: [{ text: "Broccoli", correct: true }, { text: "Soda", correct: false }] },
    { question: "Which vitamin helps control blood sugar?", answers: [{ text: "Vitamin D", correct: true }, { text: "Vitamin C", correct: false }] },
    { question: "Best fruit for diabetics?", answers: [{ text: "Berries", correct: true }, { text: "Banana", correct: false }] },
    { question: "Which type of exercise is best for diabetes?", answers: [{ text: "Aerobic", correct: true }, { text: "None", correct: false }] },
    { question: "What is a good snack for diabetics?", answers: [{ text: "Nuts", correct: true }, { text: "Candy", correct: false }] },
    { question: "Which drink is better for diabetics?", answers: [{ text: "Water", correct: true }, { text: "Soda", correct: false }] }
];

// Close modal and start game
startButton.addEventListener('click', () => {
    modalScreen.style.display = 'none';
    gameContainer.classList.remove('hidden');
    gameBoard.classList.remove('hidden');
    questionContainer.classList.remove('hidden');
    startGame();
});

function startGame() {
    score = 0;
    health = 100;
    goodFoodCount = 0;
    badFoodCount = 0;
    currentQuestionIndex = 0;
    scoreElement.innerText = score;
    healthElement.innerText = `${health}%`;
    spawnFoods();
    setNextQuestion();
}

function spawnFoods() {
    const leftSide = document.querySelector('.left-side');
    const rightSide = document.querySelector('.right-side');
    leftSide.innerHTML = '';  // Clear previous foods
    rightSide.innerHTML = '';  // Clear previous foods

    enemyImages.forEach(imgSrc => spawnFood(imgSrc, 'enemy', '.right-side'));
    allyImages.forEach(imgSrc => spawnFood(imgSrc, 'ally', '.left-side'));
}

function spawnFood(imgSrc, type, side) {
    const food = document.createElement('img');
    food.src = imgSrc;
    food.classList.add(type);

    // Ensure enemies go to the right, allies go to the left
    if (type === 'enemy') {
        document.querySelector('.right-side').appendChild(food);
    } else {
        document.querySelector('.left-side').appendChild(food);
    }
}


function eliminateFood(type) {
    const foods = document.querySelectorAll(`.${type}`);
    if (foods.length > 0) {
        const food = foods[Math.floor(Math.random() * foods.length)];
        food.classList.add('disappear');
        setTimeout(() => food.remove(), 500);
    }
}


function setNextQuestion() {
    resetState();
    showQuestion(questions[currentQuestionIndex]);
}

function showQuestion(question) {
    questionElement.innerText = question.question;
    question.answers.forEach(answer => {
        const button = document.createElement('button');
        button.innerText = answer.text;
        button.classList.add('btn');
        button.dataset.correct = answer.correct ? "true" : "false";
        button.onclick = selectAnswer;
        answerButtonsElement.appendChild(button);
    });
}

function resetState() {
    answerButtonsElement.innerHTML = '';
}

function selectAnswer(e) {
    const correct = e.target.dataset.correct === "true";
    if (correct) {
        correctSound.play();
        score += 10;
        badFoodCount++;
        eliminateFood('enemy');
    } else {
        wrongSound.play();
        health -= 20;
        goodFoodCount++;
        eliminateFood('ally');
    }
    scoreElement.innerText = score;
    healthElement.innerText = `${health}%`;
    currentQuestionIndex++;
    if (health <= 0 || currentQuestionIndex >= questions.length) endGame();
    else setNextQuestion();
}

function endGame() {
    // Hide game elements
    gameBoard.style.display = 'none';
    questionContainer.style.display = 'none';
    document.querySelector('.score-board').style.display = 'none';
    
    // Replace with statistics screen
    showStatistics();
}

function showStatistics() {
    const totalFoods = goodFoodCount + badFoodCount;
    const healthyPercentage = Math.round((badFoodCount / totalFoods) * 100);
    const unhealthyPercentage = Math.round((goodFoodCount / totalFoods) * 100);

    statisticsScreen.innerHTML = `
        <h2>Lifestyle Assessment</h2>
        <div class="stats-summary">
            <p><strong>Summary:</strong></p>
            <p>Good Foods Eliminated: ${goodFoodCount}</p>
            <p>Bad Foods Eliminated: ${badFoodCount}</p>
        </div>
        
        <p><strong>The chart below reflects how well you understand and manage Type 2 Diabetes based on your choices during the quiz.</strong></p>
        <p>Your ability to eliminate unhealthy foods while keeping healthy ones shows how informed you are about making the right dietary decisions. The more healthy foods that remain, the better your knowledge of diabetes management. Similarly, eliminating more unhealthy foods indicates a stronger grasp on making healthier choices.</p>
        
        <canvas id="lifestyleChart" width="300" height="300"></canvas>
        
        <p><strong>Remember:</strong> Consistently making the right choices can significantly impact managing diabetes effectively. Keep learning and strive to improve your lifestyle!</p>
        
        <button onclick="location.reload()" class="btn">Play Again</button>
    `; // ✅ Closing template string correctly

    // Ensure statistics screen is visible
    statisticsScreen.style.display = 'block';
    statisticsScreen.style.marginTop = '20px';
    statisticsScreen.style.border = '2px solid #ff6f61';
    statisticsScreen.style.borderRadius = '10px';
    statisticsScreen.style.backgroundColor = 'rgba(255, 255, 255, 0.9)';

    // Wait for DOM to update before initializing chart
    setTimeout(() => {
        const ctx = document.getElementById('lifestyleChart').getContext('2d');

        // Check if there are remaining enemies and allies
        const hasAllies = allyImages.length > goodFoodCount;
        const hasEnemies = enemyImages.length > badFoodCount;

        new Chart(ctx, {
            type: 'pie',
            data: {
                labels: ['Healthy Choices', 'Unhealthy Choices'],
                datasets: [{
                    data: [badFoodCount, goodFoodCount],
                    backgroundColor: [
                        hasAllies ? '#4CAF50' : '#d3d3d3',  // Green for allies, gray if none left
                        hasEnemies ? '#FF6F61' : '#d3d3d3'   // Red for enemies, gray if none left
                    ],
                    borderWidth: 1
                }]
            },
            options: {
                responsive: false,  // Disable responsive resizing
                maintainAspectRatio: false,  // Prevent aspect ratio enforcement
                plugins: {
                    legend: {
                        display: true,
                        position: 'bottom',  // Move legend to the bottom
                        labels: {
                            boxWidth: 20,         // Smaller legend boxes
                            padding: 10,          // Padding between legend items
                            usePointStyle: true,  // Use circles instead of squares for legend markers
                            color: '#333'         // Text color for legend
                        },
                    }
                },
                layout: {
                    padding: {
                        bottom: 20  // Extra space for horizontal legend
                    }
                }
            }
        });
    }, 100); // Small delay to ensure the canvas element is present
}
