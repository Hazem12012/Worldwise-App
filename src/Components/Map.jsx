import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useMap } from "react-leaflet";
import {
  MapContainer,
  Popup,
  Marker,
  TileLayer,
  useMapEvent,
} from "react-leaflet";

import styles from "./Map.module.css";
import Button from "./Button";
import { useCities } from "../contexts/CitiesContext";
import { useURLPosition } from "../hooks/useURLPosition";
import { useGeolocation } from "../hooks/useGeoLocation";

function Map() {
  const navigate = useNavigate();
  const { cities } = useCities();
  const [mapLat, mapLng] = useURLPosition();

  const [mapPosition, setMapPosition] = useState([30.033333, 31.233334]);
  const {
    isLoading: isLoadingPosition,
    position: geoLocationPosition,
    getPosition,
  } = useGeolocation();

  useEffect(() => {
    if (mapLat && mapLng) {
      setMapPosition([mapLat, mapLng]);
    }
  }, [mapLat, mapLng]);

  //********** issue **********
  useEffect(() => {
    geoLocationPosition &&
      setMapPosition([geoLocationPosition.lat, geoLocationPosition.lng]);
  }, [geoLocationPosition]);


  return (
    <div className={styles.mapContainer}>
      {!geoLocationPosition && (
        <Button type={"position"} onClick={getPosition}>
          {isLoadingPosition ? "Loading ..." : "Use your position"}
        </Button>
      )}
      <MapContainer
        center={mapPosition}
        zoom={6}
        scrollWheelZoom={true}
        className={styles.map}>
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png"
        />
        {cities.map((city) => (
          <Marker
          position={[city.position.lat, city.position.lng]}
          key={city.id}>
            <Popup>
              {city.cityName} <br />
              {city.notes}
            </Popup>
          </Marker>
        ))
        }
        <ChangeCenter position={mapPosition} />
        <DetectClick />
      </MapContainer>
    </div>
  );
}
function ChangeCenter({ position }) {
  const map = useMap();
  map.setView(position);
  return null;
}

function DetectClick() {
  const navigate = useNavigate();

  useMapEvent({
    click: (e) => {
      navigate(`form?lat=${e.latlng.lat || 55}&lng=${e.latlng.lng || 37}`);
    },
  });
}

export default Map;
