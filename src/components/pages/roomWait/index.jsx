import React, { useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { Button, Input, Col, Row, Divider, List } from "antd";
import database from "../../../database";
import { addMember } from "../../../store/user";
import styled from "styled-components";
import UserModal from "../../userModal";

const SpaceVertical = styled.div`
  padding-bottom: 30px;
`;

const RoomWait = () => {
  const user = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const users = useSelector((state) => state.users);
  const { roomId } = useParams();
  const isAdmin = user.uid === roomId;
  const userCount = users.data ? Object.keys(users.data).length : 0;
  const inputCopy = useRef(null);

  const onStart = () => {
    database.writeData({
      path: `rooms/${roomId}`,
      data: { step: 2 },
    });
  };

  useEffect(() => {
    if (!users.loaded) return;

    if (!users.data?.[user.uid]) {
      database
        .writeData({
          path: `rooms/${roomId}`,
          data: {
            users: {
              [user.uid]: {
                id: user.uid,
                name: "",
                lastName: "",
              },
            },
          },
        })
        .then(() => {
          dispatch(addMember());
        });
    }
  }, [user, users]);

  const copyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    if (inputCopy?.current) {
      inputCopy.current.select();
    }
  };

  return (
    <>
      <UserModal />
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
        <Row justify="center">Количество подключенных: {userCount}</Row>
      </SpaceVertical>
      {users.data && (
        <SpaceVertical>
          <Row justify="center">
            <List
              bordered
              dataSource={Object.values(users.data)}
              renderItem={(item) =>
                item.name && (
                  <List.Item>
                    {item.name} {item.lastName}
                  </List.Item>
                )
              }
            />
          </Row>
        </SpaceVertical>
      )}
      <Row justify="center">
        <Col span={10}>
          {isAdmin ? (
            <Button
              disabled={userCount < 2}
              type="primary"
              onClick={onStart}
              size="large"
              block
            >
              Начать
            </Button>
          ) : null}
        </Col>
      </Row>
    </>
  );
};

export default RoomWait;
