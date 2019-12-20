import React, { Component } from 'react';
import { HomeWrapper, BoardWrapper } from './style';
import BoardLiItem from '../../components/homeBoardItem';
import AddBoardItem from '../../components/addBoardItem';

class Home extends Component {
  constructor(props) {
    super(props);
    this.state = {
      boardList: [{
        id: 1,
        name: 'First Board',
        color: 'rgb(75, 191, 107)',
      }],
    };
    this.addBoard = this.addBoard.bind(this);
  }

  render() {
    return (
      <HomeWrapper>
        <BoardWrapper>
          <div className="header">我的看板</div>
          <ul className="list">
            {
              this.state.boardList.map((val) => {
                return (
                  <BoardLiItem item={val} key={val.id}></BoardLiItem>
                );
              })
            }
          </ul>
        </BoardWrapper>
        <AddBoardItem onSubmit={this.addBoard}/>
      </HomeWrapper>
    );
  }

  addBoard(itemVal) {
    this.setState((state) => {
      return {
        boardList: [...state.boardList, itemVal]
      };
    }, () => {
      console.log(this.state.boardList);
    });
  }
}

export default Home;
