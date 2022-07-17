const API_KEY = "69e376545ca93dae87ed257628268ab0";

let city = "";
let country = "";
let tempUnit = "metric";

/* utils */
const timeFormatting = (x) =>
  new Date(x * 1000).toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });

const dayFormatting = (x) =>
  new Date(x * 1000).toLocaleDateString([], {
    weekday: "long",
  });

const unitFormattingtoFahr = (x) => {
  return Math.round(x * 1.8 + 32);
};

const unitFormattingtoCels = (x) =>{
  return Math.round((x-32)*5/9);
}

/********END of Utils */


//City Input
const textInput = document.querySelector("input");
//Fetch Current Location based IP Address
const cur_loc = document.querySelector(".search-location");
//Search Location based city
const search_location = document.querySelector(".search-btn");
//For unit Conversion
const [tempCel, tempFahr] = document.getElementsByClassName("convert");

const col_left = document.querySelector(".col-left");

const [h11, h22, h33] = document.getElementsByTagName("h3");

const unit_header = document.querySelector(".unit-header");

/*handle loader*/
const LoaderElement = document.getElementsByClassName("loader");

const columnLeft = document.querySelector(".column");

const wrapper = document.querySelector(".swiper-wrapper");

const forecast_container = document.querySelector(".forecast-container");

const getJSON = function (url, errorMsg = "Something went wrong") {
  return fetch(url).then((response) => {
    console.log(response);
    if (!response.ok) throw new Error(`${errorMsg} (${response.status})`);

    return response.json();
  });
};

const getWeatherDetails = async function () {
  try {
    let query = [];

    const textInput = document.querySelector("input").value;

    const data = await getJSON(
      `https://api.openweathermap.org/data/2.5/weather?q=${textInput}&appid=${API_KEY}`
    );

    city = data.name;

    country = data.sys.country;

    const { lat, lon } = data.coord;

    const fetchWeatherData = fetch(
      `https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&exclude=minutely,alerts&appid=${API_KEY}&units=${tempUnit}`
    )
      .then((response) => response.json())
      .then((data) => {
        query.push(data);

        LoadWeatherDetails(query, city, country);
        console.log(query);
      });
  } catch (err) {
    console.log(err);
  }
};

search_location.addEventListener("click", () => {
  LoaderElement[0].classList.toggle("loaded");
  LoaderElement[1].classList.toggle("loaded");
  LoaderElement[2].classList.toggle("loaded");
  LoaderElement[3].classList.toggle("loaded");


  if (textInput.value !== " ") {
    col_left.parentNode.removeChild(document.querySelector(".column"));
    document.querySelectorAll(".swiper-slide").forEach((item) => {
      item.remove();
    });
    console.log(h22.parentNode.removeChild(document.querySelector(".highlight-container")))
    document.querySelectorAll(".week").forEach((item) => {
    
      item.remove();
    });

    getWeatherDetails();
  }
});

const success = function (position) {
  const { latitude, longitude } = position.coords;
  let defaultWeather = [];
  const fetchCitydata = fetch(
    `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${API_KEY}`
  )
    .then((response) => response.json())
    .then((item) => {
      city = item.name;
      country = item.sys.country;
    });

  const defaultData = fetch(
    `https://api.openweathermap.org/data/2.5/onecall?lat=${latitude}&lon=${longitude}&exclude=minutely,alerts&appid=${API_KEY}&units=${tempUnit}`
  )
    .then((response) => response.json())
    .then((data) => {
      defaultWeather.push(data);

      LoadWeatherDetails(defaultWeather, city, country);
    });
};

