import React, { Component } from "react";
import { PropTypes } from "prop-types";
import { CaretDownOutlined, CaretUpOutlined } from "@ant-design/icons";

class ResourceView extends Component {
  constructor(props) {
    super(props);
  }

  static propTypes = {
    schedulerData: PropTypes.object.isRequired,
    contentScrollbarHeight: PropTypes.number.isRequired,
    slotClickedFunc: PropTypes.func,
    slotItemTemplateResolver: PropTypes.func,
    toggleExpandFunc: PropTypes.func,
  };

  render() {
    const {
      schedulerData,
      contentScrollbarHeight,
      slotClickedFunc,
      slotItemTemplateResolver,
      toggleExpandFunc,
    } = this.props;
    const { renderData } = schedulerData;

    let width = schedulerData.getResourceTableWidth() - 2;
    let paddingBottom = contentScrollbarHeight;
    let displayRenderData = renderData.filter((o) => o.render);
    let resourceList = displayRenderData.map((item) => {
      let indents = [];
      for (let i = 0; i < item.indent; i++) {
        indents.push(<span key={`es${i}`} className="expander-space"></span>);
      }
      let indent = (
        <span key={`es${item.indent}`} className="expander-space"></span>
      );
      if (item.hasChildren) {
        indent = item.expanded ? (
          <CaretDownOutlined
            key={`es${item.indent}`}
            style={{}}
            className=""
            onClick={() => {
              if (!!toggleExpandFunc)
                toggleExpandFunc(schedulerData, item.slotId);
            }}
          />
        ) : (
          <CaretUpOutlined
            key={`es${item.indent}`}
            style={{}}
            className=""
            onClick={() => {
              if (!!toggleExpandFunc)
                toggleExpandFunc(schedulerData, item.slotId);
            }}
          />
        );
      }
      indents.push(indent);

      let a =
        slotClickedFunc != undefined ? (
          <span className="slot-cell">
            {indents}
            <a
              style={{
                fontWeight: item.groupOnly ? "700" : "500",
                color: item.groupOnly ? "#6B6B6B" : "#9C9C9C",
                fontSize: 13,
              }}
              className="slot-text"
              onClick={() => {
                slotClickedFunc(schedulerData, item);
              }}
            >
              {item.slotName}
            </a>
          </span>
        ) : (
          <span className="slot-cell">
            {indents}
            <span className="slot-text">{item.slotName}</span>
          </span>
        );
      let slotItem = (
        <div
          title={item.slotName}
          className="overflow-text header2-text"
          style={{
            textAlign: "left",
            // paddingTop: item.groupOnly ? "1rem" : "0.5rem",
            // paddingBottom: item.groupOnly ? "1rem" : "0.5rem",
            // height: item.groupOnly ? 50 : 40,
          }}
        >
          {a}
        </div>
      );
      if (!!slotItemTemplateResolver) {
        let temp = slotItemTemplateResolver(
          schedulerData,
          item,
          slotClickedFunc,
          width,
          "overflow-text header2-text"
        );
        if (!!temp) slotItem = temp;
      }

      let tdStyle = { height: item.rowHeight, color: "black" };
      if (item.groupOnly) {
        tdStyle = {
          ...tdStyle,
          backgroundColor: schedulerData.config.groupOnlySlotColor,
        };
      }

      return (
        <tr key={item.slotId}>
          <td data-resource-id={item.slotId} style={tdStyle}>
            {slotItem}
          </td>
        </tr>
      );
    });

    return (
      <div style={{ paddingBottom: paddingBottom }}>
        <table className="resource-table">
          <tbody>{resourceList}</tbody>
        </table>
      </div>
    );
  }
}

export default ResourceView;
