import React, { useState } from 'react';
import { List, Button, Row, Input, Col } from "antd";
import styled from "styled-components";
import { useSelector } from "react-redux";
import PropTypes from "prop-types";
import { EditOutlined, CheckOutlined } from "@ant-design/icons";
import { getId } from "../../../../helpers/generateId";

import database from "../../../../database";

const SpaceVertical = styled.div`
  padding-bottom: 30px;
`;

export const ListsIdea = ({ visible, setResetTime, ownIdeas, sheetNumber, currentSheets }) => {
    const roomId = getId();
    const [editIdea, setEditIdea] = useState('');
    const [newIdea, setNewIdea] = useState('');
    const [loading, setLoading] = useState(false);
    const user = useSelector((state) => state.user);
    const toggleEdit = ({ idea }) => {
        setEditIdea(idea);
    }
    
    const onEdit = ({ idea: currentIdea }) => {
        const ideas = currentSheets.map(item =>
            item.idea === currentIdea ? {...item, idea: newIdea} : item
        );

        setLoading(true);

        database
            .writeData({
                path: `rooms/${roomId}`,
                data: {
                    sheets: {
                        [sheetNumber]: ideas
                    },
                    sheetNumber,
                },
            })
            .finally(() => {
                setLoading(false);
                setResetTime(false);
                setEditIdea('');
            });
    }

    const renderItem = (item) => {
        if (item.idea === editIdea) {
            return (
                <List.Item>
                        <Col span={21}>
                            <Input onChange={e => setNewIdea(e.target.value)} defaultValue={item.idea} />
                        </Col>
                        <Col span={2}>
                            <Button disabled={loading} onClick={() => onEdit(item)}>
                            <CheckOutlined />
                            </Button>
                        </Col>
                </List.Item>
            );
        }
 
        return (
            <List.Item>
                <span>{item.idea}</span> <Button onClick={() => toggleEdit(item)}><EditOutlined /></Button>
            </List.Item>
        )
    }

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
            setResetTime(false);
          });
      };
    
    return (
        <div style={{ display: visible ? "none" : "block" }}>
            <SpaceVertical>
            <List
                size="small"
                footer={
                    <Row justify="center">
                        <Button
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
                renderItem={renderItem}
            />
            </SpaceVertical>
        </div>
    );
}

ListsIdea.propTypes = {
    visible: PropTypes.bool.isRequired,
    setResetTime: PropTypes.func.isRequired,
    ownIdeas: PropTypes.array.isRequired,
    sheetNumber: PropTypes.number.isRequired,
    currentSheets: PropTypes.array.isRequired,
};