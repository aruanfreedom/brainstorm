import React from "react";
import { Layout } from "antd";
import styled from "styled-components";

const Footer = styled(Layout.Footer)`
  text-align: center;
  position absolute;
  bottom: 0;
  width: 100%;
`;

const FooterWrapper = () => (
  <Footer>Copyright @redlab {new Date().getFullYear()}</Footer>
);

export default FooterWrapper;
