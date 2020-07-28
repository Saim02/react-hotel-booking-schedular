import React, { useState, useRef } from "react";
import { Modal, Select, Input, Divider, Button, Tabs, Form } from "antd";
import { TiPlus } from "react-icons/ti";
import { DATE_FORMAT, DATETIME_FORMAT } from "../Scheduler";
import moment from "moment";
import validator from "validator";

export default function ManageResourceModal(props) {
  const { reservationDetails, visible, setVisible, setRenderAgain } = props;

  const { information, schedulerData } = reservationDetails;

  const [roomClassSelectedOption, setSelectOption] = useState("slot.parentId");
  const [newRoomName, setRoomName] = useState("slot.slotName");
  const [formLoading, setFormLoading] = useState(false);
  const [showChangeUserInfoModal, setShowChangeUserInfoModal] = useState(false);
  const [accommodationSelection, changeAccommodationSelection] = useState(
    schedulerData._getParentId(information.resourceId)
  );
  const [name, setName] = useState(information.title);
  const [phoneNumber, setPhoneNumber] = useState(information.phoneNumber);
  const [email, setEmail] = useState(information.email);

  // changeInfoFormCurrentValues
  const [changeInfoFormCurrentValue, setChangeInfoFormCurrentValue] = useState(
    ""
  );
  const [
    changeInfoFormCurrentValueType,
    setChangeInfoFormCurrentValueType,
  ] = useState("");

  let currentStatus =
    information.type === 1
      ? "Checked In"
      : information.type === 2
      ? "Confirmation Pending"
      : information.type === 3
      ? "Out Of Stock"
      : information.type === 4
      ? "Confirmed"
      : information.type === 5
      ? "Blocked"
      : undefined;

  const [statusSelection, setStatusSelection] = useState(currentStatus);
  const [note, setNote] = useState("");

  const { TextArea } = Input;
  const { TabPane } = Tabs;

  const form = useRef();

  return (
    <Modal
      maskClosable={false}
      closable={false}
      width={800}
      bodyStyle={{ height: 600 }}
      visible={visible}
      onCancel={() => {
        setVisible(false);
        setRenderAgain(true);
      }}
      cancelText="Close"
      okText="Ok"
      title={information.title}
      closeIcon={<TiPlus color="white" size={18} />}
      onOk={() => {
        // if (slot.groupOnly) {
        //   schedulerData._changeRoomClassName(slot.slotId, newRoomName);
        // } else {
        //   let hasEvents = false;
        //   schedulerData.events.forEach((event) => {
        //     if (event.resourceId === slot.slotId) {
        //       hasEvents = true;
        //       alert(
        //         "Room has events attached to it. Process terminated. Try after unassigning tasks"
        //       );
        //     }
        //   });
        //   if (!hasEvents) {
        //     schedulerData._changeRoomParent(
        //       slot.slotId,
        //       roomClassSelectedOption
        //     );
        //   }
        // }
        // setVisible(false);
      }}
    >
      <Tabs defaultActiveKey="1" centered animated={false}>
        <TabPane
          style={{ display: "flex", flexDirection: "row" }}
          tab="Acommodation"
          key="1"
        >
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
              {information.type !== 3 ? (
                <p style={{ marginTop: "0.8rem", marginBottom: "0.8rem" }}>
                  <span style={{ fontWeight: "600" }}>Reservations ID </span>{" "}
                  <br />
                  {information.id}
                </p>
              ) : null}
              <p style={{ marginTop: "0.8rem", marginBottom: "0.8rem" }}>
                {information.type !== 3 ? (
                  <span style={{ fontWeight: "600" }}>Check-in / Out</span>
                ) : null}
                {information.type === 3 ? (
                  <span style={{ fontWeight: "600" }}>
                    Out Of Order Durartion
                  </span>
                ) : null}
                <br />
                {moment(information.start).format(DATE_FORMAT)} -{" "}
                {moment(information.end).format(DATE_FORMAT)}
              </p>
              {information.type !== 3 ? (
                <p style={{ marginTop: "0.8rem", marginBottom: "0.8rem" }}>
                  <span style={{ fontWeight: "600" }}>Nights</span> <br />
                  {moment(moment(information.end).format(DATE_FORMAT)).diff(
                    moment(information.start).format(DATE_FORMAT),
                    "days"
                  )}
                </p>
              ) : null}
              {information.guests ? (
                <p style={{ marginTop: "0.8rem", marginBottom: "0.8rem" }}>
                  <span style={{ fontWeight: "600" }}>Guests</span> <br />
                  {information.guests}
                </p>
              ) : null}
              {information.estimatedArrival ? (
                <p style={{ marginTop: "0.8rem", marginBottom: "0.8rem" }}>
                  <span style={{ fontWeight: "600" }}>Estimated Arrival</span>{" "}
                  <br />
                  {!information.estimatedArrival
                    ? "Unknown"
                    : information.estimatedArrival}
                </p>
              ) : null}
              {information.totalPrice ? (
                <p style={{ marginTop: "0.8rem", marginBottom: "0.8rem" }}>
                  <span style={{ fontWeight: "600" }}>Grand Total</span> <br />${" "}
                  {information.totalPrice}
                </p>
              ) : null}
              {information.amountDue ? (
                <p style={{ marginTop: "0.8rem", marginBottom: "0.8rem" }}>
                  <span style={{ fontWeight: "600" }}>Balance Due</span> <br />
                  <span
                    style={{
                      color: information.amountDue > 0 ? "red" : "inherit",
                    }}
                  >
                    $ {information.amountDue}
                  </span>
                  {information.amountDue > 0 &&
                    !information.groupedReservation && (
                      <span
                        onClick={() => {
                          if (window.confirm("Confirm Charge")) {
                            schedulerData._chargeRemaining(information);
                            setRenderAgain(true);
                          }
                        }}
                        style={{
                          color: "red",
                          textDecoration: "underline",
                          float: "right",
                          cursor: "pointer",
                        }}
                      >
                        Charge
                      </span>
                    )}
                </p>
              ) : null}
            </div>
          </div>
          <div style={{ flex: 1, paddingLeft: 20 }}>
            <div style={{ marginTop: "2rem", marginBottom: "0.8rem" }}>
              {information.type !== 3 && information.type !== 5 ? (
                <Select
                  onSelect={(val) => {
                    if (val !== information.type) {
                      if (
                        window.confirm(
                          "Are you sure you want to change status of the reservation?"
                        )
                      ) {
                        if (val === "Check In") {
                          schedulerData._changeRoomStatus(information, 1);
                        }
                        if (val === "Confirmation Pending") {
                          schedulerData._changeRoomStatus(information, 2);
                        }
                        if (val === "Out Of Stock") {
                          schedulerData._changeRoomStatus(information, 3);
                        }
                        if (val === "Confirmed") {
                          schedulerData._changeRoomStatus(information, 4);
                        }
                        if (val === "Blocked") {
                          schedulerData._changeRoomStatus(information, 5);
                        }
                        if (val === "Check Out") {
                          schedulerData._checkOutGuest(information);
                          setVisible(false);
                        }
                        if (val === "Cancel") {
                          schedulerData.removeEvent(information);
                        }

                        setStatusSelection(val);
                      } else {
                        setStatusSelection(currentStatus);
                      }
                    }
                  }}
                  style={{ width: "50%" }}
                  value={statusSelection}
                >
                  {information.type === 4 ? (
                    <Select.Option key={"Check In"}>Check In</Select.Option>
                  ) : null}
                  {
                    <Select.Option key={"Confirmation Pending"}>
                      Confirmation Pending
                    </Select.Option>
                  }
                  {information.type === 2 ? (
                    <Select.Option key={"Confirmed"}>Confirmed</Select.Option>
                  ) : null}
                  {information.type === 1 ? (
                    <Select.Option key={"Check Out"}>Check Out</Select.Option>
                  ) : null}
                  {<Select.Option key={"Cancel"}>Cancel</Select.Option>}
                </Select>
              ) : null}
            </div>
            {/* <div style={{ marginTop: "2rem", marginBottom: "0.8rem" }}>
              <p>Accommodation</p>
              {information.type !== 3 && information.type !== 5 ? (
                <Select
                  onSelect={(val) => {
                    if (
                      val !== schedulerData._getParentId(information.resourceId)
                    ) {
                      if (
                        window.confirm(
                          "Are you sure you want to change accommodation type of the reservation?"
                        )
                      ) {
                        alert("changing");
                        schedulerData.c
                      } else {
                        changeAccommodationSelection(
                          schedulerData._getParentId(information.resourceId)
                        );
                      }
                    }
                  }}
                  style={{ width: "50%" }}
                  value={accommodationSelection}
                >
                  {schedulerData._getRoomTypesList().map((option) => (
                    <Select.Option key={option.id}>{option.name}</Select.Option>
                  ))}
                </Select>
              ) : null}
            </div> */}
          </div>
        </TabPane>
        <TabPane
          style={{ display: "flex", flexDirection: "column" }}
          tab="Guest Details"
          key="2"
        >
          <div
            style={{
              flex: 1,
              backgroundColor: "white",
              borderWidth: 0,
              borderBottomWidth: 0.5,
              borderBottomColor: "lightgray",
              borderStyle: "solid",
              paddingLeft: 20,
              paddingRight: 20,
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
              }}
            >
              <p style={{ marginTop: "0.8rem", marginBottom: "0.8rem" }}>
                <span style={{ fontWeight: "600" }}>Guest Name </span> <br />
                {name}
              </p>

              <Button
                type="link"
                onClick={() => {
                  setChangeInfoFormCurrentValueType("name");
                  setShowChangeUserInfoModal(true);
                }}
              >
                edit
              </Button>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <p style={{ marginTop: "0.8rem", marginBottom: "0.8rem" }}>
                <span style={{ fontWeight: "600" }}>Phone Number </span> <br />
                {phoneNumber}
              </p>
              <Button
                type="link"
                onClick={() => {
                  setChangeInfoFormCurrentValueType("phoneNumber");

                  setShowChangeUserInfoModal(true);
                }}
              >
                edit
              </Button>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <p style={{ marginTop: "0.8rem", marginBottom: "0.8rem" }}>
                <span style={{ fontWeight: "600" }}>Email </span> <br />
                {email}
              </p>
              <Button
                type="link"
                onClick={() => {
                  setChangeInfoFormCurrentValueType("email");
                  setShowChangeUserInfoModal(true);
                }}
              >
                edit
              </Button>
            </div>
            {/* <div style={{ display: "flex", justifyContent: "space-between" }}>
              <p style={{ marginTop: "0.8rem", marginBottom: "0.8rem" }}>
                <span style={{ fontWeight: "600" }}>Card On File </span> <br />
                {information.card}
              </p>
              <Button
                type="link"
                onClick={() => setShowChangeUserInfoModal(true)}
              >
                edit
              </Button>
            </div> */}
          </div>
        </TabPane>
        <TabPane
          style={{ display: "flex", flexDirection: "column" }}
          tab={`Notes(${information.notes.length})`}
          key="3"
        >
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              width: "100%",
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
                minHeight: 300,
              }}
            >
              <div style={{ width: "100%" }}>
                {information.notes.length === 0 && (
                  <p style={{ color: "lightgray" }}>No Notes</p>
                )}
                <ul style={{ listStyle: "none", width: "100%" }}>
                  {information.notes.map((note, index) => (
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
            </div>
            <div style={{ flex: 1, display: "flex", width: "100%" }}>
              <Form
                style={{ width: "80%", marginTop: 20 }}
                // onSubmit={() => {

                // }}
              >
                <TextArea
                  value={note}
                  onChange={(val) => setNote(val.target.value)}
                  required
                  placeholder="Add Note"
                  cols={5}
                ></TextArea>
                <Button
                  loading={formLoading}
                  style={{ marginTop: 10, float: "right" }}
                  onClick={() => {
                    if (note === "") {
                      Modal.warn({
                        title: "Field Empty",
                        content: "Give note some explanation",
                      });
                    } else {
                      schedulerData._addNoteToEvent(
                        information,
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
                  Add
                </Button>
              </Form>
            </div>
          </div>
        </TabPane>
      </Tabs>

      {showChangeUserInfoModal && (
        <ChangeGuestIndoModal
          visible={showChangeUserInfoModal}
          setVisible={(val) => setShowChangeUserInfoModal(val)}
          changeInfoFormCurrentValueType={changeInfoFormCurrentValueType}
          changeInfoFormCurrentValue={changeInfoFormCurrentValue}
          schedulerData={schedulerData}
          information={information}
          setValueOnModal={(val) => {
            if (changeInfoFormCurrentValueType === "name") {
              setName(val);
            }
            if (changeInfoFormCurrentValueType === "phoneNumber") {
              setPhoneNumber(val);
            }
            if (changeInfoFormCurrentValueType === "email") {
              setEmail(val);
            }
          }}
        />
      )}
    </Modal>
  );
}

const ChangeGuestIndoModal = (props) => {
  const {
    visible,
    setVisible,
    changeInfoFormCurrentValueType,
    changeInfoFormCurrentValue,
    information,
    schedulerData,
    setValueOnModal,
  } = props;
  const [error, setError] = useState("");
  const [inputValue, setInputValue] = useState("");

  return (
    <Modal
      title={`New ${
        changeInfoFormCurrentValueType === "name"
          ? "Name"
          : changeInfoFormCurrentValueType === "phoneNumber"
          ? "Phone Number"
          : "Email"
      }`}
      visible={visible}
      onCancel={() => setVisible(false)}
      footer={false}
      destroyOnClose
    >
      <Input
        name={changeInfoFormCurrentValueType}
        value={inputValue}
        required
        onChange={(val) => setInputValue(val.currentTarget.value)}
      ></Input>
      {error && <p style={{ color: "red" }}>{error}</p>}
      <div
        style={{
          display: "flex",
          justifyContent: "flex-end",
          margin: 10,
        }}
      >
        <Button style={{ marginRight: 10 }} onClick={() => setVisible(false)}>
          Cancel
        </Button>
        <Button
          type="primary"
          onClick={() => {
            if (
              changeInfoFormCurrentValueType === "name" &&
              !/^[a-zA-Z ]+$/.test(inputValue)
            ) {
              setError("Invalid Name");
            } else if (
              changeInfoFormCurrentValueType === "phoneNumber" &&
              !validator.isMobilePhone(inputValue)
            ) {
              setError("Invalid Phone Number");
            } else if (
              changeInfoFormCurrentValueType === "email" &&
              !validator.isEmail(inputValue)
            ) {
              setError("Invalid Email");
              return;
            } else {
              setValueOnModal(inputValue);
              schedulerData._changeGuestInfo(
                information,
                changeInfoFormCurrentValueType,
                inputValue
              );
              setError("");
              setVisible(false);
            }
          }}
        >
          Save
        </Button>
      </div>
    </Modal>
  );
};
