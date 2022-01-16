import React from "react";
import PropTypes from "prop-types";
import { Layout, Spin } from "antd";
import { useSelector } from "react-redux";
import styled from "styled-components";

const Content = styled(Layout.Content)`
  border-radius: 7px;
  background-color: #fff;
  padding: 45px;
  margin: 45px;
  height: 100%;
`;

const ContentWrapper = ({ children }) => {
  const loader = useSelector((state) => state.loader);
  return <Content>{loader.main ? <Spin /> : children}</Content>;
};

ContentWrapper.propTypes = {
  children: PropTypes.node.isRequired,
};

export default ContentWrapper;
