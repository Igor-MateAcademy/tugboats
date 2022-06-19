import React, { useState, useEffect } from 'react';
import { observer } from 'mobx-react';
import { Select } from 'antd';
import { PlusOutlined, EditOutlined, CloseOutlined } from '@ant-design/icons';
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
  const [boatBySearch, setBoatBySearch] = useState<Boat | null>(null);

  const init = async () => {
    try {
      const _boats = await boatsStore.getBoats();
      const _sailors = await sailorsStore.getFreeSailors();
      const _allSailors = await sailorsStore.getSailors();

      setBoats(_boats);
      setSailors(_sailors);
      setAllSailors(_allSailors);
    } catch (e) {
      console.log(e);
    }
  };

  const deleteBoat = async (id: number) => {
    await boatsStore.deleteBoat(id);

    init();
  };

  const getBoatBySailorId = async (id: number) => {
    const _boat = await sailorsStore.getBoatBySailorId(id);

    _boat && setBoatBySearch(_boat);
  };

  useEffect(() => {
    init();
  }, []);

  return (
    <Layout>
      <h2 className={styles.title}>
        Boats
      </h2>

      <div className={styles.search}>
        <Select
          onSelect={(id: number) => {
            getBoatBySailorId(id);
          }}
          onClear={() => {
            setBoatBySearch(null);
          }}
          options={[
            ...allSailors.map(s => ({
              label: `${s.firstName} ${s.lastName}`,
              value: s.id,
            }))
          ]}
          filterOption={(value: string, sailor: any) => sailor.label.includes(value)}
          clearIcon={<CloseOutlined />}
          placeholder="Search to Select"
          style={{ width: '40%' }}
          size="large"
          showSearch
          allowClear
        />
      </div>

      <ul className={styles.list}>
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

        {boatBySearch ? (
          <li className={styles.item}>
            <div className={cn(styles.button, !boatBySearch.busy && styles.button_free)}>
              {!boatBySearch.busy && (
                <div className={styles.status}>
                  <span>Free</span>
                </div>
              )}

              <BoatModal boat={boatBySearch} sailors={sailors} allSailors={allSailors} update={init}>
                <button className={styles.edit}>
                  <EditOutlined className={styles.icon} />
                </button>
              </BoatModal>

              <button className={styles.delete} onClick={() => {
                deleteBoat(boatBySearch.id);
              }}>
                <CloseOutlined className={styles.cross} />
              </button>

              <div className={styles.name}>
                {boatBySearch.name}
              </div>

              <div className={styles.role}>
                {BoatTypes[boatBySearch.boatType]}
              </div>
            </div>
          </li>
        ) : (
          <>
            {boats.map(item => (
              <li className={styles.item} key={item.id}>
                <div className={cn(styles.button, !item.busy && styles.button_free)}>
                  {!item.busy && (
                    <div className={styles.status}>
                      <span>Free</span>
                    </div>
                  )}

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
          </>
        )}
      </ul>
    </Layout >
  );
};

export default observer(Boats);
