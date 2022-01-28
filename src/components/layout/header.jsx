import React from "react";
import { Layout, Button, Row, Modal } from "antd";
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
  const sheets = useSelector((state) => state.lists.sheets);
  const sheetNumber = useSelector((state) => state.lists.sheets?.sheetNumber);
  const { deleteUser } = useDelete();

  const getIdeas = (sheets, id) =>
    Object.values(sheets)
      .flat()
      .filter((idea) => id === idea.id);

  const result = [];

  const splitIdeas = () => {
    const ownIdeas = getIdeas(sheets, user.uid);

    const totalCountIdeas = Math.ceil(
      ownIdeas.length / Object.keys(users.data).length
    );

    let halfNumber = 0;

    if (ownIdeas.length) {
      ownIdeas.forEach(() => {
        Object.keys(users.data).forEach((id) => {
          if (id !== user.uid) {
            const halfIdea = [...ownIdeas].splice(halfNumber, totalCountIdeas);

            if (!halfIdea.length) return null;

            const otherIdeas = getIdeas(sheets[sheetNumber], id);

            halfNumber = halfNumber + totalCountIdeas;
            const changedIdIdea = halfIdea.map((idea) => ({ ...idea, id }));
            result.push([...changedIdIdea, ...otherIdeas]);
          }
        });
      });
    }
    return result.flat();
  };

  const exit = async () => {
    const sheetsShuffledIdeas = splitIdeas();
    console.log(sheetsShuffledIdeas);
    if (!users.adminId || !sheetsShuffledIdeas.length) return null;

    await database.writeData({
      path: `rooms/${users.adminId}`,
      data: {
        sheets: { [sheetNumber]: sheetsShuffledIdeas },
      },
    });

    deleteUser();
  };

  const onExit = () => {
    Modal.confirm({
      title: "Подтвердите действие",
      content: "Данные будут распределены по участникам. Вы уверенны?",
      okText: "Да",
      cancelText: "Нет",
      onOk: exit,
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
          {users.data?.[user.uid]?.name && <Exit onClick={onExit}>Выйти</Exit>}
        </div>
      </Row>
    </Header>
  );
};

export default HeaderWrapper;
