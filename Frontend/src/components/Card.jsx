import React from "react";

export const Card = ({ children, className="", ...props }) => {
  return (
    <div className={"bg-white" + " " + className} {...props}>
      {children}
    </div>
  );
};
