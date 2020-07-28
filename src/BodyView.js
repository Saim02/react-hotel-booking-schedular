import React, { Component, useState } from "react";
import { PropTypes } from "prop-types";
import validator from "validator";
import { isInteger } from "formik";
import { Input } from "antd";

class BodyView extends Component {
  constructor(props) {
    super(props);
  }

  static propTypes = {
    schedulerData: PropTypes.object.isRequired,
  };

  render() {
    const { schedulerData } = this.props;
    const { renderData, headers, config, behaviors } = schedulerData;
    let cellWidth = schedulerData.getContentCellWidth();

    let displayRenderData = renderData.filter((o) => o.render);
    let tableRows = displayRenderData.map((item) => {
      let rowCells = headers.map((header, index) => {
        let key = item.slotId + "_" + header.time;
        let style = index === headers.length - 1 ? {} : { width: cellWidth };
        // if (!!header.nonWorkingTime)
        //   style = {
        //     ...style,
        //     backgroundColor: config.nonWorkingTimeBodyBgColor,
        //   };
        // if (item.groupOnly)
        //   style = { ...style, backgroundColor: config.groupOnlySlotColor };
        if (!!behaviors.getNonAgendaViewBodyCellBgColorFunc) {
          let cellBgColor = behaviors.getNonAgendaViewBodyCellBgColorFunc(
            schedulerData,
            item.slotId,
            header
          );
          // if (!!cellBgColor) style = { ...style, backgroundColor: cellBgColor };
        }
        return (
          <TableCell
            key={key}
            style={{ style }}
            item={item}
            header={header}
            schedulerData={schedulerData}
          />
        );
      });

      return (
        <tr
          key={item.slotId}
          style={{
            height: item.rowHeight,
            backgroundColor: item.groupOnly ? "#F8F8F8" : "initial",
          }}
        >
          {rowCells}
        </tr>
      );
    });

    return <tbody>{tableRows}</tbody>;
  }
}

export default BodyView;

const TableCell = (props) => {
  const { item, style, header, schedulerData } = props;

  const [inputValue, setValue] = useState(
    item.groupOnly && item.slotId !== "AllRooms"
      ? `${schedulerData._addRoomClassPriceWithDayList(
          item.slotId,
          header.time,
          item.standardPrice
        )}`
      : null
  );

  return (
    <td
      // key={key}
      style={style}
    >
      <div
        style={{
          color: "lightgray",
          fontSize: 12,
          // paddingTop: item.groupOnly ? "1rem" : "0.5rem",
          // paddingBottom: item.groupOnly ? "1rem" : "0.5rem",
          // height: item.groupOnly ? 50 : 40,
        }}
      >
        {item.groupOnly && item.slotId !== "AllRooms" && "$"}
        {item.groupOnly && item.slotId !== "AllRooms" && (
          <input
            size="small"
            // min={0}
            // type="number"
            className="price-input"
            style={{
              backgroundColor: "transparent",
              borderWidth: 0,
              width: schedulerData.getContentCellWidth() / 3,
            }}
            onSubmit={() => alert("submitted")}
            value={inputValue}
            onChange={(val) => {
              if (
                validator.isNumeric(val.currentTarget.value) &&
                val.currentTarget.value < 10001 &&
                val.currentTarget.value >= 1
              ) {
                schedulerData._setTableCellPrice(
                  item.slotId,
                  header.time,
                  val.currentTarget.value
                );
                setValue(val.currentTarget.value);
              }
            }}
          />
        )}
      </div>
    </td>
  );
};
