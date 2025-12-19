// Restaurant Finder functionality
let currentRestaurant = null;

function generateRestaurant() {
    // Get selected cuisine filters
    const cuisineCheckboxes = document.querySelectorAll('.cuisine-filter:checked');
    const selectedCuisines = Array.from(cuisineCheckboxes).map(cb => cb.value);

    // Get selected meal time filters
    const mealtimeCheckboxes = document.querySelectorAll('.mealtime-filter:checked');
    const selectedMealTimes = Array.from(mealtimeCheckboxes).map(cb => cb.value);

    // Filter restaurants based on selections
    const filteredRestaurants = restaurantLocations.filter(restaurant => {
        const matchesCuisine = selectedCuisines.includes(restaurant.cuisine);
        const matchesMealTime = selectedMealTimes.some(time => restaurant.mealTimes.includes(time));
        return matchesCuisine && matchesMealTime;
    });

    // Hide previous results
    document.getElementById('restaurant-result').classList.add('hidden');
    document.getElementById('no-results').classList.add('hidden');

    // Check if any restaurants match the filters
    if (filteredRestaurants.length === 0) {
        document.getElementById('no-results').classList.remove('hidden');
        currentRestaurant = null;
        return;
    }

    // Select a random restaurant from filtered results, avoiding the current one if possible
    let restaurant;
    if (filteredRestaurants.length === 1) {
        restaurant = filteredRestaurants[0];
    } else {
        // Filter out the current restaurant if it exists
        const availableRestaurants = currentRestaurant
            ? filteredRestaurants.filter(r => r.name !== currentRestaurant.name)
            : filteredRestaurants;

        // If filtering removed all options, use the full filtered list
        const optionsToChooseFrom = availableRestaurants.length > 0 ? availableRestaurants : filteredRestaurants;
        restaurant = optionsToChooseFrom[Math.floor(Math.random() * optionsToChooseFrom.length)];
    }

    currentRestaurant = restaurant;

    // Format meal times for display
    const mealTimesDisplay = restaurant.mealTimes
        .map(time => time.charAt(0).toUpperCase() + time.slice(1))
        .join(', ');

    // Display the restaurant
    document.getElementById('restaurant-name').textContent = restaurant.name;
    document.getElementById('restaurant-description').textContent = restaurant.description;
    document.getElementById('restaurant-cuisine').textContent = restaurant.cuisine;
    document.getElementById('restaurant-mealtimes').textContent = mealTimesDisplay;
    document.getElementById('restaurant-result').classList.remove('hidden');
}

// Reset all filters to checked
function resetFilters() {
    document.querySelectorAll('.cuisine-filter, .mealtime-filter').forEach(checkbox => {
        checkbox.checked = true;
    });

    // Hide any results and reset current restaurant
    document.getElementById('restaurant-result').classList.add('hidden');
    document.getElementById('no-results').classList.add('hidden');
    currentRestaurant = null;
}

// Unselect all cuisine filters
function unselectAllCuisine() {
    document.querySelectorAll('.cuisine-filter').forEach(checkbox => {
        checkbox.checked = false;
    });

    // Hide any results and reset current restaurant
    document.getElementById('restaurant-result').classList.add('hidden');
    document.getElementById('no-results').classList.add('hidden');
    currentRestaurant = null;
}

// Unselect all meal time filters
function unselectAllMealTime() {
    document.querySelectorAll('.mealtime-filter').forEach(checkbox => {
        checkbox.checked = false;
    });

    // Hide any results and reset current restaurant
    document.getElementById('restaurant-result').classList.add('hidden');
    document.getElementById('no-results').classList.add('hidden');
    currentRestaurant = null;
}
