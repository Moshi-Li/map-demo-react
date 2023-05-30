import { useSelector } from "react-redux";
import { GoogleMap, Marker } from "@react-google-maps/api";

import { RootStoreI } from "../../Store";

import "./index.scss";

const Map = () => {
  const { locationList, center } = useSelector(
    (store: RootStoreI) => store.DataReducer
  );

  return (
    <>
      <GoogleMap
        zoom={10}
        center={center}
        mapContainerClassName="map-container"
        options={{
          disableDefaultUI: true,
        }}
      >
        {locationList.map((item, index) => {
          return (
            <Marker
              key={`${item.text}-${index}`}
              position={{ lat: item.lat, lng: item.lng }}
            />
          );
        })}
      </GoogleMap>
    </>
  );
};

export default Map;
