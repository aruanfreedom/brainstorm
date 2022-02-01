import React from "react";
import { Button, Modal } from "antd";
import styled from "styled-components";
import { useSelector } from "react-redux";

import database from "../../database";
import { useDelete } from "../../hooks/useDelete";

const Exit = styled(Button)`
  margin-top: 15px;
`;

const getIdeas = (sheets, id) =>
  sheets
    ? Object.values(sheets)
        .flat()
        .filter((idea) => id === idea.id)
    : [];

const ExitButton = () => {
  const user = useSelector((state) => state.user);
  const users = useSelector((state) => state.users);
  const sheets = useSelector((state) => state.lists.sheets);
  const sheetNumber = useSelector((state) => state.lists.sheets?.sheetNumber);
  const { deleteUser } = useDelete();

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

    if (!users.adminId) return null;

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

  return <Exit onClick={onExit}>Выйти</Exit>;
};

export default ExitButton;
