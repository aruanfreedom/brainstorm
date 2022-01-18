import React from "react";
import { Layout } from "antd";
import { Route, Routes } from "react-router-dom";
import styled from "styled-components";
import Header from "./header";
import Content from "./content";
import Footer from "./footer";
import NotFound from "../pages/notFound";
import Admin from "../pages/admin";
import RoomWait from "../pages/roomWait";
import Room from "../pages/room";
import Rating from "../pages/rating";
import Total from "../pages/total";

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
        <Route path="/room/:roomId" element={<Room />} />
        <Route path="/rating/:roomId" element={<Rating />} />
        <Route path="/total/:roomId" element={<Total />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Content>
    <Footer />
  </LayoutWrapper>
);

export default LayoutComp;
