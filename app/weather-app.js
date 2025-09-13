import { goToPrevPage, goToNextPage } from "./pagination.js";
import { sortAscending, sortDescending, searchCities, applyClimateFilter } from "./tool-bar.js"
import { renderCards, renderCardModal, closeCardModal } from "./card-renderer.js"

let cardsPerPage, weatherCards, filteredCards, weatherTypes, temperatureColors, temperatureUnit, selectedWeatherTypes;

// HTML Elements
const prevBtn = document.getElementById('prevButton');
const nextBtn = document.getElementById('nextButton');


// Fetch API
async function fetchData(url) {
    try {
        const response = await fetch(url);
        const data = await response.json();
        weatherCards = data.cities;
        filteredCards = [...weatherCards];
        cardsPerPage = data.metadata.pageSize;
        temperatureColors = data.metadata.temperatureColor;
        temperatureUnit = data.metadata.unit;
        weatherTypes = data.metadata.weatherType;
        selectedWeatherTypes = [...weatherTypes];
    } catch (err) {
        console.log('Error in fetching data', err);
    }
}

// Render App
async function renderApp() {
    await fetchData("https://raw.githubusercontent.com/Lokenath/JSON_DATA/master/data.json");
    renderCards();
}

// Utils
function setFilteredCards(cards) {
    filteredCards = cards
}
function setSelectedWeatherTypes(types) {
    selectedWeatherTypes = types
}


// Listeners
prevBtn.addEventListener('click', () => goToPrevPage(renderCards));
nextBtn.addEventListener('click', () => goToNextPage(renderCards));
document.querySelector('#asc').addEventListener('click', () => sortAscending(renderCards))
document.querySelector('#dec').addEventListener('click', () => sortDescending(renderCards))
document.querySelector('#city-search').addEventListener('input', (ev) => searchCities(ev.target.value, renderCards));
document.querySelector('.climate-filters').addEventListener('click', (ev) => applyClimateFilter(ev.target.value, renderCards));
document.querySelector('#card-container').addEventListener('click', (ev) => renderCardModal(ev.target.closest('.card')))
document.querySelector('#modal-close').addEventListener('click', (ev) => closeCardModal(ev))

renderApp();

export {
    weatherCards,
    filteredCards,
    setFilteredCards,
    cardsPerPage,
    temperatureUnit,
    temperatureColors,
    selectedWeatherTypes,
    setSelectedWeatherTypes
}