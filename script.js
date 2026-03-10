const apiKey = '63f7f149df74da128f8b43be4836d146';

const cityInput = document.getElementById('city-input');
const searchButton = document.getElementById('search-button');
const weatherDisplay = document.getElementById('weather-display');
const temperatureSpan = document.getElementById('temperature');
const weatherTypeSpan = document.getElementById('weather-type');
const errorContainer = document.getElementById('error-container');

searchButton.addEventListener('click', () => {
    const cityName = cityInput.value.trim();
    if (cityName) {
        fetchWeatherData(cityName);
    }
});

cityInput.addEventListener('keypress', (event) => {
    if (event.key === 'Enter') {
        const cityName = cityInput.value.trim();
        if (cityName) {
            fetchWeatherData(cityName);
        }
    }
});

function fetchWeatherData(cityName) {
    const apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${cityName}&appid=${apiKey}&units=metric`;

    fetch(apiUrl)
        .then(response => {
            if (!response.ok) {
                throw new Error('City not found. Please try again.');
            }
            return response.json();
        })
        .then(data => {
            displayWeather(data);
        })
        .catch(error => {
            displayError(error.message);
        });
}

function displayWeather(data) {
    errorContainer.classList.add('hidden');
    weatherDisplay.classList.remove('hidden');

    temperatureSpan.textContent = `${data.main.temp}°C`;
    weatherTypeSpan.textContent = data.weather[0].description;
}

function displayError(message) {
    weatherDisplay.classList.add('hidden');
    errorContainer.classList.remove('hidden');
    errorContainer.textContent = message;
}
