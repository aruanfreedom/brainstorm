import React, { useState, useMemo, useEffect } from "react";
import { Divider, Input, Form, Button, Row, List } from "antd";
import styled from "styled-components";
import { useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import Timer from "../../timer";
import database from "../../../database";
import { DbContext } from "../../Context/db";
// import { compareProposition } from "../../../helpers/levenstein";
import ThemeBrainstorm from "../../themeBrainstorm";

const SpaceVertical = styled.div`
  padding-bottom: 30px;
`;

const Error = styled.h4`
  color: red;
  text-align: center;
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
  // const values = form.getFieldsValue();

  const timeVoute = dbProps?.settings?.timeVoute;
  const sheetNumber = dbProps?.sheetNumber || 0;
  const currentSheets = dbProps?.sheets?.[sheetNumber];
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
  const disabledBtnAdd = !enableLessIdea && !enableMoreIdea && countIdea === 0;
  const disabledBtnSend = countIdea > 0 || userReady;
  const waitOthers = countIdea === 0 && !allReady && userReady;

  // const compareIdeas = (proposition, key) =>
  //   Object.values(users.data).find(({ ideas, id }) => {
  //     if (id !== user.uid) {
  //       return ideas.find((ideaProps) =>
  //         compareProposition(proposition, ideaProps[key])
  //       );
  //     }
  //   });

  const onFinish = ({ idea }) => {
    // const isOwn = isMyIdea ? isMyIdea : countIdea !== 0;

    // const findSimilarIdea = isOwn && compareIdeas(idea, "idea");

    // if (findSimilarIdea) {
    //   return setError(
    //     "Ваша идея совпадает с идеей другого участника. Нужно написать без повторов."
    //   );
    // }

    setError("");
    setResetTime(true);
    setLoading(true);
    form.resetFields();

    const sheet = dbProps?.sheets?.[sheetNumber]?.length
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
        setLoading(loading);
        setResetTime(false);
      });
  };

  useEffect(() => {
    if (allReady && users && sheetNumber === Object.keys(users).length) {
      database.writeData({
        path: `rooms/${roomId}`,
        data: { step: 3 },
      });
    }
  }, [allReady, sheetNumber, users]);

  useEffect(() => {
    if (allReady) {
      database
        .writeData({
          path: `rooms/${roomId}`,
          data: {
            users: Object.keys(users).reduce((acc, key) => ({
              [key]: { done: false },
            })),
            sheetNumber: sheetNumber + 1,
          },
        })
        .finally(() => {
          setLoading(loading);
          setResetTime(false);
        });
    }
  }, [allReady, sheetNumber, users]);

  // useEffect(() => {
  //   if (users.loaded && countIdea === 0 && !isMyIdea) {
  //     const result = Object.values(users.data).find((value) => {
  //       const allReaded = value.ideas.find(
  //         (idea) =>
  //           Object.keys(idea.readers)?.length !==
  //           Object.keys(users.data).length - 1
  //       );

  //       return allReaded;
  //     });
  //     if (!result) {
  //       navigate(`/rating/${roomId}`);
  //     }
  //   }
  // }, [users, countIdea, isMyIdea]);

  // useEffect(() => {
  //   if (users.loaded && countIdea === 0 && !isMyIdea) {
  //     Object.values(users.data).find((value) => {
  //       if (user.uid !== value.id) {
  //         const foundIdea = value.ideas.find(
  //           (idea) => !idea.readers?.[user.uid]
  //         );

  //         if (foundIdea) {
  //           form.setFieldsValue({
  //             title: foundIdea.title,
  //             idea: foundIdea.idea,
  //           });
  //           setNewIdea(value);
  //         }
  //       }
  //     });
  //   }
  // }, [countIdea, users, form, newIdea, setNewIdea, isMyIdea]);

  const sendIdeas = () => {
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
        setLoading(loading);
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
                  disabled={disabledBtnSend}
                  size="large"
                  type="primary"
                  onClick={sendIdeas}
                >
                  Отправить идей
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
          name="basic"
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
              disabled={disabledBtnAdd}
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
