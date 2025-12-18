// Data Highlights Viewer functionality
const dataHighlights = [
    { title: "Total Users", value: "12,847", description: "Active users across all platforms this month" },
    { title: "Revenue Growth", value: "+23%", description: "Year-over-year revenue increase" },
    { title: "Customer Satisfaction", value: "4.8/5.0", description: "Average rating from customer surveys" },
    { title: "Projects Completed", value: "156", description: "Successfully delivered projects this quarter" },
    { title: "Response Time", value: "2.3 hours", description: "Average customer support response time" },
    { title: "Team Members", value: "47", description: "Talented people working on our mission" }
];

let currentHighlight = 0;

function updateHighlightDisplay() {
    const highlight = dataHighlights[currentHighlight];
    document.getElementById('highlight-title').textContent = highlight.title;
    document.getElementById('highlight-value').textContent = highlight.value;
    document.getElementById('highlight-description').textContent = highlight.description;
    document.getElementById('highlight-counter').textContent = `${currentHighlight + 1} of ${dataHighlights.length}`;
}

function nextHighlight() {
    currentHighlight = (currentHighlight + 1) % dataHighlights.length;
    updateHighlightDisplay();
}

function previousHighlight() {
    currentHighlight = (currentHighlight - 1 + dataHighlights.length) % dataHighlights.length;
    updateHighlightDisplay();
}

// Initialize display when page loads
document.addEventListener('DOMContentLoaded', function() {
    updateHighlightDisplay();
});
