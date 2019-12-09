import React, { Component, Fragment } from 'react';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import 'antd/dist/antd.css';
import { GlobalStyle } from './style.js';
import { IconFontStyle } from './statics/iconfont/iconfont';
import Home from './view/home/index';
import Project from './view/project/index';

class App extends Component {
  render() {
    return (
      <Fragment>
        <GlobalStyle/>
        <IconFontStyle/>
        <Router>
          <Route path='/' exact component={Home}></Route>
          <Route path='/project' exact component={Project}></Route>
        </Router>
        {/*<Home/>*/}
      </Fragment>
    );
  }
}

export default App;
