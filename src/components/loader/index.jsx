import React from "react";
import { Spin } from "antd";
import styled from "styled-components";

const LoaderWrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
  width: 100%;
`;

const Loader = () => {
  return (
    <LoaderWrapper>
      <Spin />
    </LoaderWrapper>
  );
};

export default Loader;
