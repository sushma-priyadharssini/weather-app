import { weatherCards, filteredCards, setFilteredCards, selectedWeatherTypes, setSelectedWeatherTypes } from "./weather-app.js";
import { resetPage } from "./pagination.js"

export function sortAscending(renderFn) {
    filteredCards.sort((a, b) => a.temperature - b.temperature);
    renderFn();
}

export function sortDescending(renderFn) {
    filteredCards.sort((a, b) => b.temperature - a.temperature);
    renderFn();
}

export function searchCities(searchValue, renderFn) {
    // Implement debounce
    if (searchValue.trim() === "") {
        setFilteredCards([...weatherCards])
    } else {
        const searchData = weatherCards.filter(({ name }) => {
            return !!name.toLowerCase().match(searchValue.toLowerCase());
        });
        setFilteredCards(searchData)
    }

    resetPage();
    renderFn();
}

function toggleFilter(type) {
    return selectedWeatherTypes.includes(type) ?
        selectedWeatherTypes.filter(t => t !== type) :
        [...selectedWeatherTypes, type]
}

export function applyClimateFilter(weatherType, renderFn) {
    // clear search input when filter is applied
    setSelectedWeatherTypes(toggleFilter(weatherType))
    const filterData = weatherCards.filter(({ type }) => selectedWeatherTypes.includes(type));

    setFilteredCards(filterData)
    resetPage();
    renderFn();
}