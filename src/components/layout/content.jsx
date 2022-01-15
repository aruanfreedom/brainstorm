import React from "react";
import PropTypes from "prop-types";
import { Layout } from "antd";

const { Content } = Layout;

const ContentWrapper = ({ children }) => {
  return <Content className="content">{children}</Content>;
};

ContentWrapper.propTypes = {
  children: PropTypes.node.isRequired,
};

export default ContentWrapper;
