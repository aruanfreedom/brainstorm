import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { Divider, List, Checkbox, Row, Button, Form } from "antd";
import { useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import Timer from "../../timer";
import database from "../../../database";
import { DbContext } from "../../Context/db";
import ThemeBrainstorm from "../../themeBrainstorm";
import { resetUsersDone } from "../../../helpers/resetUsersDone";

const SpaceVertical = styled.div`
  padding-bottom: 30px;
`;

const Rating = () => {
  const dbProps = React.useContext(DbContext);
  const [vote, setVote] = useState(0);
  const [form] = Form.useForm();
  const { roomId } = useParams();
  const [loading, setLoading] = useState(false);
  const [resetTime, setResetTime] = useState(false);
  const user = useSelector((state) => state.user);

  const users = dbProps?.users;
  const timeVoute = dbProps?.settings?.timeVoute || 1;
  const raiting = dbProps?.settings?.countRaiting;
  const enableMoreRaiting = dbProps?.settings?.enableMoreRaiting;
  const sheetNumber = dbProps?.sheetNumber;
  const ideas = dbProps?.sheets?.[sheetNumber];

  const allReady = users && Object.values(users).every(({ done }) => done);
  const userReady = users?.[user.uid]?.done;
  const waitOthers = !allReady && userReady;
  const isNextPage = users && sheetNumber === Object.keys(users).length;

  const disabledBtnSend = !waitOthers && raiting - vote <= 0;
  const disabledCheckboxes =
    waitOthers || (raiting - vote === 0 && enableMoreRaiting === false);

  const onRaiting = (idea, e) => {
    const checkedNumber = e.target.checked ? +1 : -1;

    const findedIdea = ideas.map((item) => {
      if (idea === item.idea) {
        return {
          ...item,
          raiting: item.raiting ? item.raiting + checkedNumber : 1,
        };
      }
      return item;
    });

    setVote((state) =>
      ideas.length <= raiting - vote ? ideas.length : state + checkedNumber
    );

    database.writeData({
      path: `rooms/${roomId}`,
      data: {
        sheets: {
          [sheetNumber]: findedIdea,
        },
      },
    });
  };

  useEffect(() => {
    if (isNextPage) {
      database.writeData({
        path: `rooms/${roomId}`,
        data: { step: 4 },
      });

      return;
    }

    if (allReady) {
      setLoading(true);

      database
        .writeData({
          path: `rooms/${roomId}`,
          data: {
            users: resetUsersDone(users),
            sheetNumber: sheetNumber + 1,
          },
        })
        .finally(() => {
          form.resetFields();
          setLoading(false);
          setResetTime(false);
        });
    }
  }, [allReady, sheetNumber, users]);

  const sendRaiting = () => {
    database
      .writeData({
        path: `rooms/${roomId}`,
        data: {
          users: {
            [user.uid]: {
              done: true,
            },
          },
        },
      })
      .finally(() => {
        setVote(0);
        setLoading(false);
        setResetTime(false);
      });
  };

  return (
    <>
      <Divider>Рэйтинг</Divider>
      <Row justify="space-between">
        <SpaceVertical>
          Время: <Timer timeVoute={timeVoute} resetTime={resetTime} />
        </SpaceVertical>
        <SpaceVertical>
          <ThemeBrainstorm />
        </SpaceVertical>
        <SpaceVertical>
          Очки голосования: {raiting - vote < 0 ? 0 : raiting - vote}
        </SpaceVertical>
      </Row>
      <Row justify="center">
        {waitOthers && <SpaceVertical>Ожидаем участников</SpaceVertical>}
      </Row>
      <Form name="rating" form={form}>
        <List
          bordered
          dataSource={ideas}
          footer={
            <Row justify="center">
              <Button
                disabled={!disabledBtnSend || loading}
                size="large"
                type="primary"
                onClick={sendRaiting}
                block
              >
                Готово
              </Button>
            </Row>
          }
          renderItem={({ idea }) => (
            <List.Item>
              <Form.Item name="idea">
                <Checkbox
                  disabled={disabledCheckboxes}
                  defaultChecked={false}
                  onClick={(e) => onRaiting(idea, e)}
                >
                  {idea}
                </Checkbox>
              </Form.Item>
            </List.Item>
          )}
        />
      </Form>
    </>
  );
};

export default Rating;
