/**
 * @param {string} sidebarSelector - Селектор sidebar элемента
 * @param {string} overlaySelector - Селектор overlay элемента
 * @param {string} openSelector - Селектор кнопок открытия sidebar
 * @param {string} closeSelector - Селектор кнопки закрытия sidebar
 */
function initSidebar(sidebarSelector, overlaySelector, openSelector, closeSelector) {
    const sidebar = document.querySelector(sidebarSelector);
    const overlay = document.querySelector(overlaySelector);
    const openButtons = openSelector ? document.querySelectorAll(openSelector) : [];
    const closeBtn = closeSelector ? document.querySelector(closeSelector) : null;

    if (!sidebar || !overlay) return;

    function openSidebar(event) {
        if (event) {
            event.preventDefault();
        }
        sidebar.classList.add('is-open');
        overlay.classList.add('is-active');
        document.body.style.overflow = 'hidden';
    }

    function closeSidebar() {
        sidebar.classList.remove('is-open');
        overlay.classList.remove('is-active');
        document.body.style.overflow = '';
    }

    // Обработчик открытия
    if (openButtons.length) {
        openButtons.forEach((button) => {
            button.addEventListener('click', openSidebar);
        });
    }

    // Обработчик закрытия через кнопку
    if (closeBtn) {
        closeBtn.addEventListener('click', closeSidebar);
    }

    // Обработчик закрытия через overlay
    overlay.addEventListener('click', closeSidebar);

    // Закрытие по Escape
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && sidebar.classList.contains('is-open')) {
            closeSidebar();
        }
    });
}


document.addEventListener('DOMContentLoaded', () => {
    initSidebar('#sidebar', '#sidebarOverlay', '[data-sidebar-open]', '.sidebar__close');
});

