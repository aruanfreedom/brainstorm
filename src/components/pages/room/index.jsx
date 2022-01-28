import React, { useState, useMemo, useEffect } from "react";
import { Divider, Input, Form, Button, Row, List } from "antd";
import styled from "styled-components";
import { useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import Timer from "../../timer";
import database from "../../../database";
import { DbContext } from "../../Context/db";
import { compareProposition } from "../../../helpers/levenstein";
import ThemeBrainstorm from "../../themeBrainstorm";
import { resetUsersDone } from "../../../helpers/resetUsersDone";

const SpaceVertical = styled.div`
  padding-bottom: 30px;
`;

const Error = styled.h4`
  color: red;
  text-align: center;
  margin-left: 127px;
`;

const Room = () => {
  const dbProps = React.useContext(DbContext);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [resetTime, setResetTime] = useState(false);
  const [form] = Form.useForm();
  const user = useSelector((state) => state.user);
  const users = dbProps?.users;
  const { roomId } = useParams();

  const timeVoute = dbProps?.settings?.timeVoute;
  const sheetNumber = dbProps?.sheetNumber || 0;
  const sheets = dbProps?.sheets;
  const currentSheets = sheets?.[sheetNumber];

  const allReady = users && Object.values(users).every(({ done }) => done);
  const userReady = users?.[user.uid]?.done;

  const ownIdeas = currentSheets
    ? currentSheets.filter((idea) => idea.id === user.uid)
    : [];

  const countIdea = useMemo(() => {
    const currCountIdea = dbProps?.settings?.countIdea - ownIdeas?.length;
    if (ownIdeas && currCountIdea > 0) {
      return currCountIdea;
    }
    return 0;
  }, [dbProps, ownIdeas]);

  const enableMoreIdea = dbProps?.settings?.enableMoreIdea;
  const enableLessIdea = dbProps?.settings?.enableLessIdea;
  const disabledBtnAdd = !enableMoreIdea && countIdea === 0;
  const ignoreCountIdea = enableLessIdea ? false : countIdea > 0;
  const disabledBtnSend =
    ownIdeas?.length === 0 || ignoreCountIdea || userReady;
  const waitOthers = !allReady && userReady;
  const isNextPage = users && sheetNumber === Object.keys(users).length;

  const compareIdeas = (proposition) =>
    sheets &&
    Object.values(sheets).find((ideas) =>
      ideas.find(({ idea }) => compareProposition(proposition, idea))
    );

  const onFinish = ({ idea }) => {
    const findSimilarIdea = compareIdeas(idea);

    if (findSimilarIdea) {
      return setError(
        "Ваша идея совпадает с идеей другого участника. Нужно написать без повторов."
      );
    }

    setError("");
    setResetTime(true);
    setLoading(true);
    form.resetFields();

    const sheet = sheets?.[sheetNumber]?.length
      ? [...dbProps.sheets[sheetNumber]]
      : [];

    database
      .writeData({
        path: `rooms/${roomId}`,
        data: {
          sheets: {
            [sheetNumber]: [...sheet, { id: user.uid, idea }],
          },
          sheetNumber,
        },
      })
      .finally(() => {
        setLoading(false);
        setResetTime(false);
      });
  };

  useEffect(async () => {
    if (isNextPage) {
      await database.writeData({
        path: `rooms/${roomId}`,
        data: { sheetNumber: 0 },
      });

      database.writeData({
        path: `rooms/${roomId}`,
        data: { step: 3 },
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
          setLoading(false);
          setResetTime(false);
        });
    }
  }, [allReady, sheetNumber, users, isNextPage]);

  const sendIdeas = () => {
    setLoading(true);

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
        setLoading(false);
        setResetTime(false);
      });
  };

  return (
    <>
      <Divider>Создание идей</Divider>
      <Row justify="space-between">
        <SpaceVertical>
          Время: <Timer timeVoute={timeVoute} resetTime={resetTime} />
        </SpaceVertical>
        <SpaceVertical>
          <ThemeBrainstorm />
        </SpaceVertical>
        <SpaceVertical>Необходимое количество идей: {countIdea}</SpaceVertical>
      </Row>
      <Row justify="center">
        {waitOthers && <SpaceVertical>Ожидаем участников</SpaceVertical>}
      </Row>
      <div>
        <SpaceVertical>
          <List
            size="small"
            footer={
              <Row justify="center">
                <Button
                  disabled={disabledBtnSend || loading}
                  size="large"
                  type="primary"
                  onClick={sendIdeas}
                >
                  Готово
                </Button>
              </Row>
            }
            bordered
            dataSource={ownIdeas}
            renderItem={(item) => <List.Item>{item.idea}</List.Item>}
          />
        </SpaceVertical>
      </div>
      <div>
        <Form
          name="room"
          form={form}
          labelCol={{ span: 6 }}
          wrapperCol={{ span: 16 }}
          onFinish={onFinish}
          autoComplete="off"
        >
          <Form.Item
            label="Идея"
            name="idea"
            rules={[
              {
                required: true,
                message: "Это поле обязательна",
              },
            ]}
          >
            <Input.TextArea size="large" placeholder="Напишите идею" />
          </Form.Item>

          <Error>{error}</Error>

          <Form.Item wrapperCol={{ offset: 6, span: 16 }}>
            <Button
              disabled={disabledBtnAdd || loading}
              size="large"
              type="primary"
              htmlType="submit"
              block
            >
              Добавить идею
            </Button>
          </Form.Item>
        </Form>
      </div>
    </>
  );
};

export default Room;
