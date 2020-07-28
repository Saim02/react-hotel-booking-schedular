import React from "react";
import { Drawer, Button } from "antd";
import { GiHamburgerMenu } from "react-icons/gi";
import AddResourceForm from "./AddResourceForm";

export default class SideMenuBar extends React.Component {
  state = { visible: false };

  showDrawer = () => {
    this.setState({
      drawerVisible: true,
    });
  };

  onClose = () => {
    this.setState({
      drawerVisible: false,
    });
  };

  showModal = () => {
    this.handleCancel();
    this.setState({ visible: true });
  };
  handleCancel = () => {
    this.setState({ visible: false });
  };
  handleCreate = () => {
    const { addResource } = this.props;
    const form = this.form;
    form.validateFields((err, values) => {
      if (err) {
        return;
      }
      addResource(values.roomClassName, values.roomClasStandardPrice);
      form.resetFields();
      this.setState({ visible: false });
    });
  };
  saveFormRef = (form) => {
    this.form = form;
  };

  render() {
    return (
      <div>
        <div style={{ marginTop: 5 }}>
          {/* <Button type="primary" onClick={this.showDrawer}>
            Open
          </Button> */}
          <GiHamburgerMenu color="white" size={25} onClick={this.showDrawer} />
        </div>
        <Drawer
          title="Calendar Options"
          placement="left"
          closable={false}
          onClose={this.onClose}
          visible={this.state.drawerVisible}
          getContainer={true}
          style={{ position: "absolute" }}
        >
          <p className="menu-bar-option">Auto Assign All</p>
          <p
            onClick={
              // this.onClose();
              // this.props.setResourceManageModal();
              this.showModal
              // }
            }
            className="menu-bar-option"
          >
            Create New Accomodation Type
          </p>
        </Drawer>
        <AddResourceForm
          ref={this.saveFormRef}
          visible={this.state.visible}
          onCancel={this.handleCancel}
          onCreate={this.handleCreate}
          addResource={this.addResource}
        />
      </div>
    );
  }
}
