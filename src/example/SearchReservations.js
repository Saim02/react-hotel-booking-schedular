import React, { useState, useEffect } from "react";
import { AutoComplete, Input, Select, Modal } from "antd";

const { Option } = AutoComplete;

const SearchReservations = (props) => {
  const [result, setResult] = useState([
    // { id: "one", value: <div>Option1</div>, title: "Title1" },
    // { value: "Two", value: <div>Option2</div>, title: "Title" },
  ]);
  const [searchValue, setSearchValue] = useState("");

  let { schedulerData, setEventDetails, size = "default" } = props;
  let { events } = schedulerData;

  const [filteresdEvents, setFilterEvents] = useState(events);

  useEffect(() => {
    let newFilterValue = events.filter((event) => {
      return (
        event.title.toLowerCase().indexOf(searchValue) !== -1 &&
        searchValue !== "" &&
        event.type !== 3 &&
        event.type !== 5
      );
    });
    // alert("fiores");
    setFilterEvents(newFilterValue);
  }, [searchValue]);

  const handleSearch = (value) => {
    let res = [];
    // alert("fiores inSearch");

    setSearchValue(value);
  };

  const handleSelect = (value) => {
    let reservation = JSON.parse(value);

    events.forEach((event) => {
      if (event.id === reservation.id) {
        setEventDetails(schedulerData, event);
        setSearchValue("");
      }
    });
  };

  return (
    <div>
      <AutoComplete
        size={size}
        onSelect={handleSelect}
        onSearch={(val) => setSearchValue(val)}
        placeholder="Searchg For Reservations"
        value={searchValue}
      >
        {/* <Input.Search
        //   onChange={(val) => alert(val.target.value)}
          placeholder="Sreach Reservation"
        ></Input.Search> */}
        {filteresdEvents.map((event) => (
          <Option key={event.id} value={JSON.stringify(event)}>
            {event.title}
            <p style={{ color: "lightgray" }}>
              {event.phoneNumber ? "Phone NO: " + event.phoneNumber : null}
            </p>
          </Option>
        ))}
      </AutoComplete>
    </div>
  );
};

export default SearchReservations;
