import React, { useState } from "react";

import { ReactIcons } from "../constants/react_icons";

export const Pagination = ({
  page = 1,
  limit = 10,
  total = 0,
  changePage = () => {},
}) => {
  // console.log("page", page, "limit", limit, "total", total);

  return (
    <div className="my-5">
      <div className="w-2/5 mx-auto flex items-center gap-4">
        <button
          onClick={() => changePage(page - 1)}
          disabled={page == 1}
          className="px-2 py-1 rounded-md bg-cyan-900 text-white flex items-center gap-1.5"
        >
          <ReactIcons.IoIosArrowBack />
          Previous
        </button>
        <span className="text-gray-400 min-w-max">
          Page {page} of {Math.ceil(total / limit)}
        </span>
        <button
          onClick={() => changePage(page + 1)}
          disabled={page == Math.ceil(total / limit)}
          className="px-2 py-1 rounded-md bg-cyan-900 text-white flex items-center gap-1.5"
        >
          Next
          <ReactIcons.IoIosArrowForward />
        </button>
      </div>
    </div>
  );
};
