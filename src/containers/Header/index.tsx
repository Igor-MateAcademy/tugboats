import React from 'react';
import { Link } from 'react-router-dom';

import styles from './styles.module.scss';

const Header: React.FC = () => {
  return (
    <header className={styles.header}>
      <h1 className={styles.title}>
        TugBoats
      </h1>

      <ul className={styles.list}>
        <li className={styles.item}>
          <Link to="/sailors">
            Sailors
          </Link>
        </li>

        <li className={styles.item}>
          <Link to="/boats">
            Boats
          </Link>
        </li>

        <li className={styles.item}>
          <Link to="/customers">
            Customers
          </Link>
        </li>

        <li className={styles.item}>
          <Link to="/journey">
            Journey
          </Link>
        </li>
      </ul>
    </header>
  );
};

export default Header;
