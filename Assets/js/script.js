var cityNameEl = document.querySelector('#city-name');
var submitCityBtn = document.querySelector('#city-search');
var currentDayContainer = document.querySelector('#current-day-container');
var forecastHeading = document.querySelector('#forecast-heading');
var forecastContainer = document.querySelector('#forecast-container');





//type in search city 

//when click/submit 
//create button of each city search that can toggle between, add to history
//save 
function getWeather(lat, lon, cityName) {
    var requestUrl = 'https://api.openweathermap.org/data/2.5/onecall?lat=' + lat + '&lon=' + lon + '&appid=ffe237b23dcad850efe02352dc9815ee';
    fetch (requestUrl) 
        .then (function (response) {
            return response.json();

        })
        .then (function (data) {
            console.log("data", data);
            var currentDay = {
                city: cityName, 
                date: moment.unix(data.current.dt).format('dddd, MMMM Do YYYY'),
                icon: data.current.weather[0].icon,
                temp: ((((data.current.temp)-273.15)*1.8)+32).toFixed(2),
                wind: data.current.wind_speed,
                humidity: data.current.humidity,
                uvi: data.current.uvi,
            }

            createCurrentDayForecast(currentDay);
            createFiveDayForecast(data);
    
        })
}

function createCurrentDayForecast(currentDay) {
    //console.log('currentDay', currentDay);
    currentDayContainer.setAttribute('class', 'card col-9');
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

function createFiveDayForecast(data){
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
        forecastCard.setAttribute('class', 'card column');
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

submitCityBtn.addEventListener('click', function(event) {
    event.preventDefault();
    var cityName = cityNameEl.value.trim();
    var requestUrl = 'https://api.openweathermap.org/geo/1.0/direct?q=' + cityName + '&appid=ffe237b23dcad850efe02352dc9815ee';
    fetch (requestUrl)
        .then (function (response) {
            return response.json();

        })
        .then(function(data){
            console.log("data", data[0])
            getWeather(data[0].lat, data[0].lon, cityName);
        })
    cityNameEl.value = '';
})