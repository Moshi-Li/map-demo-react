import { useLoadScript } from "@react-google-maps/api";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import Map from "./components/Map";
import SearchBar from "./components/SearchBar";
import Table from "./components/Table";

import { updateCenter } from "./slices/DataSlice";

import "./App.scss";
import { useCallback, useEffect } from "react";
import { useDispatch } from "react-redux";

const API_KEY = "AIzaSyCcxWe-IIs24W5pM10BeJcuSsMXTMoH7qM";

function App() {
  const dispatch = useDispatch();
  const { isLoaded } = useLoadScript({
    googleMapsApiKey: API_KEY,
    libraries: ["places"],
  });

  useEffect(() => {
    updateUserLocation();
  }, []);

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

  if (!isLoaded) return <div>Loading...</div>;

  return (
    <>
      <Map></Map>
      <SearchBar></SearchBar>
      <Table></Table>
      <ToastContainer
        position="top-center"
        autoClose={1000 * 1000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="colored"
        bodyClassName={() => "custom--toast--container"}
      />
    </>
  );
}

export default App;
