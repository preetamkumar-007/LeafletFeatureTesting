// const tileUrl = "https://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png"; // tile layer
const tileUrl = "http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"; // OSM standard tile layer
// // ======== Google Street Tiles ========//
// let googleStreets = L.tileLayer(
//   "http://{s}.google.com/vt/lyrs=m&x={x}&y={y}&z={z}",
//   {
//     maxZoom: 20,
//     subdomains: ["mt0", "mt1", "mt2", "mt3"],
//     maxNativeZoom: 19,
//   }
// ).addTo(map);
// =====================================//
const attribution =
  '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors';

//coordinates for testing purpose
const uttamNagar = [28.6200403, 77.0537406];
const palam = [28.5901, 77.0888];
const dwarka5 = [28.5977029, 77.0574221];
const kapashera = [28.5214, 77.0819];
const janakpuri = [28.6219, 77.0878];
const indiaGate = [28.6129, 77.2295];
const akshardhaam = [28.6127, 77.2773];
const safdurgunjAir = [28.5835, 77.2111];
const form = document.querySelector("form");
const searchIn = document.querySelector("#search");
const searchResult = document.querySelector("#searchResults");
const myLoc = [28.606556, 77.063133];
let control = new L.Control();
let target = {
  latitude: 28.60852,
  longitude: 77.06617,
};
// getting current location
navigator.geolocation.getCurrentPosition(
  (position) => {
    const { latitude, longitude } = position.coords;
    console.log(latitude, longitude);
    console.log([28.6051691, 77.0609258]);
    var map = L.map("map").setView([latitude, longitude], 18);
    // const street = L.esri.basemapLayer("Streets").addTo(map); // for streets layer

    // settingUp Tiles On Map
    const tiles = L.tileLayer(tileUrl, {
      attribution: attribution,
      maxZoom: 20, // max zoom - even if the images will get blurred
      maxNativeZoom: 19, //  images to the particular zoom level - so that it can't be blurred
    });
    tiles.addTo(map);
    // ======== Google Street Tiles ========//
    // let googleStreets = L.tileLayer(
    //   "http://{s}.google.com/vt/lyrs=m&x={x}&y={y}&z={z}",
    //   {
    //     maxZoom: 20,
    //     subdomains: ["mt0", "mt1", "mt2", "mt3"],
    //     maxNativeZoom: 19,
    //   }
    // ).addTo(map);

    // settingUp Marker On Our Current Location
    L.marker([latitude, longitude])
      .addTo(map)
      .bindPopup("I am Here.")
      .openPopup();

    // Circle Layer
    const circleLayer = L.circle([latitude, longitude], {
      radius: 2000,
      color: "#00F0FF",
      // fillColor: "transparent",
      fillOpacity: 0,
      stroke: 7,
      opacity: 0.5,
    }); //draw a circle around this coordinate with radius 2000 Meter 😀 WOW.
    circleLayer.addTo(map);

    // Rectangle layer
    // const rectLayer = L.rectangle([palam, uttamNagar]);
    // rectLayer.addTo(map);

    // Polygon Layer
    const polygon = L.polygon([janakpuri, indiaGate]);
    polygon.addTo(map);

    // PolyLine
    const polyLine = L.polyline([palam, indiaGate, [latitude, longitude]], {
      color: "orange",
    });
    polyLine.addTo(map);

    // Circle Marker
    const circleMarker = L.circleMarker(akshardhaam, { radius: 50 });
    circleMarker.bindPopup("<div> Akshardhaam 🛕 </div>");
    circleMarker.addTo(map);

    // Custom Marker
    const Icon = L.icon({
      iconUrl: "pizza.jpg",
      iconSize: [30, 40],
    });
    const customMarker = L.marker(safdurgunjAir, { icon: Icon });
    customMarker.bindPopup("<div> YumTum Franchise 😁 </div>");
    customMarker.addTo(map);

    // Layer Group {Important , Toggling Between Different Layers for ex: of we have a set of markers and we group them on the same
    //  layer we can then toggle it on or off}

    // leaflet-control-geocoder search plugin
    L.Control.geocoder().addTo(map);

    ////////////////// just finding out smallest path between two coords 😁🤣
    // const search = new GeoSearch.GeoSearchControl({
    //   provider: new GeoSearch.OpenStreetMapProvider(),
    // });
    // map.addControl(search);
    // const dwarka5lln = L.latLng(dwarka5);
    // console.log(dwarka5lln);
    // const uttamNagarlln = L.latLng(uttamNagar);
    // console.log(uttamNagarlln);
    // console.log((dwarka5lln.distanceTo(uttamNagarlln) / 1000).toFixed(0));
    /////////////////////////////////////////////////////////////////////////

    ////////////////////////////////////////////////////////////////////////
    // Using Open Source Routing Machine Plugin //
    // Using ESRI Routing Service with leaflet routing machine
    ////////////////////////////////////////////////////////////////////////
    // const map = L.map("map");

    //========== ROUTING BETWEEN TWO PLACES=========//
    control = L.Routing.control({
      router: L.Routing.esri({
        liveTraffic: true,
        profile: "Walking",
        steps: true,
        serviceUrl:
          "https://utility.arcgis.com/usrsvcs/appservices/xgPIb7ppsXY9hzSw/rest/services/World/Route/NAServer/Route_World/",
      }),
      fitSelectedRoutes: "true",
      // waypoints: [L.latLng(dwarka5), L.latLng(uttamNagar)],
      waypoints: [L.latLng(myLoc), L.latLng(target.latitude, target.longitude)],
      alternatives: true,
      geocoder: L.Control.Geocoder.nominatim(),
      routeWhileDragging: false,
      // addWaypoints: false, // Can new waypoints be added by dragging the line
      reverseWaypoints: true,
      summaryTemplate: "<h2><strong>{distance} , {time}</h2></strong>",
      collapsible: true,
      // show: true, //  to hide instruction on right
    }).addTo(map);
    console.log(control.getPlan());
    console.log(control.getWaypoints());
    L.Routing.errorControl(control).addTo(map);
    control.on("routeselected", function (e) {
      console.log(e);
      console.log(e.route.summary.totalDistance);
      console.log(e.route.summary.totalTime);
      // console.log(e.getPlan());
    });

    //===============================================//
    // L.Routing.control({
    //   waypoints: [L.latLng(57.74, 11.94), L.latLng(57.6792, 11.949)],
    // }).addTo(map);

    //  Click Event listener on searchResult
    searchResult.addEventListener("click", function (e) {
      // console.log(e.target);
      const clickedElement = e.target.closest("li");

      if (!clickedElement) return;
      searchResult.style.opacity = 0;

      console.log(clickedElement.textContent);
      searchIn.value = clickedElement.textContent;

      // searchIn.setAttribute("value", clickedElement.innerText);
      // console.log(searchIn);

      console.log(clickedElement);
      const lat = clickedElement.dataset.lat;
      const lon = clickedElement.dataset.lon;
      console.log(lat, lon);

      // pan to location
      // map.setView([lat, lon], 18, {
      //   animate: true,
      //   pan: {
      //     duration: 2,
      //   },
      // });

      // fly to location
      map.flyTo([lat, lon], 18, {
        animate: true,
        pan: {
          duration: 2,
        },
      });

      L.marker([lat, lon]).addTo(map);

      searchResult.innerHTML = "";
    });

    // USING NOMINATIM SEARCH API
    form.addEventListener("submit", function (e) {
      e.preventDefault();

      // fetching data from naminatim search api
      fetch(
        "http://nominatim.openstreetmap.org/search?format=json&limit=11&q=" +
          searchIn.value
      )
        .then(function (response) {
          return response.json();
        })
        .then(function (json) {
          // document.getElementById("address").innerHTML = json.display_name;
          let html = "";
          for (const result of json.values()) {
            console.log(result);
            html += `<li data-lat='${result.lat}' data-lon='${result.lon}'><p> ${result.display_name}
          </p></li><hr>`;
            console.log(html);
          }

          searchResult.insertAdjacentHTML("afterbegin", html);
          searchResult.style.opacity = 1;
          searchResult.style.overflowY = "auto";
          // searchResult.style.overflowY = "scroll";
        });
    });

    // USING NOMINATIM REVERSE GEOLOCATION API
    map.on("click", function (mapEvent) {
      const { lat, lng } = mapEvent.latlng;
      fetch(
        "http://nominatim.openstreetmap.org/reverse?format=json&lon=" +
          lng +
          "&lat=" +
          lat
      )
        .then(function (response) {
          return response.json();
        })
        .then(function (json) {
          // document.getElementById("address").innerHTML = json.display_name;
          console.log(json);
        });
    });

    // Trying To Implement Live Tracking
    // let markerL = "";
    // map
    //   .locate({
    //     watch: true,
    //     setView: true,
    //     maxZoom: 18,
    //   })
    //   .on("locationfound", (e) => {
    //     console.log(e);
    //     if (!markerL) {
    //       markerL = L.marker([e.latitude, e.longitude], { icon: Icon }).addTo(
    //         map
    //       );
    //     } else {
    //       markerL.setLatLng([e.latitude, e.longitude]);
    //     }
    //   });
  },
  (error) => console.error(error),
  {
    enableHighAccuracy: true,
    timeout: 20000,
  }
);

