/**
 * @param {string} itemSelector - Селектор элементов
 * @param {string} labelSelector - Селектор текста страницы
 * @param {string} prevSelector - Селектор кнопки "назад"
 * @param {string} nextSelector - Селектор кнопки "вперед"
 * @param {number} perPage - Элементов на странице
 */
function initPagination(itemSelector, labelSelector, prevSelector, nextSelector, perPage) {
    const items = document.querySelectorAll(itemSelector);
    const label = document.querySelector(labelSelector);
    const prev = document.querySelector(prevSelector);
    const next = document.querySelector(nextSelector);

    if (!items.length || !label || !prev || !next) return;

    const total = Math.ceil(items.length / perPage);
    let page = 1;

    function render() {
        const start = (page - 1) * perPage;
        items.forEach((el, i) => el.style.display = (i >= start && i < start + perPage) ? '' : 'none');
        label.textContent = `${page}/${total}`;
        prev.disabled = page === 1;
        next.disabled = page === total;
    }

    prev.onclick = () => { if (page > 1) { page--; render(); } };
    next.onclick = () => { if (page < total) { page++; render(); } };

    render();
}

// Использование:
// document.addEventListener('DOMContentLoaded', () => {
//     initPagination('.faq-item', '.faq-pagination-label', '.faq-pagination-prev-button', '.faq-pagination-next-button', 4);
//     initPagination('.review-item', '.review-pagination-label', '.review-pagination-prev-button', '.review-pagination-next-button', 5);
// });