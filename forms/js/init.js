// declare variables
let mapOptions = {'center': [0,0],'zoom':2}

// use the variables
const map = L.map('the_map').setView(mapOptions.center, mapOptions.zoom);

L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}).addTo(map);

// create a function to add markers
// function addMarker(lat,lng,title,message){
//     // console.log(message)
//     L.marker([lat,lng]).addTo(map).bindPopup(`<h2>${title}</h2> <h3>${message}</h3>`)
//     createButtons(lat,lng,location)
//     return message
// }

let allTheMakers = L.featureGroup();

function addMarker(data){
    const title = data["Project Title"];
    const lat = parseFloat(data["lat"]);
    const lng = parseFloat(data["lng"]);
    const bestMenu = data["Project Link"];
    const shoutout = data.shoutout;
    const message = bestMenu + (shoutout ? "<br>Recommended by " + shoutout : "");
    console.log(shoutout)

    let thisMarker = L.marker([lat,lng]).addTo(map).bindPopup(`<h2>${title}</h2> <p>${message}</p>`)
    createButtons(lat, lng, title);

    return message;
}

function createButtons(lat,lng,title){
    const newButton = document.createElement("button"); // create a new button
    newButton.id = "button"+title; // give the button an id
    newButton.className = "coolButtons"
    newButton.innerHTML = title; // give the button text
    newButton.setAttribute("lat",lat); 
    newButton.setAttribute("lng",lng);
    newButton.addEventListener('click', function(){
        map.flyTo([lat,lng], mapOptions.zoom); //this will move the view to the button location
    })
    document.getElementById('placeForButtons').appendChild(newButton); //append the button to placeForButtons div

}
const dataUrl = "https://docs.google.com/spreadsheets/d/e/2PACX-1vQyucJNypjSisFbXYbFwRRPtTIfHTKU8Y3Qnt3fGrK6bWxAfXdner6ojHd6Zg_9FLh1f9aHv7iWeyFN/pub?output=csv"

function loadData(url){
    Papa.parse(url, {
        header: true,
        download: true,
        complete: results => processData(results)
    })
}

function processData(results){
    console.log(results)
    // loop through the data and add a marker `.forEach` data
    results.data.forEach(data => {
        console.log(data)
        addMarker(data)
    })

    // we then get the bounds of all the markers
    map.fitBounds(allTheMakers.getBounds())
}

function toggleIframe() {
    let contents = document.getElementById("survey");
    let main = document.querySelector(".main");
    if (contents.style.display === "none") {
      contents.style.display = "block";
      main.style.gridTemplateColumns = "1fr 1fr";
      // you needed to hide the buttons div when you click it 
      let theButtonsDiv = document.getElementById("placeForButtons"); // get the div that holds the buttons
      theButtonsDiv.style.display = "none"; // hide the div that holds the buttons
      map.invalidateSize();
    } else {
      let theButtonsDiv = document.getElementById("placeForButtons"); // get the div that holds the buttons
      theButtonsDiv.style.display = "grid"; // bring back the grid that holds the buttons
      let theSurveyDiv = document.getElementById("survey"); // get the div that holds the survey
      theSurveyDiv.style.display = "none"; // hide the div that holds the survey

      main.style.gridTemplateColumns = "1fr"; // change the grid to one column
      map.invalidateSize();
    }
  
  }
  
  window.addEventListener('DOMContentLoaded', function () {
    document.getElementById("toggleBtn").addEventListener("click", toggleIframe);
  });

toggleIframe()
loadData(dataUrl)
