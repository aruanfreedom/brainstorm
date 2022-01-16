import React from "react";
import PropTypes from "prop-types";
import { Layout } from "antd";
import styled from "styled-components";

const Content = styled(Layout.Content)`
  border-radius: 7px;
  background-color: #fff;
  padding: 45px;
  margin: 45px;
  height: 100%;
`;

const ContentWrapper = ({ children }) => {
  return <Content>{children}</Content>;
};

ContentWrapper.propTypes = {
  children: PropTypes.node.isRequired,
};

export default ContentWrapper;
