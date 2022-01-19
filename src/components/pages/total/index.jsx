import React, { useEffect } from "react";
import { Divider, List, Row, Button, Modal } from "antd";
import styled from "styled-components";
import { useParams, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import database from "../../../database";
import { DbContext } from "../../Context/db";

const SpaceVertical = styled.div`
  padding-bottom: 30px;
  width: 100%;
`;

const RowWrapper = styled.div`
  width: 100%;
`;

const Total = () => {
  const dbProps = React.useContext(DbContext);
  const { roomId } = useParams();
  const navigate = useNavigate();
  const user = useSelector((state) => state.user);
  const isAdmin = user.uid === roomId;

  const getAllIdeas = (users) =>
    users &&
    Object.values(users)
      .map((item) => item.ideas)
      .flat();

  const ideas = getAllIdeas(dbProps?.users);
  const isDelete = dbProps?.delete;

  useEffect(() => {
    if (isDelete) {
      database.deleteData({ path: `rooms/${roomId}` }).then(() => {
        navigate("/");
      });
    }
  }, [isDelete]);

  const onOk = () => {
    database.writeData({ path: `rooms/${roomId}`, data: { delete: true } });
  };

  const onComplete = () => {
    Modal.confirm({
      title: "Подтвердите действие",
      content: "Данные будут удалены навсегда. Вы уверенны?",
      okText: "Да",
      cancelText: "Нет",
      onOk,
    });
  };

  const onExport = () => {
    const csvContent =
      "data:text/csv;charset=utf-8," +
      ideas.map((item) => [item.title, item.idea].join(",")).join("\n");

    const encodedUri = encodeURI(csvContent);
    window.open(encodedUri);
  };

  return (
    <>
      <Divider>Итоги голосования</Divider>
      <SpaceVertical>
        {isAdmin && <Button onClick={onComplete}>Завершить</Button>}
        <Button onClick={onExport}>Экспорт</Button>
      </SpaceVertical>
      <SpaceVertical>
        {ideas && (
          <List
            bordered
            dataSource={ideas}
            renderItem={(item) => (
              <List.Item>
                <RowWrapper>
                  <Row justify="space-between">
                    <div>{item.title}</div>{" "}
                    <div>
                      <strong>{item.raiting}</strong>
                    </div>
                  </Row>
                </RowWrapper>
              </List.Item>
            )}
          />
        )}
      </SpaceVertical>
    </>
  );
};

export default Total;
