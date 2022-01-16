import React, { useState } from "react";
import { Button, Input, Form, Switch, Divider, Row, Col } from "antd";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import database from "../../../database";
import { addSettings } from "../../../store/user";
import { prepareDataFetch } from "../../../helpers/prepareDataFetch";

const FormWrapper = styled.div`
  margin-top: 50px;
`;

const Admin = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const user = useSelector((state) => state.user);

  const onFinish = (formData) => {
    setLoading(true);

    database
      .writeData({
        path: `admins/${user.uid}`,
        data: prepareDataFetch(formData),
      })
      .then(() => {
        dispatch(addSettings(formData));
        navigate(`roomWait/${user.uid}`);
      })
      .finally(() => setLoading(false));
  };

  return (
    <>
      <Divider>Введите данные для создания комнаты идей</Divider>
      <FormWrapper>
        <Row justify="center">
          <Col span={8}>
            <Form
              name="basic"
              layout="vertical"
              initialValues={{
                remember: true,
              }}
              onFinish={onFinish}
              autoComplete="off"
            >
              <Form.Item
                label="Время голосования"
                name="timeVoute"
                rules={[
                  {
                    required: true,
                    message: "Это поле обязательна",
                  },
                ]}
              >
                <Input
                  type="number"
                  size="large"
                  placeholder="Введите время голосования"
                />
              </Form.Item>

              <Form.Item
                label="Количество идей"
                name="countIdea"
                rules={[
                  {
                    required: true,
                    message: "Это поле обязательна",
                  },
                ]}
              >
                <Input
                  size="large"
                  type="number"
                  placeholder="Введите количество идей"
                />
              </Form.Item>

              <Form.Item
                label="Количество оценок"
                name="countRaiting"
                rules={[
                  {
                    required: true,
                    message: "Это поле обязательна",
                  },
                ]}
              >
                <Input
                  size="large"
                  type="number"
                  placeholder="Введите количество оценок"
                />
              </Form.Item>

              <Form.Item label="Разрешить меньше идей" name="enableMoreIdea">
                <Switch defaultChecked={false} />
              </Form.Item>

              <Form.Item label="Разрешить больше идей" name="enableLessIdea">
                <Switch />
              </Form.Item>

              <Form.Item
                label="Разрешить больше оценок"
                name="enableMoreRaiting"
              >
                <Switch />
              </Form.Item>

              <Form.Item>
                <Button
                  disabled={loading}
                  size="large"
                  type="primary"
                  htmlType="submit"
                >
                  Готово
                </Button>
              </Form.Item>
            </Form>
          </Col>
        </Row>
      </FormWrapper>
    </>
  );
};

export default Admin;
