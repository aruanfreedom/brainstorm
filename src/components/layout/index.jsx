import React from "react";
import { Layout } from "antd";
import { Route, Routes } from "react-router-dom";
import styled from "styled-components";
import Header from "./header";
import { DatabaseContext } from "../Context/db";
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
        <Route
          path="/roomWait/:roomId"
          element={
            <DatabaseContext>
              <RoomWait />
            </DatabaseContext>
          }
        />
        <Route
          path="/room/:roomId"
          element={
            <DatabaseContext>
              <Room />
            </DatabaseContext>
          }
        />
        <Route
          path="/rating/:roomId"
          element={
            <DatabaseContext>
              <Rating />
            </DatabaseContext>
          }
        />
        <Route
          path="/total/:roomId"
          element={
            <DatabaseContext>
              <Total />
            </DatabaseContext>
          }
        />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Content>
    <Footer />
  </LayoutWrapper>
);

export default LayoutComp;
