import React, { useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import Axios from "axios";
import { GoLocation, GoSearch } from "react-icons/go";
import { toast } from "react-toastify";
import usePlacesAutocomplete, {
  getGeocode,
  getLatLng,
} from "use-places-autocomplete";
import useOnclickOutside from "react-cool-onclickoutside";

import {
  addLocation,
  deleteLocation,
  updateCenter,
} from "../../slices/DataSlice";
import { RootStoreI } from "../../Store";

import "./index.scss";

const getTimeZoneUrl = (lat: number, lng: number) => {
  return ` https://maps.googleapis.com/maps/api/timezone/json?location=${lat}%2C${lng}&timestamp=${Math.floor(
    new Date().getTime() / 100
  )}&key=AIzaSyCcxWe-IIs24W5pM10BeJcuSsMXTMoH7qM
`;
};

const SearchBar = () => {
  const dispatch = useDispatch();
  const { locationList } = useSelector(
    (store: RootStoreI) => store.DataReducer
  );

  const {
    ready,
    value,
    suggestions: { status, data },
    setValue,
    clearSuggestions,
  } = usePlacesAutocomplete({
    debounce: 300,
  });

  const containerRef = useOnclickOutside(() => {
    // When user clicks outside of the component, we can dismiss
    // the searched suggestions by calling this method
    clearSuggestions();
  });

  const inputOnChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setValue(e.target.value);
    },
    [setValue]
  );

  const handleSelect = async (address: string) => {
    try {
      setValue(address, false);

      const results = await getGeocode({ address });

      const { lat, lng } = await getLatLng(results[0]);
      const { data } = await Axios.get<{
        timeZoneId: string;
        timeZoneName: string;
        rawOffset: number;
      }>(getTimeZoneUrl(lat, lng));

      dispatch(
        addLocation({
          locationInfo: {
            text: address,
            lat,
            lng,
            id: `${new Date().getTime()}`,
            timeZoneId: data.timeZoneId,
            timeZoneName: data.timeZoneName,
            rawOffset: data.rawOffset,
          },
        })
      );
      clearSuggestions();
    } catch (e) {
      toast(`error: ${e}`, {
        position: "top-center",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "colored",
      });
      clearSuggestions();
    }
  };

  const updateUserLocation = useCallback(
    () =>
      navigator.geolocation.getCurrentPosition(
        (location: GeolocationPosition) => {
          dispatch(
            updateCenter({
              center: {
                lng: location.coords.longitude,
                lat: location.coords.latitude,
              },
            })
          );
        },
        (e) => {
          toast(`error: ${e.message}`, {
            position: "top-center",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "colored",
          });
        }
      ),
    []
  );

  const renderSuggestions = () => {
    return data.map((suggestion) => {
      const {
        place_id,
        structured_formatting: { main_text, secondary_text },
        description,
      } = suggestion;

      return (
        <li
          key={place_id}
          onClick={() => handleSelect(description)}
          tabIndex={1}
          onKeyDown={(e) => {
            if (e.code === "Enter") {
              handleSelect(description);
            }
          }}
          title={description}
        >
          <p>{`${main_text ? main_text : ""} ${
            secondary_text ? secondary_text : ""
          }`}</p>
        </li>
      );
    });
  };

  const renderLocationList = () => {
    return locationList.map((item) => {
      return (
        <div key={item.id} className="item--tag">
          <p>{item.text}</p>
          <span
            onClick={() => dispatch(deleteLocation({ locationId: item.id }))}
          >
            &#x2715;
          </span>
        </div>
      );
    });
  };

  return (
    <div ref={containerRef} className="search--container">
      <input
        value={value}
        onChange={(e) => inputOnChange(e)}
        disabled={!ready}
        placeholder="Type to Search"
        tabIndex={1}
        onKeyDown={(e) => {
          if (e.code === "Enter") {
            handleSelect(value);
          }
        }}
      />
      <span
        className="icon--btn icon--search"
        onClick={() => handleSelect(value)}
      >
        <GoSearch></GoSearch>
      </span>
      <span
        className="icon--btn icon---locate"
        onClick={() => updateUserLocation()}
      >
        <GoLocation></GoLocation>
      </span>

      {status === "OK" ? (
        <ul>{renderSuggestions()}</ul>
      ) : (
        <div className="responsive--table">{renderLocationList()}</div>
      )}
    </div>
  );
};

export default SearchBar;
