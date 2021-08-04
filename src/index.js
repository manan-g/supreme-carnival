import React from 'react';
import ReactDOM from 'react-dom';
import App from './Pages/App';
import { StateProvider } from "./Pages/StateProvider";

ReactDOM.render(
  <StateProvider>
    <App />
  </StateProvider>,
  document.getElementById('root')
);
