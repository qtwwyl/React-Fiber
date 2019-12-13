import React, { useEffect, useState } from 'react';
import ReactDOM from 'react-dom';
import { Router, Switch, Route, Redirect } from 'react-router-dom';

import Layout from '@components/Layout/index';
import DashBoard from '@pages/DashBoard/index';
import Agent from '@pages/Agent/index';
import MyCruise from '@pages/MyCruise/index';
import Help from '@pages/Help/index';
import NotFound from '@pages/NotFound/index';

import '@resource/css/base.css';
import '@resource/css/fonts.css';

import history from './history';

import 'core-js/stable';
import 'regenerator-runtime/runtime';

const Root = document.getElementById('Root');

ReactDOM.render(
  <Main/>,
  Root
);

function Main(){
  const [count, setcount] = useState(0);
  const [loading, setLoading] = useState(false);

  useEffect(()=>{
    console.log(`click count: ${count}`)
  },[count])

  useEffect(()=>{
    console.log(`loading: ${loading}`)
  })

  function handleClick(){
    setcount(count+1)
    setLoading(!loading)
  }

  return( 
    <div>
      <p>clicked times: {count}</p>
      <button onClick={handleClick}>click me</button>
    </div>
  )
}
