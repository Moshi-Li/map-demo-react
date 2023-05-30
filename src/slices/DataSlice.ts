import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { dummyData } from "./data";
export interface LocationInfoI {
  text: string;
  lat: number;
  lng: number;
  id: string;
  timeZoneId: string;
  timeZoneName: string;
  rawOffset: number;
}

interface LocationCoordI {
  lat: number;
  lng: number;
}

export interface DataI {
  locationList: LocationInfoI[];
  center: LocationCoordI;
}

const defaultLocation = { lat: 44, lng: -80 };

const dataDefaultState: DataI = {
  locationList: dummyData,
  center: defaultLocation,
};

export const DataSlice = createSlice({
  name: "DataSlice",
  initialState: dataDefaultState,
  reducers: {
    addLocation: (
      state: DataI,
      action: PayloadAction<{ locationInfo: LocationInfoI }>
    ) => {
      state.locationList.unshift(action.payload.locationInfo);
      state.center = {
        ...action.payload.locationInfo,
      };
    },
    deleteLocation: (
      state: DataI,
      action: PayloadAction<{ locationId: string }>
    ) => {
      state.locationList = state.locationList.filter((item) => {
        return action.payload.locationId !== item.id;
      });
    },
    deleteAllLocation: (state: DataI) => {
      state.locationList = [];
    },

    updateCenter: (
      state: DataI,
      action: PayloadAction<{ center: LocationCoordI }>
    ) => {
      state.center = {
        lat: action.payload.center.lat,
        lng: action.payload.center.lng,
      };
    },
  },
});

export const { addLocation, deleteLocation, deleteAllLocation, updateCenter } =
  DataSlice.actions;

export default DataSlice.reducer;
