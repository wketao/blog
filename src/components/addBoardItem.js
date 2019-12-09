import React, { Component } from 'react';
import { Icon } from 'antd';
import styled from 'styled-components';

const ShadowWrapper = styled.div`
  width: 100%;
  height: 100%;
  overflow: hidden;
  background-color: rgba(0,0,0,0.75);
  z-index: 10;
  position: fixed;
  top: 0;
  left: 0;
`;

const AddBoardWrapper = styled.div`
  width: 400px;
  display: flex;
  margin: 40px auto;
`;

const BoardLefItem = styled.div`
    box-sizing: border-box;
    height: 96px;
    margin: 0;
    padding: 10px 10px 10px 16px;
    position: relative;
    width: 296px;
    border-radius: 3px;
    background-color: rgb(0, 121, 191);
    
    input{
      width: calc(100% - 18px - 16px);
      background-color: transparent;
      outline: none;
      border: none;
      color: #fff;
      font-size: 16px;
      font-weight: 700;
      line-height: 24px;
      border-radius: 3px;
      transition-property: background-color,border-color,box-shadow;
      transition-duration: 85ms;
      transition-timing-function: ease;
      padding: 2px 5px;
      box-sizing: border-box;
      &::-webkit-input-placeholder{    
       color:hsla(0,0%,100%,.6)
      } 
      &:hover{
        background: hsla(0,0%,100%,.15);
      }
    }
    
    button{
      padding: 0;
      margin: 0;
      border: 0;
      background-color: unset;
      color: #fff;
      height: 20px;
      font-size: 16px;
      line-height: 20px;
      width: 20px;
      cursor: pointer;
      float: right;
      position: relative;
      right: -2px;
      top: -2px;
      z-index: 2;
    }
`;

const BoardRightColorSelect = styled.ul`
  width: calc(100% - 296px - 10px);
  display: flex;
  margin-left: 10px;
  flex-wrap: wrap;
  justify-content: space-between;
  list-style: none;
  
  li{
    height: 28px;
    width: 28px;
    margin-bottom: 6px;
    cursor: pointer;
    position: relative;
    &:hover{
      &:before{
        background: rgba(0,0,0,.15);
        position: absolute;
        bottom: 0;
        content: "";
        display: block;
        left: 0;
        right: 0;
        top: 0;
        border-radius: 3px;
      }
    }
    .iconCheck{
      color: #fff;
      display: block;
      line-height: 28px;
      font-size: 14px;
    }
  }
`;

const ColorSelect = {
  1: 'rgb(0, 121, 191)',
  2: 'rgb(210, 144, 52)',
  3: 'rgb(81, 152, 57)',
  4: 'rgb(176, 70, 50)',
  5: 'rgb(137, 96, 158)',
  6: 'rgb(205, 90, 145)',
  7: 'rgb(75, 191, 107)',
  8: 'rgb(0, 174, 204)',
  9: 'rgb(131, 140, 145)'
};

export const AddProjectBtn = styled.div`
  display: block;
  width: 50px;
  height: 50px;
  border: 1px solid #026aa7;
  background-color: #026aa7;
  position: fixed;
  bottom: 100px;
  right: 50px;
  border-radius: 50%;
  cursor: pointer;
  text-align: center;
  line-height: 50px;
  color: #fff;
  font-size: 18px;
`;

function addBoardWrapper(colorStyle, changeBoardColorStyle, closeShadowWrapper) {
  return (
    <ShadowWrapper onClick={closeShadowWrapper}>
      <AddBoardWrapper onClick={(e) => {
        e.stopPropagation();
      }}>
        <BoardLefItem style={{background: ColorSelect[colorStyle]}}>
          <input type="text" placeholder="添加看板标题"/>
          <button>
            <i className="iconfont icon-guanbi"></i>
          </button>
        </BoardLefItem>
        <BoardRightColorSelect>
          {
            Object.keys(ColorSelect).map(function (key) {
              return (
                <li style={{background: ColorSelect[key]}} key={ColorSelect[key]}
                    onClick={() => {
                      changeBoardColorStyle(key);
                    }}>
                  {key === colorStyle.toString() && <Icon type="check" className="iconCheck"/>}

                </li>
              );
            })
          }

        </BoardRightColorSelect>
      </AddBoardWrapper>
    </ShadowWrapper>
  );
}

class AddBoardItem extends Component {

  constructor(props) {
    super(props);
    this.state = {
      visible: false,
      colorStyle: 1,
    };
    this.showBoardWrapper = this.showBoardWrapper.bind(this);
    this.changeBoardColorStyle = this.changeBoardColorStyle.bind(this);
    this.closeShadowWrapper = this.closeShadowWrapper.bind(this);
  }

  render() {
    return (
      <>
        <AddProjectBtn className='iconfont icon-jia' onClick={this.showBoardWrapper}/>
        {this.state.visible &&
        addBoardWrapper(this.state.colorStyle, this.changeBoardColorStyle, this.closeShadowWrapper)}
      </>
    );
  }

  closeShadowWrapper() {
    this.setState(() => {
      return {
        visible: false
      };
    });
  }


  changeBoardColorStyle(colorStyle) {
    this.setState(() => {
      return {
        colorStyle
      };
    });
  }

  showBoardWrapper() {
    this.setState(() => {
      return {
        visible: true
      };
    });
  }
}

export default AddBoardItem;
