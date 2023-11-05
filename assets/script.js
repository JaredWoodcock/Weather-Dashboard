function searchWeather() {
    var apiKey = "0eaaab6156a1398e36b426113287b597";
    var city = document.getElementById("searchInput").value;
    var geocodingURL = `https://api.openweathermap.org/geo/1.0/direct?q=${city}&limit=5&appid=${apiKey}`;

    fetch(geocodingURL)
        .then((response) => response.json())
        .then((data) => {
            var latitude = data[0].lat;
            var longitude = data[0].lon;

            var currentWeatherURL = `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&units=imperial&appid=${apiKey}`;
            var forecastURL = `https://api.openweathermap.org/data/2.5/forecast?lat=${latitude}&lon=${longitude}&units=imperial&appid=${apiKey}`;

            var cityList = JSON.parse(localStorage.getItem("cityList")) || [];
            if (!cityList.includes(city)) {
                cityList.unshift(city);
                localStorage.setItem("cityList", JSON.stringify(cityList));
            }

            fetch(currentWeatherURL)
                .then((response) => response.json())
                .then((data) => {
                    console.log("current weather data:", data);

                    var currentWeather = document.getElementById("currentWeather");
                    var currentDate = dayjs().format("M/D/YYYY");
                    var iconUrl = `https://openweathermap.org/img/wn/${data.weather[0].icon}.png`;

                    currentWeather.innerHTML = `<h3>${city} (${currentDate}) <img src="${iconUrl}" alt="Weather icon"></h3>`
                    currentWeather.innerHTML += `Temp: ${data.main.temp}°F <br>`;
                    currentWeather.innerHTML += `Wind: ${data.wind.speed} MPH <br>`;
                    currentWeather.innerHTML += `Humidity: ${data.main.humidity}% <br>`;

                    populateSearchHistory();
                })
                .catch((error) => {
                    console.error("Error fetching current weather data:", error);
            })  
            fetch(forecastURL)
                .then((response) => response.json())
                .then((data) => {
                    console.log("Forecast data:", data);
                    var forecastWeather = document.getElementById("forecast");
                    forecastWeather.innerHTML = "<h4>5 Day Forecast:</h4>";

                    var dailyData = data.list.filter((reading, index) => index % 8 === 4);

                    var forecastRow = document.createElement("div");
                    forecastRow.classList.add("row");

                    dailyData.forEach((reading) => {
                        var date = new Date(reading.dt * 1000).toLocaleDateString("en-US");
                        var card = `
                            <div class="col">
                                <div class="card">
                                    <div class="card-body">
                                        <h5 class="card-title">${date}</h5>
                                        <img src="https://openweathermap.org/img/w/${reading.weather[0].icon}.png" alt="Weather icon">
                                        <p class="card-text">Temp: ${reading.main.temp}°F</p>
                                        <p class="card-text">Wind: ${reading.wind.speed} MPH</p>
                                        <p class="card-text">Humidity: ${reading.main.humidity}%</p>
                                    </div>
                                </div>
                            </div>`;
                        forecastRow.innerHTML += card;
                    });
                    forecastWeather.appendChild(forecastRow);
                })
                .catch((error) => {
                    console.error("Error fetching 5-day forecast data:", error);
            });

        })
        .catch((error) => {
            console.error("Error fetching geocoding data:", error);
    });

}

function populateSearchHistory() {
    var searchHistory = document.getElementById("searchHistory");
    searchHistory.innerHTML = "<h4>Search History:</h4>";

    var cityList = JSON.parse(localStorage.getItem("cityList")) || [];
    cityList.forEach((city) => {
        var button = document.createElement("button");
        button.innerText = city;
        button.classList.add("search-history-button");
        button.addEventListener("click", function () {
            searchWeatherByCity(city);
        });
        searchHistory.appendChild(button);
    });
}

function searchWeatherByCity(city) {
    document.getElementById("searchInput").value = city;
    searchWeather();
}