const LoadWeatherDetails = (weatherDetails, city, country) => {
  const { current } = weatherDetails[0];
  const { hourly } = weatherDetails[0];
  const { daily } = weatherDetails[0];

  const time = timeFormatting(current.dt);
  const day = dayFormatting(current.dt);
  const sunrise = timeFormatting(current.sunrise);

  const sunset = timeFormatting(current.sunset);

  const humidity = current.humidity;
  const pressure = current.pressure;
  const wind_speed = current.wind_speed;
  const uvi = current.uvi;
  const clouds = current.clouds;
  const temp = Math.round(current.temp);
  const feels_like = Math.round(current.feels_like);

  const weather_desc = current.weather[0].description;
  const weather_icon = current.weather[0].icon;

  let currentMarkUp = `<div class="column">
<div class="row-2">
  <img src="./weather_icons/${weather_icon}.svg" alt="day_weather" />
</div>
<div class="row-3">
  <div class="weather-info">
    <h1 class="temp-main">${temp}<span>°C</span></h1>
    <div class="temp-feels">Feels like ${feels_like}°C</div>
    <div class="description">
      <i class="fa-brands fa-cloudversify"></i>
        ${weather_desc}
      </div>
  </div>
  <div>
    <div class="day">${day}, <span>${time}</span></div>
    <div class="city">
    <i class="fa-solid fa-location-dot"></i>${city}, ${country}
    </div>
  </div>
</div>
</div>`;

  let highlightMarkUp = `<div class="highlight-container">
<div class="h-card">
  <div class="h-title">Humidity</div>
  <img src="/weather_icons/humidity.png" width="100" alt="" />
  <div class="hl-value">
    <h1>${humidity}</h1>
    <span>%</span>
  </div>
</div>
<div class="h-card">
  <div class="h-title">Wind Speed</div>
  <img src="/weather_icons/wind-day.svg" width="100" alt="wind icon" />
  <div class="hl-value">
    <h1>${wind_speed}</h1>
    <span>m/s</span>
  </div>
</div>
<div class="h-card sun">
  <div class="sun-info">
    <img src="/weather_icons/sunrise.svg" width="50" alt="" />
    <div>${sunrise}<span>Sunrise</span></div>
  </div>
  <div class="sun-info">
    <img src="/weather_icons/sunset.svg" width="50" alt="" />
    <div>${sunset}<span>Sunset</span></div>
  </div>
</div>
<div class="h-card">
  <div class="h-title">Clouds</div>
  <img src="/weather_icons/clouds.svg" width="100" alt="" />
  <div class="hl-value">
    <h1>${clouds}</h1>
    <span>%</span>
  </div>
</div>
<div class="h-card">
  <div class="h-title">UV Index</div>
  <img src="/weather_icons/uv.svg" width="100" alt="" />
  <h1>${uvi}</h1>
</div>
<div class="h-card">
  <div class="h-title">Pressure</div>
  <img src="/weather_icons/pressure.svg" width="100" alt="" />
  <div class="hl-value">
    <h1>${pressure}</h1>
    <span>hPa</span>
  </div>
</div>
</div>`;

  hourly.forEach((item) => {
    const content = `
    <div class="swiper-slide" style="margin-right: 20px; width: 232px">
            <div class="forecast-card">
    <div class="forecast-day">${dayFormatting(item.dt)}, <span>${timeFormatting(
      item.dt
    )}</span></div>
    <img src="./weather_icons/${item.weather[0].icon}.svg" alt="" width="100" />
    <div class="forecast-description">${item.weather[0].description}</div>

     <div class="minmax-temp">${Math.round(item.temp)}°C</div>
       
    </div>
    </div>
    </div>`;

    wrapper.innerHTML += content;
  });

  daily.forEach((data) => {
    const content = `<div class="forecast-card week">
    <div class="forecast-day">${dayFormatting(data.dt)}</div>
    <img src="/weather_icons/${
      data.weather[0].icon
    }.svg" alt="icon" width="100" />
    <div class="forecast-description">${data.weather[0].description}</div>
    <div class="minmax-temp">${Math.round(data.temp.max)}°C<span>${Math.round(
      data.temp.min
    )}°C</span></div>
  </div>`;

    forecast_container.innerHTML += content;
  });

  //fix the same below error
  col_left.insertAdjacentHTML("afterend", currentMarkUp);
   LoaderElement[0].classList.toggle("loaded");
 
  //If it has children then remove else add the html part
  h22.insertAdjacentHTML("afterend", highlightMarkUp);
  LoaderElement[1].classList.toggle("loaded");

  LoaderElement[2].classList.toggle("loaded");
  LoaderElement[3].classList.toggle("loaded");
};

/**GET CURRENT POSITION
 * ---------------------------START ------------------------*/
const fetchCurrentPosition = function () {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(success, () =>
      console.log("error")
    );
  }
};

if (document.querySelector("input").value === "") {
  cur_loc.addEventListener("click", fetchCurrentPosition);
}

if (document.querySelector("input").value !== "") {
  cur_loc.removeEventListener("click", fetchCurrentPosition);
}

window.onload = () => {
  fetchCurrentPosition();
  cur_loc.addEventListener("click", fetchCurrentPosition);
};

/***-------------------END--------------- */

let swiper = new Swiper(".mySwiper", {
  navigation: {
    nextEl: ".swiper-button-next",
    prevEl: ".swiper-button-prev",
  },
  slidesPerView: 5,
});


tempFahr.addEventListener("click", () => {
  tempFahr.classList.toggle("current");
  tempCel.classList.toggle("current");

  tempCel.style.pointerEvents = "";
  tempFahr.style.pointerEvents = "none";
  document.querySelectorAll(".minmax-temp").forEach((el) => {
    if(el.children.length == 0){
      el.innerHTML = `${unitFormattingtoFahr(el.innerHTML.slice(0,2))}°F`;
 
    }

    if(el.children.length == 1){
      console.log(el.innerHTML.slice(10,12));
      el.innerHTML = `${unitFormattingtoFahr(el.innerHTML.slice(0,2))}°C<span>${unitFormattingtoFahr(el.innerHTML.slice(10,12))}°F</span`
    }                                                  
  })

  let el1 = document.querySelector(".temp-main");
  let el2 = document.querySelector(".temp-feels");
  
  el1.innerHTML = `${unitFormattingtoFahr(el1.innerHTML.slice(0,2))}<span>°F</span>`;
  el2.innerHTML = `Feels like ${unitFormattingtoFahr(el2.innerHTML.slice(-5,-2))}°F`;
});

tempCel.addEventListener("click", () => {
  tempCel.classList.toggle("current");
  tempFahr.classList.toggle("current");

  tempCel.style.pointerEvents = "none";
  tempFahr.style.pointerEvents = "";
 
  document.querySelectorAll(".minmax-temp").forEach((el) => {

    if(el.children.length == 0){
      el.innerHTML = `${unitFormattingtoCels(el.innerHTML.slice(0,2))}°C`;
    }   
    
    if(el.children.length == 1){
      console.log(el.innerHTML);
      el.innerHTML = `${unitFormattingtoCels(el.innerHTML.slice(0,2))}°C<span>${unitFormattingtoCels(el.innerHTML.slice(10,12))}°C</span`
    }
  })

  let el1 = document.querySelector(".temp-main");
  let el2 = document.querySelector(".temp-feels");
  
  el1.innerHTML = `${unitFormattingtoCels(el1.innerHTML.slice(0,2))}<span>°C</span>`;
  el2.innerHTML = `Feels like ${unitFormattingtoCels(el2.innerHTML.slice(-5,-2))}°C`;
});


/****Check pointer Events */
if(tempCel.classList.contains("current")){
  tempCel.style.pointerEvents = "none";
}
if(tempFahr.classList.contains("current")){
  tempFahr.style.pointerEvents = "none";
}
/*********************END  ***********/