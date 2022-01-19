import React from "react";
import { Layout, Button, Row } from "antd";
import styled from "styled-components";
import { useSelector } from "react-redux";

const Header = styled(Layout.Header)``;

const Profile = styled.h1`
  color: #fff;
  padding: 0 10px;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
  width: 150px;
`;

const Title = styled.h1`
  color: #fff;
  width: 267px;
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
        <div>
          <Row>
            {users.data?.[user.uid]?.name && (
              <img
                src={`https://avatars.dicebear.com/api/bottts/${
                  users?.data?.[user.uid]?.avatarId
                }.svg`}
                width="30"
                alt="bottts_avatar"
              />
            )}
            <Profile>
              {users.data?.[user.uid]?.name} {users.data?.[user.uid]?.lastName}
            </Profile>
          </Row>
        </div>
        <Title>Генерация идей</Title>
        <div>{users.data?.[user.uid]?.name && <Exit>Выйти</Exit>}</div>
      </Row>
    </Header>
  );
};

export default HeaderWrapper;
