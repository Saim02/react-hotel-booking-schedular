import React from "react";
import { Modal, Form, Input, Radio } from "antd";
const FormItem = Form.Item;

const AddResourceForm = Form.create()((props) => {
  const { visible, onCancel, onCreate, form } = props;
  const { getFieldDecorator } = form;
  return (
    <Modal
      visible={visible}
      title="New Room Type"
      okText="Create"
      onCancel={onCancel}
      onOk={onCreate}
    >
      <Form layout="vertical">
        <FormItem label="Room Class Name">
          {getFieldDecorator("roomClassName", {
            rules: [
              {
                required: true,
                message: "Enter Room Type Name",
                placeholder: "Room Type Name",
              },
            ],
          })(<Input />)}
        </FormItem>
        <FormItem label="Room Class Standard Price">
          {getFieldDecorator("roomClasStandardPrice", {
            rules: [
              {
                required: true,
                message: "Enter Room Type Standard Price",
                placeholder: "Room Type Standard Price",
              },
            ],
          })(<Input />)}
        </FormItem>
      </Form>
    </Modal>
  );
});

export default AddResourceForm;
