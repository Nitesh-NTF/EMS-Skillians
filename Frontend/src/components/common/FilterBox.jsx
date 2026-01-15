import React from "react";

export const FilterBox = ({
  children,
  title = "",
  options = [], // [{ value: "", title: "" }]
  className = "",
}) => {
  return (
    <div className={`p-8 w-full ${className}`}>
      <div className="flex justify-between">
        {title && <h2>{title}</h2>}
        {options.length > 0 && (
          <select>
            {options.map((opt, index) => (
              <option key={index} value={opt.value}>
                {opt.title}
              </option>
            ))}
          </select>
        )}
      </div>
      <div>{children}</div>
    </div>
  );
};
