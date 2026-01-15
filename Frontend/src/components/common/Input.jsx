import React from "react";
import { RequiredSign } from "./RequiredSign";

export const Input = ({
  label = "",
  id = undefined,
  name = "",
  value = "",
  onchange = () => {},
  description = "",
  required = false,
  type = "",
  classname=""
}) => {
  return (
    <div className={classname}>
      <label htmlFor={id}>
        {label} {required && <RequiredSign />}
      <br />
      <input
        className="input"
        id={id}
        name={name}
        type={type}
        value={value}
        onChange={(e) => onchange(e)}
        />
      <p className="text-[#666666] text-xs">{description}</p>
        </label>
    </div>
  );
};
