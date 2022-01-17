import React, { useEffect, useState, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { Button, Input, Col, Row, Divider } from "antd";
import { useNavigate } from "react-router-dom";
import database from "../../../database";
import { addMember } from "../../../store/user";
import styled from "styled-components";

const SpaceVertical = styled.div`
  padding-bottom: 30px;
`;

const RoomWait = () => {
  const user = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const [users, setUsers] = useState([]);
  const [start, setStart] = useState(false);
  const { roomId } = useParams();
  const navigate = useNavigate();
  const isAdmin = user.uid === roomId;
  const userCount = users ? Object.keys(users).length : 0;
  const inputCopy = useRef(null);

  const onStart = () => {
    database.writeData({
      path: `rooms/${roomId}`,
      data: { start: true },
    });
  };

  const updatedData = (newData) => {
    setUsers(newData.users);
    setStart(newData.start);
  };

  useEffect(() => {
    database.listenerData({ path: `rooms/${roomId}`, updatedData });
  }, []);

  useEffect(() => {
    if (start) {
      navigate("/room", { replace: true });
    }
  }, [start]);

  useEffect(() => {
    if (!isAdmin) {
      database
        .writeData({
          path: `rooms/${roomId}`,
          data: {
            users: {
              [user.uid]: {
                id: user.uid,
              },
            },
          },
        })
        .then(() => {
          dispatch(addMember());
        });
    }
  }, [isAdmin]);

  const copyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    if (inputCopy?.current) {
      inputCopy.current.select();
    }
  };

  return (
    <>
      <Divider>Ожидаем участников</Divider>
      <SpaceVertical>
        <Row justify="center">
          <Col span={8}>
            <Input ref={inputCopy} readOnly value={window.location.href} />
          </Col>
          <Col span={4}>
            <Button type="primary" onClick={copyLink}>
              Скопировать ссылку
            </Button>
          </Col>
        </Row>
      </SpaceVertical>
      <SpaceVertical>
        <Row justify="center">
          Количество подключенных: {users ? Object.keys(users).length : 0}
        </Row>
      </SpaceVertical>
      <div>
        <Row justify="center">
          {isAdmin ? (
            <Button disabled={!userCount} type="primary" onClick={onStart}>
              Начать
            </Button>
          ) : null}
        </Row>
      </div>
    </>
  );
};

export default RoomWait;
