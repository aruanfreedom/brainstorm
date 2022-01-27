import React, { useState, useMemo } from "react";
import { Divider, Input, Form, Button, Row, Switch } from "antd";
import styled from "styled-components";
import { useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import Timer from "../../timer";
import database from "../../../database";
import { DbContext } from "../../Context/db";
import { compareProposition } from "../../../helpers/levenstein";
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
  const [newIdea, setNewIdea] = useState(null);
  const [loading, setLoading] = useState(false);
  const [isMyIdea, setIsMyIdea] = useState(false);
  const [error, setError] = useState("");
  const [resetTime, setResetTime] = useState(false);
  const [form] = Form.useForm();
  const user = useSelector((state) => state.user);
  const users = useSelector((state) => state.users);
  const { roomId } = useParams();
  const values = form.getFieldsValue();

  const timeVoute = dbProps?.settings?.timeVoute;
  const ideas = dbProps?.users?.[user.uid]?.ideas;

  const countIdea = useMemo(() => {
    const currCountIdea = dbProps?.settings?.countIdea - ideas?.length;
    if (ideas && currCountIdea > 0) {
      return currCountIdea;
    }
    return 0;
  }, [dbProps, ideas]);

  const enableMoreIdea = dbProps?.settings?.enableMoreIdea;
  // const enableLessIdea = dbProps?.settings?.enableLessIdea;

  const getOwn = (user, ideas, idea) => ({
    [user.uid]: {
      ideas: [...ideas, { idea, readers: {}, raiting: 0 }],
    },
  });

  const getOther = (newIdea, idea) => ({
    [newIdea.id]: {
      ideas: newIdea.ideas.map((newIdea) => {
        if (!newIdea.readers[user.uid]) {
          return {
            idea,
            raiting: 0,
            readers: { ...newIdea.readers, [user.uid]: true },
          };
        }
        return newIdea;
      }),
    },
  });

  const compareIdeas = (proposition, key) =>
    Object.values(users.data).find(({ ideas, id }) => {
      if (id !== user.uid) {
        return ideas.find((ideaProps) =>
          compareProposition(proposition, ideaProps[key])
        );
      }
    });

  const onFinish = ({ title, idea }) => {
    const isOwn = isMyIdea ? isMyIdea : countIdea !== 0;

    const findSimilarIdea = isOwn && compareIdeas(idea, "idea");

    if (findSimilarIdea) {
      return setError(
        "Ваша идея совпадает с идеей другого участника. Нужно написать без повторов."
      );
    }

    setError("");
    setResetTime(true);
    setLoading(true);
    form.resetFields();
    database
      .writeData({
        path: `rooms/${roomId}`,
        data: {
          users: isOwn
            ? getOwn(user, ideas, title, idea)
            : getOther(newIdea, title, idea),
        },
      })
      .finally(() => {
        setLoading(loading);
        setResetTime(false);
      });
  };

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

  const addNewIdea = () => {
    setIsMyIdea(!isMyIdea);
    setNewIdea(null);
    setResetTime(true);
    form.resetFields();
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
        {newIdea && values.title && values.idea && (
          <SpaceVertical>
            Идея от{" "}
            <strong>
              {newIdea.name} {newIdea.lastName}
            </strong>
          </SpaceVertical>
        )}
        {countIdea === 0 && !newIdea && !isMyIdea && (
          <SpaceVertical>Ожидаем участников</SpaceVertical>
        )}
      </Row>
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

          <Row justify="center">
            {(newIdea || isMyIdea) && enableMoreIdea && (
              <Form.Item
                labelCol={{ span: 18 }}
                label="Добавить еще идею"
                name="enableMoreIdea"
              >
                <Switch
                  checked={isMyIdea}
                  defaultChecked={isMyIdea}
                  onChange={addNewIdea}
                />
              </Form.Item>
            )}
          </Row>

          {/* <Row justify="center">
            {enableLessIdea && (
              <Form.Item
                labelCol={{ span: 18 }}
                label="Добавить меньше идею"
                name="enableLessIdea"
              >
                <Switch
                  checked={isMyIdea}
                  defaultChecked={isMyIdea}
                  onChange={addNewIdea}
                />
              </Form.Item>
            )}
          </Row> */}

          <Error>{error}</Error>

          <Row justify="center">
            <Form.Item>
              <Button
                disabled={loading}
                size="large"
                type="primary"
                htmlType="submit"
              >
                Подтвердить
              </Button>
            </Form.Item>
          </Row>
        </Form>
      </div>
    </>
  );
};

export default Room;
