'use strict';

const btn = document.querySelector('.btn-country');
const countriesContainer = document.querySelector('.countries');

// const getCountryData = function (country) {
//   const request = new XMLHttpRequest();
//   request.open('GET', `https://restcountries.com/v2/name/${country}`);
//   request.send();
//   request.addEventListener('load', function (e) {
//     const [data] = JSON.parse(this.responseText);
//     console.log(data);
//     renderCountry(data);
//   });
// };

// const getCountryAndNeighbour = function (country) {
//   // AJAX call country 1
//   const request = new XMLHttpRequest();
//   request.open('GET', `https://restcountries.com/v2/name/${country}`);
//   request.send();
//   request.addEventListener('load', function (e) {
//     const [data] = JSON.parse(this.responseText);

//     // Render country 1
//     renderCountry(data);

//     // AJAX call country 2
//     const neighbour = data.borders?.[0];

//     if (!neighbour) return;

//     // AJAX call country 2
//     const request2 = new XMLHttpRequest();
//     request2.open('GET', `https://restcountries.com/v2/alpha/${neighbour}`);
//     request2.send();
//     request2.addEventListener('load', function (e) {
//       const data2 = JSON.parse(this.responseText);
//       console.log(data2);

//       renderCountry(data2, 'neighbour');
//     });
//   });
// };

const renderCountry = (data, className = '') => {
  const html = `
    <article class="country ${className}">
    <img class="country__img" src="${data.flag}" />
    <div class="country__data">
    <h3 class="country__name">${data.name}</h3>
    <h4 class="country__region">${data.region}</h4>
    <p class="country__row"><span>👫</span>${(
      +data.population / 1000000
    ).toFixed(1)}</p>
    <p class="country__row"><span>🗣️</span>${data.languages[0].name}</p>
    <p class="country__row"><span>💰</span>${data.currencies[0].name}</p>
    </div>
  </article>
    `;
  countriesContainer.insertAdjacentHTML('beforeend', html);
};
const renderError = function (msg) {
  countriesContainer.insertAdjacentText('beforeend', msg);
};

// // NEW COUNTRIES API URL (use instead of the URL shown in videos):
// // https://restcountries.com/v2/name/portugal

// // NEW REVERSE GEOCODING API URL (use instead of the URL shown in videos):
// // https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${lat}&longitude=${lng}

// // getCountryData('portugal');
// // getCountryData('usa');
// getCountryAndNeighbour('portugal');
const getJSON = (url, errorMessage = 'Something went wrong') => {
  return fetch(url).then(response => {
    if (!response.ok) throw new Error(`${errorMessage} ${response.status}`);
    return response.json();
  });
};
const getCountryData = country => {
  getJSON(`https://restcountries.com/v2/name/${country}`, 'Country not found')
    .then(data => {
      renderCountry(data[0]);

      const neighbour = data[0].borders?.[0];

      if (!neighbour) throw new Error('No neighbour found!');

      return getJSON(
        `https://restcountries.com/v2/alpha/${neighbour}`,
        'Country not found'
      );
    })
    .then(data => renderCountry(data, 'neighbour'))
    .catch(err => {
      console.error(`${err} 💥💥💥`);
      renderError(`Something went wrong 💥💥💥 ${err.message}. Try again!`);
    })
    .finally(() => (countriesContainer.style.opacity = 1));
};
// const getCountryData = country => {
//   fetch(`https://restcountries.com/v2/name/${country}`)
//     .then(response => {
//       console.log(response);

//       if (!response.ok) {
//         throw new Error(`Country not found ${response.status}`);
//       }

//       return response.json();
//     })
//     .then(data => {
//       renderCountry(data[0]);
//       //   const neighbour = data[0].borders?.[0];
//       const neighbour = 'asdkjkasfg';
//       if (!neighbour) return;

//       return fetch(`https://restcountries.com/v2/alpha/${neighbour}`);
//     })
//     .then(response => {
//       if (!response.ok) {
//         throw new Error(`Country not found ${response.status}`);
//       }

//       response.json();
//     })
//     .then(data => renderCountry(data, 'neighbour'))
//     .catch(err => {
//       console.log(`${err}💥💥💥💥💥`);
//       renderError(`Something went wrong 💥: ${err.message}. Try again!`);
//     })
//     .finally(() => (countriesContainer.style.opacity = 1));
// };

// btn.addEventListener('click', () => getCountryData('australia'));

//////////////////////////////////////////////////////////////////////////
// Coding Challenge #1
/* In this challenge you will build a function 'whereAmI' which renders a country ONLY based on GPS coordinates. For that, you will use a second API to geocode coordinates. Here are your tasks: 

PART 1 
  1. Create a function 'whereAmI' which takes as inputs a latitude value (lat) and a longitude value (lng) (these are GPS coordinates, examples are below). 
  2. Do 'reverse geocoding' of the provided coordinates. Reverse geocoding means to convert coordinates to a meaningful location, like a city and country name. Use this API to do reverse geocoding: https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${lat}&longitude=${lng}. The AJAX call will be done to a URL with this format: https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=52.508&longitude=13.381. Use the fetch API and promises to get the data. Do NOT use the getJSON function we created, that is cheating 😉 
  3. Once you have the data, take a look at it in the console to see all the attributes that you recieved about the provided location. Then, using this data, log a messsage like this to the console: 'You are in Berlin, Germany' 
  4. Chain a .catch method to the end of the promise chain and log errors to the console 
  5. This API allows you to make only 3 requests per second. If you reload fast, you will get this error with code 403. This is an error with the request. Remember, fetch() does NOT reject the promise in this case. So create an error to reject the promise yourself, with a meaningful error message. 
  
PART 2 
  6. Now it's time to use the received data to render a country. So take the relevant attribute from the geocoding API result, and plug it into the countries API that we have been using. 
  7. Render the country and catch any errors, just like we have done in the last lecture (you can even copy this code, no need to type the same code) 
  
  TEST COORDINATES 1: 52.508, 13.381 (Latitude, Longitude) 
  TEST COORDINATES 2: 19.037, 72.873 
  TEST COORDINATES 2: -33.933, 18.474
 */

