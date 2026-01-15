import React from "react";
import { ReactIcons } from "../constants/react_icons";

export const SearchBar = ({ placeholder = "", value, onChange = () => {} }) => {
  return (
    <div className="bg-[#EEEEF0] rounded-2xl flex items-center px-7 w-full">
      <ReactIcons.IoSearchSharp className="text-[#7a7c8f] text-xl" />
      <input
        type="search"
        name="search"
        value={value}
        onChange={(e) => onChange(e)}
        className="w-full rounded-2xl px-3 py-2"
        placeholder={placeholder || "Search..."}
      />
    </div>
  );
};
