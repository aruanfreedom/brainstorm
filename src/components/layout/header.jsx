import React, { useEffect } from "react";
import { Layout, Row } from "antd";
import styled from "styled-components";
import { useSelector, useDispatch } from "react-redux";
import ExitButton from "../exitButton";
import { useNavigate } from "react-router-dom";
import { clearUserData } from "../../store/user";
import { clearUsersData } from "../../store/users";
import { getId } from "../../helpers/generateId";

const Header = styled(Layout.Header)``;

const Profile = styled.h1`
  color: #fff;
  padding: 0 10px;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
  width: 170px;
`;

const Title = styled.h1`
  color: #fff;
  width: 280px;
`;

const HeaderWrapper = () => {
  const user = useSelector((state) => state.user);
  const users = useSelector((state) => state.users);
  const roomId = getId();
  const path = location.pathname.split("/");

  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(async () => {
    if (!roomId) {
      navigate("/");
      dispatch(clearUserData());
      dispatch(clearUsersData());
    }
  }, [roomId, path]);

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
        <div>
          <Title>Генерация идей</Title>
        </div>
        <div>
          {users.data?.[user.uid]?.name && <ExitButton>Выйти</ExitButton>}
        </div>
      </Row>
    </Header>
  );
};

export default HeaderWrapper;
