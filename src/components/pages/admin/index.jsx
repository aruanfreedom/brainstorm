import React, { useState } from "react";
import {
  Button,
  InputNumber,
  Input,
  Form,
  Switch,
  Divider,
  Row,
  Col,
} from "antd";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import database from "../../../database";
import { addSettings } from "../../../store/user";

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
        path: `rooms/${user.uid}`,
        data: {
          settings: formData,
          adminId: user.uid,
        },
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
          <Col span={10}>
            <Form
              name="basic"
              layout="vertical"
              initialValues={{
                titleBrainstrom: "",
                timeVoute: 1,
                countIdea: 1,
                countRaiting: 1,
                enableMoreIdea: false,
                enableLessIdea: false,
                enableMoreRaiting: false,
              }}
              onFinish={onFinish}
              autoComplete="off"
            >
              <Form.Item
                label="Тема мозгового штурма"
                name="titleBrainstrom"
                rules={[
                  {
                    required: true,
                    message: "Это поле обязательна",
                  },
                ]}
                wrapperCol={{ span: 20 }}
              >
                <Input
                  size="large"
                  placeholder="Введите тему мозгового шторма"
                />
              </Form.Item>

              <Form.Item
                label="Время голосования (в минутах)"
                name="timeVoute"
                rules={[
                  {
                    required: true,
                    message: "Это поле обязательна",
                  },
                ]}
              >
                <InputNumber
                  type="number"
                  size="large"
                  min={1}
                  max={60}
                  defaultValue={1}
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
                <InputNumber
                  size="large"
                  min={1}
                  max={20}
                  defaultValue={1}
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
                <InputNumber
                  size="large"
                  min={1}
                  max={15}
                  defaultValue={1}
                  placeholder="Введите количество оценок"
                />
              </Form.Item>

              <Form.Item label="Разрешить меньше идей" name="enableMoreIdea">
                <Switch />
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

              <Row justify="center">
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
              </Row>
            </Form>
          </Col>
        </Row>
      </FormWrapper>
    </>
  );
};

export default Admin;