/////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////
//////////////////////TRACKING 🙂//////////////////////////////////
/////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////
////////////////////////   1    /////////////////////////////
// Our Users Lat Lng
// let target = {
//   latitude: 28.5977029,
//   longitude: 77.0574221,
// };
// let map = L.map("map");
// map.setView(dwarka5, 18);
// // const tiles = L.tileLayer(tileUrl, {
// //   attribution: attribution,
// //   maxZoom: 20, // max zoom - even if the images will get blurred
// //   maxNativeZoom: 19, //  images to the particular zoom level - so that it can't be blurred
// // });
// // tiles.addTo(map);

// let control = L.Routing.control({
//   router: L.Routing.esri({
//     liveTraffic: true,
//     profile: "Driving",
//     serviceUrl:
//       "https://utility.arcgis.com/usrsvcs/appservices/xgPIb7ppsXY9hzSw/rest/services/World/Route/NAServer/Route_World/",
//   }),
//   // waypoints: [
//   //   L.latLng(pos.coords.latitude, pos.coords.longitude),
//   //   L.latLng(target.latitude, target.longitude),
//   // ],
//   waypoints: [null],
//   geocoder: L.Control.Geocoder.nominatim(),
//   autoRoute: true,
//   fitSelectedRoutes: true,
//   show: false,
// }).addTo(map);
// L.Routing.errorControl(control).addTo(map);

