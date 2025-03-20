/** @format */

// "https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=0&longitude=0"

// import the hooks
import { useEffect, useState } from "react";
import { useURLPosition } from "../hooks/useURLPosition";
import { useNavigate } from "react-router-dom";
// import  DatePicker liberary
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

//  import the file component
import Spinner from "./Spinner";
import Button from "./Button";
import BackButton from "./BackButton";
import Message from "./Message";

import styles from "./Form.module.css";
import { createContext } from 'react';
import { useCities } from "../contexts/CitiesContext";


// converts a two-letter country code  into flag emoji. 
export function convertToEmoji(countryCode) {
  const codePoints = countryCode
    .toUpperCase()
    .split("")
    .map((char) => 127397 + char.charCodeAt());
  return String.fromCodePoint(...codePoints);
}


const BASE_URL = "https://api.bigdatacloud.net/data/reverse-geocode-client";
//start  main function(form) 
function Form() {

  const [country, setCountry] = useState("");
  const [notes, setNotes] = useState("");
  const [lat, lng] = useURLPosition();
  const [isLoadingGeocoding, setIsLoadingGeocoding] = useState();
  const [cityName, setCityName] = useState("");
  const [emoji, setEmoji] = useState();
  const [geoCodingError, setGeoCodingError] = useState("");
  const [date, setDate] = useState(new Date());
  const { createCity, isLoading } = useCities();

  const navigate = useNavigate();

  //get data from  BASE_URL
  useEffect(() => {
    async function fetchCityData() {
      try {
        setGeoCodingError("");
        setIsLoadingGeocoding(true);
        const res = await fetch(`${BASE_URL}?latitude=${lat}&longitude=${lng}`);
        const data = await res.json();
        if (!data.countryCode) {
          throw new Error(
            "That doesn't seem to be a city.click somewhere else 😞"
          );
        }
        setCityName(data.city || data.locality || "");
        setCountry(data.countryName);
        setEmoji(convertToEmoji(data.countryCode));
      } catch (err) {
        setGeoCodingError(err.message);
      } finally {
        setIsLoadingGeocoding(false);
      }
    }
    fetchCityData();
  }, [lat, lng]);
  // Handle submit function
  async function handleSubmit(e) {
    e.preventDefault()
    if (!cityName || !date) return;
    const newCity = {
      cityName,
      country,
      emoji,
      date,
      notes,
      position: { lat, lng },
    }
    await createCity(newCity)
    navigate("/app/cities")
  }


  if (!lat && !lng) return <Message message={"Start by clicking somewhere on the map "} />;
  if (geoCodingError) return <Message message={geoCodingError}></Message>;
  if (isLoadingGeocoding) return <Spinner />;
  return (
    <form className={`${styles.form} ${isLoading ? styles.loading : ""
      } `} onSubmit={handleSubmit}>
      <div className={styles.row}>
        <label htmlFor={"cityName"}>City name</label>
        <input
          id={"cityName"}
          onChange={(e) => setCityName(e.target.value)}
          value={cityName}
        />

        <span className={styles.flag}>{emoji}</span>
      </div>

      <div className={styles.row}>
        <label htmlFor="date">When did you go to {cityName}?</label>
        {/* <input
          id="date"
          onChange={(e) => setDate(e.target.value)}
          value={date}
        /> */}
        <DatePicker styles={{ background: "red" }} id={"date"}
          onChange={(date) => setDate(date)} selected={date} dateFormat={"dd/MM/yyyy"} />
      </div>

      <div className={styles.row}>
        <label htmlFor="notes">Notes about your trip to {cityName}</label>
        <textarea
          id="notes"
          onChange={(e) => setNotes(e.target.value)}
          value={notes}
        />
      </div>

      <div className={styles.buttons}>
        <Button type="primary" >Add</Button>
        <BackButton type="form" />
      </div>
    </form >
  );
}

export default Form;
