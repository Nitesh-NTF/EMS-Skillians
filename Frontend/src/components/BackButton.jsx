import React from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "./Button";
import { ReactIcons } from "./constants/react_icons";

export const BackButton = ({
  path = "",
  btnName = "",
  title = "",
  caption = "",
  className = { backBtn: "", title: "", caption: "", container: "" },
}) => {
  const navigate = useNavigate();
  return (
    <div className={className.container}>
      {btnName && (
        <Button
          className={`flex items-center text-[#215675] gap-2 ${className.backBtn}`}
          onClick={() => (path ? navigate(path) : navigate(-1))}
        >
          <ReactIcons.FaArrowLeftLong />
          <span className="text-xs">{btnName}</span>
        </Button>
      )}
      <h1 className={`text-xl font-bold my-2 ${className.title}`}>{title}</h1>
      <p className={`text-[#757575] text-md ${className.caption}`}>{caption}</p>
    </div>
  );
};
