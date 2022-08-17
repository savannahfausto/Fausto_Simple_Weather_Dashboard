//global variables getting elements from index.html
var cityNameEl = document.querySelector('#city-name');
var submitCityBtn = document.querySelector('#city-search');
var historyContainer = document.querySelector('#history-container');
var historyBreak = document.querySelector('#break');
var currentDayContainer = document.querySelector('#current-day-container');
var forecastHeading = document.querySelector('#forecast-heading');
var forecastContainer = document.querySelector('#forecast-container');

//gets saved cities out of localStorage and saves in cityNames variable
var cityNames = JSON.parse(localStorage.getItem('cityNames'));

//if there is nothing in local storage, set cityNames equal to an empty array
if (!cityNames) {
    cityNames = [];
}

//function changes user city input so that the first letter is capitalized
function cityNameDisplay (str) {
    var splitStr = str.toLowerCase().split(' ');
    for (let i = 0; i < splitStr.length; i++) {
        splitStr[i] = splitStr[i].charAt(0).toUpperCase() + splitStr[i].substring(1);
    }
    return splitStr.join(' ');
}

//first API call gets the longitude and latitude for the city name and passes it in to our next API call getWeather()
function getLatLon(cityName) {
    var requestUrl = 'https://api.openweathermap.org/geo/1.0/direct?q=' + cityName + '&appid=ffe237b23dcad850efe02352dc9815ee';
    fetch (requestUrl)
        .then (function (response) {
            return response.json();

        })    
        .then(function(data){
            console.log("data", data[0])
            getWeather(data[0].lat, data[0].lon, cityName);
        })

}

//takes in lat and lon data from the first API call, returns data that we can use for currentDay and 5-dayForecast printing
function getWeather(lat, lon, cityName) {
    var requestUrl = 'https://api.openweathermap.org/data/2.5/onecall?lat=' + lat + '&lon=' + lon + '&appid=ffe237b23dcad850efe02352dc9815ee';
    fetch (requestUrl) 
        .then (function (response) {
            return response.json();

        })
        .then (function (data) {
            console.log("data", data);
            //create currentDay object from data in this API call
            var currentDay = {
                city: cityName, 
                date: moment.unix(data.current.dt).format('dddd, MMMM Do YYYY'),
                icon: data.current.weather[0].icon,
                temp: ((((data.current.temp)-273.15)*1.8)+32).toFixed(2),
                wind: data.current.wind_speed,
                humidity: data.current.humidity,
                uvi: data.current.uvi,
            }
            //invoke functions to create the current day, 5 day forecast and to save the city into local storage
            createCurrentDayForecast(currentDay);
            createFiveDayForecast(data);
            saveCity(cityName);
    
        })
}

//gets the currentDay weather information from the object previously created, this function also appends this information to index.html
//uses bootstrap helper classes for styling
function createCurrentDayForecast(currentDay) {

    currentDayContainer.setAttribute('class', 'card col-9 border-dark');
    var cardBodyEl = document.createElement('div');
    cardBodyEl.setAttribute('class', 'card-body');
    var cardHeadingEl = document.createElement('h2');
    cardHeadingEl.setAttribute('class', 'font-weight-bold');
    var cardHeadingIcon = document.createElement('img');
    cardHeadingIcon.setAttribute('src', "http://openweathermap.org/img/w/" + currentDay.icon + ".png");
    cardHeadingEl.textContent = currentDay.city + ' (' + currentDay.date + ') ';

    var cardTemp = document.createElement('p');
    cardTemp.textContent = 'Temp: ' + currentDay.temp + ' ˚F';
    var cardWind = document.createElement('p');
    cardWind.textContent = 'Wind: ' + currentDay.wind + ' MPH';
    var cardHumidity = document.createElement('p');
    cardHumidity.textContent = 'Humidity: ' + currentDay.humidity + ' %';
    var cardUvi = document.createElement('p');
    cardUvi.textContent = 'UV Index: '
    var cardUviValue = document.createElement('p');
    cardUviValue.setAttribute('class', 'd-inline p-1 rounded text-white');
    cardUviValue.textContent = currentDay.uvi;

    //changes color background of UVI based on severity
     if (cardUviValue.textContent > 7) {
            cardUviValue.setAttribute('style', 'background: red');
                
        } else if (cardUviValue.textContent <= 2) {
                cardUviValue.setAttribute('style', 'background: green');

        } else {
                cardUviValue.setAttribute('style', 'background: yellow');
        }

    cardHeadingEl.appendChild(cardHeadingIcon);
    cardUvi.appendChild(cardUviValue);
    cardBodyEl.appendChild(cardHeadingEl);
    cardBodyEl.appendChild(cardTemp);
    cardBodyEl.appendChild(cardWind);
    cardBodyEl.appendChild(cardHumidity);
    cardBodyEl.appendChild(cardUvi);
    currentDayContainer.appendChild(cardBodyEl);
}

