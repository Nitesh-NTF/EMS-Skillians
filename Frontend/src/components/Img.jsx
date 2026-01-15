import React from "react";

export const Img = ({ src = "", alt = "image", className="",onClick = () => {} }) => {
  return <img src={src} alt={alt} className={className}/>;
};