// const id = navigator.geolocation.watchPosition((pos) => {
//   control = L.Routing.control({
//     router: L.Routing.esri({
//       liveTraffic: true,
//       profile: "Driving",
//       serviceUrl:
//         "https://utility.arcgis.com/usrsvcs/appservices/xgPIb7ppsXY9hzSw/rest/services/World/Route/NAServer/Route_World/",
//     }),
//     waypoints: [
//       L.latLng(pos.coords.latitude, pos.coords.longitude),
//       L.latLng(target.latitude, target.longitude),
//     ],

//     geocoder: L.Control.Geocoder.nominatim(),
//     // autoRoute: true,
//     // fitSelectedRoutes: true,
//     show: false,
//   }).addTo(map);

//   if (
//     target.latitude === pos.coords.latitude &&
//     target.longitude === pos.coords.longitude
//   ) {
//     console.log("Congratulations, you reached the target");
//     navigator.geolocation.clearWatch(id);
//   } else {
//     console.log("comming");
//     // Delivery Boys Lat and Long
//   }
// });

///////////////////////////// 2 ///////////////////////////////////////
// var id, target, options;

// function success(pos) {
//   var crd = pos.coords;
//   // var latitude = 28.606556;
//   // var longitude = 77.063133;
//   // console.log("Google : ", myLoc);
//   // console.log("Browser : ", [pos.coords.latitude, pos.coords.longitude]);

//   if (target.latitude === crd.latitude && target.longitude === crd.longitude) {
//     console.log("Congratulations, you reached the target");
//     navigator.geolocation.clearWatch(id);
//   } else {
//     // console.log("comming");
//     // Delivery Boys Lat and Long
//   }
// }

// function error(err) {
//   console.warn("ERROR(" + err.code + "): " + err.message);
// }

// let options = {
//   enableHighAccuracy: true,
//   timeout: 50000,
//   maximumAge: 30000,
// };

// id = navigator.geolocation.watchPosition(success, error, options);

/////////////////////////////// 3 /////////////////////////////////////

// const tiles = L.tileLayer(tileUrl, {
//   attribution: attribution,
//   maxZoom: 20, // max zoom - even if the images will get blurred
//   maxNativeZoom: 19, //  images to the particular zoom level - so that it can't be blurred
// });
// tiles.addTo(map);

// map.locate({ watch: true });
// map.setView(dwarka5, 18);
// let markerLayer = L.layerGroup();
// let marker = L.marker(dwarka5).addTo(map);

// function onLocationFound(e) {
//   var radius = e.accuracy / 2;
//   console.log(e.latlng);
//   marker = L.marker(e.latlng)
//     .addTo(markerLayer)
//     .bindPopup("You are within " + radius + " meters from this point")
//     .openPopup();

//   // console.log(marker);
//   // console.log(markerLayer);
//   markerLayer.addTo(map);

//   console.log(map.removeLayer(markerLayer));

//   // if (marker) map.removeLayer(marker);
//   // L.marker(e.latlng)
//   //   .addTo(map)
//   //   .bindPopup("You are within " + radius + " meters from this point")
//   //   .openPopup();
//   // L.circle(e.latlng, radius).addTo(map);
// }

// map.on("locationfound", onLocationFound);

//////////////////4////////////////////////

navigator.geolocation.watchPosition(
  function (e) {
    console.log(control.getWaypoints());
    console.log(e);
    control.spliceWaypoints(0, 1, [e.coords.latitude, e.coords.longitude]);
  },
  (error) => console.error(error),
  {
    enableHighAccuracy: true,
    timeout: 20000,
  }
);
