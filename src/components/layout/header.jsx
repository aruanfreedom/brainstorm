import React from "react";
import { Layout } from "antd";
import styled from "styled-components";

const Header = styled(Layout.Header)``;
const Title = styled.h1`
  color: #fff;
`;

const HeaderWrapper = () => (
  <Header>
    <Title>Генерация идей</Title>
  </Header>
);

export default HeaderWrapper;
