import React from "react";
import { BackButton } from "../common/BackButton";
import NotificationBox from "./NotificationBox";
import { Outlet, useLocation } from "react-router-dom";

export const Inbox = () => {
  const { pathname } = useLocation();
  const isInbox = !pathname.includes("/inbox/") && pathname === "/inbox";

  console.log("isInbox", isInbox, pathname);

  return (
    <div>
      {/* <BackButton title='Inbox'/> */}
      {isInbox ? (
        <NotificationBox search={true} header={true} pagination={true} />
      ) : (
        <Outlet />
      )}
    </div>
  );
};
