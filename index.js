
const userTab = document.querySelector('[data-YourWeather]');
const searchTab = document.querySelector("[data-SearchWeather]");
const userContainer = document.querySelector(".weather_container");

// There are total 4 screen that i have to show only one at a time
const grantAccess = document.querySelector(".grant-location");
const searchForm = document.querySelector("[data-search-form]");
const loadinScreen = document.querySelector("[loading-screen]");
const userInfoContainer = document.querySelector(".user-weather-info");


// Initially some value should bea defined
const API_Key = "6651ca9faa17b9c20d418e21a0d94eab";
let currenTab = userTab;
currenTab.classList.add("current-tab");

getFromSessionStorage();   // when you refresh your page then by using this old data will fetch from session storage and it will display
function switchTab(clickedTab) {
  if (clickedTab !== currenTab) {
    currenTab.classList.remove("current-tab");
    currenTab = clickedTab;
    currenTab.classList.add("current-tab");
    currenTab.classList.add("active");

    //    if (currenTab === userTab) {
    //     grantAccess.classList.add("active");
    //     searchForm.classList.remove("active");
    //     userInfoContainer.classList.remove("active");
    // } 

    if (!searchForm.classList.contains("active")) { // means isi  ko active krna hai
      searchForm.classList.add("active");
      userInfoContainer.classList.remove("active");
      grantAccess.classList.remove("active");
      errorImg.style.display = "none";

    }
    else {
      searchForm.classList.remove("active");
      userInfoContainer.classList.remove("active");
      errorImg.style.display = "none";
      getFromSessionStorage();
    }

  }
  // else{
  // means phle mai search tab pr tha ab muje Your Weather tab me jana hai means visible krana hai
  // searchForm.classList.remove("active");
  // userInfoContainer.classList.remove("active");

  ///dekooooooooooooooooooooo
  // ab mai Your weather tab me aa gya hu and to weather bhi UI pr show karana hoga . lets check the cordinates the and and 
  // show the info(weather info) about it   

  // }
}


userTab.addEventListener("click", () => {
  // pass the userTab as parameter
  switchTab(userTab);
});
searchTab.addEventListener("click", () => {
  switchTab(searchTab);
});

// check if any  coordinate is present in local storage 
function getFromSessionStorage() {    // we can use user-coordinate ki jagah pr kuch bhi but i hve to use that name everywhere
  const localcoordinate = sessionStorage.getItem("user-coordinates");
  if (!localcoordinate) {
    //  localStorage me koi coordinate nhi hai iska mtlb grnatAcces tab ko open krna hai
    grantAccess.classList.add("active");
    // if Local cordinate is not present then i have to add the event listner on " Grant accces btn" for finding the live location of user .
    // Then add event lisner fo access location by uisng" geolite location"
  }
  else {   // if any coordinate (means lattitude or longitude) present then show about them information
    // userInfoContainer.classList.add("active");
    const coordinate = JSON.parse(localcoordinate);     // object me convert kro then pass kro
    fetchCWeatherInfo(coordinate);
  }
}

//  --------------------------------------- HW----------------------
// search different bw json object and json String
// JSON.parse()  ---> convert the json into object  BUT json.



async function fetchCWeatherInfo(coordinate) {
  const { lat, lon } = coordinate;   // by usibg this , lattitude and lognitude  finding kr rhe hai
  // grnat acces ko invisible krna hai
  grantAccess.classList.remove("active"); console.log("grant active ..")
  // loading screen ko visible krna hai
  loadinScreen.classList.add("active"); console.log("loading active ..")

  // API call kro
  try {
    const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_Key}&units=metric`);
    const data = await response.json();
    // loading sscreen ko invisible kr do 
    loadinScreen.classList.remove("active");
    // show the userInfoContainer  info about weather 
    userContainer.classList.add("active");
    userInfoContainer.classList.add("active");   //////////////////////
    // redor the data on UI 
    rendorWeatherDetails(data); console.log("redering data..");
  }
  catch (e) {
    loadinScreen.classList.remove("active");
    errorImg.style.display = "flex";
    errorText.textContent = "Failed";
  }
}

function rendorWeatherDetails(weatherInfo) {
  // we have to fetch the element 
  const city = document.querySelector("[city-name]");
  const countryIcon = document.querySelector("[counrty_icon]");
  const desc = document.querySelector("[weather-desc]");
  const conditionIcon = document.querySelector("[weather-condition-icon]");
  const temp = document.querySelector("[weather-temp]");
  const windSpeed = document.querySelector("[weather-speed]");
  const humadity = document.querySelector("[weather-humadity]");
  const cloudy = document.querySelector("[weather-cloud]");
  // Fetching the info from json object    
  // Im finding the property by using  ""  Opional chaining operator "" .  its benifit is  --> if propertyv is not find in 
  // Object then it will not shw any errror only it will show "Undefined "  . For use this one i convert the JSOn.parse() -- give Object not string
  city.textContent = weatherInfo?.name;

  countryIcon.src = `https://flagcdn.com/144x108/${weatherInfo?.sys?.country.toLowerCase()}.png`;   // it is forn converting counrty name to image

  desc.textContent = weatherInfo?.weather?.[0].description;   // bq the child of main object weatherInfo i.e weather is object so i have to traverse 

  conditionIcon.src = `https://openweathermap.org./img/w/${weatherInfo?.weather?.[0]?.icon}.png`;
  temp.textContent = weatherInfo?.main?.temp + " °C";
  windSpeed.textContent = weatherInfo?.wind?.speed + "m/s";
  humadity.textContent = weatherInfo?.main?.humidity + "%";
  cloudy.textContent = weatherInfo?.clouds?.all + "%";

}

