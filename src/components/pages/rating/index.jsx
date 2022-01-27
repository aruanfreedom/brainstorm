import React, { useState } from "react";
import styled from "styled-components";
import { Divider, List, Checkbox, Row } from "antd";
import { useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import Timer from "../../timer";
import database from "../../../database";
import { DbContext } from "../../Context/db";
import ThemeBrainstorm from "../../themeBrainstorm";

const SpaceVertical = styled.div`
  padding-bottom: 30px;
`;

const Rating = () => {
  const dbProps = React.useContext(DbContext);
  const [vote, setVote] = useState(null);
  const users = useSelector((state) => state.users);
  const { roomId } = useParams();

  const timeVoute = dbProps?.settings?.timeVoute || 1;
  const raiting = dbProps?.settings?.countRaiting;
  const enableMoreRaiting = dbProps?.settings?.enableMoreRaiting;
  const sheetNumber = dbProps?.sheetNumber;
  const ideas = dbProps?.sheets?.[sheetNumber];
  console.log(sheetNumber, ideas);
  const onRaiting = (item, e) => {
    const findedIdea = Object.values(users.data).find((user) =>
      user.ideas.find((idea) => idea.title === item.title)
    );
    const checked = e.target.checked ? +1 : -1;

    setVote((state) => (Number.isInteger(state) ? state + checked : 1));

    database.writeData({
      path: `rooms/${roomId}`,
      data: {
        users: {
          [findedIdea.id]: {
            ideas: users.data[findedIdea.id].ideas.map((idea) =>
              idea.title === item.title
                ? {
                    ...idea,
                    raiting: idea.raiting ? idea.raiting + checked : 1,
                  }
                : idea
            ),
          },
        },
      },
    });
  };

  return (
    <>
      <Divider>Рэйтинг</Divider>
      <Row justify="space-between">
        <SpaceVertical>
          Время: <Timer timeVoute={timeVoute} />
        </SpaceVertical>
        <SpaceVertical>
          <ThemeBrainstorm />
        </SpaceVertical>
        <SpaceVertical>
          Очки голосования: {raiting - vote < 0 ? 0 : raiting - vote}
        </SpaceVertical>
      </Row>
      <List
        bordered
        dataSource={ideas}
        renderItem={(item) => (
          <List.Item>
            <Checkbox
              disabled={raiting - vote === 0 && enableMoreRaiting === false}
              onClick={(e) => onRaiting(item, e)}
            >
              {item.idea}
            </Checkbox>
          </List.Item>
        )}
      />
    </>
  );
};

export default Rating;
