const apiPrefix = "https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/";

async function runApp() {
	const search = document.getElementById("input");
	const weather = await lookUpWeather(search.value);
	displayWeather(weather);
}

function formatAddress(input) {
	const newInput = input.toString();
	const formatted = (newInput.split(" ")).join("%20");
	return formatted;
}

function currentData(dateObject) {
	return {
		"Conditions": dateObject.conditions,
		"Last Checked": dateObject.datetime,
		"Temperature": 
			{
				"Fahrenheit": dateObject.temp,
				"Celsius": toCelsius(dateObject.temp)
			},
		"Feels Like":
			{
				"Fahrenheit": dateObject.feelslike,
				"Celsius": toCelsius(dateObject.feelslike)
			},
		"Sunrise": dateObject.sunrise,
		"Sunset": dateObject.sunset,
		"Precipitation": dateObject.precip,
		"Snow": dateObject.snow,
		"Wind Speed": dateObject.windspeed
	}
}

function toCelsius(temp) {
	const raw = (Number(temp) - 32) * (5/9);
	return Number(Number.parseFloat(raw).toFixed(2));
}

function forecastData(date) {
	return {
		"Date": date.datetime,
		"Maximum Temperature": 
			{
				"Fahrenheit": date.tempmax,
				"Celsius": toCelsius(date.tempmax)
			},
		"Minimum Temperature": 
			{
				"Fahrenheit": date.tempmin,
				"Celsius": toCelsius(date.tempmin)
			},
		"Maximum Feels Like": 
			{
				"Fahrenheit": date.feelslikemax,
				"Celsius": toCelsius(date.feelslikemax)
			},
		"Minimum Feels Like":
			{
				"Fahrenheit": date.feelslikemin,
				"Celsius": toCelsius(date.feelslikemin)
			},
		"Description": date.description,
		"Conditions": date.conditions,
		"Sunrise": date.sunrise,
		"Sunset": date.sunset,
		"Wind Speed": date.windspeed,
		"Precipitation": date.precip,
		"Precipitation Probability": date.precipprob,
		"Precipitation Type": date.preciptype,
		"Snow": date.snow,
		"Hours": hourlyBreakdown(date.hours)
	}
}

function hourlyBreakdown(hours) {
	const filteredHours = [];
	hours.forEach(hour => {
		filteredHours.push({
			"Conditions": hour.conditions,
			"Time": hour.datetime,
			"Temperature": 
				{
					"Fahrenheit": hour.temp,
					"Celsius": toCelsius(hour.temp)
				},
			"Feels Like": 
				{
					"Fahrenheit": hour.temp,
					"Celsius": toCelsius(hour.temp)
				},
			"Wind Speed": hour.windspeed,
			"Precipitation": hour.precip,
			"Precipitation Probability": hour.precipprob,
			"Precipitation Type": hour.preciptype,
			"Snow": hour.snow,
		});
	});
	return filteredHours;
}

async function lookUpWeather(city) {
	const url = apiPrefix + formatAddress(city) + "?key=AWEPLTSDVJWX27V9PGFLFUG8A";
	const response = await fetch(url, {mode: "cors"});
	const rawData = await response.json();
	
	const location = rawData.resolvedAddress;
	const currentWeather = currentData(rawData.currentConditions);
	const weekForecast = [];
	(rawData.days.slice(0, 7))
		.forEach(day => 
			weekForecast.push(forecastData(day))
		);
	const newData = { location, currentWeather, weekForecast };
	console.log(newData);
	return newData;
}

function displayWeather(data) {
	resetDisplay();
	displayCity(data.location);
	displayCurrent(data.currentWeather);
	displayWeek(data.weekForecast)
}

function displayCity(cityName) {
	const place = document.querySelector(".place");
	const p = document.createElement("p");
	p.textContent = cityName;
	place.appendChild(p);
}

function displayTempInChosenScale(tempObject) {
	if (document.getElementById("fahrenheit").checked) {
		return `${tempObject["Fahrenheit"]} °F`
	} else if (document.getElementById("celsius").checked) {
		return `${tempObject["Celsius"]} °C`
	}
}

