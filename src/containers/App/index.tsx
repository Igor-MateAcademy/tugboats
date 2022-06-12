import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import { Provider } from 'mobx-react';

import store from 'stores';

import 'sources/styles/styles.scss';
import 'antd/dist/antd.css';

const App: React.FC = () => {
  return (
    <BrowserRouter>
      <Provider {...store}>
        <div>Aboba</div>
      </Provider>
    </BrowserRouter>
  );
}

export default App;