function getLocation() {
  grantAccess.classList.add("active");
  if (navigator.geolocation) {   // If on your location geolocation is supporting or not
    navigator.geolocation.getCurrentPosition(Showposition);   // call showposition with fetched cuurent location pos
    console.log(" geolocation live grnat access btn working ");
  }
  else {  // if nhi 
    loadinScreen.classList.remove("active");
    alert("Live Location is not fetched!");
  }
}
function Showposition(position) {
  // findinf latt and logn
  const userCoordinates = {
    lat: position.coords.latitude,
    lon: position.coords.longitude,
  };
  sessionStorage.setItem("user-coordinates", JSON.stringify(userCoordinates));   // here im storing the weather info in sessionstorage
  // ab store ho gya hai to UI pr dikhana bhi to hoga 
  fetchCWeatherInfo(userCoordinates);
}
const grant_access_btn = document.querySelector("[grant-btn]");
grant_access_btn.addEventListener("click", getLocation);

const searchInput = document.querySelector("[data-search-city]");// By using this im fetching the vacity name that is inserting by User

searchForm.addEventListener("submit", (e) => {
  e.preventDefault();   // It will remove the default function of arrow function
  let cityName = searchInput.value;
  errorImg.style.display = "none";
  if (cityName === "") {
    return;
  }
  else {
    searchInput.value = "";
    userInfoContainer.classList.remove("active");
    fetchSearchWeatherInfo(cityName);
  }
});
const errorImg = document.querySelector(".error_found_image");
const errorText = document.querySelector("[error_handle_text]");
async function fetchSearchWeatherInfo(cityName) {
  userContainer.classList.remove("active");
  loadinScreen.classList.add("active");

  errorImg.style.display = "none";
  try {     // We can also pass the units as arguments during function calling  ie.   fetchSearchWeatherInfo(cityName , imperial or metric) and then we will use as var in api calling
    const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${cityName}&appid=${API_Key}&units=metric`);
    if (!response.ok) {   // for checking there is any error show  when you entered wrong city .                             // units=metric  --> temp =in degree celcius
      throw new Error('city not found!');                                                                                   // units =imperial --> in Fahrenheit
    }
    const data = await response.json();
    loadinScreen.classList.remove("active");
    userContainer.classList.remove("active");
    userInfoContainer.classList.add("active");
    rendorWeatherDetails(data);
  }
  catch (err) {
    console.log(err);
    loadinScreen.classList.remove("active");
    errorImg.style.display = "flex";
    // errorText.textContent = "City Not Found";
    document.getElementById("x").innerHTML = "City Not Found";
  }

}












/* ---------------------------------------------------------------------------------------------------------------------------------*/
/*            < ------ Some importants points ---->
 
1 . SESSION STORAGE : - 
------------------------
It return the string , when i getting the item.
it is a local storage area which store data locally , means the data is safe untill you closed not your open Tab.
Session storage is a web storage mechanism that allows you to store data locally in the browser for a single session. The data is
stored in key-value pairs, and it is only accessible to the current browser tab. The data is deleted when the browser tab is closed.

Session storage is useful for storing data that needs to be persisted for a single session, such as a user's login information or the 
contents of a shopping cart. It is not suitable for storing data that needs to be persisted across sessions, such as a user's preferences.
To use session storage, you can use the following methods:--

 -->. sessionStorage.setItem(key, value): Sets the value for the given key.
 -->. sessionStorage.getItem(key): Gets the value for the given key.
 -->. sessionStorage.removeItem(key): Removes the item for the given key.
 -->. sessionStorage.clear(): Clears all items from session storage.

 2. Optional chaining / Operator :- 
 -------------------------------------
  Optional chaining is a JavaScript feature that allows you to access properties or call functions of nested objects or 
  arrays without throwing an error if the object or function is undefined or null. The optional chaining operator is written
   with a question mark followed by a period ( ?. ).
   example ---
    weatherinfo?.main?.temp;   --> it will give the temp from weatherInfo object.
 
3 .    API calling wiith units 
----------------------------------------
fetchCWeatherInfo(userCoordinates, 'metric'); // for Celsius
// or
fetchCWeatherInfo(userCoordinates, 'imperial'); // for Fahrenheit
or
async function fetchCWeatherInfo(coordinate, units) { 
....
 const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=${units}&appid=${API_Key}`); 
...
}
*/
