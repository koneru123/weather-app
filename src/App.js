import React from "react";
import "./App.css";
import Form from "./app_component/form.component";
import Weather from "./app_component/weather.component";
import "bootstrap/dist/css/bootstrap.min.css";
import classNames from 'classnames';

import "weather-icons/css/weather-icons.css";

const Api_Key = "429736441cf3572838aa10530929f7cd";

// Temperature in Kelvin is used by default, we need to calculate kelvin to celsius
const calCelsius = temp => {
  return Math.floor(temp - 273.15);
}

// Convert F to Celsius
const convertFtoC = fTemp => {
  return Math.floor(((fTemp - 32) * 5) / 9 );
}

const weatherIcons = {
  Thunderstorm: "wi-thunderstorm",
  Drizzle: "wi-sleet",
  Rain: "wi-storm-showers",
  Snow: "wi-snow",
  Atmosphere: "wi-fog",
  Clear: "wi-day-sunny",
  Clouds: "wi-day-fog"
};

class App extends React.Component {
  constructor() {
    super();
    this.state = {
      city: undefined,
      country: undefined,
      icon: undefined,
      weatherCls: 'clearWeather',
      main: undefined,
      celsius: undefined,
      temp_max: null,
      temp_min: null,
      description: "",
      error: false,
      fTemp: {},
      currUnit:'F'
    };
  }

  getWeatherIcon(icons, rangeId) {
    switch (true) {
      case rangeId >= 200 && rangeId < 232:
        this.setState({ icon: icons.Thunderstorm, weatherCls: 'thunderstormWeather' });
        break;
      case rangeId >= 300 && rangeId <= 321:
        this.setState({ icon: icons.Drizzle, weatherCls: 'drizzleWeather' });
        break;
      case rangeId >= 500 && rangeId <= 521:
        this.setState({ icon: icons.Rain, weatherCls: 'rainyWeather' });
        break;
      case rangeId >= 600 && rangeId <= 622:
        this.setState({ icon: icons.Snow, weatherCls: 'snowyWeather' });
        break;
      case rangeId >= 701 && rangeId <= 781:
        this.setState({ icon: icons.Atmosphere, weatherCls: 'foggyWeather' });
        break;
      case rangeId === 800:
        this.setState({ icon: icons.Clear, weatherCls: 'clearWeather' });
        break;
      case rangeId >= 801 && rangeId <= 804:
        this.setState({ icon: icons.Clouds, weatherCls: 'cloudyWeather' });
        break;
      default:
        this.setState({ icon: icons.Clouds, weatherCls: 'cloudyWeather' });
    }
  }

  getWeather = async e => {
    e.preventDefault();

    const country = e.target.elements.country.value;
    const city = e.target.elements.city.value;

    if (country && city) {
      const api_call = await fetch(
        `http://api.openweathermap.org/data/2.5/weather?q=${city},${country}&appid=${Api_Key}`
      );
      const response = await api_call.json();
      if(!response || response.cod >= 400){
        this.setState({
          error: true
        });
      } else {
        this.setState({
          city: `${response.name}, ${response.sys.country}`,
          country: response.sys.country,
          main: response.weather[0].main,
          celsius: calCelsius(response.main.temp),
          temp_max: calCelsius(response.main.temp_max),
          temp_min: calCelsius(response.main.temp_min),
          description: response.weather[0].description,
          error: false
        });
        // seting icons
        this.getWeatherIcon(weatherIcons, response.weather[0].id);
      }
    } else {
      this.setState({
        error: true
      });
    }
  };

  changeToCelcius = (e) => {
    e.preventDefault();
    const {celsius, temp_max, temp_min, currUnit} = this.state;
    if(currUnit === 'C') {
      return;
    }
    const convertedTemp = convertFtoC(celsius);
    const convertedMax = convertFtoC(temp_max);
    const convertedMin = convertFtoC(temp_min);

    this.setState({
      celsius: convertedTemp,
      temp_max: convertedMax,
      temp_min: convertedMin,
      fTemp: { celsius, temp_max, temp_min },
      currUnit: 'C'
    });
  }

  changeToFarenheit = (e) => {
    e.preventDefault();
    const {fTemp, currUnit} = this.state;

    if(currUnit === 'F'){
      return;
    }

    this.setState({
      ...fTemp,
      currUnit: 'F'
    });
  }
  componentDidMount() {
    const currentComp = this;
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(displayLocationInfo);
    }

    function displayLocationInfo(position) {
      const {latitude, longitude} = position.coords;

      if(latitude && longitude) {
        (async () => {
          const api_call = await fetch(
            `http://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${Api_Key}&units=imperial`
          );
          const response = await api_call.json();

          currentComp.setState({
            city: `${response.name}, ${response.sys.country}`,
            country: response.sys.country,
            main: response.weather[0].main,
            celsius: response.main.temp,
            temp_max: response.main.temp_max,
            temp_min: response.main.temp_min,
            description: response.weather[0].description,
            error: false
          });

          // seting icons
          currentComp.getWeatherIcon(weatherIcons, response.weather[0].id);
        })();
      }
    }
  }

  render() {
    const {city, icon, celsius, temp_max, temp_min, description, error, weatherCls, currUnit} = this.state;
    const classes = [
      'App',
      weatherCls
    ];
    const farenheitClasses = [
      'link',
      currUnit === 'F' ? 'active' : ''
    ];
    const celsiusClasses = [
      'link',
      currUnit === 'C' ? 'active' : ''
    ];

    return (
      <div className={classNames(classes)} >
        <Form
          loadweather={this.getWeather}
          error={error}
        />
        <Weather
          cityname={city}
          weatherIcon={icon}
          temp_celsius={celsius}
          temp_max={temp_max}
          temp_min={temp_min}
          description={description}
        />
        <div className="text-light">
          <button className={classNames(farenheitClasses)} onClick={this.changeToFarenheit}>&deg;F</button> / <button className={classNames(celsiusClasses)} onClick={this.changeToCelcius}>&deg;C</button>
        </div>
      </div>
    );
  }
}

export default App;
