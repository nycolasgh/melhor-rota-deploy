
$.getScript( "https://maps.googleapis.com/maps/api/js?key=" + google_api_key + "&libraries=places&callback=Function.prototype")
.done(function( script, textStatus ) {
    google.maps.event.addDomListener(window, "load", initAutocomplete())
    google.maps.event.addDomListener(window, "load", initMap())

})

center = { lat: -26.315882523667277, lng: -48.83957283943075 };  // define o centro de onde vai partir a distancia das fronteiras
const defaultBounds = {  // são as distancias a partir do centro até onde vai a limitação em direçao a determinado ponto cardeal
    north: center.lat + 0.2,
    south: center.lat - 0.2,
    east: center.lng + 0.2,
    west: center.lng - 0.2,
};

const options = {
   bounds: defaultBounds,
   componentRestrictions: {'country': ['br']},
   strictBounds: true,
   fields: ["formatted_address", "geometry", "name"],
}


function initAutocomplete() {

    var input_s = document.querySelector('input#start');
    var autocomplete_s = new google.maps.places.Autocomplete(input_s, options);

    var input_e = document.querySelector('input#end');
    var autocomplete_e = new google.maps.places.Autocomplete(input_e, options);

    var waypoints = document.getElementsByName("waypoints[]");
    for (var i; i < waypoints.length; i++);{
        var input_w = waypoints[i];
        var autocomplete_w = new google.maps.places.Autocomplete(input_w, options);
        };
  }

function initMap() {
  directionsDisplay = new google.maps.DirectionsRenderer();
  directionsService = new google.maps.DirectionsService();
  var city = new google.maps.LatLng(-26.315882523667277, -48.83957283943075);
  var mapOptions = {
    zoom: 12,
    mapTypeId: google.maps.MapTypeId.ROADMAP,
    center: city
  }

  map = new google.maps.Map(document.getElementById("map-canvas"), mapOptions);
  directionsDisplay.setMap(map);
  google.maps.event.addDomListener(document.getElementById('getdir'), 'click', function() {
    calculateAndDisplayRoute(directionsService, directionsDisplay);
  });
}


function calculateAndDisplayRoute() {
  var waypts = [];
  var checkboxArray = document.getElementById('dynamicInput');
  var waypointElmts = document.getElementsByName('waypoints[]');
  for (var i = 0; i < waypointElmts.length; i++) {
    if (waypointElmts[i].value.length > 0) {
      waypts.push({
        location: waypointElmts[i].value,
        stopover: true
      });
    }
  }
  directionsService.route({
    origin: document.getElementById('start').value,
    destination: document.getElementById('end').value,
    waypoints: waypts,
    optimizeWaypoints: true,
    travelMode: 'DRIVING'
  },
  function(response, status) {
    if (status === 'OK') {
        directionsDisplay.setDirections(response);
        computeTotalDistance(response);
        const route = response.routes[0];
        const wayptOrder = route.waypoint_order;

        console.log(route.waypoint_order);
        console.log(route);

        // maps url parse

        //Extract the origin and destination addresses from the html element and encode
        const originUrl = encodeURIComponent(document.getElementById('start').value);
        const destinationUrl = encodeURIComponent(document.getElementById('end').value);
        let waypoints = ''
        const wayptsArray = waypts.map(obj => obj.location);

        // For para ajustar os waypoints na ordem que a response do método retorna
        for (let i = 0; i < wayptOrder.length; i++) {
          waypoints += wayptsArray[route.waypoint_order[i]];
          if (i < wayptOrder.length - 1) {
            waypoints += '|';
          }
        }

        //Depois de juntar todos waypoints em uma string, a gente transforma ela em url
        wayptsUrl = encodeURIComponent(waypoints);

        // Construct the Google Maps universal URL
        let url = "https://www.google.com/maps/dir/?api=1&origin=" + originUrl + "&destination=" + destinationUrl + "&waypoints=" + wayptsUrl + "&travelmode=driving&dir_action=navigate";

        // Log the URL
        console.log(url);
        console.log(wayptsArray);

        // var para selecionar a div que vai receber a lista de paradas otimizada em ordem
        const summaryPanel = document.getElementById("waypoints-results");

        summaryPanel.innerHTML = "<h3>Aqui está a melhor rota!</h3>";

        // For each route, display summary information.
        for (let i = 0; i < route.legs.length; i++) {
            const routeSegment = i + 1;
            summaryPanel.innerHTML += "<br><b>Parada " + routeSegment + "</b><br>";
        if (typeof route.waypoint_order[i] !== 'undefined' && route.waypoint_order[i] !== null) {
            let waypointName = waypts[route.waypoint_order[i]].location.split("-");
            summaryPanel.innerHTML += waypointName[0] + "<br>";
            summaryPanel.innerHTML += route.legs[i].end_address + "<br>";
            summaryPanel.innerHTML += route.legs[i].distance.text + "<br>";
        }
        else {
        summaryPanel.innerHTML += route.legs[i].end_address + "<br>";
        summaryPanel.innerHTML += route.legs[i].distance.text + "<br><br>";
        }
        }

         document.getElementById("result-links").innerHTML = "<a href=" + url + " target='_blank'>Ver rota no Google Maps</a><button id='copy-button'>Copiar Link</button>";
         const copyButton = document.getElementById('copy-button');

         copyButton.addEventListener('click', () => {
            const input = document.createElement('input');
            input.setAttribute('value', url);
            document.body.appendChild(input);
            input.select();
            document.execCommand('copy');
            document.body.removeChild(input);
            alert('Link copiado para a área de transferência!');
        });
    } else {
      window.alert('Roteirizador falhou devido ao status: ' + status);
    }
  });
}

