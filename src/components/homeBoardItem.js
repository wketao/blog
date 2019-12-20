import React from 'react';
import styled from 'styled-components';

const BoardLiItem = styled.li`
    width: calc(100% / 4 - 15px);
    margin: 10px 15px 10px 0;
    position: relative;
    box-sizing: border-box;
    border-radius: 2px;
    padding: 8px;
    height: 100px;
    cursor: pointer;
    background-color: rgb(176, 70, 50);
    color: #fff;
`;

const BoardName = styled.div`
  font-size: 18px;
  font-weight: 500;
`;

const ShadowWrapper = styled.div`
  position: absolute;
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
`;


function HomeBoardItem(props) {
  return (
    <BoardLiItem style={{background: props.item.color}}>
      <BoardName>{props.item.name}</BoardName>
      <ShadowWrapper></ShadowWrapper>
    </BoardLiItem>
  );
}

export default HomeBoardItem;
