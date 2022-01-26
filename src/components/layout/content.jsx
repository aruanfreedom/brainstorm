import React from "react";
import PropTypes from "prop-types";
import { Layout } from "antd";
import { useSelector } from "react-redux";
import styled from "styled-components";
import Loader from "../loader";

const Content = styled(Layout.Content)`
  border-radius: 7px;
  background-color: #fff;
  padding: 20px 45px;
  margin: 45px;
  height: 100%;
`;

const ContentWrapper = ({ children }) => {
  const loader = useSelector((state) => state.loader);
  return <Content>{loader.main ? <Loader /> : children}</Content>;
};

ContentWrapper.propTypes = {
  children: PropTypes.node.isRequired,
};

export default ContentWrapper;
