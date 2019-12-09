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


function HomeBoardItem(props) {
  return (
    <BoardLiItem>
      <BoardName>BoardName</BoardName>
    </BoardLiItem>
  );
}

export default HomeBoardItem;
