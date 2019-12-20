import React, { Component } from 'react';
import { Icon, Button } from 'antd';
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

const BboardWrapper = styled.div`
  display: flex;
`;

const AddBoardWrapper = styled.div`
  width: 400px;
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


const BtnBboardWrapper = styled.div`
  button{
    background-color: rgb(81, 152, 57);
    border-color: rgb(81, 152, 57);
    &:hover,
    &:focus,
    &:active{
      background-color: rgb(100, 175, 74);
      border-color: rgb(100, 175, 74);
    }
  }
`;

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


function addBoardWrapper(params) {
  return (
    <ShadowWrapper onClick={params.toggleBoardWrapper}>

      <AddBoardWrapper onClick={(e) => {
        e.stopPropagation();
      }}>
        <BboardWrapper>
          <BoardLefItem style={{background: ColorSelect[params.colorStyle]}}>
            <input type="text" placeholder="添加看板标题" value={params.inputValue} onChange={params.inputChange}
                   onKeyUp={params.handleInputKeyUp}/>
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
                        params.changeBoardColorStyle(key);
                      }}>
                    {key === params.colorStyle.toString() && <Icon type="check" className="iconCheck"/>}
                  </li>
                );
              })
            }

          </BoardRightColorSelect>
        </BboardWrapper>
        <BtnBboardWrapper>
          {/*disabled*/}
          <Button type="primary" disabled={!params.inputValue} onClick={() => {
            params.addBoardItem();
          }}>创建看板</Button>
        </BtnBboardWrapper>
      </AddBoardWrapper>

    </ShadowWrapper>
  );
}

class AddBoardItem extends Component {

  constructor(props) {
    super(props);
    this.state = {
      inputValue: '',
      visible: false,
      colorStyle: 1,
    };

    this.toggleBoardWrapper = this.toggleBoardWrapper.bind(this);
    this.inputChange = this.inputChange.bind(this);
    this.changeBoardColorStyle = this.changeBoardColorStyle.bind(this);
    this.handleInputKeyUp = this.handleInputKeyUp.bind(this);
    this.addBoardItem = this.addBoardItem.bind(this);

  }

  render() {
    let componentsParams = {
      inputValue: this.state.inputValue,
      colorStyle: this.state.colorStyle,
      inputChange: this.inputChange,
      changeBoardColorStyle: this.changeBoardColorStyle,
      addBoardItem: this.addBoardItem,
      handleInputKeyUp: this.handleInputKeyUp,
      toggleBoardWrapper: () => {
        this.toggleBoardWrapper(false);
      }
    };
    return (
      <>
        <AddProjectBtn className='iconfont icon-jia' onClick={() => {
          this.toggleBoardWrapper(true);
        }}/>
        {
          this.state.visible &&
          addBoardWrapper(componentsParams)
        }
      </>
    );
  }

  /**
   * 控制看板显示隐藏
   * @param flag
   */
  toggleBoardWrapper(flag) {
    this.setState(() => {
      return {
        visible: flag
      };
    });
  }

  /**
   * 监听input的change事件
   * @param e 事件源
   */
  inputChange(e) {
    let inputValue = e.target.value;
    this.setState(() => {
      return {
        inputValue
      };
    });
  }

  /**
   * 改变新增看板的颜色
   * @param colorStyle
   */
  changeBoardColorStyle(colorStyle) {
    this.setState(() => {
      return {
        colorStyle
      };
    });
  }

  /**
   * 添加看板
   */
  addBoardItem() {
    let inputValue = this.state.inputValue;
    this.props.onSubmit({
      id: Math.ceil(Math.random() * 1000000),
      name: inputValue,
      color: ColorSelect[this.state.colorStyle]
    });
    this.setState(() => {
      return {
        inputValue: '',
        visible: false,
      };
    });
  }

  /**
   * 处理键盘Enter事件
   * @param e
   */
  handleInputKeyUp(e) {
    e.keyCode === 13 && this.addBoardItem();
  }
}

export default AddBoardItem;