var limit = 20;  // Limite de waypoints, a partir de 11 o google cobra um pouco a mais e 23 é o máximo
var counter = 1;
var i = 0;

function addWaypoint(divName){  // Cria função cujo objeto será o nome da div onde serão adicionados os elementos dinamicamente
    if (counter == limit) {
        alert("Você chegou ao limite de " + counter + " paradas");
    }
    else {
        var div = document.createElement('div'); // cria uma div que vai conter o botão de remover e o input de texto
        div.setAttribute("class", "waypointbox");
        div.setAttribute("id", "box_"+counter);  // usa counter aqui para poder remover a box certa com a função remove
        var newinput = document.createElement("input");
        newinput.setAttribute("name", "waypoints[]");
        newinput.setAttribute("autocomplete", "on");
        newinput.setAttribute("type", "text");
        newinput.setAttribute("id", "newin"+counter);
        newinput.setAttribute("class", "newinput");
        var remove = document.createElement("input");
        remove.setAttribute("class", "rmvbutton");
        remove.setAttribute("name", "remove");
        remove.setAttribute("value", "X");
        remove.setAttribute("type", "button");
        remove.setAttribute("onclick", "removeWaypoint(this)");
        remove.setAttribute("id", "remove"+counter);
        document.getElementById(divName).appendChild(div);
        document.getElementById("box_"+counter).appendChild(newinput);
        document.getElementById("box_"+counter).appendChild(remove);

        counter++;
        i++
        console.log("cntr=" + counter + " i=" + i + " waypoints[].length=" + document.getElementsByName("waypoints[]"));
        var autocompletew = new google.maps.places.Autocomplete(newinput, options);

  }
}

function removeWaypoint(ele){
    ele.parentNode.remove();
    counter--;
    i--;
}

function computeTotalDistance(result) {
  var totalDist = 0;
  var totalTime = 0;
  var myroute = result.routes[0];
  for (i = 0; i < myroute.legs.length; i++) {
    totalDist += myroute.legs[i].distance.value;
    totalTime += myroute.legs[i].duration.value;
  }
  totalDist = totalDist / 1000;
  document.getElementById("total").innerHTML = "<b>Distância Total: </b>" + totalDist.toFixed(2) + " km<br><b>Tempo Total Aproximado: </b>" + (totalTime / 60).toFixed(0) + " minutos";
}