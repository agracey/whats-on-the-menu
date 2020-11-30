import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';

import { Provider } from 'react-redux'
import store from './store'

// import axios from 'axios'

// axios.get('/api/meals?week=0').then((res)=>{
//   console.log(res.data)
//   store.dispatch({type: 'LIST_LOAD', payload: res.data})
// })


const socketProtocol = (window.location.protocol === 'https:' ? 'wss:' : 'ws:')
const socketUrl = socketProtocol + '//' + window.location.hostname+':3081'+ '/ws/meals'
const ws = new WebSocket(socketUrl)


ws.onmessage = ({data})=>{
  console.log('msg')
  store.dispatch(JSON.parse(data))
}

ws.onopen = (msg)=>{
  ws.send('init')
}

ReactDOM.render(
  <React.StrictMode>
    <Provider store={store}>
      <App />
    </Provider>
  </React.StrictMode>,
  document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
