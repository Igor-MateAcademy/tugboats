import React from 'react';

import { Header } from 'containers';

import styles from './styles.module.scss';

interface Props {
  children: React.ReactNode;
}

const Layout: React.FC<Props> = ({ children }) => {
  return (
    <div className={styles.layout}>
      <Header />

      <div className={styles.box}>
        {children}
      </div>
    </div>
  );
};

export default Layout;
