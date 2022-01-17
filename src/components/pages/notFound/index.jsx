import React from "react";
import styled from "styled-components";

const NotFoundWrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
  width: 100%;
`;

const NotFound = () => (
  <NotFoundWrapper>
    <span>Страница не найдена</span>
  </NotFoundWrapper>
);

export default NotFound;
