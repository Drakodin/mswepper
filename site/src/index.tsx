import React from 'react';
import ReactDOM from 'react-dom';
import Board from './components/board/Board';
import './index.css';
import reportWebVitals from './reportWebVitals';

document.addEventListener('contextmenu', (e: any) => e.preventDefault())

ReactDOM.render(
  <React.StrictMode>
    <Board shape={[16, 30]} mines={99} depth={1} revealed={false}/>
  </React.StrictMode>,
  document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
