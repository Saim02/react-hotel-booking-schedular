import React, { useState } from "react";
import { DATE_FORMAT, DATETIME_FORMAT } from "../Scheduler.js";
import { TiArrowBack, TiPlus } from "react-icons/ti";
import moment from "moment";
import { Button, Divider, Typography, Modal } from "antd";
import TextArea from "antd/lib/input/TextArea";
import { TiGroupOutline } from "react-icons/ti";

export default function EventItemCustomPopover(props) {
  const {
    schedulerData,
    eventItem,
    title,
    start,
    end,
    statusColor,
    changePopoverVisible,
    setRenderAgain,
    setEventDetails,
  } = props;

  const [togglereservationnotes, setTogglereservationnotes] = useState(false);
  const [formLoading, setFormLoading] = useState(false);
  const [note, setNote] = useState("");
  return (
    <div style={{ width: "550px", minHeight: "350px", padding: 0 }}>
      <div
        style={{
          backgroundColor: "#2d8acd",
          width: "100%",
          fontSize: 13,
          display: "flex",
          flexDirection: "row",
        }}
      >
        <div className="container" style={{ padding: 10, flex: 1 }}>
          <p
            style={{
              color: "white",
              fontWeight: "bold",
              lineHeight: 2,
              margin: 0,
            }}
          >
            {eventItem.groupedReservation ? (
              <TiGroupOutline
                color="white"
                size={20}
                style={{ transform: "translateY(5px)" }}
              />
            ) : null}{" "}
            {eventItem.title} -{" "}
            {eventItem.type === 1
              ? "ChekedIn"
              : eventItem.type === 2
              ? "Confirmation Pending"
              : eventItem.type === 3
              ? "Maintenance"
              : eventItem.type === 4
              ? "Confirmed"
              : "Blocked"}
          </p>
          <p
            style={{
              color: "white",
              fontWeight: "bold",
              lineHeight: 2,
              margin: 0,
            }}
          >
            {eventItem.id} - Front Desk
          </p>
        </div>
        <TiPlus
          color="white"
          size={18}
          style={{
            marginTop: 10,
            marginRight: 10,
            cursor: "pointer",
            transform: "rotate(45deg)",
          }}
          onClick={() => changePopoverVisible(false)}
        />
      </div>
      <div style={{ display: "flex", width: "100%", height: "100%" }}>
        <div
          style={{
            flex: 1,
            borderWidth: 0,
            borderRightWidth: 0.5,
            borderRightColor: "lightgray",
            borderStyle: "solid",
          }}
        >
          <div style={{ width: "80%", margin: "auto" }}>
            <p style={{ marginTop: "0.8rem", marginBottom: "0.8rem" }}>
              {eventItem.type !== 3 ? (
                <span style={{ fontWeight: "600" }}>Check-in / Out</span>
              ) : null}
              {eventItem.type === 3 ? (
                <span style={{ fontWeight: "600" }}>
                  Out Of Order Durartion
                </span>
              ) : null}
              <br />
              {start.format(DATE_FORMAT)} - {end.format(DATE_FORMAT)}
            </p>
            {eventItem.groupedReservation ? (
              <p
                style={{
                  marginTop: "0.8rem",
                  marginBottom: "0.8rem",
                  color:
                    eventItem.groupedReservationType === "primary"
                      ? "green"
                      : "initial",
                }}
              >
                <span
                  style={{
                    fontWeight: "600",
                  }}
                >
                  Grouped Type
                </span>{" "}
                <br />
                {eventItem.groupedReservationType}
              </p>
            ) : null}
            {eventItem.guests ? (
              <p style={{ marginTop: "0.8rem", marginBottom: "0.8rem" }}>
                <span style={{ fontWeight: "600" }}>Guests</span> <br />
                {eventItem.guests}
              </p>
            ) : null}

            {eventItem.estimatedArrival ? (
              <p style={{ marginTop: "0.8rem", marginBottom: "0.8rem" }}>
                <span style={{ fontWeight: "600" }}>Estimated Arrival</span>{" "}
                <br />
                {!eventItem.estimatedArrival
                  ? "Unknown"
                  : eventItem.estimatedArrival}
              </p>
            ) : null}
            {eventItem.groupedReservation &&
            eventItem.groupedReservationType === "secondary" ? (
              <p style={{ marginTop: "0.8rem", marginBottom: "0.8rem" }}>
                <span style={{ fontWeight: "600" }}>
                  Total for Current Reservation
                </span>{" "}
                <br />$ {eventItem.totalPrice}
                <Button
                  disabled={eventItem.amountDue <= 0 ? true : false}
                  onClick={() => {
                    let primaryReservation = schedulerData._getEventById(
                      eventItem.primaryReservationRef
                    );
                    schedulerData._chargeRemaining(eventItem);
                    schedulerData._setNewEventTotalPrice(
                      primaryReservation,
                      primaryReservation.totalPrice - eventItem.totalPrice
                    );
                    schedulerData._setNewEventDueAmount(
                      primaryReservation,
                      primaryReservation.amountDue - eventItem.totalPrice
                    );
                    setRenderAgain(true);
                  }}
                  type="link"
                  danger
                  style={{
                    float: "right",
                    transform: "translateY(-4px)",
                    fontSize: 12,
                  }}
                >
                  <p
                    style={{
                      textDecoration:
                        eventItem.amountDue <= 0 ? "underLine" : "inherit",
                      color: eventItem.amountDue <= 0 ? "green" : "inherit",
                    }}
                  >
                    {" "}
                    {eventItem.amountDue <= 0 ? "Paid" : "Charge Current"}
                  </p>
                </Button>
              </p>
            ) : null}
            {eventItem.totalPrice ? (
              <p style={{ marginTop: "0.8rem", marginBottom: "0.8rem" }}>
                <span style={{ fontWeight: "600" }}>Grand Total</span> <br />${" "}
                {eventItem.groupedReservation &&
                eventItem.groupedReservationType === "secondary"
                  ? schedulerData._getGrandTotalForGroupedReservation(
                      eventItem.primaryReservationRef
                    )
                  : eventItem.totalPrice}
              </p>
            ) : null}

            {eventItem.amountDue ? (
              <p style={{ marginTop: "0.8rem", marginBottom: "0.8rem" }}>
                <span style={{ fontWeight: "600" }}>Balance Due</span> <br />
                <span
                  style={{
                    color: eventItem.amountDue > 0 ? "red" : "inherit",
                  }}
                >
                  $ {eventItem.amountDue}
                  {eventItem.groupedReservation &&
                    eventItem.groupedReservationType === "primary" && (
                      <Button
                        disabled={eventItem.amountDue <= 0 ? true : false}
                        onClick={() => {
                          eventItem.roomsAttached.forEach((eventId) => {
                            let event = schedulerData._getEventById(eventId);
                            schedulerData._chargeRemaining(event);
                          });
                          schedulerData._chargeRemaining(eventItem);
                          setRenderAgain(true);
                        }}
                        type="link"
                        danger
                        style={{
                          float: "right",
                          transform: "translateY(-4px)",
                          fontSize: 14,
                        }}
                      >
                        <p
                          style={{
                            textDecoration:
                              eventItem.amountDue <= 0
                                ? "underLine"
                                : "inherit",
                            color:
                              eventItem.amountDue <= 0 ? "green" : "inherit",
                          }}
                        >
                          {" "}
                          {eventItem.amountDue <= 0 ? "Paid" : "Charge All"}
                        </p>
                      </Button>
                    )}
                </span>
              </p>
            ) : null}
          </div>
        </div>
        <div
          style={{
            flex: 1.2,
            display: "flex",
            flexDirection: "column",
          }}
        >
          <div
            style={{
              flex: 2,
              backgroundColor: "white",
              display: "flex",
              borderWidth: 0,
              borderBottomWidth: 0.5,
              borderBottomColor: "lightgray",
              borderStyle: "solid",
            }}
          >
            <div
              style={{
                flex: 1,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <p
                className="reservationnotestoggler"
                onClick={() => {
                  setTogglereservationnotes(false);
                }}
                style={{
                  margin: 0,
                  color: "gray",
                  fontWeight: togglereservationnotes ? "400" : "600",
                }}
              >
                {" "}
                Reservation
              </p>
            </div>
            <div
              style={{
                flex: 1,
                display: "flex",
                alignItems: "center",
                // justifyContent: "center",
              }}
            >
              <p
                className="reservationnotestoggler"
                onClick={() => {
                  setTogglereservationnotes(true);
                }}
                style={{
                  margin: 0,
                  fontWeight: togglereservationnotes ? "600" : "400",
                  color: "gray",
                }}
              >
                Notes ({eventItem.notes.length})
              </p>
            </div>
          </div>
          <Divider style={{ margin: 3 }} />
          <div style={{ flex: 8, display: "flex" }}>
            {togglereservationnotes ? (
              <div
                style={{ flex: 1, display: "flex", flexDirection: "column" }}
              >
                <div
                  style={{
                    flex: 2,
                    overflow: "scroll",
                    borderBottomColor: "lightgray",
                    borderWidth: 0,
                    borderBottomWidth: 0.5,
                    minHeight: 100,
                  }}
                >
                  <ul
                    style={{
                      listStyle: "none",
                      fontSize: 12,
                      marginLeft: 0,
                    }}
                  >
                    {eventItem.notes.map((note, index) => (
                      <li
                        style={{
                          backgroundColor: "#F9F59F",
                          width: "80%",
                          marginBottom: 2,
                          marginLeft: 0,
                        }}
                        key={index}
                      >
                        {note.date}
                        <br />
                        <span style={{ fontWeight: 600 }}>{note.text}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                <div style={{ flex: 1 }}>
                  <form
                  // onSubmit={() => {

                  // }}
                  >
                    <TextArea
                      value={note}
                      required
                      onChange={(val) => setNote(val.target.value)}
                      placeholder="New Note"
                    />
                    <Button
                      loading={formLoading}
                      onClick={() => {
                        if (note === "") {
                          Modal.warn({
                            title: "Field Empty",
                            content: "Give note some explanation",
                          });
                        } else {
                          setFormLoading(true);
                          schedulerData._addNoteToEvent(
                            eventItem,
                            note,
                            moment().format(DATETIME_FORMAT)
                          );
                          setNote("");
                          setTimeout(() => {
                            setFormLoading(false);
                            setRenderAgain(true);
                          }, 300);
                        }
                      }}
                    >
                      Add Note
                    </Button>
                  </form>
                </div>
              </div>
            ) : (
              <ul
                style={{ marginTop: "2rem", fontSize: 16 }}
                className="modal-body-option-ul"
              >
                {(eventItem.type === 2 || eventItem.type === 5) && (
                  <li
                    onClick={() => {
                      schedulerData._confirmreservation(eventItem);
                      setRenderAgain(true);
                    }}
                  >
                    Confirm Reservation
                  </li>
                )}

                {eventItem.type !== 3 && eventItem.type !== 5 && (
                  <li
                    onClick={() => {
                      schedulerData._unAssignRoom(eventItem);
                      setRenderAgain(true);
                    }}
                  >
                    Un-assign room
                  </li>
                )}
                {eventItem.type === 4 && (
                  <li
                    onClick={() => {
                      schedulerData._checkInGuest(eventItem);
                      setRenderAgain(true);
                    }}
                  >
                    Check-in
                  </li>
                )}
                {eventItem.type !== 3 && (
                  <li
                    onClick={() => {
                      setEventDetails(schedulerData, eventItem);
                    }}
                  >
                    Reservation Details
                  </li>
                )}
                {eventItem.type === 1 &&
                  eventItem.amountDue > 0 &&
                  !eventItem.groupedReservation && (
                    <li
                      onClick={() => {
                        schedulerData._chargeRemaining(eventItem);
                        setRenderAgain(true);
                      }}
                    >
                      Charge Amount Due
                    </li>
                  )}
                {eventItem.type === 1 && (
                  <li
                    onClick={() => {
                      if (eventItem.paid) {
                        schedulerData._checkOutGuest(eventItem);
                        setRenderAgain(true);
                      } else {
                        alert("Failed: Charge amount due to Check-out");
                      }
                    }}
                  >
                    Check-out
                  </li>
                )}
                {eventItem.type !== 3 && (
                  <li
                    onClick={() => {
                      if (window.confirm("Confirm Change")) {
                        schedulerData.removeEvent(eventItem);
                        setRenderAgain(true);
                      }
                    }}
                  >
                    Free Slot (No Re-assigining)
                  </li>
                )}
                {eventItem.type === 3 && (
                  <li
                    onClick={() => {
                      schedulerData.removeEvent(eventItem);
                      setRenderAgain(true);
                    }}
                  >
                    Open for reservations
                  </li>
                )}
              </ul>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
