import React from "react";
import { useNavigate } from "react-router-dom";
import { ReactIcons } from "../constants/react_icons";
import { exportToJSON } from "../../utils/helpingFns";

export const BackButton = ({
  path = "",
  btnName = "",
  title = "",
  caption = "",
  showExport = false,
  exportLabel = "Export",
  data = {},
  fileName = "data",
  className = {
    backBtn: "",
    title: "",
    caption: "",
    container: "",
    exportBtn: "",
  },
}) => {
  const navigate = useNavigate();

  return (
    <div
      className={`flex items-center justify-between gap-4 ${className.container}`}
    >
      {/* LEFT SIDE */}
      <div>
        {btnName && (
          <button
            className={`flex items-center text-[#215675] gap-2 ${className.backBtn}`}
            onClick={() => (path ? navigate(path) : navigate(-1))}
          >
            <ReactIcons.FaArrowLeftLong />
            <span className="text-xs">{btnName}</span>
          </button>
        )}

        <h1 className={`text-xl font-bold my-2 ${className.title}`}>{title}</h1>

        {caption && (
          <p className={`text-[#757575] text-md ${className.caption}`}>
            {caption}
          </p>
        )}
      </div>

      {/* RIGHT SIDE */}
      {showExport && (
        <button
          onClick={() => exportToJSON(data, `${fileName}.json`)}
          className={`flex items-center gap-2 px-5 py-1 
          text-sm font-medium rounded-xs
          bg-[#215675] text-white 
          hover:bg-[#1a455f] transition
          ${className.exportBtn}`}
        >
          {/* <ReactIcons.FaFileExport /> */}
          {exportLabel}
        </button>
      )}
    </div>
  );
};
