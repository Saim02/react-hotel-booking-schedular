import React, { useState } from "react";
import { Modal, Select, Input } from "antd";

export default function ManageResourceModal(props) {
  const { manageResourceData, visible, setVisible } = props;
  const { schedulerData, slot } = manageResourceData;

  const [roomClassSelectedOption, setSelectOption] = useState(slot.parentId);
  const [newRoomName, setRoomName] = useState(slot.slotName);
  return (
    <Modal
      visible={visible}
      onCancel={() => setVisible(false)}
      okText="Confirm Changes"
      title={slot.slotId}
      onOk={() => {
        if (slot.groupOnly) {
          schedulerData._changeRoomClassName(slot.slotId, newRoomName);
        } else {
          let hasEvents = false;
          schedulerData.events.forEach((event) => {
            if (event.resourceId === slot.slotId) {
              hasEvents = true;
              alert(
                "Room has events attached to it. Process terminated. Try after unassigning tasks"
              );
            }
          });
          if (!hasEvents) {
            schedulerData._changeRoomParent(
              slot.slotId,
              roomClassSelectedOption
            );
          }
        }

        setVisible(false);
      }}
    >
      {slot.groupOnly ? (
        <div>
          <label>Room Type Name</label>
          <Input
            value={newRoomName}
            onChange={(val) => setRoomName(val.currentTarget.value)}
          />
        </div>
      ) : (
        <Select
          value={roomClassSelectedOption}
          onChange={(val) => setSelectOption(val)}
        >
          {schedulerData.resources.map((resource, index) =>
            resource.groupOnly && resource.id !== "AllRooms" ? (
              <Select.Option value={resource.id}>{resource.name}</Select.Option>
            ) : null
          )}
        </Select>
      )}
    </Modal>
  );
}
