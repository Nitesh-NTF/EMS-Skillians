import React, { useState } from "react";
import { ReactIcons } from "./constants/react_icons";
import { Outlet, useLocation, useNavigate, useParams } from "react-router-dom";

export const MultiTabs = ({
  tabName = "",
  path = "",
  tabs = [],
  className = {
    tHead: "",
    tHeaders: "",
    tContent: "",
    activeTabHeader: "",
    inactiveTabHeader: "",
  },
}) => {
  // const [currentTab, setCurrentTab] = useState(0);
  const params = useParams();
  const navigate = useNavigate();
  const { pathname } = useLocation();

  return (
    <div>
      <div className={`flex leading-4 ${className.tHead}`}>
        {tabs.map((t, index) => (
          <button
            className={`rounded-xs cursor-pointer w-full ${
              className.tHeaders
            } ${
              pathname.includes(t.key)
                ? className.activeTabHeader
                : className.inactiveTabHeader
            }`}
            key={index}
            onClick={() => navigate(path + t.key)}
          >
            {t.header}
          </button>
        ))}
      </div>
      <div className="py-5">
        {tabs
          // .filter((t) => params[tabName] == t.key)
          .filter((t) => pathname.includes(t.key))
          .map((tab, index) => (
            <div key={index}>
              {/* {tab.render ? tab.render(tab, index) : <Outlet />} */}
              {tab.render(tab, index)}
            </div>
          ))}
      </div>
    </div>
  );
};
