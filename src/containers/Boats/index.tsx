import React, { useState, useEffect } from 'react';
import { observer } from 'mobx-react';
import { PlusOutlined, EditOutlined, CloseOutlined, IdcardOutlined, TeamOutlined } from '@ant-design/icons';
import cn from 'classnames';

import { Layout } from 'containers';
import BoatModal from './BoatModal';

import { useStore } from 'stores';

import { Boat, Sailor } from 'models';

import styles from './styles.module.scss';

const BoatTypes = {
  'CARGO': 'Cargo',
  'VESSEL': 'Vessel',
  'BARGE': 'Barge',
};

const Boats: React.FC = () => {
  const { boatsStore, sailorsStore } = useStore();

  const [boats, setBoats] = useState<Boat[]>([]);
  const [sailors, setSailors] = useState<Sailor[]>([]);
  const [allSailors, setAllSailors] = useState<Sailor[]>([]);

  const init = async () => {
    try {
      const _boats = await boatsStore.getBoats();
      const _sailors = await sailorsStore.getFreeSailors();
      const _allSailors = await sailorsStore.getSailors();

      setBoats(_boats);
      setSailors(_sailors);
      setAllSailors(_allSailors);
    } catch(e) {
      console.log(e);
    }
  };

  const deleteBoat = async (id: number) => {
    await boatsStore.deleteBoat(id);

    init();
  };

  useEffect(() => {
    init();
  }, []);

  return (
    <Layout>
      <h2 className={styles.title}>
        Boats
      </h2>

      <ul className={styles.list}>
        {boats.map(item => (
          <li className={styles.item} key={item.id}>
            <div className={styles.button}>
              <BoatModal boat={item} sailors={sailors} allSailors={allSailors} update={init}>
                <button className={styles.edit}>
                  <EditOutlined className={styles.icon} />
                </button>
              </BoatModal>

              <button className={styles.delete} onClick={() => {
                deleteBoat(item.id);
              }}>
                <CloseOutlined className={styles.cross} />
              </button>

              <div className={styles.name}>
                {item.name}
              </div>

              <div className={styles.role}>
                {BoatTypes[item.boatType]}
              </div>
            </div>
          </li>
        ))}

        <li className={styles.item} key={'new'}>
          <BoatModal sailors={sailors} allSailors={allSailors} update={init}>
            <button className={cn(styles.button, styles.button_new)}>
              <div>
                <PlusOutlined className={styles.icon} />
              </div>

              <div className={styles.text}>
                Create New Boat
              </div>
            </button>
          </BoatModal>
        </li>
      </ul>
    </Layout>
  );
};

export default observer(Boats);
