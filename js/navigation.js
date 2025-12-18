// Shared navigation for all pages
function initNavigation(currentPage) {
    const pages = {
        'index.html': 'Home',
        'dog-walk.html': 'Dog Walk Generator',
        'data-viewer.html': 'Data Highlights',
        'waitress-stats.html': 'Waitress Stats'
    };

    const navLinks = document.querySelectorAll('.nav-link');
    navLinks.forEach(link => {
        const href = link.getAttribute('href');
        if (href === currentPage) {
            link.className = 'nav-link px-4 py-2 rounded-lg bg-blue-600 text-white font-medium';
        } else {
            link.className = 'nav-link px-4 py-2 rounded-lg bg-gray-200 text-gray-700 font-medium hover:bg-gray-300';
        }
    });
}
