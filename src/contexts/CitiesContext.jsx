import { createContext, useEffect, useState, useContext } from "react";

const BASE_URL = "http://localhost:9000";

const CitiesContext = createContext();

function CitiesProvider({ children }) {
  const [cities, setCities] = useState([]);
  const [isLoading, setisLoading] = useState(false);

  useEffect(function () {
    async function fetchCities() {
      try {
        setisLoading(true);
        const res = await fetch(`${BASE_URL}/cities`);
        const data = await res.json();
        setCities(data);
      } catch {
        alert("there was an error loading data...");
      } finally {
        setisLoading(false);
      }
    }
    fetchCities();
  }, []);


  const [currentCity, setCurrentCity] = useState({});

  async function getCity(id) {
    try {
      setisLoading(true);
      const res = await fetch(`${BASE_URL}/cities/${id}`);
      const data = await res.json();
      setCurrentCity(data);
    } catch {
      alert("there was an error loading data...");
    } finally {
      setisLoading(false);
    }
  }

  return (
    <CitiesContext.Provider value={{
      cities,
      isLoading,
      currentCity,
      getCity
    }}>
      {children}
    </CitiesContext.Provider >
  );

}
function useCities() {
  const context = useContext(CitiesContext);
  if (context === undefined) {
    throw new Error("CitiesContext is used outside the CitiesProvider");
  }
  return context;
}
export { CitiesProvider, useCities };
