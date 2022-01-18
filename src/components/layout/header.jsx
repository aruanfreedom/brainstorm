import React from "react";
import { Layout, Button, Row } from "antd";
import styled from "styled-components";
import { useSelector } from "react-redux";

const Header = styled(Layout.Header)``;

const Title = styled.h1`
  color: #fff;
`;

const Exit = styled(Button)`
  margin-top: 15px;
`;

const HeaderWrapper = () => {
  const user = useSelector((state) => state.user);
  const users = useSelector((state) => state.users);

  return (
    <Header>
      <Row justify="space-between">
        <Title>
          {users.data?.[user.uid]?.name} {users.data?.[user.uid]?.lastName}
        </Title>
        <Title>Генерация идей</Title>
        <div>{users.data?.[user.uid]?.name && <Exit>Выйти</Exit>}</div>
      </Row>
    </Header>
  );
};

export default HeaderWrapper;
