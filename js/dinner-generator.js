// Dinner Generator functionality
function generateDinners() {
    const mealCount = parseInt(document.getElementById('meal-count').value);

    // Hide previous results
    document.getElementById('dinner-results').classList.add('hidden');

    // Get random dinners without repeats
    const selectedDinners = [];
    const availableDinners = [...dinnerIdeas];

    for (let i = 0; i < mealCount && availableDinners.length > 0; i++) {
        const randomIndex = Math.floor(Math.random() * availableDinners.length);
        selectedDinners.push(availableDinners[randomIndex]);
        availableDinners.splice(randomIndex, 1);
    }

    // Display the results
    const resultsContainer = document.getElementById('dinner-list');
    resultsContainer.innerHTML = '';

    selectedDinners.forEach((dinner, index) => {
        const dinnerElement = document.createElement('div');
        dinnerElement.className = 'bg-green-50 border border-green-200 rounded-lg p-4 flex items-center justify-between';
        dinnerElement.innerHTML = `
            <div class="flex items-center gap-3">
                <span class="text-2xl font-bold text-green-700">${index + 1}</span>
                <span class="text-lg font-medium text-gray-900">${dinner.name}</span>
            </div>
        `;
        resultsContainer.appendChild(dinnerElement);
    });

    document.getElementById('dinner-results').classList.remove('hidden');
}
