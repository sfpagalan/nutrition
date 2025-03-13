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
    `; // ✅ Properly closing the template literal here

    statisticsScreen.style.display = 'block';
    statisticsScreen.style.marginTop = '20px';
    statisticsScreen.style.border = '2px solid #ff6f61';
    statisticsScreen.style.borderRadius = '10px';
    statisticsScreen.style.backgroundColor = 'rgba(255, 255, 255, 0.9)';

    // Generate the pie chart
    const ctx = document.getElementById('lifestyleChart').getContext('2d');

    // Check if there are remaining enemies and allies
    const hasAllies = allyImages.length > goodFoodCount;
    const hasEnemies = enemyImages.length > badFoodCount;

    const lifestyleChart = new Chart(ctx, {
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
}
