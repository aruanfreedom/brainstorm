import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { Divider, List, Checkbox, Row } from "antd";
import { useSelector } from "react-redux";
import { useParams, useNavigate } from "react-router-dom";
import Timer from "../../timer";
import useFetchData from "../../../hooks/useFetchData";
import database from "../../../database";

const SpaceVertical = styled.div`
  padding-bottom: 30px;
`;

const Rating = () => {
  const [timeVoute, setTimeVoute] = useState(0);
  const [raiting, setRaiting] = useState(0);
  const [vote, setVote] = useState(0);
  const [ideas, setIdeas] = useState([]);
  const users = useSelector((state) => state.users);
  const { roomId } = useParams();
  const navigate = useNavigate();

  const getAllIdeas = (users) =>
    Object.values(users)
      .map((item) => item.ideas)
      .flat();

  const updateCallback = (data) => {
    const { timeVoute, countRaiting } = data.settings;
    setTimeVoute(timeVoute);
    setRaiting(countRaiting);
    setIdeas(getAllIdeas(data.users));
  };

  useFetchData({ updateCallback });

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
