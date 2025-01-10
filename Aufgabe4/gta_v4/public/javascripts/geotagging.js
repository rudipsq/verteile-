// File origin: VS1LAB A2

/* eslint-disable no-unused-vars */

// This script is executed when the browser loads index.html.

// "console.log" writes to the browser's console.
// The console window must be opened explicitly in the browser.
// Try to find this output in the browser...

console.log("The geoTagging script is going to start...");

/**
 * A class to help using the HTML5 Geolocation API.
 */
// class LocationHelper {
//   // Location values for latitude and longitude are private properties to protect them from changes.
//   #latitude = "";

//   /**
//    * Getter method allows read access to privat location property.
//    */
//   get latitude() {
//     return this.#latitude;
//   }

//   #longitude = "";

//   get longitude() {
//     return this.#longitude;
//   }

//   /**
//    * Create LocationHelper instance if coordinates are known.
//    * @param {string} latitude
//    * @param {string} longitude
//    */
//   constructor(latitude, longitude) {
//     this.#latitude = parseFloat(latitude).toFixed(5);
//     this.#longitude = parseFloat(longitude).toFixed(5);
//   }

//   /**
//    * The 'findLocation' method requests the current location details through the geolocation API.
//    * It is a static method that should be used to obtain an instance of LocationHelper.
//    * Throws an exception if the geolocation API is not available.
//    * @param {*} callback a function that will be called with a LocationHelper instance as parameter, that has the current location details
//    */
//   static findLocation(callback) {
//     const geoLocationApi = navigator.geolocation;

//     if (!geoLocationApi) {
//       throw new Error("The GeoLocation API is unavailable.");
//     }

//     // Call to the HTML5 geolocation API.
//     // Takes a first callback function as argument that is called in case of success.
//     // Second callback is optional for handling errors.
//     // These callbacks are given as arrow function expressions.
//     geoLocationApi.getCurrentPosition(
//       (location) => {
//         // Create and initialize LocationHelper object.
//         let helper = new LocationHelper(
//           location.coords.latitude,
//           location.coords.longitude
//         );
//         // Pass the locationHelper object to the callback.
//         callback(helper);
//       },
//       (error) => {
//         alert(error.message);
//       }
//     );
//   }
// }

/**
 * A class to help using the Leaflet map service.
 */
// class MapManager {
//   #map;
//   #markers;

//   /**
//    * Initialize a Leaflet map
//    * @param {number} latitude The map center latitude
//    * @param {number} longitude The map center longitude
//    * @param {number} zoom The map zoom, defaults to 18
//    */
//   initMap(latitude, longitude, zoom = 18) {
//     // set up dynamic Leaflet map
//     this.#map = L.map("map").setView([latitude, longitude], zoom);
//     var mapLink = '<a href="http://openstreetmap.org">OpenStreetMap</a>';
//     L.tileLayer("http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
//       attribution: "&copy; " + mapLink + " Contributors",
//     }).addTo(this.#map);
//     this.#markers = L.layerGroup().addTo(this.#map);
//   }

//   /**
//    * Update the Markers of a Leaflet map
//    * @param {number} latitude The map center latitude
//    * @param {number} longitude The map center longitude
//    * @param {{latitude, longitude, name}[]} tags The map tags, defaults to just the current location
//    */
//   updateMarkers(latitude, longitude, tags = []) {
//     // delete all markers
//     this.#markers.clearLayers();
//     L.marker([latitude, longitude])
//       .bindPopup("Your Location")
//       .addTo(this.#markers);
//     for (const tag of tags) {
//       L.marker([tag.location.latitude, tag.location.longitude])
//         .bindPopup(tag.name)
//         .addTo(this.#markers);
//     }
//   }
// }

/**
 * TODO: 'updateLocation'
 * A function to retrieve the current location and update the page.
 * It is called once the page has been fully loaded.
 */
// ... your code here ...

// function updateLocation() {
//   // - - - Teil 1
//   LocationHelper.findLocation((helper) => {
//     const latitude = helper.latitude;
//     const longitude = helper.longitude;

//     console.log(latitude);
//     console.log(longitude);

//     document.getElementById("tag-form-latitude").value = latitude;
//     document.getElementById("tag-form-longitude").value = longitude;

//     document.getElementById("discovery-form-latitude").value = latitude;
//     document.getElementById("discovery-form-longitude").value = longitude;

//     // - - - Teil 2
//     const elements = document.getElementsByClassName("jsDelete");

//     for (const element of elements) {
//       element.remove();
//     }

//     let mapManager = new MapManager();

//     mapManager.initMap(latitude, longitude);
//     mapManager.updateMarkers(latitude, longitude);
//   });
// }

function updateLocation() {
  const latitudeField = document.getElementById("tag-form-latitude");
  const longitudeField = document.getElementById("tag-form-longitude");

  // Check if coordinates are already set in the input fields
  if (!latitudeField.value || !longitudeField.value) {
    console.log(11111);
    LocationHelper.findLocation((helper) => {
      const latitude = helper.latitude;
      const longitude = helper.longitude;

      latitudeField.value = latitude;
      longitudeField.value = longitude;

      console.log(latitude);
      console.log(longitude);

      document.getElementById("discovery-form-latitude").value = latitude;
      document.getElementById("discovery-form-longitude").value = longitude;

      const elements = document.getElementsByClassName("jsDelete");
      for (const element of elements) {
        element.remove();
      }

      // let mapManager = new MapManager();
      mapManager.initMap(latitude, longitude);
      mapManager.updateMarkers(latitude, longitude);
    });
  } else {
    console.log(22222);
    // If coordinates are already present, initialize the map with them

    const latitude = latitudeField.value;
    const longitude = longitudeField.value;

    console.log(latitude);
    console.log(longitude);

    const elements = document.getElementsByClassName("jsDelete");
    for (const element of elements) {
      element.remove();
    }

    // let mapManager = new MapManager();
    mapManager.initMap(latitude, longitude);

    const map = document.getElementById("map");
    const taglistString = map.getAttribute("data-tags");
    console.log(taglistString);

    const tagList = JSON.parse(taglistString);
    console.log(tagList);

    for (const tag of tagList) {
      tag.location = { latitude: tag.latitude, longitude: tag.longitude };
    }

    mapManager.updateMarkers(latitude, longitude, tagList);
  }
}

