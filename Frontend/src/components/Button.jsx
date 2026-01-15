import React from "react";

export const Button = ({ children, className = "", onClick = () => {}, ...props }) => {
  return (
    <button className={"cursor-pointer" + " " + className} onClick={(e)=>onClick(e)} {...props}>
      {children}
    </button>
  );
};
