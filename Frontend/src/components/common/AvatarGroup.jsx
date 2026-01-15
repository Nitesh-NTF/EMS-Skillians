import React, { useState } from "react";

export const AvatarGroup = ({
  avatars = [],
  sizeInPixel = 22,
  noOfIcon = 3,
  spacing = 15,
  fontSize = 10,
  className=""
}) => {
  const icons = avatars.filter((_, index) => index < noOfIcon);

  if(!avatars.length) return <p className="text-[#51515B]">None</p>

  return (
    <div
      className={`relative ${className}`}
      style={{ width: `${(noOfIcon + 1) * spacing}px` }}
    >
      {icons.map((emp, index) => (
        <img
          key={index}
          className={`rounded-full absolute border-2 border-white`}
          src={emp.icon}
          alt="icon"
          style={{
            left: `${index * spacing}px`,
            zIndex: index,
            width: `${sizeInPixel}px`,
            height: `${sizeInPixel}px`,
            top: `${-sizeInPixel/2}px`,
          }}
        />
      ))}
      {
        avatars.length > noOfIcon &&
        <span
        className={`bg-[#374052] rounded-full text-white flex items-center justify-center absolute`}
        style={{
          left: `${icons.length * spacing}px`,
          zIndex: icons.length,
          width: `${sizeInPixel}px`,
          height: `${sizeInPixel}px`,
          top: `${-sizeInPixel/2}px`,
          fontSize: `${fontSize}px`,
        }}
      >
        +{avatars.length - icons.length}
      </span>
        }
    </div>
  );
};
