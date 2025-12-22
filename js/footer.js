// Shared footer component
function renderFooter() {
    const footer = `
        <footer class="bg-white border-t border-gray-200 mt-16">
            <div class="max-w-6xl mx-auto px-4 py-6 text-center text-gray-600 text-sm">
                Tyler Millis • Built with ❤️
            </div>
        </footer>
    `;

    // Insert footer at the end of body
    document.body.insertAdjacentHTML('beforeend', footer);
}
