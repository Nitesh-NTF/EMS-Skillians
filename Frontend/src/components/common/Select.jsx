import React from "react";
import { RequiredSign } from "./RequiredSign";

export const Select = ({
  label = "",
  id = undefined,
  name = "",
  value = "",
  onChange = () => {},
  description = "",
  required = false,
  options = [],
  classname=""
}) => {
  return (
    <div className={`w-full flex flex-col ${classname}`}>
      <label htmlFor={id}>
        {label} {required && <RequiredSign />}
      </label>
      {/* <br /> */}
      <select
        className={"input"}
        name={name}
        id={id}
        onChange={onChange}
        defaultValue={value}
      >
        {options.map((opt) => (
          <option key={opt.key} value={opt.name}>
            {opt.value}
          </option>
        ))}
      </select>{" "}
      <p className="text-[#666666] text-xs">{description}</p>
    </div>
  );
};
