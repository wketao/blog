import React, { Component } from 'react';
import { HomeWrapper, BoardWrapper } from './style';
import BoardLiItem from '../../components/homeBoardItem';
import AddBoardItem from '../../components/addBoardItem';

class Home extends Component {
  constructor(props) {
    super(props);
    this.state = {
      addProject: {
        visible: true
      }
    };
  }

  render() {
    return (
      <HomeWrapper>
        <BoardWrapper>
          <div className="header">我的看板</div>
          <ul className="list">
            <BoardLiItem></BoardLiItem>
            <BoardLiItem></BoardLiItem>
          </ul>
        </BoardWrapper>
        <AddBoardItem/>
      </HomeWrapper>
    );
  }
}

export default Home;