let mapManager;
let prevPageButton;
let nextPageButton;
let currentPage = 1;

let latitude;
let longitude;
let searchTerm;

// Wait for the page to fully load its DOM content, then call updateLocation
document.addEventListener("DOMContentLoaded", () => {
  //   alert("Please change the script 'geotagging.js'");
  mapManager = new MapManager();
  updateLocation();

  const tagFormSubmitForm = document.getElementById("tag-form");
  tagFormSubmitForm.addEventListener("submit", tagFormSubmit);

  const discoveryFormSubmitButton = document.getElementById(
    "discoveryFilterForm"
  );
  discoveryFormSubmitButton.addEventListener("submit", discoveryFormSubmit);

  prevPageButton = document.getElementById("prev");
  nextPageButton = document.getElementById("next");

  prevPageButton.addEventListener("click", async (event) => {
    event.preventDefault();
    const url = event.target.href;

    currentPage--;

    maxPageNumber = await fetchGeotags(url);
    updatePageButtons(maxPageNumber);
  });

  nextPageButton.addEventListener("click", async (event) => {
    event.preventDefault();
    const url = event.target.href;

    currentPage++;

    maxPageNumber = await fetchGeotags(url);
    updatePageButtons(maxPageNumber);
  });
});

function tagFormSubmit(event) {
  event.preventDefault();

  const latitude = document.getElementById("tag-form-latitude").value;
  const longitude = document.getElementById("tag-form-longitude").value;
  const name = document.getElementById("tag-form-name").value;
  const hashtag = document.getElementById("tag-form-hashtag").value;

  console.log(latitude, longitude, name, hashtag);

  let requestJson = {
    name: name,
    latitude: latitude,
    longitude: longitude,
    hashtag: hashtag,
  };

  fetch("/api/geotags", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(requestJson),
  })
    .then((response) => response.json())
    .then((data) => console.log("Erfolg:", data))
    .catch((error) => console.error("Fehler:", error));
}

async function discoveryFormSubmit(event) {
  event.preventDefault();

  latitude = document.getElementById("discovery-form-latitude").value;
  longitude = document.getElementById("discovery-form-longitude").value;
  searchTerm = document.getElementById("discovery-form-search").value;

  const maxPageNumber = await fetchGeotags(
    `/api/geotags?latitude=${latitude}&longitude=${longitude}&searchterm=${searchTerm}&page=1`
  );

  currentPage = 1;

  updatePageButtons(maxPageNumber);

  // fetch(
  //   `/api/geotags?latitude=${latitude}&longitude=${longitude}&searchterm=${searchTerm}&page=1`,
  //   {
  //     method: "GET",
  //   }
  // )
  //   .then((response) => response.json())
  //   .then((data) => {
  //     console.log("Erfolg:", data);

  //     console.log(data);
  //     const tagList = data.geotags;
  //     const maxPages = data.maxPageNumber;

  //     const resultsListElement = document.getElementById("discoveryResults");
  //     resultsListElement.innerHTML = "";

  //     for (const tag of tagList) {
  //       tag.location = { latitude: tag.latitude, longitude: tag.longitude };

  //       const childElement = document.createElement("li");
  //       childElement.innerHTML = `${tag.name} (${tag.latitude}, ${tag.longitude}) ${tag.hashtag}`;

  //       resultsListElement.appendChild(childElement);
  //     }

  //     mapManager.updateMarkers(latitude, longitude, tagList);
  //   })
  //   .catch((error) => console.error("Fehler:", error));
}

function updatePageButtons(maxPages) {
  console.log(currentPage, maxPages);
  document.getElementById("pagination").style.display = "flex";

  prevPageButton.href = `/api/geotags?latitude=${latitude}&longitude=${longitude}&searchterm=${searchTerm}&page=${
    currentPage - 1
  }`;
  nextPageButton.href = `/api/geotags?latitude=${latitude}&longitude=${longitude}&searchterm=${searchTerm}&page=${
    currentPage + 1
  }`;

  if (currentPage === 1) {
    prevPageButton.classList.add("disabled");
  } else {
    prevPageButton.classList.remove("disabled");
  }

  if (currentPage === maxPages) {
    nextPageButton.classList.add("disabled");
  } else {
    nextPageButton.classList.remove("disabled");
  }

  document.getElementById("currentPage").innerHTML = currentPage;
}

async function fetchGeotags(url) {
  return await fetch(url, {
    method: "GET",
  })
    .then((response) => response.json())
    .then((data) => {
      console.log("Erfolg:", data);

      console.log(data);
      const tagList = data.geotags;
      const maxPages = data.maxPageNumber;

      const resultsListElement = document.getElementById("discoveryResults");
      resultsListElement.innerHTML = "";

      for (const tag of tagList) {
        tag.location = { latitude: tag.latitude, longitude: tag.longitude };

        const childElement = document.createElement("li");
        childElement.innerHTML = `${tag.name} (${tag.latitude}, ${tag.longitude}) ${tag.hashtag}`;

        resultsListElement.appendChild(childElement);
      }

      mapManager.updateMarkers(latitude, longitude, tagList);

      return maxPages;
    })
    .catch((error) => console.error("Fehler:", error));
}
