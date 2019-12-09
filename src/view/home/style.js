import styled from 'styled-components';

export const HomeWrapper = styled.div`
  width: 1080px;
  margin: 40px auto;
`;

export const BoardWrapper = styled.div`
  .header{
    font-size: 18px;
    font-weight: 500;
  }
  .list{
    margin-top: 10px;
    display: flex;
    flex-wrap: wrap;
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

