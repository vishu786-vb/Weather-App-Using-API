const apiKey = '63f7f149df74da128f8b43be4836d146';

// DOM Elements
const cityInput = document.getElementById('city-input');
const searchButton = document.getElementById('search-button');
const weatherResults = document.getElementById('weather-results');
const weatherIcon = document.getElementById('weather-icon');
const weatherLabel = document.getElementById('weather-label');
const temperatureP = document.getElementById('temperature');
const forecastContainer = document.getElementById('forecast-container');
const errorContainer = document.getElementById('error-container');
const themeToggle = document.getElementById('theme-toggle');

// --- Event Listeners ---
searchButton.addEventListener('click', () => {
    const cityName = cityInput.value.trim();
    if (cityName) {
        getWeather(cityName);
    }
});

cityInput.addEventListener('keypress', (event) => {
    if (event.key === 'Enter') {
        const cityName = cityInput.value.trim();
        if (cityName) {
            getWeather(cityName);
        }
    }
});

cityInput.addEventListener('input', () => {
    if (cityInput.value.trim() === '') {
        clearDisplay();
    }
});

themeToggle.addEventListener('change', () => {
    document.body.classList.toggle('dark-mode', themeToggle.checked);
    localStorage.setItem('theme', themeToggle.checked ? 'dark' : 'light');
});

// --- Main Weather Function ---
function getWeather(cityName) {
    const currentWeatherUrl = `https://api.openweathermap.org/data/2.5/weather?q=${cityName}&appid=${apiKey}&units=metric`;
    const forecastUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${cityName}&appid=${apiKey}&units=metric`;

    // Use Promise.all to fetch both current weather and forecast concurrently
    Promise.all([fetch(currentWeatherUrl), fetch(forecastUrl)])
        .then(responses => {
            // Check if both responses are OK
            if (responses.some(res => !res.ok)) {
                throw new Error('City not found. Please try again.');
            }
            // Parse both responses as JSON
            return Promise.all(responses.map(res => res.json()));
        })
        .then(([currentWeather, forecastData]) => {
            displayCurrentWeather(currentWeather);
            displayForecast(forecastData);
        })
        .catch(error => {
            displayError(error.message);
        });
}


// --- Display Functions ---
function displayCurrentWeather(data) {
    clearDisplay();
    weatherResults.classList.remove('hidden');

    const iconCode = data.weather[0].icon;
    const weatherDescription = data.weather[0].description;
    
    weatherIcon.src = `https://openweathermap.org/img/wn/${iconCode}@4x.png`;
    weatherIcon.alt = weatherDescription;

    weatherLabel.textContent = weatherDescription;
    temperatureP.textContent = `${Math.round(data.main.temp)}°C`;
}

function displayForecast(forecastData) {
    forecastContainer.innerHTML = ''; // Clear previous forecast

    // Filter the forecast list to get one entry per day (e.g., at noon)
    const dailyForecasts = forecastData.list.filter(item => 
        item.dt_txt.includes("12:00:00")
    );

    dailyForecasts.forEach(day => {
        const date = new Date(day.dt * 1000);
        const dayName = date.toLocaleDateString('en-US', { weekday: 'short' });
        const iconCode = day.weather[0].icon;

        const forecastItem = document.createElement('div');
        forecastItem.className = 'forecast-item';
        forecastItem.innerHTML = `
            <div class="day">${dayName}</div>
            <img src="https://openweathermap.org/img/wn/${iconCode}.png" alt="${day.weather[0].description}">
            <div>${Math.round(day.main.temp)}°C</div>
        `;
        forecastContainer.appendChild(forecastItem);
    });
}

function displayError(message) {
    clearDisplay();
    errorContainer.textContent = message;
    errorContainer.classList.remove('hidden');
}

function clearDisplay() {
    weatherResults.classList.add('hidden');
    errorContainer.classList.add('hidden');
}

// --- On Page Load ---
function loadTheme() {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') {
        document.body.classList.add('dark-mode');
        themeToggle.checked = true;
    }
}

// Initialize the theme when the script loads
loadTheme();
