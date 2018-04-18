import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import registerServiceWorker from './registerServiceWorker';

ReactDOM.render(React.createElement(App, null), document.getElementById('root')
// TODO: [@NedimMuhamedagic]:
// Add proper checkup to make sure an element
// with id 'root' exists
);
registerServiceWorker();