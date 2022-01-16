import React from "react";
import { Layout } from "antd";
import { Route, Routes } from "react-router-dom";
import Header from "./header";
import Content from "./content";
import Footer from "./footer";
import NotFound from "../pages/notFound";
import Admin from "../pages/admin";
import RoomWait from "../pages/roomWait";
import styled from "styled-components";

const LayoutWrapper = styled(Layout)`
  height: 100%;
`;

const LayoutComp = () => (
  <LayoutWrapper>
    <Header />
    <Content>
      <Routes>
        <Route path="/" element={<Admin />} />
        <Route path="/roomWait/:roomId" element={<RoomWait />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Content>
    <Footer />
  </LayoutWrapper>
);

export default LayoutComp;