function displayCurrent(current) {
	const container = document.querySelector(".current");
	const header = document.createElement("p");
	header.setAttribute("class", "header");
	header.textContent = "Current Conditions";

	const temp = document.createElement("p");
	temp.setAttribute("class", "temp");
	temp.textContent = displayTempInChosenScale(current["Temperature"])

	const conditions = document.createElement("p");
	conditions.setAttribute("class", "conditions");
	conditions.textContent = current["Conditions"];

	const feelsLike = document.createElement("p");
	feelsLike.setAttribute("class", "feels-like");
	feelsLike.textContent = "Feels like " + displayTempInChosenScale(current["Feels Like"]);

	const grid = document.createElement("div");
	grid.setAttribute("class", "current-conditions-grid");

	const sunrise = document.createElement("div");
	sunrise.setAttribute("class", "sunrise");
	const riseTime = document.createElement("p");
	riseTime.setAttribute("class", "time");
	riseTime.textContent = current["Sunrise"]
	const riseLabel = document.createElement("p");
	riseLabel.setAttribute("class", "label");
	riseLabel.textContent = "Sunrise";
	sunrise.appendChild(riseTime);
	sunrise.appendChild(riseLabel);

	const wind = document.createElement("div");
	wind.setAttribute("class", "wind");
	const windSpeed = document.createElement("p");
	windSpeed.setAttribute("class", "speed");
	windSpeed.textContent = current["Wind Speed"];
	const windLabel = document.createElement("p");
	windLabel.setAttribute("class", "label");
	windLabel.textContent = "Wind";
	wind.appendChild(windSpeed);
	wind.appendChild(windLabel);

	const sunset = document.createElement("div");
	sunset.setAttribute("class", "sunset");
	const setTime = document.createElement("p");
	setTime.setAttribute("class", "time");
	setTime.textContent = current["Sunset"]
	const setLabel = document.createElement("p");
	setLabel.setAttribute("class", "label");
	setLabel.textContent = "Sunset";
	sunset.appendChild(setTime);
	sunset.appendChild(setLabel);

	grid.appendChild(sunrise);
	grid.appendChild(wind);
	grid.appendChild(sunset);

	const lastChecked = document.createElement("p");
	lastChecked.setAttribute("class", "last-checked");
	lastChecked.textContent = `Last updated ${current["Last Checked"]} local time`

	container.appendChild(header);
	container.appendChild(temp);
	container.appendChild(conditions);
	container.appendChild(feelsLike);
	container.appendChild(grid);
	container.appendChild(lastChecked);
}

function displayWeek(week) {
	const forecast = document.querySelector(".week");

	const slideList = document.createElement("ul");
	slideList.setAttribute("class", "slides-container");

	week.forEach(day => {
		const slide = document.createElement("li");
		slide.setAttribute("id", week.indexOf(day));
		slide.setAttribute("class", "slide");
		
		const header = document.createElement("p");
		header.setAttribute("class", "header");
		header.textContent = day["Date"];

		const tempGrid = document.createElement("div");
		tempGrid.setAttribute("class", "temp-grid");

		const low = document.createElement("div");
		low.setAttribute("class", "low");
		const lowTemp = document.createElement("p");
		lowTemp.setAttribute("class", "temp");
		lowTemp.textContent = displayTempInChosenScale(day["Minimum Temperature"]);
		const lowLabel = document.createElement("p");
		lowLabel.setAttribute("class", "label");
		lowLabel.textContent = "Low";
		low.appendChild(lowTemp);
		low.appendChild(lowLabel);

		const high = document.createElement("div");
		high.setAttribute("class", "high");
		const highTemp = document.createElement("p");
		highTemp.setAttribute("class", "temp");
		highTemp.textContent = displayTempInChosenScale(day["Maximum Temperature"]);
		const highLabel = document.createElement("p");
		highLabel.setAttribute("class", "label");
		highLabel.textContent = "High";
		high.appendChild(highTemp);
		high.appendChild(highLabel);

		tempGrid.appendChild(low);
		tempGrid.appendChild(high);		

		const description = document.createElement("p");
		description.setAttribute("class", "description");
		description.textContent = day["Description"];

		slide.appendChild(header);
		slide.appendChild(tempGrid);
		slide.appendChild(description);
		
		slideList.appendChild(slide);
	});
	
	forecast.appendChild(slideList);
}

window.addEventListener("DOMContentLoaded", () => {
	const btn = document.getElementById("search");
	btn.addEventListener("click", () => {
		runApp();
	});

	const scaleBtns = document.querySelectorAll("input[name=temp");
	scaleBtns.forEach(btn => {
		btn.addEventListener("change", () => {
			runApp();
		})
	})
})

function resetDisplay() {
	const contentSection = document.querySelector(".content");
	contentSection.textContent = "";

	const place = document.createElement("div");
	place.setAttribute("class", "place");

	const current = document.createElement("div");
	current.setAttribute("class", "current");

	const week = document.createElement("div");
	week.setAttribute("class", "week");

	contentSection.appendChild(place);
	contentSection.appendChild(current);
	contentSection.appendChild(week);
}