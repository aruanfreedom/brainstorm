import React from "react";
import { Button, Input, Form, Checkbox, Typography } from "antd";

const { Title } = Typography;

const Admin = () => (
  <>
    <Title level={2} className="title">
      Введите данные для создания комнаты идей
    </Title>
    <Form
      name="basic"
      labelCol={{
        span: 8,
      }}
      wrapperCol={{
        span: 8,
      }}
      initialValues={{
        remember: true,
      }}
      //   onFinish={onFinish}
      //   onFinishFailed={onFinishFailed}
      autoComplete="off"
    >
      <Form.Item
        label="Время голосования"
        name="time"
        rules={[
          {
            required: true,
            message: "Please input time!",
          },
        ]}
      >
        <Input />
      </Form.Item>

      <Form.Item
        label="Количество идей"
        name="idea"
        rules={[
          {
            required: true,
            message: "Please input idea!",
          },
        ]}
      >
        <Input />
      </Form.Item>

      <Form.Item
        label="Количество оценок"
        name="raiting"
        rules={[
          {
            required: true,
            message: "Please input raiting!",
          },
        ]}
      >
        <Input />
      </Form.Item>

      <Form.Item
        name="enableMoreIdea"
        wrapperCol={{
          offset: 8,
          span: 8,
        }}
      >
        <Checkbox>Разрешить меньше идей</Checkbox>
      </Form.Item>

      <Form.Item
        name="enableLessIdea"
        wrapperCol={{
          offset: 8,
          span: 8,
        }}
      >
        <Checkbox>Разрешить больше идей</Checkbox>
      </Form.Item>

      <Form.Item
        name="enableMoreRaiting"
        wrapperCol={{
          offset: 8,
          span: 8,
        }}
      >
        <Checkbox>Разрешить больше оценок</Checkbox>
      </Form.Item>

      <Form.Item
        wrapperCol={{
          offset: 8,
          span: 8,
        }}
      >
        <Button type="primary" htmlType="submit">
          Готово
        </Button>
      </Form.Item>
    </Form>
  </>
);

export default Admin;
