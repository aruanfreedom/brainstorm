import React, { useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { Button, Input, Col, Row, Divider, List } from "antd";
import { useNavigate } from "react-router-dom";
import database from "../../../database";
import { addMember } from "../../../store/user";
import styled from "styled-components";
import UserModal from "../../userModal";
import { DbContext } from "../../Context/db";

const SpaceVertical = styled.div`
  padding-bottom: 30px;
`;

const RoomWait = () => {
  const dbProps = React.useContext(DbContext);
  const user = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const users = useSelector((state) => state.users);
  const { roomId } = useParams();
  const navigate = useNavigate();
  const isAdmin = user.uid === roomId;
  const userCount = users.data ? Object.keys(users.data).length : 0;
  const inputCopy = useRef(null);

  const onStart = () => {
    database.writeData({
      path: `rooms/${roomId}`,
      data: { start: true },
    });
  };

  useEffect(() => {
    if (dbProps?.start) {
      navigate(`/room/${roomId}`, { replace: true });
    }
  }, [dbProps]);

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
                ideas: [],
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
              renderItem={(item) => (
                <List.Item>
                  {item.name} {item.lastName}
                </List.Item>
              )}
            />
          </Row>
        </SpaceVertical>
      )}
      <div>
        <Row justify="center">
          {isAdmin ? (
            <Button disabled={userCount < 2} type="primary" onClick={onStart}>
              Начать
            </Button>
          ) : null}
        </Row>
      </div>
    </>
  );
};

export default RoomWait;
