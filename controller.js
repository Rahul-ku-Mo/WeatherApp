let query = [];

const my_loc = document.getElementById('my_loc');
const desc_box = document.querySelector(".desc-box");
const head = document.getElementById("head");
const ParentEl = document.getElementById("prec");
const parentEl = document.getElementById("cont");
const API_KEY = "69e376545ca93dae87ed257628268ab0";




const addHTML = function(rawData) {
  const temp_MAX = rawData.main.temp_max;
  const temp_MIN = rawData.main.temp_min;
  const description = rawData.weather[0].description;
  const Humidity = rawData.main.humidity;
  const Pressure = rawData.main.pressure;
  const windSpeed = rawData.wind.speed;
 
  const feels_like = rawData.main.feels_like;
  const name = rawData.name;
  const markup = `<div class="col2">
  <div class="mintemp"><img src="/Icons/min-temp.png" alt="">MIN TEMP:${temp_MIN}K</div>
  <div class="maxtemp"><img src="/Icons/max-temp.png" alt="">MAX TEMP:${temp_MAX}K</div>
  </div>`;


  const markup2 = `  <div class="row2">
  <div class="Humidity">${Humidity}% <img src="/Icons/humidity.png" alt=""></div>
  <div class="pressure">${Pressure}N-m<img src="/Icons/pressure.png" alt=""></div>
</div>
<div class="row3">
  <div class="windspeed">
      ${windSpeed}KMPH <img src="/Icons/wind-speed.png" alt="">
  </div>
</div>`;
  const markup3 = ` <div class="desciption">
It is ${description}
</div>`;

const markup4 = ` <div class="row1">${name}</div>
<div class="row24">
  <div class="icon-box">${feels_like} K</div>
  <div class="temp">${rawData.main.temp} K</div>

</div>`

  parentEl.insertAdjacentHTML("beforeend", markup2);


  ParentEl.insertAdjacentHTML("beforeend", markup);

  desc_box.insertAdjacentHTML("beforeend",markup3);
  head.insertAdjacentHTML('beforeend',markup4);
}
const getJSON = function (url, errorMsg = "Something went wrong") {
  return fetch(url).then((response) => {
    console.log(response);
    if (!response.ok) throw new Error(`${errorMsg} (${response.status})`);

    return response.json();
  });
};

const getCoin = async function () {
  try {
    reRender();
    const input  = document.querySelector('.input').value;
    const data = await getJSON(
      `https://api.openweathermap.org/data/2.5/weather?q=${input}&appid=${API_KEY}`
    );
    // console.log(data);
   
    addHTML(data);
  } catch (err) {
    console.log(err);
  }
};
const loc = document.getElementById('loc');
loc.addEventListener('click', getCoin);


const success = function(position) {
 const {latitude,longitude} = position.coords;

   
 const defaultData  = fetch(
         `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${API_KEY}`
       ).then(response => response.json()).then((data) =>
        addHTML(data))
           
}

const getPosition = function() {
  reRender();
  if(navigator.geolocation){
    navigator.geolocation.getCurrentPosition(success,() => console.log("error"))
  }
}

const reRender = function(){
  parentEl.innerHTML = '';
  head.innerHTML = '';
  ParentEl.innerHTML = '';
  desc_box.innerHTML = '';
}

my_loc.addEventListener('click', getPosition);

window.onload = () =>{
  getPosition();
}