import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { Divider, List, Checkbox, Row } from "antd";
import { useSelector } from "react-redux";
import { useParams, useNavigate } from "react-router-dom";
import Timer from "../../timer";
import database from "../../../database";
import { DbContext } from "../../Context/db";

const SpaceVertical = styled.div`
  padding-bottom: 30px;
`;

const Rating = () => {
  const dbProps = React.useContext(DbContext);
  const [vote, setVote] = useState(0);
  const users = useSelector((state) => state.users);
  const { roomId } = useParams();
  const navigate = useNavigate();

  const getAllIdeas = (users) =>
    users &&
    Object.values(users)
      .map((item) => item.ideas)
      .flat();

  const timeVoute = dbProps?.settings?.timeVoute || 1;
  const raiting = dbProps?.settings?.countRaiting;
  const ideas = getAllIdeas(dbProps?.users);

  useEffect(() => {
    if (users.loaded && Object.values(users.data).every((user) => user.done)) {
      navigate(`/total/${roomId}`);
    }
  }, [users]);

  const onRaiting = (item) => {
    const findedIdea = Object.values(users.data).find((user) =>
      user.ideas.find((idea) => idea.title === item.title)
    );
    setVote((state) => state + 1);

    database.writeData({
      path: `rooms/${roomId}`,
      data: {
        users: {
          [findedIdea.id]: {
            done: raiting - (vote + 1) === 0,
            ideas: users.data[findedIdea.id].ideas.map((idea) =>
              idea.title === item.title
                ? { ...idea, raiting: idea.raiting ? idea.raiting + 1 : 1 }
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
          Время: <Timer timeVoute={timeVoute} resetTime={false} />
        </SpaceVertical>
        <SpaceVertical>Очки голосования: {raiting - vote}</SpaceVertical>
      </Row>
      <List
        bordered
        dataSource={ideas}
        renderItem={(item) => (
          <List.Item>
            <Checkbox
              disabled={raiting - vote === 0}
              onClick={() => onRaiting(item)}
            >
              {item.title}
            </Checkbox>
          </List.Item>
        )}
      />
    </>
  );
};

export default Rating;
