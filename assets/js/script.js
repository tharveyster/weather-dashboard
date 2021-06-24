var APIKey = "77d9b213504a58408f3d89d57b484a0d";
var city;
var cityNameSearch = document.querySelector("#cityName");
var searchButton = document.querySelector("#citySearch");
var currentDate = moment().format('M/D/YYYY');
var weatherBlock = document.querySelector("#weatherBlock");
var fiveDayBlock = document.querySelector("#fiveDayBlock");
var day = [];

function getWeather() {
    var requestUrl = 'http://api.openweathermap.org/data/2.5/weather?q=' + city + '&units=imperial&appid=' + APIKey;
    fetch(requestUrl)
        .then(function (response) {
            return response.json();
        })
        .then(function (data) {
            console.log(data);
            var cityName = document.createElement('h3');
            var temp = document.createElement('p');
            var wind = document.createElement('p');
            var humidity = document.createElement('p');
            var uvIndex = document.createElement('p');
            var uvNumber = document.createElement('span');
            var todayIcon = (data.weather[0].icon);
            var todayIconImage = '<img src="http://openweathermap.org/img/wn/' + todayIcon + '.png" alt="" />';
            cityName.innerHTML = data.name + ' (' + currentDate + ')' + todayIconImage;
            temp.innerHTML = 'Temp: ' + (data.main.temp) + '&#176F';
            wind.innerHTML = 'Wind: ' + (data.wind.speed) + ' MPH';
            humidity.innerHTML = 'Humidity: ' + (data.main.humidity) + '%';
            weatherBlock.append(cityName);
            weatherBlock.append(temp);
            weatherBlock.append(wind);
            weatherBlock.append(humidity);
            var lat = (data.coord.lat);
            var lon = (data.coord.lon);
            var requestUvi = 'https://api.openweathermap.org/data/2.5/onecall?lat=' + lat + '&lon=' + lon + '&exclude=minutely,hourly&units=imperial&appid=' + APIKey;
            fetch(requestUvi)
                .then(function (response) {
                    return response.json();
                })
                .then(function (data) {
                    console.log(data);
                    var uviValue = data.current.uvi;
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
                    for (var i = 1; i < 6; i++) {
                        var weatherCard = document.createElement('div');
                        var weatherCardContent = document.createElement('div');
                        var date5 = document.createElement('h5');
                        var icon5 = document.createElement('p');
                        var temp5 = document.createElement('p');
                        var wind5 = document.createElement('p');
                        var humidity5 = document.createElement('p');
                        var fiveDayIcon = (data.daily[i].weather[0].icon);
                        var fiveDayIcons = '<img src="http://openweathermap.org/img/wn/' + fiveDayIcon + '.png" alt="" />';
                        var unix_timestamp = (data.daily[i].dt)
                        date5.innerHTML = moment.unix(unix_timestamp).format('M/D/YYYY');
                        icon5.innerHTML = fiveDayIcons;
                        temp5.innerHTML = 'Temp: ' + (data.daily[i].temp.max) + '&#176F';
                        wind5.innerHTML = 'Wind: ' + (data.daily[i].wind_speed) + ' MPH';
                        humidity5.innerHTML = 'Humidity: ' + (data.daily[i].humidity) + '%';
                        var fiveDayIcons = '<img src="http://openweathermap.org/img/wn/' + icon5 + '.png" alt="" />';
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
        })

}

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
    getWeather();
    cityNameSearch.value = "";
});
