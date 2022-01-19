import React, { useState, useEffect } from "react";
import { Modal, Button, Form, Input, Row } from "antd";
import { useSelector } from "react-redux";
import database from "../../database";
import { useParams } from "react-router-dom";

const userModal = () => {
  const [visible, setVisible] = useState(false);
  const [confirmLoading, setConfirmLoading] = useState(false);
  const user = useSelector((state) => state.user);
  const users = useSelector((state) => state.users);
  const { roomId } = useParams();

  const onFinish = ({ name, lastName }) => {
    setConfirmLoading(true);

    database
      .writeData({
        path: `rooms/${roomId}`,
        data: {
          users: {
            [user.uid]: {
              name,
              lastName,
              done: false,
              avatarId: Math.random(),
            },
          },
        },
      })
      .finally(() => {
        setConfirmLoading(false);
        setVisible(false);
      });
  };

  useEffect(() => {
    if (!users.loaded) return;

    if (users.data?.[user.uid]?.name === "") {
      setVisible(true);
    }
  }, [user, users]);

  return (
    <Modal title="Авторизация" visible={visible} footer={[]}>
      <Form
        name="basic"
        initialValues={{
          remember: true,
        }}
        labelCol={{ span: 6 }}
        wrapperCol={{ span: 16 }}
        onFinish={onFinish}
        autoComplete="off"
      >
        <Form.Item
          label="Имя"
          name="name"
          rules={[
            {
              required: true,
              message: "Это поле обязательна",
            },
          ]}
        >
          <Input size="large" placeholder="Введите имя" />
        </Form.Item>

        <Form.Item
          label="Фамилия"
          name="lastName"
          rules={[
            {
              required: true,
              message: "Это поле обязательна",
            },
          ]}
        >
          <Input size="large" placeholder="Введите фамилию" />
        </Form.Item>

        <Row justify="center">
          <Form.Item>
            <Button
              disabled={confirmLoading}
              size="large"
              type="primary"
              htmlType="submit"
            >
              Подтвердить
            </Button>
          </Form.Item>
        </Row>
      </Form>
    </Modal>
  );
};

export default userModal;
