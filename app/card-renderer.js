import { weatherCards, temperatureUnit, temperatureColors } from "./weather-app.js"
import { getCurrentCards, getPageInfo } from "./pagination.js";

// HTML Elements
const cardContainer = document.getElementById('card-container');
const prevBtn = document.getElementById('prevButton');
const nextBtn = document.getElementById('nextButton');

function getTemperatureColor(t) {
    const range = temperatureColors.find((colorRange) =>
        (t >= colorRange.range[0] && t <= colorRange.range[1]));
    return range.color
}

function renderCard(card) {
    const { name, temperature, type, description } = card;
    return `
        <div class="card-details" id="cityName">${name}</div>
        <div class="card-details" id="temp">
        <span style="color:${getTemperatureColor(temperature)};font-size: 30px;">${temperature}</span>
        <span>${temperatureUnit}</span></div>
        <div class="card-details" id="climateType">${type}</div>
        <div class="card-details" id="desc" style="display:none;">${description}</div>
    `
}

export function renderCards() {
    cardContainer.innerHTML = "";
    const currentCards = getCurrentCards();

    currentCards.forEach(card => {
        const listItem = document.createElement('li');
        listItem.setAttribute('data-index', card.id);
        listItem.className = 'card';
        listItem.innerHTML = renderCard(card)
        cardContainer.appendChild(listItem);
    });
    renderFooter();
}


function renderFooter() {
    // Update button states
    const { currentPage, totalPages } = getPageInfo();
    prevBtn.disabled = currentPage === 1;
    nextBtn.disabled = currentPage === totalPages;
}

export function renderCardModal(cardEl) {
    cardEl.classList.add('selected');
    const dataIndex = cardEl.getAttribute('data-index');
    const card = weatherCards.find(c => c.id === parseInt(dataIndex));

    document.querySelector('.card-modal').classList.add('is-modal-visible');
    document.querySelector('.body-fadeout').classList.add('is-faded-out');

    const weatherDetailsUI = renderCard(card)
    document.querySelector('.card-modal-details').innerHTML = `${weatherDetailsUI}
        <div class="modal-card-details" id="desc">${card.description}</div>`
}

export function closeCardModal() {
    // selectedCard.classList.remove('selected');
    document.querySelector('.card-modal').classList.remove('is-modal-visible');
    document.querySelector('.body-fadeout').classList.remove('is-faded-out')
}

