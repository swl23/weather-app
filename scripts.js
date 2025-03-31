const mke = "Milwaukee, WI";
const la = "Los Angeles, CA";
const nyc = "New York City, NY";

const apiPrefix = "https://weather.visualcrossing.com/VisualCrossingWebServices/rest/ services/timeline/";

function formatAddress(input) {
	let newInput;
	if (typeof input !== "string") {
		newInput = input.toString();
	} else {
		newInput = input;
	}
	const formatted = (newInput.split(" ")).join("%20");
	return formatted;
}

function currentData(dateObject) {
	return {
		"conditions": dateObject.conditions,
		"last checked": dateObject.datetime,
		"temp": dateObject.temp,
		"feels like": dateObject.feelslike,
		"sunrise": dateObject.sunrise,
		"sunset": dateObject.sunset,
		"precipitation": dateObject.precip,
		"snow": dateObject.snow,
		"wind speed": dateObject.windspeed
	}
}

function forecastData(date) {
	return {
		"date": date.datetime,
		"temp": date.temp,
		"max temp": date.tempmax,
		"min temp": date.tempmin,
		"max feels like": date.feelslikemax,
		"min feels like": date.feelslikemin,
		"description": date.description,
		"conditions": date.conditions,
		"sunrise": date.sunrise,
		"sunset": date.sunset,
		"wind speed": date.windspeed,
		"precip": date.precip,
		"precip prob": date.precipprob,
		"precip type": date.preciptype,
		"snow": date.snow,
		"hours": hourlyBreakdown(date.hours)
	}
}

function hourlyBreakdown(hours) {
	const filteredHours = [];
	hours.forEach(hour => {
		filteredHours.push({
			"conditions": hour.conditions,
			"time": hour.datetime,
			"temp": hour.temp,
			"feels like": hour.feelslike,
			"wind speed": hour.windspeed,
			"precip": hour.precip,
			"precip prob": hour.precipprob,
			"precip type": hour.preciptype,
			"snow": hour.snow,
		});
	});
	return filteredHours;
}

function lookUpWeather(city) {
	const url = apiPrefix + formatAddress(city) + "?key=AWEPLTSDVJWX27V9PGFLFUG8A";
	fetch(url, {mode: "cors"})
		.then(function(response) {
			return response.json();
		})
		.then(function(response) {
			const location = response.address;
			const currentWeather = currentData(response.currentConditions);
			const weekForecast = [];
			(response.days.slice(0, 7))
				.forEach(day => 
					weekForecast.push(forecastData(day))
				);
			console.log({ location, currentWeather, weekForecast });
			return { location, currentWeather, weekForecast }
		});
}

lookUpWeather(mke);
lookUpWeather(la);
lookUpWeather(nyc);
lookUpWeather(53217)