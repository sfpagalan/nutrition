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
const mealModal = document.getElementById('meal-modal');
const mealResult = document.getElementById('meal-result');
const loadingScreen = document.getElementById('loading-screen');
const mealPlanBtn = document.getElementById('meal-plan-btn');
const generateMealButton = document.getElementById('generate-meal-btn');

let score = 0;
let health = 100;
let currentQuestionIndex = 0;
let goodFoodCount = 0;
let badFoodCount = 0;
let mealData = null;

fetch('meals.json')
    .then(response => {
        if (!response.ok) {
            throw new Error("Failed to load meal data.");
        }
        return response.json();
    })
    .then(data => {
        mealData = data;
        console.log("Meal JSON Loaded:", mealData);
    })
    .catch(error => console.error("Error loading meals.json:", error));

if (mealPlanBtn) {
    mealPlanBtn.addEventListener('click', () => {
        mealModal.classList.remove('hidden');
        statisticsScreen.classList.add('hidden');
    });
}

if (generateMealButton) {
    generateMealButton.addEventListener('click', () => {
        if (!mealData) {
            console.error("Meal data is not available yet!");
            return;
        }
        
        const dietPreference = document.getElementById('diet').value;
        console.log("Selected Diet:", dietPreference);
        
        loadingScreen.classList.remove('hidden');
        mealResult.classList.add('hidden');
        
        setTimeout(() => {
            loadingScreen.classList.add('hidden');
            mealResult.classList.remove('hidden');

            const breakfast = getRandomMeal(mealData.breakfast[dietPreference]);
            const lunch = getRandomMeal(mealData.lunch[dietPreference]);
            const dinner = getRandomMeal(mealData.dinner[dietPreference]);

            if (!breakfast || !lunch || !dinner) {
                console.error("Meal selection failed!");
                return;
            }

            document.getElementById('breakfast').innerHTML = formatMealCard(breakfast);
            document.getElementById('lunch').innerHTML = formatMealCard(lunch);
            document.getElementById('dinner').innerHTML = formatMealCard(dinner);
        }, 1500);
    });
}

function getRandomMeal(arr) {
    return arr[Math.floor(Math.random() * arr.length)];
}

function formatMealCard(meal) {
    return `<h3>${meal.name}</h3>
            <img src="${meal.image}" alt="${meal.name}">
            <p>${meal.description}</p>
            <ul>${meal.ingredients.map(ingredient => `<li>${ingredient}</li>`).join('')}</ul>`;
}

document.querySelectorAll(".close-modal").forEach(button => {
    button.addEventListener("click", () => {
        mealModal.classList.add('hidden');
        statisticsScreen.classList.remove('hidden');
    });
});

const enemyImages = [
    'images/enemies/bread.png', 'images/enemies/cookies.png', 'images/enemies/fries.png',
    'images/enemies/icecream.png', 'images/enemies/soda.png', 'images/enemies/donut.png',
    'images/enemies/liquior.png', 'images/enemies/canned.png', 'images/enemies/pork.png'
];

const allyImages = [
    'images/allies/broccoli.png', 'images/allies/almonds.png', 'images/allies/apple.png',
    'images/allies/avocado.png', 'images/allies/banana.png', 'images/allies/salmon.png',
    'images/allies/oatmeal.png', 'images/allies/eggs.png', 'images/allies/berries.png'
];

const questions = [
    {
      question: "You have Type 2 Diabetes. Which meal choice shows you understand how to control your blood sugar?",
      answers: [
        { text: "Fried chicken with mashed potatoes and soda", correct: false },
        { text: "Grilled salmon with brown rice and steamed broccoli", correct: true },
        { text: "Pepperoni pizza and sweet tea", correct: false },
        { text: "White bread sandwich and chips", correct: false }
      ]
    },
    {
      question: "You're learning how to check your blood sugar. When should you test it?",
      answers: [
        { text: "Only when I feel dizzy or tired", correct: false },
        { text: "Before meals and at bedtime", correct: true },
        { text: "Once a week, in the morning", correct: false },
        { text: "After every snack", correct: false }
      ]
    },
    {
      question: "You ask how to care for your feet. Which response shows good understanding?",
      answers: [
        { text: "I’ll check my feet daily and wear fitted shoes.", correct: true },
        { text: "I’ll soak my feet in hot water every night.", correct: false },
        { text: "I’ll cut my toenails really short.", correct: false },
        { text: "I can go barefoot at home to let my feet breathe.", correct: false }
      ]
    },
    {
      question: "You want to manage stress to help control your diabetes. Which technique is helpful?",
      answers: [
        { text: "Ignoring stress because it doesn’t affect blood sugar", correct: false },
        { text: "Practicing deep breathing and daily walks", correct: true },
        { text: "Eating comfort food during stressful days", correct: false },
        { text: "Avoiding exercise when overwhelmed", correct: false }
      ]
    },
    {
      question: "You’re choosing a snack. Which is the best option to avoid a spike in blood sugar?",
      answers: [
        { text: "Fruit juice and cookies", correct: false },
        { text: "Plain nuts and apple slices", correct: true },
        { text: "Chocolate bar and soda", correct: false },
        { text: "Potato chips and sweet tea", correct: false }
      ]
    },
    {
      question: "You’re reviewing signs of high blood sugar. Which symptoms should you report?",
      answers: [
        { text: "Shakiness and sweating", correct: false },
        { text: "Blurred vision and frequent urination", correct: true },
        { text: "Cold, clammy skin", correct: false },
        { text: "Hunger and fatigue", correct: false }
      ]
    }
  ];
  

