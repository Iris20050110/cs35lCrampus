import React from "react";
import { Outlet } from "react-router-dom";

const mainLayout = () => {
  return (
    <>
      <Outlet />
    </>
  );
};

export default mainLayout;
