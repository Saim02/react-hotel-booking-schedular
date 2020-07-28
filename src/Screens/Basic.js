import React, { Component } from "react";
import { PropTypes } from "prop-types";
import Scheduler, {
  SchedulerData,
  ViewTypes,
  DATE_FORMAT,
  DemoData,
  CellUnits,
  DATETIME_FORMAT,
} from "../Scheduler.js";
import withDragDropContext from "../example/withDnDContext";
import { tuple } from "antd/lib/_util/type";
import "antd/dist/antd.css";
import {
  Modal,
  Select,
  Input,
  Popover,
  Calendar,
  Button,
  Form,
  Row,
  Col,
  Divider,
  AutoComplete,
  Typography,
} from "antd";
import {
  CloseOutlined,
  StarOutlined,
  CalendarOutlined,
  ExclamationCircleOutlined,
  CheckOutlined,
} from "@ant-design/icons";
import "../App.css";
import moment from "moment";
import { Formik } from "formik";
import * as Yup from "yup";
import validator from "validator";
import { TiArrowBack, TiPlus } from "react-icons/ti";
import { GrFormClose } from "react-icons/gr";
import AddResourceForm from "../example/AddResourceForm";
import ManageResource from "../example/ManageResourceModal";
import ManageResourceModal from "../example/ManageResourceModal";
import TextArea from "antd/lib/input/TextArea";
import EventItemCustomPopover from "../example/EventItemCustomPopover.js";
import SearchReservations from "../example/SearchReservations.js";
import ReservationDetailModal from "../example/ReservationDetailModal.js";

// import "../css/style.css";

class Basic extends Component {
  constructor(props) {
    super(props);

    let schedulerData = new SchedulerData(
      new moment().format(DATE_FORMAT),
      ViewTypes.Month
    );
    // let schedulerData = new SchedulerData("2017-12-18", ViewTypes.Week);
    schedulerData.localeMoment.locale("en");

    // getting from in local storage if exsists
    let localEvents = localStorage.getItem("events");

    schedulerData.setResources(DemoData.resources);
    schedulerData.setEvents(
      localEvents ? JSON.parse(localEvents) : DemoData.events
    );
    this.state = {
      viewModel: schedulerData,
      createEventModal: false,
      updateEventModal: false,
      createEventModalData: {},
      updateEventModalData: {},
      modalForm: false,
      modalFormData: {
        title: "",
        eventData: {},
      },
      calendarStartDateForForm: moment().format("YYYY-MM-DD"),
      calendarEndDateForForm: moment().format("YYYY-MM-DD"),
      roomSelectedValue: "",
      newReservationEstimatedPrice: 0,
      firstName: "",
      lastName: "",
      outOfStockReasonMessage: "",
      courtesyLengthOfHold: 0,
      courtesyLengthOfHoldFormat: "days",
      showStartDatePopOver: false,
      showEndDatePopOver: false,
      currentValidationSchema: {},

      // Rendering
      renderAgain: true,

      // Conflict Modal
      changeRoomClassModal: false,

      //Move Modal Values
      moveModalData: {},

      //Manage Resource Slot
      showManageResourceModal: false,
      manageResourceData: [],

      //Propover selection options
      togglereservationnotes: false,
      note: "",

      //  REservations DEyail Data

      showReservationDetailModal: false,
      reservationDetails: {},

      // Group Reservation Modal
      showGroupReservation: false,
      toGroupReservationData: {},

      // Warning Modal data
      warningModal: false,
      warningModalText: "Warning",
    };
  }

  componentWillUpdate() {
    console.warn("Updated");

    localStorage.setItem("events", JSON.stringify(this.state.viewModel.events));
  }

  componentDidMount() {
    console.warn("component mounted");
  }

  setResourceManageModal = () => {
    this.setState({ visible: true });
  };

  showModal = () => {
    this.handleCancel();
    this.setState({ visible: true });
  };
  handleCancel = () => {
    this.setState({ visible: false });
  };
  handleCreate = () => {
    const form = this.form;
    form.validateFields((err, values) => {
      if (err) {
        return;
      }
      this.addResource(values.roomClassName, values.roomClasStandardPrice);
      form.resetFields();
      this.setState({ visible: false });
    });
  };
  saveFormRef = (form) => {
    this.form = form;
  };

  reservationModalRef = (form2) => {
    this.form2 = form2;
  };

