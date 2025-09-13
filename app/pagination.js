import { filteredCards, cardsPerPage } from "./weather-app.js";

let currentPage = 1;
const totalPages = () => Math.ceil(filteredCards.length / cardsPerPage);


export function getCurrentCards() {
    const start = (currentPage - 1) * cardsPerPage;
    const end = start + cardsPerPage;
    return filteredCards.slice(start, end);
}

export function goToNextPage(renderFn) {
    if (currentPage < totalPages()) {
        currentPage++;
        renderFn();
    }
}

export function goToPrevPage(renderFn) {
    if (currentPage > 1) {
        currentPage--;
        renderFn();
    }
}

export function resetPage() {
    currentPage = 1;
}

export function getPageInfo() {
    return { currentPage, totalPages: totalPages() };
}
