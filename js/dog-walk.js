// Dog Walk Generator functionality
function generateDogWalk() {
    // Get selected distance filters
    const distanceCheckboxes = document.querySelectorAll('.distance-filter:checked');
    const selectedDistances = Array.from(distanceCheckboxes).map(cb => cb.value);

    // Get selected type filters
    const typeCheckboxes = document.querySelectorAll('.type-filter:checked');
    const selectedTypes = Array.from(typeCheckboxes).map(cb => cb.value);

    // Filter locations based on selections
    const filteredLocations = dogWalkLocations.filter(location => {
        const matchesDistance = selectedDistances.includes(location.distance);
        const matchesType = selectedTypes.includes(location.type);
        return matchesDistance && matchesType;
    });

    // Hide previous results
    document.getElementById('dog-walk-result').classList.add('hidden');
    document.getElementById('no-results').classList.add('hidden');

    // Check if any locations match the filters
    if (filteredLocations.length === 0) {
        document.getElementById('no-results').classList.remove('hidden');
        return;
    }

    // Select a random location from filtered results
    const location = filteredLocations[Math.floor(Math.random() * filteredLocations.length)];

    // Display the location
    document.getElementById('dog-walk-location').textContent = location.name;
    document.getElementById('dog-walk-description').textContent = location.description;
    document.getElementById('dog-walk-distance').textContent = location.distance;
    document.getElementById('dog-walk-type').textContent = location.type;
    document.getElementById('dog-walk-result').classList.remove('hidden');
}