  render() {
    const {
      viewModel,
      createEventModal,
      updateEventModal,
      createEventModalData,
      updateEventModalData,
      modalFormData,
      modalForm,
      calendarStartDateForForm,
      calendarEndDateForForm,
      roomSelectedValue,
      firstName,
      lastName,
      outOfStockReasonMessage,
      courtesyLengthOfHold,
      courtesyLengthOfHoldFormat,
      showStartDatePopOver,
      showEndDatePopOver,
      currentValidationSchema,
      changeRoomClassModal,
      moveModalData,
    } = this.state;

    let leftCustomHeader = (
      <div>
        <span style={{ fontWeight: "bold" }}>
          <a onClick={this.showModal}>Add New Room Type</a>
        </span>
        <AddResourceForm
          ref={this.saveFormRef}
          visible={this.state.visible}
          onCancel={this.handleCancel}
          onCreate={this.handleCreate}
          addResource={this.addResource}
        />
      </div>
    );

    const { Option } = Select;

    const selectChildren = [];

    viewModel.resources.forEach((val, index) =>
      val.groupOnly
        ? null
        : selectChildren.push(
            <Option key={val.id} value={val.id}>
              {val.name}
            </Option>
          )
    );

    let startDatePopover = (
      <div className="popover-calendar">
        <Calendar
          fullscreen={false}
          // value={calendarStartDateForForm}
          value={moment(calendarStartDateForForm)}
          onSelect={(date) => {
            this.setState(
              {
                calendarStartDateForForm: date.format("YYYY-MM-DD"),
                showStartDatePopOver: false,
              },
              () => {
                if (date.format("YYYY-MM-DD") >= calendarEndDateForForm) {
                  console.warn("triggered" + date);
                  this.setState(
                    {
                      calendarEndDateForForm: moment(date)
                        .add(1, "days")
                        .format("YYYY-MM-DD"),
                    },
                    () => {
                      let newPrice = 0;
                      newPrice = viewModel._getRoomClassPriceWithDayList(
                        this.state.roomSelectedValue,
                        this.state.calendarStartDateForForm + " 12:01:01",
                        this.state.calendarEndDateForForm + " 12:01:01"
                      );
                      alert(newPrice);
                      this.setState({ newReservationEstimatedPrice: newPrice });
                    }
                  );
                } else {
                  let newPrice = 0;
                  newPrice = viewModel._getRoomClassPriceWithDayList(
                    this.state.roomSelectedValue,
                    this.state.calendarStartDateForForm + " 12:01:01",
                    this.state.calendarEndDateForForm + " 12:01:01"
                  );
                  this.setState({ newReservationEstimatedPrice: newPrice });
                }
              }
            );
          }}
        />
      </div>
    );
    let endDatePopover = (
      <div className="popover-calendar">
        <Calendar
          // value={calendarEndDateForForm}
          value={moment(calendarEndDateForForm)}
          fullscreen={false}
          disabledDate={(current) => {
            if (current.format("YYYY-MM-DD") <= calendarStartDateForForm) {
              return true;
            } else {
              return false;
            }
          }}
          onSelect={(date) => {
            console.warn(date);
            this.setState(
              {
                calendarEndDateForForm: date.format("YYYY-MM-DD"),
                showEndDatePopOver: false,
              },
              () => {
                let newPrice = viewModel._getRoomClassPriceWithDayList(
                  this.state.roomSelectedValue,
                  this.state.calendarStartDateForForm + " 12:01:01",
                  this.state.calendarEndDateForForm + " 12:01:01"
                );
                this.setState({ newReservationEstimatedPrice: newPrice });
              }
            );
          }}
        />
      </div>
    );

    const validationSchema = Yup.object().shape({
      firstName: Yup.string()
        .required("LastName is required")
        .test((val) => /^[A-Za-z]+$/.test(val) === true),
      lastName: Yup.string()
        .required("Last Name is required")
        .test(
          "fullName",
          "Invalid Format",
          (value) => /^[a-zA-Z ]+$/.test(value) === true
        ),
      phoneNumber: Yup.string()
        .required("Phone Number is required")
        .test(
          "phonenumber",
          "Not a valid Phone Number",
          (value) => validator.isMobilePhone(value) === true
        ),
      email: Yup.string().notRequired().email(),
    });

    const validationSchemaForOutOfService = Yup.object().shape({
      reasonMessage: Yup.string()
        .required("Message is required, Atleast 15 letters")
        .min(5),
    });

    // createEventFormSubmition = () => {
    //   //   let newFreshId = 0;
    //   //   schedulerData.events.forEach((item) => {
    //   //     if (item.id >= newFreshId) newFreshId = item.id + 1;
    //   //   });
    //   //   let newEvent = {
    //   //     id: newFreshId,
    //   //     title: "New event you just created",
    //   //     start: start,
    //   //     end: end,
    //   //     resourceId: slotId,
    //   //     bgColor: "purple",
    //   //   };
    //   //   schedulerData.addEvent(newEvent);
    //   //   this.setState({
    //   //     viewModel: schedulerData,
    //   //   });
    //   // }
    // };

    return (
      <div>
        <div>
          <Scheduler
            schedulerData={viewModel}
            prevClick={this.prevClick}
            nextClick={this.nextClick}
            onSelectDate={this.onSelectDate}
            onViewChange={this.onViewChange}
            eventItemClick={this.eventClicked}
            viewEventClick={this.ops1}
            viewEventText="Ops 1"
            viewEvent2Text="Ops 2"
            viewEvent2Click={this.ops2}
            updateEventStart={this.updateEventStart}
            updateEventEnd={this.updateEventEnd}
            moveEvent={this.moveEvent}
            newEvent={this.newEvent}
            onScrollLeft={this.onScrollLeft}
            onScrollRight={this.onScrollRight}
            onScrollTop={this.onScrollTop}
            onScrollBottom={this.onScrollBottom}
            toggleExpandFunc={this.toggleExpandFunc}
            conflictOccurred={this.conflictOccurred}
            leftCustomHeader={leftCustomHeader}
            slotClickedFunc={this.slotClickedFunc}
            eventItemTemplateResolver={this.eventItemTemplateResolver}
            eventItemPopoverTemplateResolver={
              this.eventItemPopoverTemplateResolver
            }
            nonAgendaCellHeaderTemplateResolver={
              this.nonAgendaCellHeaderTemplateResolver
            }
            demoFunc={this.demoFunc}
            setResourceManageModal={this.setResourceManageModal}
            addResource={this.addResource}
            setEventDetails={this.setEventDetails}
            renderAgains={this.renderAgains}
          />
        </div>
        {/* <Tips /> */}

        {/* Manage Resource Modals */}

        {this.state.showManageResourceModal && (
          <ManageResourceModal
            manageResourceData={this.state.manageResourceData}
            visible={this.state.showManageResourceModal}
            setVisible={(val) =>
              this.setState({ showManageResourceModal: val })
            }
          />
        )}

        {/*  */}
        {this.state.showReservationDetailModal && (
          <ReservationDetailModal
            reservationDetails={this.state.reservationDetails}
            visible={this.state.showReservationDetailModal}
            setVisible={(val) =>
              this.setState({ showReservationDetailModal: val })
            }
            setRenderAgain={(val) => this.setState({ renderAgain: true })}
          />
        )}

        {/* Create Event Modal */}

        <Modal
          visible={createEventModal}
          bodyStyle={{
            padding: 0,
            height: "100%",
          }}
          destroyOnClose
          maskStyle={{ backgroundColor: "rgba(0,0,0,0.1)" }}
          onCancel={() => this.setState({ createEventModal: false })}
          onOk={() => this.setState({ createEventModal: false })}
          footer={false}
          confirmLoading
          closeIcon={
            <TiPlus
              color="white"
              size={18}
              style={{
                cursor: "pointer",
                transform: "rotate(45deg)",
              }}
            />
          }
          style={{
            borderRadius: 5,
            width: 100,
            padding: 0,
          }}
        >
          {createEventModalData ? (
            <div className="modal-content">
              <div className="modal-header">
                <p className="start-end-date">
                  {createEventModalData.startDate +
                    " - " +
                    createEventModalData.endDate}
                </p>
                <div className="addommodation-total-div">
                  <p>Accommodation Total: </p>
                  <p>${this.state.newReservationEstimatedPrice}</p>
                </div>
              </div>
              <div className="modal-body">
                <ul className="modal-body-option-ul">
                  {[
                    "Create New Reservation",
                    "Group Reservation",
                    "Curtosy Hold",
                    "Block Dates",
                    "Out of Service",
                  ].map((type, index) => (
                    <li
                      onClick={() => {
                        let data = {
                          title: type,
                          eventData: createEventModalData,
                        };
                        this.setState(
                          {
                            modalFormData: data,
                            roomSelectedValue: createEventModalData.roomId,
                            calendarStartDateForForm:
                              createEventModalData.startDate,
                            calendarEndDateForForm:
                              createEventModalData.endDate,
                          },
                          () => {
                            this.setState({
                              createEventModal: false,
                              modalForm: true,
                            });
                          }
                        );
                      }}
                      key={type}
                    >
                      {type}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ) : null}
        </Modal>

        <Modal visible={updateEventModal} />

        <Modal
          width={"60vw"}
          style={{ top: "30%", backgroundColor: "#DCDCDC", padding: 0 }}
          bodyStyle={{ backgroundColor: "#DCDCDC", padding: 20 }}
          footer={false}
          // icon={<ExclamationCircleOutlined />}
          visible={this.state.changeRoomClassModal}
        >
          <div className="modal-content">
            <div className="modal-room-class-change-header">
              <h4>
                Warning! You are attempting to change the reservation to the
                following dates
              </h4>
            </div>
            <div>
              <TiArrowBack
                style={{ transform: "rotate(-90deg) translateX(-8rem)" }}
                size={40}
              />
              <table style={{ width: "90%", margin: "auto" }}>
                <thead className="modal-room-class-table-header">
                  <tr className="modal-room-class-table-row">
                    <td>Accommodation Type</td>
                    <td>#</td>
                    <td>Dates</td>
                    <td>Price</td>
                  </tr>
                </thead>
                <tbody className="modal-room-class-table-body">
                  <tr className="modal-room-class-table-row">
                    <td>{moveModalData ? moveModalData.oldParentId : "N/F"}</td>
                    <td>{moveModalData ? moveModalData.resourceId : "N/F"}</td>
                    <td>
                      {moveModalData ? moveModalData.start : "N/F"} -{" "}
                      {moveModalData ? moveModalData.end : "N/F"}
                    </td>
                    <td>
                      ${moveModalData ? moveModalData.originalPrice : "N/F"}
                    </td>
                  </tr>
                  <tr className="modal-room-class-table-row">
                    <td>{moveModalData ? moveModalData.newParentId : "N/F"}</td>
                    <td>{moveModalData ? moveModalData.slotName : "N/F"}</td>
                    <td>
                      {moveModalData ? moveModalData.start : "N/F"} -{" "}
                      {moveModalData ? moveModalData.end : "N/F"}
                    </td>

                    <td>
                      ${moveModalData ? moveModalData.newMovingPrice : "N/F"}
                    </td>
                  </tr>
                  <tr className="modal-room-class-table-row">
                    <td style={{ fontWeight: "bold" }}>Price Difference</td>
                    <td></td>
                    <td></td>
                    <td rowSpan="4" style={{ color: "red" }}>
                      $
                      {moveModalData.newMovingPrice -
                        moveModalData.originalPrice}
                    </td>
                  </tr>
                </tbody>

                <tfoot className="modal-room-class-table-footer"></tfoot>
              </table>
            </div>
            <div className="modal-custom-footer">
              <Button
                className="btn"
                onClick={() => this.setState({ changeRoomClassModal: false })}
                size="large"
                htmlType="submit"
              >
                Cancel
              </Button>
              <Button
                // icon={<CheckOutlined />}
                className="btn"
                type="primary"
                size="large"
                onClick={() => {
                  let {
                    schedulerData,
                    oldParentId,
                    newParentId,
                    start,
                    end,
                    event,
                    slotId,
                    slotName,
                  } = moveModalData;
                  schedulerData.moveEvent(event, slotId, slotName, start, end);
                  this.setState({
                    viewModel: schedulerData,
                    changeRoomClassModal: false,
                  });
                }}
              >
                Override
              </Button>
              <Button
                icon={<CheckOutlined />}
                className="btn"
                type="primary"
                size="large"
                onClick={() => {
                  let {
                    schedulerData,
                    oldParentId,
                    newParentId,
                    start,
                    end,
                    event,
                    slotId,
                    slotName,
                    newMovingPrice,
                    originalPrice,
                  } = moveModalData;
                  schedulerData._setNewEventPrice(
                    event,
                    newMovingPrice - originalPrice
                  );
                  schedulerData.moveEvent(event, slotId, slotName, start, end);
                  this.setState({
                    viewModel: schedulerData,
                    changeRoomClassModal: false,
                  });
                }}
              >
                Continue
              </Button>
            </div>
          </div>
        </Modal>

        {/* Form Modal */}

        <Modal
          visible={modalForm}
          title={modalFormData.title}
          okText="Save"
          width="70%"
          height="90%"
          onCancel={() => {
            this.setState({ modalForm: false, toGroupReservationData: {} });
          }}
          onOk={() => {
            this.setState({ modalForm: false });
          }}
          okType=""
          destroyOnClose
          footer={false}
        >
          <div className="modal-content">
            <div className="container">
              <div className="modal-body">
                {modalFormData.title === "Out of Service" ? (
                  <Formik
                    initialValues={{
                      reasonMessage: "",
                    }}
                    validationSchema={validationSchemaForOutOfService}
                    onSubmit={(values, actions) => {
                      let newFreshId = 0;
                      modalFormData.eventData.schedulerData.events.forEach(
                        (item) => {
                          if (item.id >= newFreshId) newFreshId = item.id + 1;
                        }
                      );
                      let newEvent = {
                        id: newFreshId,
                        title: "Out Of Stock",
                        start:
                          this.state.calendarStartDateForForm + " 12:01:01",
                        end: this.state.calendarEndDateForForm + " 12:01:01",
                        resourceId: this.state.roomSelectedValue,
                        bgColor: "red",
                        movable: false,
                        startResizable: false,
                        endResizable: false,
                        type: 3,
                        notes: [
                          {
                            text: values.reasonMessage,
                            date: moment().format(DATETIME_FORMAT),
                          },
                        ],
                      };
                      if (
                        modalFormData.eventData.schedulerData._checkConflict(
                          this.state.roomSelectedValue,
                          this.state.calendarStartDateForForm + " 12:01:01",
                          this.state.calendarEndDateForForm + " 12:01:01"
                        )
                      ) {
                        alert(
                          "Room slot already taken. Choose another slot/date"
                        );
                      } else {
                        modalFormData.eventData.schedulerData.addEvent(
                          newEvent
                        );
                        this.setState({
                          viewModel: modalFormData.eventData.schedulerData,
                        });
                        actions.resetForm();
                        this.setState({ modalForm: false });
                      }
                    }}
                  >
                    {(formikProps) => (
                      <form onSubmit={formikProps.handleSubmit}>
                        {modalFormData.eventData.schedulerData._checkConflict(
                          this.state.roomSelectedValue,
                          this.state.calendarStartDateForForm + " 12:01:01",
                          this.state.calendarEndDateForForm + " 12:01:01"
                        ) && (
                          <span style={{ color: "red" }}>Slot Occupied</span>
                        )}
                        <div className="default-fields">
                          <div className="field">
                            <label>Start</label>
                            <Popover
                              content={startDatePopover}
                              trigger="click"
                              placement="bottom"
                              visible={showStartDatePopOver}
                              style={{ cursor: "pointer" }}
                              onVisibleChange={() =>
                                this.setState({
                                  showStartDatePopOver: !showStartDatePopOver,
                                })
                              }
                            >
                              <div className="popover-text">
                                <p>{calendarStartDateForForm}</p>
                                <CalendarOutlined className="popover-calendar-icon" />
                              </div>
                            </Popover>
                          </div>
                          <div className="field">
                            <label>End</label>
                            <Popover
                              content={endDatePopover}
                              trigger="click"
                              placement="bottom"
                              style={{ cursor: "pointer" }}
                              visible={showEndDatePopOver}
                              onVisibleChange={() =>
                                this.setState({
                                  showEndDatePopOver: !showEndDatePopOver,
                                })
                              }
                            >
                              <div className="popover-text">
                                <p>{calendarEndDateForForm}</p>
                                <CalendarOutlined />
                              </div>
                            </Popover>
                          </div>

                          <div className="field">
                            <label>Accommodation</label>
                            <Select
                              value={this.state.roomSelectedValue}
                              size="large"
                              onChange={(val) =>
                                this.setState({ roomSelectedValue: val })
                              }
                            >
                              {viewModel.resources.map((val, index) => {
                                return !val.groupOnly &&
                                  modalFormData.eventData.parentId ===
                                    val.parentId ? (
                                  <Option key={val.id} value={val.id}>
                                    {val.name}
                                  </Option>
                                ) : null;
                              })}
                            </Select>
                          </div>
                        </div>
                        <div className="field">
                          <label for="reasonMessage"> Reason</label>
                          <Input.TextArea
                            id="reasonMessage"
                            rows={5}
                            maxLength={450}
                            autoFocus
                            placeholder="..."
                            allowClear
                            required
                            onChange={formikProps.handleChange}
                          ></Input.TextArea>
                        </div>
                        <div className="modal-custom-footer">
                          <Button
                            className="btn"
                            onClick={() => this.setState({ modalForm: false })}
                          >
                            Cancel
                          </Button>
                          <Button
                            className="btn"
                            type="primary"
                            htmlType="submit"
                          >
                            Save
                          </Button>
                        </div>
                      </form>
                    )}
                  </Formik>
                ) : modalFormData.title === "Group Reservation" ? (
                  <Formik
                    initialValues={{
                      firstName: "",
                      lastName: "",
                      email: "",
                      phoneNumber: "",
                    }}
                    enableReinitialize
                    // validationSchema={validationSchema}
                    onSubmit={(values, actions) => {
                      let newFreshId = 0;
                      modalFormData.eventData.schedulerData.events.forEach(
                        (item) => {
                          if (item.id >= newFreshId) newFreshId = item.id + 1;
                        }
                      );
                      let newEvent = {
                        id: newFreshId,
                        title: this.state.toGroupReservationData.eventDetails
                          .title,
                        start:
                          this.state.calendarStartDateForForm + " 12:01:01",
                        end: this.state.calendarEndDateForForm + " 12:01:01",
                        resourceId: this.state.roomSelectedValue,
                        groupedReservation: true,
                        groupedReservationType: "secondary",
                        primaryReservationRef: this.state.toGroupReservationData
                          .eventDetails.id,
                        type: 2,
                        // modalFormData.title === "Create New Reservation"
                        //   ? 1
                        //   : modalFormData.title === "Curtosy Hold"
                        //   ? 2
                        //   : modalFormData.title === "Confirm Reservation"
                        //   ? 4
                        //   : modalFormData.title === "Block Dates"
                        //   ? 5
                        //   : null,
                        totalPrice: this.state.newReservationEstimatedPrice,
                        paidAmount: 0,
                        paid: false,
                        movable: true,
                        startResizable: true,
                        endResizable: true,
                        notes: [],
                        phoneNumber: values.phoneNumber,
                        email: values.email,
                        amountDue: this.state.newReservationEstimatedPrice,
                      };
                      if (
                        modalFormData.eventData.schedulerData._checkConflict(
                          this.state.roomSelectedValue,
                          this.state.calendarStartDateForForm + " 12:01:01",
                          this.state.calendarEndDateForForm + " 12:01:01"
                        )
                      ) {
                        Modal.error({
                          title: "Slot Occupied",
                          content:
                            "Room slot already taken. Choose another slot/date",
                        });
                      } else {
                        modalFormData.eventData.schedulerData._makeReservationMultiType(
                          this.state.toGroupReservationData.eventDetails,
                          "primary",
                          newFreshId
                        );
                        let newTotal = modalFormData.eventData.schedulerData._setNewEventTotalPrice(
                          this.state.toGroupReservationData.eventDetails,
                          this.state.toGroupReservationData.eventDetails
                            .totalPrice +
                            this.state.newReservationEstimatedPrice
                        );

                        modalFormData.eventData.schedulerData._setNewEventDueAmount(
                          this.state.toGroupReservationData.eventDetails,
                          this.state.toGroupReservationData.eventDetails
                            .amountDue + this.state.newReservationEstimatedPrice
                        );

                        modalFormData.eventData.schedulerData.addEvent(
                          newEvent
                        );
                        this.setState({
                          viewModel: modalFormData.eventData.schedulerData,
                        });
                        actions.resetForm();
                        this.setState({
                          modalForm: false,
                          toGroupReservationData: {},
                        });
                      }
                    }}
                  >
                    {(props) => (
                      <form onSubmit={props.handleSubmit}>
                        {modalFormData.eventData.schedulerData._checkConflict(
                          this.state.roomSelectedValue,
                          this.state.calendarStartDateForForm + " 12:01:01",
                          this.state.calendarEndDateForForm + " 12:01:01"
                        ) && <span style={{ color: "red" }}>Slot Ocupied</span>}
                        <div className="default-fields">
                          <div className="field">
                            <label>Start</label>
                            <Popover
                              content={startDatePopover}
                              trigger="click"
                              placement="bottom"
                              visible={showStartDatePopOver}
                              style={{ cursor: "pointer" }}
                              onVisibleChange={() =>
                                this.setState({
                                  showStartDatePopOver: !showStartDatePopOver,
                                })
                              }
                            >
                              <div className="popover-text">
                                <p>{calendarStartDateForForm}</p>
                                <CalendarOutlined className="popover-calendar-icon" />
                              </div>
                            </Popover>
                          </div>
                          <div className="field">
                            <label>End</label>
                            <Popover
                              content={endDatePopover}
                              trigger="click"
                              placement="bottom"
                              style={{ cursor: "pointer" }}
                              visible={showEndDatePopOver}
                              onVisibleChange={() =>
                                this.setState({
                                  showEndDatePopOver: !showEndDatePopOver,
                                })
                              }
                            >
                              <div className="popover-text">
                                <p>{calendarEndDateForForm}</p>
                                <CalendarOutlined />
                              </div>
                            </Popover>
                          </div>

                          <div className="field">
                            <label>Accommodation</label>
                            <Select
                              value={this.state.roomSelectedValue}
                              size="large"
                              onChange={(val) =>
                                this.setState({ roomSelectedValue: val })
                              }
                            >
                              {viewModel.resources.map((val, index) => {
                                return !val.groupOnly &&
                                  modalFormData.eventData.parentId ===
                                    val.parentId ? (
                                  <Option key={val.id} value={val.id}>
                                    {val.name}
                                  </Option>
                                ) : null;
                              })}
                            </Select>
                          </div>
                        </div>
                        <div className="form-name-div">
                          <div className="field">
                            <label>Group With</label>
                            <SearchReservations
                              size="large"
                              schedulerData={
                                modalFormData.eventData.schedulerData
                              }
                              setEventDetails={(
                                schedulerData,
                                eventDetails
                              ) => {
                                let {
                                  roomId,
                                  startFullDate,
                                  endFullDate,
                                } = modalFormData.eventData;
                                let newRoomTotal = schedulerData._getRoomClassPriceWithDayList(
                                  roomId,
                                  startFullDate,
                                  endFullDate
                                );
                                this.setState({
                                  toGroupReservationData: {
                                    eventDetails: eventDetails,
                                    newRoomTotal: newRoomTotal,
                                  },
                                });
                              }}
                            ></SearchReservations>
                          </div>
                        </div>
                        {JSON.stringify(this.state.toGroupReservationData) !==
                          "{}" && (
                          <div
                            className="form-name-div"
                            style={{ marginTop: 30 }}
                          >
                            <div className="field">
                              <p>
                                Reservation ID
                                {" " +
                                  this.state.toGroupReservationData.eventDetails
                                    .id}
                              </p>
                              <div>
                                <Typography.Text type="secondary">
                                  Name:{" "}
                                  {
                                    this.state.toGroupReservationData
                                      .eventDetails.title
                                  }
                                </Typography.Text>
                              </div>
                              <div>
                                <Typography.Text type="secondary">
                                  Phone Number:{" "}
                                  {
                                    this.state.toGroupReservationData
                                      .eventDetails.phoneNumber
                                  }
                                </Typography.Text>
                              </div>
                            </div>

                            <div className="field">
                              <p
                                style={{
                                  display: "flex",
                                  justifyContent: "space-between",
                                }}
                              >
                                <Typography.Text>
                                  Previous Total{" "}
                                </Typography.Text>
                                <Typography.Text type="secondary">
                                  $
                                  {
                                    this.state.toGroupReservationData
                                      .eventDetails.totalPrice
                                  }
                                </Typography.Text>
                              </p>

                              <p
                                style={{
                                  display: "flex",
                                  justifyContent: "space-between",
                                }}
                              >
                                <Typography.Text>
                                  Total for new Reservation{" "}
                                </Typography.Text>
                                <Typography.Text style={{ color: "green" }}>
                                  + ${this.state.newReservationEstimatedPrice}
                                </Typography.Text>
                              </p>

                              <p
                                style={{
                                  display: "flex",
                                  justifyContent: "space-between",
                                }}
                              >
                                <Typography.Text>Grand Total </Typography.Text>

                                <Typography.Text type="warning">
                                  $
                                  {this.state.toGroupReservationData
                                    .eventDetails.totalPrice +
                                    this.state.newReservationEstimatedPrice}
                                </Typography.Text>
                              </p>
                            </div>
                          </div>
                        )}

                        <div className="modal-custom-footer">
                          <Button
                            className="btn"
                            onClick={() => this.setState({ modalForm: false })}
                          >
                            Cancel
                          </Button>
                          <Button
                            className="btn"
                            type="primary"
                            htmlType="submit"
                          >
                            Group
                          </Button>
                        </div>
                      </form>
                    )}
                  </Formik>
                ) : (
                  <Formik
                    initialValues={{
                      firstName: "",
                      lastName: "",
                      email: "",
                      phoneNumber: "",
                    }}
                    enableReinitialize
                    validationSchema={validationSchema}
                    onSubmit={(values, actions) => {
                      let newFreshId = 0;
                      modalFormData.eventData.schedulerData.events.forEach(
                        (item) => {
                          if (item.id >= newFreshId) newFreshId = item.id + 1;
                        }
                      );
                      let newEvent = {
                        id: newFreshId,
                        title: `${values.firstName} ${values.lastName}`,
                        start: calendarStartDateForForm + " 12:01:01",
                        end: calendarEndDateForForm + " 12:01:01",
                        resourceId: this.state.roomSelectedValue,
                        type:
                          modalFormData.title === "Create New Reservation"
                            ? 1
                            : modalFormData.title === "Curtosy Hold"
                            ? 2
                            : modalFormData.title === "Confirm Reservation"
                            ? 4
                            : modalFormData.title === "Block Dates"
                            ? 5
                            : null,
                        totalPrice: this.state.newReservationEstimatedPrice,
                        paidAmount: 0,
                        paid: false,
                        movable: true,
                        startResizable: true,
                        endResizable: true,
                        notes: [],
                        phoneNumber: values.phoneNumber,
                        email: values.email,
                        amountDue: this.state.newReservationEstimatedPrice,
                      };
                      if (
                        modalFormData.eventData.schedulerData._checkConflict(
                          this.state.roomSelectedValue,
                          this.state.calendarStartDateForForm + " 12:01:01",
                          this.state.calendarEndDateForForm + " 12:01:01"
                        )
                      ) {
                        alert(
                          "Room slot already taken. Choose another slot/date"
                        );
                      } else {
                        modalFormData.eventData.schedulerData.addEvent(
                          newEvent
                        );
                        this.setState({
                          viewModel: modalFormData.eventData.schedulerData,
                        });
                        actions.resetForm();
                        this.setState({ modalForm: false });
                      }
                    }}
                  >
                    {(props) => (
                      <form onSubmit={props.handleSubmit}>
                        {modalFormData.eventData.schedulerData._checkConflict(
                          this.state.roomSelectedValue,
                          this.state.calendarStartDateForForm + " 12:01:01",
                          this.state.calendarEndDateForForm + " 12:01:01"
                        ) && <span style={{ color: "red" }}>Slot Ocupied</span>}
                        <div className="default-fields">
                          <div className="field">
                            <label>Start</label>
                            <Popover
                              content={startDatePopover}
                              trigger="click"
                              placement="bottom"
                              visible={showStartDatePopOver}
                              style={{ cursor: "pointer" }}
                              onVisibleChange={() =>
                                this.setState({
                                  showStartDatePopOver: !showStartDatePopOver,
                                })
                              }
                            >
                              <div className="popover-text">
                                <p>{calendarStartDateForForm}</p>
                                <CalendarOutlined className="popover-calendar-icon" />
                              </div>
                            </Popover>
                          </div>
                          <div className="field">
                            <label>End</label>
                            <Popover
                              content={endDatePopover}
                              trigger="click"
                              placement="bottom"
                              style={{ cursor: "pointer" }}
                              visible={showEndDatePopOver}
                              onVisibleChange={() =>
                                this.setState({
                                  showEndDatePopOver: !showEndDatePopOver,
                                })
                              }
                            >
                              <div className="popover-text">
                                <p>{calendarEndDateForForm}</p>
                                <CalendarOutlined />
                              </div>
                            </Popover>
                          </div>

                          <div className="field">
                            <label>Accommodation</label>
                            <Select
                              value={this.state.roomSelectedValue}
                              size="large"
                              onChange={(val) =>
                                this.setState({ roomSelectedValue: val })
                              }
                            >
                              {viewModel.resources.map((val, index) => {
                                return !val.groupOnly &&
                                  modalFormData.eventData.parentId ===
                                    val.parentId ? (
                                  <Option key={val.id} value={val.id}>
                                    {val.name}
                                  </Option>
                                ) : null;
                              })}
                            </Select>
                          </div>
                        </div>
                        {modalFormData.title === "Create New Reservation" ||
                        modalFormData.title === "Curtosy Hold" ||
                        modalFormData.title === "Block Dates" ? (
                          <div className="form-name-div">
                            <div className="field">
                              <label for="firstName">Frist Name</label>
                              <Input
                                id="firstName"
                                required
                                allowClear
                                size="large"
                                onChange={props.handleChange}
                              />
                              {props.errors.firstName && (
                                <p style={{ color: "red", fontSize: 12 }}>
                                  {props.errors.firstName}
                                </p>
                              )}
                            </div>
                            <div className="field">
                              <label for="lastName">Last Name</label>
                              <Input
                                id="lastName"
                                required
                                size="large"
                                onChange={props.handleChange}
                              />

                              {props.errors.lastName && (
                                <p style={{ color: "red", fontSize: 12 }}>
                                  {props.errors.lastName}
                                </p>
                              )}
                            </div>
                          </div>
                        ) : null}

                        {modalFormData.title === "Curtosy Hold" ||
                        modalFormData.title === "Block Dates" ? (
                          <div className="form-name-div">
                            <div className="field">
                              <label for="lengthOfHold">Length of Hold</label>
                              {console.warn("rendered")}
                              <Input
                                id="lengthOfHold"
                                required
                                size="large"
                                type="number"
                                min="0"
                                allowClear
                              />
                            </div>
                            <div className="field">
                              <label for="lengthOfHoldFormat">Format</label>
                              <Select
                                id="lengthOfHoldFormat"
                                size="large"
                                value={courtesyLengthOfHoldFormat}
                                onChange={(val) =>
                                  this.setState({
                                    courtesyLengthOfHoldFormat: val,
                                  })
                                }
                              >
                                <Option value="hours">Hours</Option>
                                <Option value="days">Days</Option>
                              </Select>
                            </div>
                          </div>
                        ) : null}

                        {modalFormData.title === "Create New Reservation" ||
                        modalFormData.title === "Curtosy Hold" ||
                        modalFormData.title === "Block Dates" ? (
                          <div className="form-name-div">
                            <div className="field">
                              <label for="email">Email</label>
                              <Input
                                allowClear
                                id="email"
                                size="large"
                                onChange={props.handleChange}
                              />

                              {props.errors.email && (
                                <p style={{ color: "red", fontSize: 12 }}>
                                  {props.errors.email}
                                </p>
                              )}
                            </div>
                            <div className="field">
                              <label for="phoneNumber">Phone Number</label>
                              <Input
                                allowClear
                                id="phoneNumber"
                                required
                                size="large"
                                onChange={props.handleChange}
                              />

                              {props.errors.phoneNumber && (
                                <p style={{ color: "red", fontSize: 12 }}>
                                  {props.errors.phoneNumber}
                                </p>
                              )}
                            </div>
                          </div>
                        ) : null}

                        <div className="modal-custom-footer">
                          <Button
                            className="btn"
                            onClick={() => this.setState({ modalForm: false })}
                          >
                            Cancel
                          </Button>
                          <Button
                            className="btn"
                            type="primary"
                            htmlType="submit"
                          >
                            Save
                          </Button>
                        </div>
                      </form>
                    )}
                  </Formik>
                )}
              </div>
            </div>
          </div>
        </Modal>
      </div>
    );
  }

  setEventDetails = (schedulerData, eventDetails) => {
    let reservationDetails = {
      information: eventDetails,
      schedulerData: schedulerData,
    };
    this.setState({ reservationDetails: reservationDetails }, () => {
      this.setState({ showReservationDetailModal: true });
    });
  };

  demoFunc = (schedulerData) => {
    alert("called");
  };

  warningModal() {
    Modal.warning({
      title: "Conflict",
      content: this.state.warningModalText,
    });
  }

  renderAgains = (val) => {
    this.setState({ renderAgain: val });
  };

  prevClick = (schedulerData) => {
    schedulerData.prev();
    let localEvents = localStorage.getItem("events");
    schedulerData.setEvents(
      localEvents ? JSON.parse(localEvents) : DemoData.events
    );
    this.setState({
      viewModel: schedulerData,
    });
  };

  nextClick = (schedulerData) => {
    schedulerData.next();
    let localEvents = localStorage.getItem("events");
    schedulerData.setEvents(
      localEvents ? JSON.parse(localEvents) : DemoData.events
    );
    this.setState({
      viewModel: schedulerData,
    });
  };

  onViewChange = (schedulerData, view) => {
    schedulerData.setViewType(
      view.viewType,
      view.showAgenda,
      view.isEventPerspective
    );
    let localEvents = localStorage.getItem("events");
    schedulerData.setEvents(
      localEvents ? JSON.parse(localEvents) : DemoData.events
    );
    this.setState({
      viewModel: schedulerData,
    });
  };

  onSelectDate = (schedulerData, date) => {
    schedulerData.setDate(date);
    let localEvents = localStorage.getItem("events");
    schedulerData.setEvents(
      localEvents ? JSON.parse(localEvents) : DemoData.events
    );
    this.setState({
      viewModel: schedulerData,
    });
  };

  eventClicked = (schedulerData, event) => {
    // alert(
    //   `You just clicked an event: {id: ${event.id}, title: ${event.title}}`
    // );
  };

  ops1 = (schedulerData, event) => {
    alert(
      `You just executed ops1 to event: {id: ${event.id}, title: ${event.title}}`
    );
  };

  ops2 = (schedulerData, event) => {
    alert(
      `You just executed ops2 to event: {id: ${event.id}, title: ${event.title}}`
    );
  };

  newEvent = (schedulerData, slotId, slotName, start, end, type, item) => {
    let lastIndexStart = start.lastIndexOf(" ");
    let lastIndexEnd = start.lastIndexOf(" ");

    let startDate = start.substring(0, lastIndexStart);
    let endDate = end.substring(0, lastIndexEnd);

    let totalPrice = schedulerData._getRoomClassPriceWithDayList(
      slotId,
      start,
      end
    );

    let slotParentId = schedulerData._getParentId(slotId);

    this.setState(
      {
        createEventModalData: {
          schedulerData: schedulerData,
          startDate: startDate,
          endDate: endDate,
          startFullDate: start,
          endFullDate: end,
          roomId: slotId,
          totalPrice: totalPrice,
          parentId: slotParentId,
        },
        newReservationEstimatedPrice: totalPrice,
      },
      () => {
        this.setState({ createEventModal: true });
      }
    );
    // if (
    //   confirm(
    //     `Do you want to create a new event? {slotId: ${slotId}, slotName: ${slotName}, start: ${start}, end: ${end}, type: ${type}, item: ${item}}`
    //   )
    // ) {
    //   let newFreshId = 0;
    //   schedulerData.events.forEach((item) => {
    //     if (item.id >= newFreshId) newFreshId = item.id + 1;
    //   });
    //   let newEvent = {
    //     id: newFreshId,
    //     title: "New event you just created",
    //     start: start,
    //     end: end,
    //     resourceId: slotId,
    //     bgColor: "purple",
    //   };
    //   schedulerData.addEvent(newEvent);
    //   this.setState({
    //     viewModel: schedulerData,
    //   });
    // }
  };

  updateEventStart = (schedulerData, event, newStart) => {
    let { localeMoment, cellUnit, config } = schedulerData;
    if (newStart === event.end) {
      let newMadeStart = localeMoment(newStart)
        .add(
          cellUnit === CellUnits.Hour ? -1 * config.minuteStep : -1,
          cellUnit === CellUnits.Hour ? "minutes" : "days"
        )
        .format(DATETIME_FORMAT);

      let newPrice =
        event.totalPrice +
        schedulerData._getRoomClassPriceWithDayList(
          event.resourceId,
          newMadeStart,
          event.end
        ) -
        event.amountDue;
      if (
        window.confirm(
          "Change Check Out Date to: " +
            newMadeStart +
            " with new rpice to pay: $" +
            newPrice
        )
      ) {
        schedulerData._setNewEventDueAmount(event, newPrice);
        schedulerData._setNewEventTotalPrice(event, newPrice);
        schedulerData.updateEventStart(event, newMadeStart);
      }
    } else {
      let newPrice =
        event.totalPrice +
        schedulerData._getRoomClassPriceWithDayList(
          event.resourceId,
          newStart,
          event.end
        ) -
        event.amountDue;
      if (window.confirm("New Price after editing: " + newPrice)) {
        schedulerData._setNewEventDueAmount(event, newPrice);
        schedulerData._setNewEventTotalPrice(event, newPrice);
        schedulerData.updateEventStart(event, newStart);
      }
      // if (window.confirm(`New Price to after editing days Days: "$${newPrice}`)) {
      //   schedulerData._setNewEventDueAmount(event, newPrice);
      //   schedulerData._setNewEventTotalPrice(event, newPrice);
      //   schedulerData.updateEventStart(event, newStart);
      // }
    }
    this.setState({
      viewModel: schedulerData,
    });
  };

  updateEventEnd = (schedulerData, event, newEnd) => {
    let { localeMoment, cellUnit, config } = schedulerData;
    if (newEnd === event.start) {
      let newMadeEnd = localeMoment(newEnd)
        .add(
          cellUnit === CellUnits.Hour ? 1 * config.minuteStep : 1,
          cellUnit === CellUnits.Hour ? "minutes" : "days"
        )
        .format(DATETIME_FORMAT);

      let newPrice =
        event.totalPrice +
        schedulerData._getRoomClassPriceWithDayList(
          event.resourceId,
          event.start,
          newMadeEnd
        ) -
        event.amountDue;
      if (
        window.confirm(
          "Change Check Out Date to: " +
            newMadeEnd +
            " with new price to pay: $" +
            newPrice
        )
      ) {
        schedulerData._setNewEventDueAmount(event, newPrice);
        schedulerData._setNewEventTotalPrice(event, newPrice);
        schedulerData.updateEventEnd(event, newMadeEnd);
      }
    } else {
      let newPrice =
        event.totalPrice +
        schedulerData._getRoomClassPriceWithDayList(
          event.resourceId,
          event.start,
          newEnd
        ) -
        event.amountDue;
      if (window.confirm(`New Price after editing Days: $${newPrice}`)) {
        schedulerData._setNewEventDueAmount(event, newPrice);
        schedulerData._setNewEventTotalPrice(event, newPrice);
        schedulerData.updateEventEnd(event, newEnd);
      }
    }
    this.setState({
      viewModel: schedulerData,
    });
  };

  moveEvent = (schedulerData, event, slotId, slotName, start, end) => {
    // event is data with old slot where it was before
    // slot id from props is an address of new new slot where event is moved to

    let oldParentId = "";
    let newParentId = "";
    let conflict = false;
    schedulerData.resources.forEach((res) => {
      if (res.id === event.resourceId) oldParentId = res.parentId;
    });
    schedulerData.resources.forEach((res) => {
      if (res.id === slotId) newParentId = res.parentId;
    });

    if (oldParentId !== newParentId) conflict = true;

    let newMovingPrice = schedulerData._getRoomClassPriceWithDayList(
      slotId,
      start,
      end
    );

    let moveModalDataToPass = {
      schedulerData: schedulerData,
      event: event,
      slotId: slotId,
      slotName: slotName,
      start: start,
      end: end,
      resourceId: event.resourceId,
      oldParentId: oldParentId,
      newParentId: newParentId,
      originalPrice: event.totalPrice,
      newMovingPrice: newMovingPrice,
    };
    if (conflict) {
      this.setState(
        {
          moveModalData: moveModalDataToPass,
        },
        () => {
          this.setState({ changeRoomClassModal: true });
        }
      );
    } else {
      schedulerData.moveEvent(event, slotId, slotName, start, end);
      this.setState({
        viewModel: schedulerData,
      });
    }
  };

  setViewModal = (schedulerData) => {
    alert("working");
    // this.setState({viewModel:schedulerData})
  };

  onScrollRight = (schedulerData, schedulerContent, maxScrollLeft) => {
    if (schedulerData.ViewTypes === ViewTypes.Day) {
      schedulerData.next();
      let localEvents = localStorage.getItem("events");
      schedulerData.setEvents(
        localEvents ? JSON.parse(localEvents) : DemoData.events
      );
      this.setState({
        viewModel: schedulerData,
      });

      schedulerContent.scrollLeft = maxScrollLeft - 10;
    }
  };

  onScrollLeft = (schedulerData, schedulerContent, maxScrollLeft) => {
    if (schedulerData.ViewTypes === ViewTypes.Day) {
      schedulerData.prev();
      let localEvents = localStorage.getItem("events");
      schedulerData.setEvents(
        localEvents ? JSON.parse(localEvents) : DemoData.events
      );
      this.setState({
        viewModel: schedulerData,
      });

      schedulerContent.scrollLeft = 10;
    }
  };

  onScrollTop = (schedulerData, schedulerContent, maxScrollTop) => {
    console.log("onScrollTop");
  };

  onScrollBottom = (schedulerData, schedulerContent, maxScrollTop) => {
    console.log("onScrollBottom");
  };

  toggleExpandFunc = (schedulerData, slotId) => {
    schedulerData.toggleExpandStatus(slotId);
    this.setState({
      viewModel: schedulerData,
    });
  };

  conflictOccurred = (
    schedulerData,
    action,
    event,
    type,
    slotId,
    slotName,
    start,
    end
  ) => {
    Modal.error({
      title: "Conflict",
      content: `Room already occupied from date ${moment(event.start).format(
        DATE_FORMAT
      )} to date ${moment(event.end).format(DATE_FORMAT)}.`,
    });
  };

  addResource = (resourceName, standardPrice) => {
    let schedulerData = this.state.viewModel;
    let newFreshId = schedulerData.resources.length + 1;
    let newFreshName = resourceName;
    schedulerData.addResource({
      id: newFreshId,
      name: newFreshName,
      standardPrice: standardPrice,
      groupOnly: true,
    });
    this.setState({
      viewModel: schedulerData,
    });
  };

  slotClickedFunc = (schedulerData, slot) => {
    if (slot.slotId === "AllRooms") {
      alert("Root name not updatable");
      // alert(
      //   `You just clicked a ${
      //     schedulerData.isEventPerspective ? "task" : "resource"
      //   }.{id: ${slot.slotId}, name: ${slot.slotName}}`
      // );
    } else {
      this.setState(
        { manageResourceData: { schedulerData: schedulerData, slot: slot } },
        () => {
          this.setState({ showManageResourceModal: true });
        }
      );
    }
  };

  eventItemTemplateResolver = (
    schedulerData,
    event,
    bgColor,
    isStart,
    isEnd,
    mustAddCssClass,
    mustBeHeight,
    agendaMaxEventWidth
  ) => {
    let borderWidth = isStart ? "2" : "0";
    let borderColor = "rgba(0,139,236,1)",
      backgroundColor = "#80C5F6";
    let titleText = schedulerData.behaviors.getEventTextFunc(
      schedulerData,
      event
    );
    if (!!event.type) {
      borderColor =
        event.type == 1
          ? "rgba(0,139,236,1)"
          : event.type == 3
          ? "rgba(245,60,43,1)"
          : "#999";
      backgroundColor =
        event.type == 1
          ? "#4BB772"
          : event.type == 3
          ? "#F04F55"
          : event.type == 2
          ? "#4B8FB2"
          : event.type == 4
          ? "#3CBDF3"
          : event.type == 5
          ? "#707070"
          : "#D9D9D9";
    }
    let divStyle = {
      borderLeft: !event.startResizable
        ? borderWidth + "px solid " + "black"
        : 0,
      borderRight: !event.endResizable
        ? borderWidth + "px solid " + "black"
        : 0,
      backgroundColor: backgroundColor,
      height: mustBeHeight,
      marginTop: 5,
      transform: "skew(-30deg)",
      // marginLeft: schedulerData.getContentCellWidth() / 2,
      // marginRight: schedulerData.getContentCellWidth(),
    };
    if (!!agendaMaxEventWidth)
      divStyle = { ...divStyle, maxWidth: agendaMaxEventWidth };

    return (
      <div key={event.id} className={mustAddCssClass} style={divStyle}>
        <span
          style={{
            marginLeft: "6px",
            lineHeight: `${mustBeHeight}px`,
            transform: "skew(60deg)",
            paddingLeft:
              moment(event.start).format(DATE_FORMAT) <
              moment(schedulerData.headers[0].time).format(DATE_FORMAT)
                ? 30
                : "initial",
          }}
        >
          {event.groupedReservation ? "+ " : ""}
          {titleText}
          {event.amountDue > 0 && <div className="to-charge-alert-icon"></div>}
          {event.notes && event.notes.length > 0 && (
            <div className="event-note-icon"></div>
          )}
        </span>
      </div>
    );
  };

  eventItemPopoverTemplateResolver = () =>
    // schedulerData,
    // eventItem,
    // title,
    // start,
    // end,
    // statusColor,
    // changePopoverVisible
    {
      return (
        // <React.Fragment>
        //     <h3>{title}</h3>
        //     <h5>{start.format("HH:mm")} - {end.format("HH:mm")}</h5>
        //     <img src="./icons8-ticket-96.png" />
        // </React.Fragment>
        // <EventItemCustomPopover
        //   schedulerData={schedulerData}
        //   eventItem={eventItem}
        //   title={title}
        //   start={start}
        //   end={end}
        //   statusColor={statusColor}
        //   changePopoverVisible={changePopoverVisible}
        //   setRenderAgain={(val) => this.setState({ renderAgain: val })}
        // />
        <div>EVent Item</div>
      );
    };

  nonAgendaCellHeaderTemplateResolver = (
    schedulerData,
    item,
    formattedDateItems,
    style
  ) => {
    let datetime = schedulerData.localeMoment(item.time);
    let isCurrentDate = false;

    if (schedulerData.viewType === ViewTypes.Day) {
      isCurrentDate = datetime.isSame(new Date(), "hour");
    } else {
      isCurrentDate = datetime.isSame(new Date(), "day");
    }

    if (isCurrentDate) {
      style.backgroundColor = "#118dea";
      style.color = "white";
    }

    return (
      <th key={item.time} className={`header3-text`} style={style}>
        {formattedDateItems.map((formattedItem, index) => (
          <div
            key={index}
            // dangerouslySetInnerHTML={{
            //   __html: formattedItem.replace(/[0-9]/g, "<b>$&</b>"),
            // }}
          >
            <div
              style={{
                cursor: "pointer",
                backgroundColor:
                  item.unAssignedEvents.length > 0 ? "#2d8acd" : "lightgray",
                width: "35%",
                margin: "auto",
                padding: "0.2rem",
                borderRadius: 100,
                color: "white",
              }}
            >
              {item.unAssignedEvents.length > 0 && (
                <Popover
                  style={{
                    // width: "100%",
                    // height: "100%",
                    borderRadius: 50,
                  }}
                  trigger="hover"
                  placement="bottom"
                  content={
                    <div style={{ width: 200 }}>
                      <ul className="modal-body-option-ul">
                        <li
                          onClick={() => {
                            schedulerData._reAssignEvents(
                              item.unAssignedEvents,
                              schedulerData,
                              item
                            );
                            this.setState({ renderAgain: true });
                          }}
                        >
                          Assign Events to Rooms
                        </li>
                      </ul>
                    </div>
                  }
                >
                  {item.unAssignedEvents.length}
                </Popover>
              )}
              {item.unAssignedEvents.length === 0 && (
                <span>{item.unAssignedEvents.length}</span>
              )}
            </div>
            {formattedItem}
          </div>
        ))}
      </th>
    );
  };
}

export default withDragDropContext(Basic);
