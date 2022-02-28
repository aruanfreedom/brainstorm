import React from "react";
import { Divider, List, Row, Button, Modal } from "antd";
import styled from "styled-components";
import { useSelector } from "react-redux";
import database from "../../../database";
import { DbContext } from "../../context/db";
import { useDelete } from "../../../hooks/useDelete";
import ThemeBrainstorm from "../../themeBrainstorm";
import { getId } from "../../../helpers/generateId";

const SpaceVertical = styled.div`
  padding-bottom: 30px;
  width: 100%;
`;

const RowWrapper = styled.div`
  width: 100%;
`;

const Total = () => {
  const dbProps = React.useContext(DbContext);
  const roomId = getId();
  const user = useSelector((state) => state.user);
  const { deleteAll } = useDelete();
  const isAdmin = user.uid === roomId;
  const ideas = dbProps?.sheets ? Object.values(dbProps.sheets).flat() : [];

  const onOk = async () => {
    await database.writeData({ path: `rooms/${roomId}`, data: { step: 0 } });
    deleteAll();
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
      ideas.map((item) => [item.idea, item.raiting || 0].join(",")).join("\n");

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "brainstorm.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <>
      <Divider>Итоги голосования</Divider>
      <SpaceVertical>
        <Row justify="space-between">
          <ThemeBrainstorm />
          <div>
            <Button onClick={onExport}>Экспорт</Button>
            {isAdmin && <Button onClick={onComplete}>Завершить</Button>}
          </div>
        </Row>
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
                    <div>{item.idea}</div>{" "}
                    <div>
                      <strong>{item.raiting || 0}</strong>
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
