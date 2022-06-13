import React, { useState, useEffect } from 'react';
import { observer } from 'mobx-react';
import { CloseOutlined, EditOutlined, IdcardOutlined, PlusOutlined, TeamOutlined } from '@ant-design/icons';
import cn from 'classnames';

import { Layout } from 'containers';
import SailorModal from './SailorModal';

import { useStore } from 'stores';

import { Sailor } from 'models';

import styles from './styles.module.scss';

const SailorType = {
  'MECHANIC': 'Mechanic',
  'CAPTAIN': 'Captain',
  'SAILOR': 'Sailor',
};

const Sailors: React.FC = () => {
  const { sailorsStore } = useStore();

  const [sailors, setSailors] = useState<Sailor[]>([]);

  const init = async () => {
    try {
      const _sailors = await sailorsStore.getSailors();

      setSailors(_sailors);
    } catch (e) {
      console.log(e);
    }
  };

  const deleteSailor = async (id: number) => {
    await sailorsStore.deleteSailor(id);
    init();
  };

  useEffect(() => {
    init();
  }, []);

  return (
    <Layout>
      <h2 className={styles.title}>
        Sailors
      </h2>

      <ul className={styles.list}>
        {sailors.map(item => (
          <li className={styles.item} key={item.id}>
            <div className={styles.button}>
              <SailorModal sailor={item} update={init}>
                <button className={styles.edit}>
                  <EditOutlined className={styles.icon} />
                </button>
              </SailorModal>

              <button className={styles.delete} onClick={() => {
                deleteSailor(item.id);
              }}>
                <CloseOutlined className={styles.cross} />
              </button>

              <div className={styles.name}>
                <IdcardOutlined className={styles.card} />

                <span>
                  {`${item.firstName} ${item.lastName}`}
                </span>
              </div>

              <div className={styles.role}>
                <TeamOutlined className={styles.team} />

                <span>
                  {SailorType[item.sailorType]}
                </span>
              </div>
            </div>
          </li>
        ))}

        <li className={styles.item} key={'new'}>
          <SailorModal update={init}>
            <button className={cn(styles.button, styles.button_new)}>
              <div>
                <PlusOutlined className={styles.icon} />
              </div>

              <div className={styles.text}>
                Create New Sailor
              </div>
            </button>
          </SailorModal>
        </li>
      </ul>
    </Layout>
  );
};

export default observer(Sailors);
