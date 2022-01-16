import React from "react";
import { Layout } from "antd";
import styled from "styled-components";

const Footer = styled(Layout.Footer)`
  text-align: center;
`;

const FooterWrapper = () => (
  <Footer>Copyright @redlab {new Date().getFullYear()}</Footer>
);

export default FooterWrapper;
