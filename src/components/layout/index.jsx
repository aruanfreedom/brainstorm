import React from "react";
import { Layout } from "antd";
import { Route, Routes } from "react-router-dom";
import Header from "./header";
import Content from "./content";
import Footer from "./footer";
import NotFound from "../notFound";
import Admin from "../admin";

const LayoutWrapper = () => (
  <Layout className="layout">
    <Header />
    <Content>
      <Routes>
        <Route path="/" element={<Admin />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Content>
    <Footer />
  </Layout>
);

export default LayoutWrapper;
