// Shared header component
function renderHeader(activePage) {
    const header = `
        <header class="bg-white shadow-sm">
            <div class="max-w-6xl mx-auto px-4 py-6">
                <h1 class="text-3xl font-bold text-gray-900">Tyler's Tools</h1>
                <p class="text-gray-600 mt-1">A collection of useful small tools</p>
            </div>
            <nav class="border-t border-gray-200">
                <div class="max-w-6xl mx-auto px-4 py-4">
                    <div class="flex flex-wrap gap-2">
                        <a href="index.html" class="nav-link px-4 py-2 rounded-lg ${activePage === 'index.html' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'} font-medium">Home</a>
                        <a href="dog-walk.html" class="nav-link px-4 py-2 rounded-lg ${activePage === 'dog-walk.html' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'} font-medium">Dog Walking</a>
                        <a href="waitress-stats.html" class="nav-link px-4 py-2 rounded-lg ${activePage === 'waitress-stats.html' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'} font-medium">Waitress Stats</a>
                        <a href="food-finder.html" class="nav-link px-4 py-2 rounded-lg ${activePage === 'food-finder.html' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'} font-medium">Food Finder</a>
                    </div>
                </div>
            </nav>
        </header>
    `;

    // Insert header at the beginning of body
    document.body.insertAdjacentHTML('afterbegin', header);
}
