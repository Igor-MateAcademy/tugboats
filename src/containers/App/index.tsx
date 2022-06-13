import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Provider } from 'mobx-react';

import { Sailors, Boats, Journeys, Customers } from 'containers';

import store from 'stores';

import 'sources/styles/styles.scss';
import 'antd/dist/antd.css';

const App: React.FC = () => {
  return (
    <BrowserRouter>
      <Provider {...store}>
        <Routes>
          <Route path="/" element={<Navigate to="sailors" />} />
          <Route path="/sailors" element={<Sailors />} />
          <Route path="/boats" element={<Boats />} />
          <Route path="/customers" element={<Customers />} />
          <Route path="/journey" element={<Journeys />} />
        </Routes>
      </Provider>
    </BrowserRouter>
  );
}

export default App;
