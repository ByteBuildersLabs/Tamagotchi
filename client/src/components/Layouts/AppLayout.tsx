// AppLayout.tsx
import React from "react";
import { Outlet } from "react-router-dom";
import Header from "../Header/index.tsx";

const AppLayout: React.FC = () => {
  return (
    <>
      <Header />
      <Outlet />
    </>
  );
};

export default AppLayout;
