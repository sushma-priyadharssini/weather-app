const url = "https://raw.githubusercontent.com/Lokenath/JSON_DATA/master/data.json";

var pageStartIndex=0;
var pageEndIndex;
var apiData;
var weatherData;
var selected;
var filterMap = {};
var selectedCard = '';


// Render cards on DOM
const renderCards = (data) => {
	let cardHTML = ``;

	for(let i=pageStartIndex; i< pageEndIndex; i++) {
		let color = '';
		if (data[i]) {
			apiData.metadata.temperatureColor.forEach((colorRange) => {
				if (data[i].temperature >= colorRange.range[0] &&
					data[i].temperature <= colorRange.range[1]) {
				   color = colorRange.color;
				   return;
			   }
			});
			cardHTML += `<li class="card">` +
							`<div class="card-details" id="cityName">${data[i].name}</div>` + 
							`<div class="card-details" id="temp" >` +
							`<span style="color:${color};font-size: 30px;">${data[i].temperature}</span>` +
							`<span>${apiData.metadata.unit[0]}</span></div>` +
							`<div class="card-details" id="climateType">${data[i].type}</div>` +
							`<div class="card-details" id="desc" style="display:none;">${data[i].description}</div>` +
							`</li>`
		}
	}

	document.querySelector('#card-list-container').innerHTML = cardHTML;

	// Enable/Disable Next/Prev buttons
	if (data.length <= pageEndIndex) {
		document.querySelector('#nextButton').setAttribute('disabled', true);
	} else {
		document.querySelector('#nextButton').removeAttribute('disabled');
	}
	if (pageStartIndex === 0) {
		document.querySelector('#prevButton').setAttribute('disabled', true);
	} else {
		document.querySelector('#prevButton').removeAttribute('disabled');
	}
	initCardListerners();
}


initCardListerners = () => {
	// Modal pop up listeners
	document.querySelectorAll('.card').forEach(card => {
		// Pop up open listener
		card.addEventListener('click', (ev) => {
			selectedCard = ev.currentTarget;
			let cardDetails = ev.currentTarget.getElementsByClassName('card-details');
			let selectedCardObj = {
				name: cardDetails.cityName.innerHTML,
				temp: cardDetails.temp.innerHTML,
				desc: cardDetails.desc.innerHTML,
				type: cardDetails.climateType.innerHTML
			}
			selectedCard.classList.add('selected');
			document.querySelector('.card-modal').classList.add('is-modal-visible');
			document.querySelector('.card-modal-details').innerHTML = `<div class="modal-card-details" id="cityName">${selectedCardObj.name}</div>` + 
																		`<div class="modal-card-details" id="temp" > ${selectedCardObj.temp}</div>` +	
																		`<div class="modal-card-details" id="climateType">${selectedCardObj.type}</div>` +
																		`<div class="modal-card-details" id="desc">${selectedCardObj.desc}</div>`
			document.querySelector('.body-fadeout').classList.add('is-faded-out')
		})
	})
}


// Pop up close listener
document.querySelector('#modal-close').addEventListener('click', (ev) => {
	selectedCard.classList.remove('selected');
	document.querySelector('.card-modal').classList.remove('is-modal-visible');
	document.querySelector('.body-fadeout').classList.remove('is-faded-out')
})


// Go to next page
document.querySelector('#nextButton').addEventListener('click', (ev) => {
	pageStartIndex = pageEndIndex;
	pageEndIndex = pageStartIndex + apiData.metadata.pageSize;
	renderCards(weatherData);
});


// Go to prev page
document.querySelector('#prevButton').addEventListener('click', (ev) => {
	pageEndIndex = pageStartIndex;
	pageStartIndex = pageStartIndex - apiData.metadata.pageSize;
	renderCards(weatherData);
})


// Climate filter
document.querySelectorAll('.right-items').forEach(filter => {
	filter.addEventListener( 'change', function(ev) {
		filterMap[ev.target.value] = ev.target.checked;
		weatherData = apiData.cities.filter(city => {
			return filterMap[city.type];
		});
		// reset to first page
		pageStartIndex=0;
		pageEndIndex=apiData.metadata.pageSize;
		renderCards(weatherData);
	});
});

// Sort Ascending
document.querySelector('#asc').addEventListener('click', (ev) => {
	function compare( a, b ) {
		if ( a.temperature < b.temperature ){
		  return -1;
		}
		if ( a.temperature > b.temperature ){
		  return 1;
		}
		return 0;
	  }
	  
	  weatherData.sort( compare );
	  renderCards(weatherData);
})


// Sort Descending
document.querySelector('#dec').addEventListener('click', (ev) => {
	function compare( a, b ) {
		if ( a.temperature < b.temperature ){
		  return 1;
		}
		if ( a.temperature > b.temperature ){
		  return -1;
		}
		return 0;
	  }
	  
	  weatherData.sort( compare );
	  renderCards(weatherData);
})

// Toolbar search
document.querySelector('#city-search').addEventListener('input', (ev) => {
	setTimeout(() => {
		let searchedData = weatherData.filter((item) => {
			return !!item.name.toLowerCase().match(ev.target.value.toLowerCase());
		});
		// reset to first page
		pageStartIndex=0;
		pageEndIndex=apiData.metadata.pageSize;
		renderCards(searchedData);
	}, 1500)
})




// Get weather report
fetch(url)
.then((resp) => resp.json())
.then(function(data) {
	apiData = data;
	apiData.metadata.pageSize = 4;
	pageStartIndex=0;
	pageEndIndex=apiData.metadata.pageSize;
	weatherData = apiData.cities;
	selected = apiData.metadata.weatherType;
	for (let s of selected) {
		filterMap[s] = true;
	}
	renderCards(weatherData);
}).catch(function () {
	console.log('Error in fetching data');
})