startButton.addEventListener('click', () => {
    modalScreen.style.display = 'none';
    gameContainer.classList.remove('hidden');
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
    document.querySelector('.left-side').innerHTML = '';
    document.querySelector('.right-side').innerHTML = '';

    enemyImages.forEach(imgSrc => spawnFood(imgSrc, 'enemy', '.right-side'));
    allyImages.forEach(imgSrc => spawnFood(imgSrc, 'ally', '.left-side'));
}

function spawnFood(imgSrc, type, side) {
    const food = document.createElement('img');
    food.src = imgSrc;
    food.classList.add(type);
    document.querySelector(side).appendChild(food);
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
    if (currentQuestionIndex < questions.length) {
        showQuestion(questions[currentQuestionIndex]);
    } else {
        endGame();
    }
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
    gameBoard.style.display = 'none';
    questionContainer.style.display = 'none';
    document.querySelector('.score-board').style.display = 'none';
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
        <button id="meal-plan-btn" class="btn">Generate Meal Plan</button>
    `; 

    statisticsScreen.style.display = 'block';
    statisticsScreen.style.marginTop = '20px';
    statisticsScreen.style.border = '2px solid #ff6f61';
    statisticsScreen.style.borderRadius = '10px';
    statisticsScreen.style.backgroundColor = 'rgba(255, 255, 255, 0.9)';

    setTimeout(() => {
        const ctx = document.getElementById('lifestyleChart').getContext('2d');

        const hasAllies = allyImages.length > goodFoodCount;
        const hasEnemies = enemyImages.length > badFoodCount;

        new Chart(ctx, {
            type: 'pie',
            data: {
                labels: ['Healthy Choices', 'Unhealthy Choices'],
                datasets: [{
                    data: [badFoodCount, goodFoodCount],
                    backgroundColor: [
                        hasAllies ? '#4CAF50' : '#d3d3d3', 
                        hasEnemies ? '#FF6F61' : '#d3d3d3' 
                    ],
                    borderWidth: 1
                }]
            },
            options: {
                responsive: false, 
                maintainAspectRatio: false, 
                plugins: {
                    legend: {
                        display: true,
                        position: 'bottom', 
                        labels: {
                            boxWidth: 20,
                            padding: 10,
                            usePointStyle: true,
                            color: '#333'
                        },
                    }
                },
                layout: {
                    padding: {
                        bottom: 20  
                    }
                }
            }
        });
    }, 100); 

    document.getElementById('meal-plan-btn').addEventListener('click', () => {
        mealModal.classList.remove('hidden');
        statisticsScreen.classList.add('hidden');
    });
}

function closeMealGenerator() {
    mealModal.classList.add('hidden');
    statisticsScreen.classList.remove('hidden');
}

function restartMealGenerator() {
    document.getElementById('meal-result').classList.add('hidden');
    document.getElementById('meal-generator').classList.remove('hidden');
}

document.querySelectorAll(".close-modal").forEach(button => {
    button.addEventListener("click", closeMealGenerator);
});

function getRandomMeal(arr) {
    return arr[Math.floor(Math.random() * arr.length)];
}

function formatMealCard(meal) {
    return `<h3>${meal.name}</h3><img src="${meal.image}" alt="${meal.name}"><p>${meal.description}</p>`;
}

document.getElementById('generate-meal-btn').addEventListener('click', () => {
    console.log("Generate Meal Plan button clicked!");
});

