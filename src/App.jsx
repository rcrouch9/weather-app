import { useState, useRef} from 'react';
import './App.css';
import descriptions from './descriptions';
import ClipLoader from "react-spinners/ClipLoader";

function App() {
  
  const [temperature, setTemperature] = useState("");

  const [description, setDescription] = useState("");

  const [descriptionImage, setDescriptonImage] = useState("")

  const [isLoading, setIsLoading] = useState(false);

  const container = useRef(null)

  function getUserLocation() {

    setIsLoading(true);

    navigator.geolocation.getCurrentPosition((position) => {
      let latitude = position.coords.latitude.toString();
      let longitude = position.coords.longitude.toString();

      var weatherUrl = `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,weather_code,is_day`;
      getResponse(weatherUrl);   
    })  
  }

  async function geocodeLocation(e) {

    setIsLoading(true);

    e.preventDefault();

    let location = e.target[0].value;
    let geocodeUrl = `https://maps.googleapis.com/maps/api/geocode/json?address=${location}&key=AIzaSyD7Bt_X5qPpbkh592n3g6s1S5Q5AmZZoa8`;

    try {
      const response = await fetch(geocodeUrl);
      const data = await response.json();

      let latitude = data.results[0].geometry.location.lat;
      let longitude = data.results[0].geometry.location.lng;

      var weatherUrl = `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,weather_code,is_day`;
      getResponse(weatherUrl);

      }
      
      catch (error) {
        console.log('Error:', error);
      }
  }

  
  async function getResponse(url) {

    try {
      const response = await fetch(url);
      const data = await response.json();

      setIsLoading(false);

      setTemperature((data.current.temperature_2m).toString() + data.current_units.temperature_2m);

      let code = data.current.weather_code.toString();
      let day = data.current.is_day
      if (day == 1){
        setDescription(descriptions[code].day.description)
        setDescriptonImage(descriptions[code].day.image)
        if (data.current.weather_code < 3) {
          container.current.style.backgroundColor = "skyblue";
        }
        else {
          container.current.style.backgroundColor = "grey";
        }
      }
      else {
        setDescription(descriptions[code].night.description)
        setDescriptonImage(descriptions[code].night.image)
        container.current.style.backgroundColor = "black";
      }
      

      }
      
      catch (error) {
        console.log('Error:', error);
      }
  }

  return (
    <div className='container' ref={container}>
      <div className="home">

        <div className='title'>Weather App</div>
        <div className='inputs'>

          <button className='button' onClick={getUserLocation}><i class="material-icons">my_location</i></button>
          <form id='form' className='user' onSubmit={geocodeLocation}>
            <input className='input' type='text' placeholder='Enter Your Location'></input>
            <button className='button search' type='submit'><i class="material-icons">search</i></button>
          </form>

        </div>

      </div>
      
      <div className="info">
        
      {isLoading ? <ClipLoader color="white" size={35} loading={isLoading} aria-label="Loading Spinner"></ClipLoader> :<img className='image' src={descriptionImage}></img>}
        <div className={`details ${!isLoading && 'visible'}`}>
          <div className='temp'>{temperature}</div>
          <div className='desc'>{description}</div>
        </div>
        
      </div>

    </div>
  )
}

export default App
