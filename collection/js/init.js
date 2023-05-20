// declare variables
let mapOptions = {'center': [0,0],'zoom':2}

// use the variables
const dataUrl = "https://docs.google.com/spreadsheets/d/e/2PACX-1vRgq92ybGx-zwgUvEX1Iq5rU_S-2lnQUYW3TWZsSF4srWf1F51JbyNYFInUsURhJI2wIn46PmfN4QfP/pub?gid=0&single=true&output=csv"
const map = L.map('the_map').setView(mapOptions.center, mapOptions.zoom);

L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', {
	attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
	subdomains: 'abcd',
	maxZoom: 20
})
.addTo(map);


function createButtons(lat,lng,title){
    const newButton = document.createElement("button"); // adds a new button
    newButton.id = "button"+title; // gives the button a unique id
    newButton.className = title
    newButton.innerHTML = title; // gives the button a title
    newButton.setAttribute("lat",lat); // sets the latitude 
    newButton.setAttribute("lng",lng); // sets the longitude 
    newButton.addEventListener('mouseover', function(){
        map.flyTo([lat,lng],11); //this is the flyTo from Leaflet
    })
    document.getElementById("contents").appendChild(newButton); //this adds the button to our page.
}

function loadData(url){
  Papa.parse(url, {
      header: true,
      download: true,
      complete: results => processData(results)
      
  })
}
loadData(dataUrl)

function processData(results){
  console.log(results) //for debugging: this can help us see if the results are what we want
  results['data'].forEach(data => {
      console.log(data) // for debugging: are we seeing each data correctly?
      addMarker(data.lat, data.lng, data['Project Title'], data['Project Link'])
    
    })
}

// create a function to add markers
function addMarker(lat,lng,title,link){
  console.log(link)
  L.marker([lat,lng]).addTo(map).bindPopup(`<h2>${title}</h2> <h3><a href="${link}">${link}</a></h3>`)
  createButtons(lat,lng,title);
  return 
}


