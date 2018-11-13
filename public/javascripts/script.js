document.addEventListener('DOMContentLoaded', () => {

  console.log('IronGenerator JS imported successfully!');



  const center = {
    lat: 52.5059909,
    lng: 13.3710617
  };
  
  const markers = []
  
  
  
  const map = new google.maps.Map(document.getElementById('map'), {
    zoom: 13,
    center: center
  });
  
  getPlaces()
  
  // let center = {
  //   lat: undefined,
  //   lng: undefined
  // }; 
  
  function getPlaces() {
    axios.get("http://localhost:3000/api")
      .then(response => {
        placePlaces(response.data.places);
      })
      .catch(error => {
        next(error);
      })
  }
  
  function placePlaces(place) {
    place.forEach(function (place) {
      const center = {
        lat: place.location.coordinates[1],
        lng: place.location.coordinates[0]
      };
      const pin = new google.maps.Marker({
        position: center,
        map: map,
        title: place.name
      });
      markers.push(pin);
    });
  }
  
  

  

  
}, false);
