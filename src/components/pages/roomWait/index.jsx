import React, { useEffect, useRef, useContext } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Button, Input, Col, Row, Divider, List } from "antd";
import database from "../../../database";
import { addMember } from "../../../store/user";
import styled from "styled-components";
import UserModal from "../../userModal";
import { getId } from "../../../helpers/generateId";
import { DbContext } from "../../context/db";

const SpaceVertical = styled.div`
  padding-bottom: 30px;
`;

const RoomWait = () => {
  const dbProps = useContext(DbContext);
  const user = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const users = useSelector((state) => state.users);
  const roomId = getId();
  const isAdmin = user.uid === dbProps?.adminId;
  const userCount = users.data ? Object.keys(users.data).length : 0;
  const usersHasName = users.data
    ? Object.values(users.data).some(({ name }) => !name)
    : 0;
  const inputCopy = useRef(null);

  const onStart = () => {
    database.writeData({
      path: `rooms/${roomId}`,
      data: { step: 2 },
    });
  };

  useEffect(async () => {
    if (!users.loaded) return;

    if (users.data && Object.keys(users.data).length === 1) {
      await database.writeData({
        path: `rooms/${roomId}`,
        data: {
          adminId: user.uid,
        },
      });
    }

    if (!users.data?.[user.uid]) {
      await database.writeData({
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
      });

      dispatch(addMember());
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
              disabled={userCount < 2 || usersHasName}
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
