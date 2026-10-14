const submitButton = document.getElementById("submit");
const userInput = document.getElementById("userInput");
const weatherResults = document.getElementById("results");
const searchForm = document.getElementById('searchForm');

searchForm.addEventListener('submit', async (event) => {
    event.preventDefault();
    const city = userInput.value.trim();
    if (!city) {
        weatherResults.textContent = 'Please enter a city.';
        return;
    }
    const url = `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(city)}&count=1`;
    try {
        submitButton.disabled = true; 
        submitButton.textContent = "Loading . . . "
        const response = await fetch(url);
        const data = await response.json();

        if (!data.results) {
            weatherResults.textContent = 'City not found.';
            return;
        }

        const place = data.results[0];
        const temp = await getTemps(place.latitude, place.longitude);
        weatherResults.textContent = `${place.name}, ${place.admin1}, ${place.country}: ${temp}°F`;

    } catch (error) {
        console.log(error)
        weatherResults.textContent = 'Something went wrong. Please try again.';
    } finally {
        submitButton.textContent = "Enter"
        submitButton.disabled = false; 
        searchForm.reset();
    }
    
    
});

async function getTemps(lat, long) {
    const weatherUrl = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${long}&current=temperature_2m,weather_code&temperature_unit=fahrenheit`;
    const weatherResponse = await fetch(weatherUrl);
    if (!weatherResponse.ok) {
        throw new Error(`Weather request failed: ${weatherResponse.status}`);
    }
    const weatherData = await weatherResponse.json();
    return weatherData.current.temperature_2m;
   
    
}