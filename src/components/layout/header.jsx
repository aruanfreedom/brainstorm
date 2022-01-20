import React from "react";
import { Layout, Button, Row } from "antd";
import styled from "styled-components";
import { useSelector } from "react-redux";
import database from "../../database";
import { useDelete } from "../../hooks/useDelete";

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

const Exit = styled(Button)`
  margin-top: 15px;
`;

const HeaderWrapper = () => {
  const user = useSelector((state) => state.user);
  const users = useSelector((state) => state.users);
  const { deleteUser } = useDelete();

  const splitIdeas = () => {
    const ideas = users.data[user.uid].ideas;
    const result = {};
    const totalCountIdeas = Math.ceil(
      ideas.length / Object.keys(users.data).length
    );
    let halfNumber = 0;

    if (ideas.length) {
      Object.keys(users.data).forEach((id) => {
        if (id !== user.uid) {
          const value = users.data[id];
          const halfIdea = [...ideas].splice(halfNumber, totalCountIdeas);

          halfNumber = halfNumber + totalCountIdeas;

          result[id] = {
            ideas: [...value.ideas, ...halfIdea],
          };
        }
      });
    }
    return result;
  };

  const exit = () => {
    const usersChangedIdeas = splitIdeas();

    if (!users.adminId) return null;

    database
      .writeData({
        path: `rooms/${users.adminId}`,
        data: { users: usersChangedIdeas },
      })
      .then(() => {
        deleteUser();
      });
  };

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
          {users.start && users.data?.[user.uid]?.name && (
            <Exit onClick={exit}>Выйти</Exit>
          )}
        </div>
      </Row>
    </Header>
  );
};

export default HeaderWrapper;
