import React, { useEffect, useState } from "react";
import { Divider, Input, Form, Button, Row } from "antd";
import styled from "styled-components";
import { useSelector } from "react-redux";
import { useParams, useNavigate } from "react-router-dom";
import Timer from "../../timer";
import database from "../../../database";
import { DbContext } from "../../Context/db";

const SpaceVertical = styled.div`
  padding-bottom: 30px;
`;

const Room = () => {
  const dbProps = React.useContext(DbContext);
  const [newIdea, setNewIdea] = useState(null);
  const [loading, setLoading] = useState(false);
  const [resetTime, setResetTime] = useState(false);
  const [form] = Form.useForm();
  const user = useSelector((state) => state.user);
  const users = useSelector((state) => state.users);
  const { roomId } = useParams();
  const navigate = useNavigate();

  const timeVoute = dbProps?.settings?.timeVoute;
  const ideas = dbProps?.users?.[user.uid]?.ideas;
  const countIdea = ideas
    ? dbProps?.settings?.countIdea - ideas.length
    : dbProps?.settings?.countIdea;

  const getOwn = (user, ideas, title, idea) => ({
    [user.uid]: {
      ideas: [...ideas, { title, idea, readers: {}, raiting: 0 }],
    },
  });

  const getOther = (newIdea, title, idea) => ({
    [newIdea.id]: {
      ideas: newIdea.ideas.map((newIdea) => {
        if (newIdea.title === title) {
          return {
            title,
            idea,
            readers: { ...newIdea.readers, [user.uid]: true },
          };
        }
        return newIdea;
      }),
    },
  });

  const onFinish = ({ title, idea }) => {
    const isOwn = countIdea !== 0;

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

  useEffect(() => {
    if (users.loaded && countIdea === 0) {
      const result = Object.values(users.data).find((value) => {
        const allReaded = value.ideas.find(
          (idea) =>
            Object.keys(idea.readers)?.length !==
            Object.keys(users.data).length - 1
        );

        return allReaded;
      });
      if (!result) {
        navigate(`/rating/${roomId}`);
      }
    }
  }, [users, countIdea]);

  useEffect(() => {
    if (users.loaded && countIdea === 0) {
      Object.values(users.data).find((value) => {
        if (user.uid !== value.id) {
          const foundIdea = value.ideas.find(
            (idea) => !idea.readers?.[user.uid]
          );

          if (foundIdea) {
            form.setFieldsValue({
              title: foundIdea.title,
              idea: foundIdea.idea,
            });
            setNewIdea(value);
          }
        }
      });
    }
  }, [countIdea, users, form, newIdea, setNewIdea]);

  return (
    <>
      <Divider>Создание идей</Divider>
      <Row justify="space-between">
        <SpaceVertical>
          Время: <Timer timeVoute={timeVoute} resetTime={resetTime} />
        </SpaceVertical>
        <SpaceVertical>Необходимое количество идей: {countIdea}</SpaceVertical>
      </Row>
      <Row justify="center">
        {newIdea && (
          <SpaceVertical>
            Идея от{" "}
            <strong>
              {newIdea.name} {newIdea.lastName}
            </strong>
          </SpaceVertical>
        )}
        {countIdea === 0 && !newIdea && (
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
            label="Название"
            name="title"
            rules={[
              {
                required: true,
                message: "Это поле обязательна",
              },
            ]}
          >
            <Input
              disabled={newIdea}
              size="large"
              placeholder="Введите название"
            />
          </Form.Item>

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