// const whereAmI = (lat, lng) => {
//   const geocodeURL = `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${lat}&longitude=${lng}&localityLanguage=en`;

//   // 1) Reverse geocoding
//   return fetch(geocodeURL)
//     .then(res => {
//       // fetch only rejects on network failure; make it reject on HTTP errors too
//       if (!res.ok) {
//         // 403 is common here if you spam requests (>3 req/sec)
//         throw new Error(
//           `Geocoding failed (${res.status}) — possibly rate limited. Try again in a moment.`
//         );
//       }
//       return res.json();
//     })
//     .then(geo => {
//       // 2) Log "You are in City, Country"
//       const city =
//         geo.city ||
//         geo.locality ||
//         geo.principalSubdivision ||
//         geo.localityInfo?.administrative?.[0]?.name ||
//         'Unknown city';
//       const country = geo.countryName || 'Unknown country';
//       console.log(`You are in ${city}, ${country}`);

//       // 3) Use country name to fetch country details
//       // Prefer fullText match; if that fails we'll try a non-fullText fallback.
//       const byNameFull = `https://restcountries.com/v3.1/name/${encodeURIComponent(
//         country
//       )}?fullText=true`;

//       return fetch(byNameFull)
//         .then(res => {
//           if (!res.ok)
//             throw new Error(
//               `Country lookup failed for "${country}" (${res.status}).`
//             );
//           return res.json();
//         })
//         .catch(err => {
//           // Fallback: some country names might not match fullText exactly
//           const byName = `https://restcountries.com/v3.1/name/${encodeURIComponent(
//             country
//           )}`;
//           return fetch(byName).then(res => {
//             if (!res.ok) throw err; // rethrow original if fallback also fails
//             return res.json();
//           });
//         });
//     })
//     .then(countryData => {
//       // 4) Render the country
//       renderCountry(countryData);
//     })
//     .catch(err => {
//       console.error(err);
//       renderErrorBox(`⚠️ ${err.message}`);
//     });
// };

// // ----- TEST COORDINATES -----
// // 1) Berlin
// whereAmI(52.508, 13.381);
// // 2) Mumbai
// whereAmI(19.037, 72.873);
// // 3) Cape Town
// whereAmI(-33.933, 18.474);
// console.log('Test start');
// setTimeout(() => {
//   console.log('0 sec timer');
// }, 0);
// Promise.resolve('Resolved promise #1').then(res => console.log(res));
// Promise.resolve('Resolved promise #2').then(res => {
//   for (let i = 0; i < 100000000; i++) {}
//   console.log(res);
// });
// console.log('Test end');

// const lotteryPromise = new Promise(function (resolve, reject) {
//   console.log('Lotter draw is happening');

//   setTimeout(function () {
//     if (Math.random() >= 0.5) {
//       resolve('You WIN 💰');
//     } else {
//       reject(new Error('You lost your money 💩'));
//     }
//   }, 2000);
// });
// // Promisifying setTimeout
// const wait = function (seconds) {
//   return new Promise(function (resolve) {
//     setTimeout(resolve, seconds * 1000);
//   });
// };
// lotteryPromise.then(res => console.log(res)).catch(err => console.error(err));
// wait(2)
//   .then(() => {
//     console.log('I waited for 2 seconds');
//     return wait(1);
//   })
//   .then(() => console.log('I waited for 1 seond'));

// const getPosition = function () {
//   return new Promise(function (resolve, reject) {
//     navigator.geolocation.getCurrentPosition(resolve, reject);
//   });
// };

// getPosition().then(pos => console.log(pos));

// const whereAmI = () => {
//   getPosition()
//     .then(pos => {
//       const { latitude: lat, longitude: lng } = pos.coords;

//       return fetch(
//         `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${lat}&longitude=${lng}&localityLanguage=en`
//       );
//     })
//     .then(res => {
//       if (!res.ok) throw new Error(`Problem with geocoding ${res.status}`);

//       return res.json();
//     })
//     .then(data => {
//       console.log(data);
//       console.log(`You are in ${data.city}, ${data.countryName}`);

//       return fetch(`https://restcountries.com/v2/name/${data.countryName}`);
//     })
//     .then(res => {
//       if (!res.ok) throw new Error(`Country not found ${res.status}`);

//       return res.json();
//     })
//     .then(data => renderCountry(data[0]))
//     .catch(err => console.error(`${err.message}💥💥💥`));
// };
// btn.addEventListener('click', whereAmI);

const getPosition = function () {
  return new Promise(function (resolve, reject) {
    navigator.geolocation.getCurrentPosition(resolve, reject);
  });
};

const whereAmI = async function (country) {
  const pos = await getPosition();

  const { latitude: lat, longitude: lng } = pos.coords;

  const responseGeo = await fetch(
    `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${lat}&longitude=${lng}&localityLanguage=en`
  );
  const dataGeo = await responseGeo.json();
  console.log(dataGeo);
  const response = await fetch(
    `https://restcountries.com/v2/name/${dataGeo.countryName}`
  );

  const data = await response.json();

  renderCountry(data[0]);
};
whereAmI('portugal');
console.log('FIRST');