//passes in data from the second API call and creates a forecast object that will be used to create a card for the next 5 days of weather
//uses bootstrap helper classes for styling
function createFiveDayForecast(data) {
    var title = document.createElement('h2');
    title.setAttribute('class', 'font-weight-bold');
    title.textContent = '5-Day Forecast:'

    forecastHeading.append(title);

    for (let i = 1; i < 6; i++) {
        var forecastData = data.daily[i];
        var forecast = {
            date: moment.unix(forecastData.dt).format('L'),
            icon: forecastData.weather[0].icon,
            highTemp: ((((forecastData.temp.max)-273.15)*1.8)+32).toFixed(2),
            lowTemp: ((((forecastData.temp.min)-273.15)*1.8)+32).toFixed(2),
            wind: forecastData.wind_speed,
            humidity: forecastData.humidity,
        }
        var forecastCard = document.createElement('div');
        forecastCard.setAttribute('class', 'card column custom-card');
        var cardBodyEl = document.createElement('div');
        cardBodyEl.setAttribute('class', 'card-body');
        var cardHeadingEl = document.createElement('h3');
        cardHeadingEl.textContent = forecast.date;
        var cardIcon = document.createElement('img');
        cardIcon.setAttribute('src', "http://openweathermap.org/img/w/" + forecast.icon + ".png");
        var cardHighTemp = document.createElement('p');
        cardHighTemp.textContent = 'High Temp: ' + forecast.highTemp + ' ˚F';
        var cardLowTemp = document.createElement('p');
        cardLowTemp.textContent = 'Low Temp: ' + forecast.lowTemp + ' ˚F';
        var cardWind = document.createElement('p');
        cardWind.textContent = 'Wind: ' + forecast.wind + ' MPH';
        var cardHumidity = document.createElement('p');
        cardHumidity.textContent = 'Humidity: ' + forecast.humidity + ' %';

        cardBodyEl.appendChild(cardHeadingEl);
        cardBodyEl.appendChild(cardIcon);
        cardBodyEl.appendChild(cardHighTemp);
        cardBodyEl.appendChild(cardLowTemp);
        cardBodyEl.appendChild(cardWind);
        cardBodyEl.appendChild(cardHumidity);
        forecastCard.appendChild(cardBodyEl);
        forecastContainer.appendChild(forecastCard);
    }
}  

//if the city has not been saved, pushes the city into the array to save and create a history button for it, re-invoking first api call to store that information in the history button
function saveCity(cityName) {
    //when saving an array of data, treat it like a single item have to parse/stringify it 
    if (!cityNames.includes(cityName)) {
        cityNames.push(cityName);
        localStorage.setItem('cityNames', JSON.stringify(cityNames));
        
        var newCityBtn = document.createElement('button');
        newCityBtn.textContent = cityName;
        newCityBtn.setAttribute('class', 'btn btn-secondary btn-block mt-2');
        
        newCityBtn.addEventListener('click', function(event){
            //empties containers so that multiple cities arent displayed
            currentDayContainer.innerHTML='';
            forecastHeading.innerHTML='';
            forecastContainer.innerHTML='';
            
            var nameOfCity = event.target.textContent
            getLatLon(nameOfCity);
        })

        var hrEl = document.querySelector('hr')
        if (!hrEl) {
            var horizontalBreak = document.createElement('hr');
            horizontalBreak.setAttribute('class', 'bg-dark');
            historyBreak.appendChild(horizontalBreak);
        }
    historyContainer.appendChild(newCityBtn);
}
}


//on loading of the page, gets cities saved from local storage and again makes history buttons functional by invoking first API call
function getCityInfo() {
    var horizontalBreak = document.createElement('hr');
    horizontalBreak.setAttribute('class', 'bg-dark');
    
    for (i = 0; i < cityNames.length; i++) {
        var city = cityNames[i]
        var cityBtn = document.createElement('button');
        cityBtn.textContent = city;
        cityBtn.setAttribute('class', 'btn btn-secondary btn-block mt-2');
        
        cityBtn.addEventListener('click', function(event){
            //empties containers so that multiple cities arent displayed
            currentDayContainer.innerHTML='';
            forecastHeading.innerHTML='';
            forecastContainer.innerHTML='';
            
            var nameOfCity = event.target.textContent
            getLatLon(nameOfCity);
        })
        historyBreak.appendChild(horizontalBreak);
        historyContainer.appendChild(cityBtn);
    }
}

//invokes previous functions
getCityInfo();

//event listener on submit button. when clicked on it takes the user input, passes it into the helper function to make first lettter in each word capital, and passes that into our first API call 
submitCityBtn.addEventListener('click', function(event) {
    event.preventDefault();
    
    //empties containers so that multiple cities arent displayed
    currentDayContainer.innerHTML='';
    forecastHeading.innerHTML='';
    forecastContainer.innerHTML='';
        
    var cityName = cityNameDisplay(cityNameEl.value.trim());
    console.log('cityName1', cityName);
    
    getLatLon(cityName);

    //empties input field so user can type in new city
    cityNameEl.value = '';
})
