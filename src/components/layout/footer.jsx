import React from "react";
import { Layout } from "antd";

const { Footer } = Layout;

const FooterWrapper = () => (
  <Footer className="footer">
    Copyright @redlab {new Date().getFullYear()}
  </Footer>
);

export default FooterWrapper;
