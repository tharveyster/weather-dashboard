const APIKey = "77d9b213504a58408f3d89d57b484a0d";
let city;
const cityNameSearch = document.querySelector("#cityName");
const searchButton = document.querySelector("#citySearch");
const weatherBlock = document.querySelector("#weatherBlock");
const fiveDayBlock = document.querySelector("#fiveDayBlock");
let searchHistory = JSON.parse(localStorage.getItem("cityWeatherSearch")) || [];
const searchedCities = document.querySelector("#searchedCities");

// Displays the search history
function showHistory() {
    for (let i = 0; i < searchHistory.length; i++) {
        historyBtn = document.createElement('button');
        $(historyBtn).addClass('btn btn-secondary form-control history');
        searchHistory = JSON.parse(localStorage.getItem("cityWeatherSearch"));
        historyBtn.append(searchHistory[i]);
        searchedCities.append(historyBtn);
    }
}

// Adds latest search to search history
function addHistory(city) {
    historyBtn = document.createElement('button');
    $(historyBtn).addClass('btn btn-secondary form-control history');
    historyBtn.append(city);
    searchedCities.append(historyBtn);
}

// Fetches weather and uvi data from openweathermap API
function getWeather(city) {
    const currentDate = moment().format('M/D/YYYY');
    const requestUrl = 'https://api.openweathermap.org/data/2.5/weather?q=' + city + '&units=imperial&appid=' + APIKey;
    fetch(requestUrl)
        .then(function (response) {
            if (!response.ok) {
                alert('Error: ' + response.statusText);
                location.reload();
            } else {
                return response.json();
            }
        })
        .then(function (data) {
            const cityName = document.createElement('h3');
            const temp = document.createElement('p');
            const wind = document.createElement('p');
            const humidity = document.createElement('p');
            const uvIndex = document.createElement('p');
            const uvNumber = document.createElement('span');
            const todayIcon = (data.weather[0].icon);
            const todayIconImage = '<img src="https://openweathermap.org/img/w/' + todayIcon + '.png" alt="" />';
            cityName.innerHTML = data.name + ' (' + currentDate + ')' + todayIconImage;
            temp.innerHTML = 'Temp: ' + (data.main.temp) + '&#176F';
            wind.innerHTML = 'Wind: ' + (data.wind.speed) + ' MPH';
            humidity.innerHTML = 'Humidity: ' + (data.main.humidity) + '%';
            weatherBlock.append(cityName);
            weatherBlock.append(temp);
            weatherBlock.append(wind);
            weatherBlock.append(humidity);
            const lat = (data.coord.lat);
            const lon = (data.coord.lon);
            const requestUvi = 'https://api.openweathermap.org/data/2.5/onecall?lat=' + lat + '&lon=' + lon + '&exclude=minutely,hourly&units=imperial&appid=' + APIKey;
            fetch(requestUvi)
                .then(function (response) {
                    return response.json();
                })
                .then(function (data) {
                    const uviValue = data.current.uvi;
                    if (uviValue <= 2.99) {
                        $(uvNumber).addClass('uvIndex green');
                    } else if (uviValue >= 3 && uviValue <= 5.99) {
                        $(uvNumber).addClass('uvIndex yellow');
                    } else if (uviValue >= 6 && uviValue <= 7.99) {
                        $(uvNumber).addClass('uvIndex orange');
                    } else if (uviValue >= 8 && uviValue <= 10.99) {
                        $(uvNumber).addClass('uvIndex red');
                    } else {
                        $(uvNumber).addClass('uvIndex violet');
                    }
                    uvNumber.innerHTML = uviValue;
                    uvIndex.textContent = 'UV Index: ';
                    uvIndex.append(uvNumber);
                    weatherBlock.append(uvIndex);
                    for (let i = 1; i < 6; i++) {
                        const weatherCard = document.createElement('div');
                        const weatherCardContent = document.createElement('div');
                        const date5 = document.createElement('h5');
                        const icon5 = document.createElement('p');
                        const temp5 = document.createElement('p');
                        const wind5 = document.createElement('p');
                        const humidity5 = document.createElement('p');
                        const fiveDayIcon = (data.daily[i].weather[0].icon);
                        const fiveDayIcons = '<img src="https://openweathermap.org/img/w/' + fiveDayIcon + '.png" alt="" />';
                        const unix_timestamp = (data.daily[i].dt)
                        date5.innerHTML = moment.unix(unix_timestamp).format('M/D/YYYY');
                        icon5.innerHTML = fiveDayIcons;
                        temp5.innerHTML = 'Temp: ' + (data.daily[i].temp.max) + '&#176F';
                        wind5.innerHTML = 'Wind: ' + (data.daily[i].wind_speed) + ' MPH';
                        humidity5.innerHTML = 'Humidity: ' + (data.daily[i].humidity) + '%';
                        fiveDayBlock.append(weatherCard);
                        $(weatherCard).addClass('weatherCard');
                        weatherCard.append(weatherCardContent);
                        $(weatherCardContent).addClass('weatherCardContent');
                        weatherCardContent.append(date5);
                        weatherCardContent.append(icon5);
                        weatherCardContent.append(temp5);
                        weatherCardContent.append(wind5);
                        weatherCardContent.append(humidity5);
                    }
                })
                if (!searchHistory.includes(city)) {
                    searchHistory.push(city);
                    localStorage.setItem("cityWeatherSearch",JSON.stringify(searchHistory));
                    addHistory(city);
                }
        })

}

// Event listener for city search
searchButton.addEventListener('click', function() {
    if (cityNameSearch.value === '') {
        alert("You must enter a city!");
        return;
    }
    weatherBlock.innerHTML = '';
    fiveDayBlock.innerHTML = '';
    weatherBlock.style.display = 'block';
    fiveDayBlock.style.display = 'block';
    city = cityNameSearch.value;
    getWeather(city);
    cityNameSearch.value = '';
});

// Event listener for search history
searchedCities.addEventListener('click', function(e){
    if(e.target.tagName=="BUTTON"){
        city = e.target.textContent;
        weatherBlock.innerHTML = "";
        fiveDayBlock.innerHTML = "";
        weatherBlock.style.display = 'block';
        fiveDayBlock.style.display = 'block';
        getWeather(city);
    }
})

showHistory();