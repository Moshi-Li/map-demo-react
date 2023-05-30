import { useCallback, useEffect, useState } from "react";
import { AiOutlineArrowRight } from "react-icons/ai";
import { RiDeleteBin7Line } from "react-icons/ri";
import { useSelector, useDispatch } from "react-redux";
import ReactPaginate from "react-paginate";

import {
  LocationInfoI,
  deleteAllLocation,
  deleteLocation,
  updateCenter,
} from "../../slices/DataSlice";
import { RootStoreI } from "../../Store";

import "./index.scss";

const LOCATION_PER_PAGE = 10;

const DeleteIcon = ({ selected }: { selected: boolean }) => {
  return (
    <div className="delete--icon">
      <div
        style={{ display: selected ? "" : "none" }}
        className="cross--one"
      ></div>
      <div
        style={{ display: selected ? "" : "none" }}
        className="cross--two"
      ></div>
    </div>
  );
};

const TimeDisplay = ({
  timeZoneId,
  timeZoneName,
  rawOffset,
}: {
  timeZoneId: string;
  timeZoneName: string;
  rawOffset: number;
}) => {
  const [data, setData] = useState<string[]>(["", "", ""]);
  useEffect(() => {
    const intervalId = setInterval(() => {
      setData(getTimeString(timeZoneId, rawOffset, timeZoneName));
    }, 10);
    return () => {
      clearInterval(intervalId);
    };
  }, []);
  return (
    <>
      <span>{`${data[0]}`}</span>
      <span>{`${data[1]}, ${data[2]}`}</span>
    </>
  );
};

const getTimeString = (
  timeZone: string,
  offset: number,
  timeZoneName: string
) => {
  const localTime = new Date(Date.now()).toLocaleTimeString("en-US", {
    timeZone: timeZone,
  });
  const utcOffset = new Date(Math.abs(offset * 1000))
    .toISOString()
    .slice(11, 19);

  return [localTime, `${offset > 0 ? "+" : "-"}${utcOffset}`, timeZoneName];
};

const Table = () => {
  const dispatch = useDispatch();

  const { locationList } = useSelector(
    (store: RootStoreI) => store.DataReducer
  );

  const [displayingLocation, setDisplayingLocation] = useState<LocationInfoI[]>(
    []
  );

  const [currentPage, setCurrentPage] = useState<number>(0);

  const [selectedLocations, setSelectedLocations] = useState<
    Record<string, boolean>
  >({});

  const handleSelectedClick = useCallback(
    (location: LocationInfoI) => {
      if (selectedLocations[location.id]) {
        const nextState = { ...selectedLocations };
        delete nextState[location.id];
        setSelectedLocations({
          ...nextState,
        });
      } else {
        setSelectedLocations({
          ...selectedLocations,
          [location.id]: true,
        });
      }
    },
    [selectedLocations, setSelectedLocations]
  );

  const handleSelectedClickAll = useCallback(() => {
    const nextState: Record<string, boolean> = {};
    if (Object.keys(selectedLocations).length === 0) {
      locationList.forEach((item) => (nextState[item.id] = true));
    }
    setSelectedLocations(nextState);
  }, [locationList, selectedLocations, setSelectedLocations]);

  const handlePageClick = useCallback(
    (nextPageNumber: { selected: number }) => {
      setCurrentPage(nextPageNumber.selected);
    },
    [setCurrentPage, locationList]
  );

  const handleDeleteClick = useCallback(() => {
    if (Object.keys(selectedLocations).length === 0) {
      return;
    }

    if (Object.keys(selectedLocations).length !== locationList.length) {
      Object.keys(selectedLocations).forEach((locationId) => {
        dispatch(deleteLocation({ locationId }));
      });
    } else {
      dispatch(deleteAllLocation());
      setCurrentPage(0);
    }
    setSelectedLocations({});
  }, [setCurrentPage, locationList, selectedLocations, setSelectedLocations]);

  useEffect(() => {
    if (
      currentPage > 0 &&
      currentPage * LOCATION_PER_PAGE >= locationList.length
    ) {
      setCurrentPage(Math.ceil(locationList.length / LOCATION_PER_PAGE) - 1);
    } else {
      setDisplayingLocation(
        locationList.slice(
          currentPage * LOCATION_PER_PAGE,
          currentPage * LOCATION_PER_PAGE + LOCATION_PER_PAGE
        )
      );
    }
  }, [currentPage, locationList]);

  useEffect(() => {
    setSelectedLocations({});
  }, [locationList]);

  return (
    <div className="table--container">
      <div className="table--label">
        <h3>Location List</h3>
        <></>
      </div>
      <div className="table--header">
        <span onClick={() => handleSelectedClickAll()}>
          <DeleteIcon
            selected={
              Object.keys(selectedLocations).length === locationList.length &&
              locationList.length !== 0
            }
          ></DeleteIcon>
        </span>
        <div className="table--header--content">
          {Object.keys(selectedLocations).length > 0 && (
            <p>{`${
              Object.keys(selectedLocations).length
            } locations selected`}</p>
          )}
        </div>
        <span
          className="table--delete--icon"
          onClick={() => handleDeleteClick()}
        >
          <RiDeleteBin7Line></RiDeleteBin7Line>
        </span>
      </div>
      <ul>
        {displayingLocation.map((item) => {
          return (
            <li key={item.id} className="location--item">
              <span onClick={() => handleSelectedClick(item)}>
                <DeleteIcon
                  selected={selectedLocations[item.id] === true}
                ></DeleteIcon>
              </span>
              <div className="location--item--content">
                <p className="location--item--location">{item.text}</p>
                <p className="location--item--time">
                  <TimeDisplay
                    timeZoneId={item.timeZoneId}
                    timeZoneName={item.timeZoneName}
                    rawOffset={item.rawOffset}
                  ></TimeDisplay>
                </p>
              </div>
              <span
                className="locate--icon"
                onClick={() =>
                  dispatch(
                    updateCenter({ center: { lng: item.lng, lat: item.lat } })
                  )
                }
              >
                <AiOutlineArrowRight></AiOutlineArrowRight>
              </span>
            </li>
          );
        })}
      </ul>
      <div className="table--footer">
        {locationList.length > LOCATION_PER_PAGE && (
          <ReactPaginate
            className="page--selector"
            breakLabel="..."
            nextLabel="next >"
            onPageChange={(nextPageNumber) => handlePageClick(nextPageNumber)}
            pageRangeDisplayed={5}
            pageCount={Math.ceil(locationList.length / LOCATION_PER_PAGE)}
            previousLabel="< previous"
            renderOnZeroPageCount={null}
          ></ReactPaginate>
        )}
      </div>
    </div>
  );
};

export default Table;
