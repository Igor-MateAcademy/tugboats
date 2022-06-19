import React, { useState, useEffect } from 'react';
import { Button } from 'antd';
import { LineOutlined, PlusOutlined, CalendarOutlined } from '@ant-design/icons';
import cn from 'classnames';
import moment from 'moment';

import JourneyModal from './JourneyModal';

import { Layout } from 'containers';

import { useStore } from 'stores';

import { Journey } from 'models';

import styles from './styles.module.scss';

const Journeys: React.FC = () => {
  const { journeysStore } = useStore();

  const [journeys, setJourneys] = useState<Journey[]>([]);
  const [inTransit, setInTransit] = useState<Journey[]>([]);

  const init = async () => {
    const _all = await journeysStore.getAllJourneys();
    const _inTransit = await journeysStore.getJourneysInTransit();

    setJourneys(_all);
    setInTransit(_inTransit);
  };

  useEffect(() => {
    init();
  }, []);

  return (
    <Layout>
      <h2 className={styles.title}>
        Journeys
      </h2>

      <JourneyModal update={init}>
        <Button icon={<PlusOutlined />} style={{ marginBottom: '20px' }}>
          Create New Journey
        </Button>
      </JourneyModal>

      <div className={styles.lists}>
        <div className={styles.part}>
          <h3 className={styles.subtitle}>All</h3>

          <ul className={styles.list}>
            {journeys.map(j => {
              console.log(moment(j.startDate).format('DD-MM-YYYY H:mm'), moment(j.startDate).isBefore(moment(), 'hour'));

              return (
                <JourneyModal inTransit={moment(j.startDate).isBefore(moment(), 'hour')} update={init} key={j.id} journey={j}>
                  <button className={styles.button}>
                    <li className={styles.item}>
                      <div className={styles.box}>
                        <span>{j.beginning}</span>

                        <LineOutlined />

                        <span>{j.destination}</span>
                      </div>

                      <div className={styles.box}>
                        <CalendarOutlined />

                        <span>{moment(j.startDate).format('DD-MM-YYYY H:mm')}</span>
                      </div>
                    </li>
                  </button>
                </JourneyModal>
              );
            })}
          </ul>
        </div>

        <div className={styles.part}>
          <h3 className={styles.subtitle}>In transit</h3>

          <ul className={styles.list}>
            {inTransit.map(j => (
              <JourneyModal update={init} key={j.id} journey={j} inTransit={true}>
                <button className={styles.button}>
                  <li className={styles.item}>
                    <div className={styles.box}>
                      <span>{j.beginning}</span>

                      <LineOutlined />

                      <span>{j.destination}</span>
                    </div>

                    <div className={styles.box}>
                      <CalendarOutlined />

                      <span>{moment(j.startDate).format('DD-MM-YYYY H:mm')}</span>
                    </div>
                  </li>
                </button>
              </JourneyModal>
            ))}
          </ul>
        </div>
      </div>
    </Layout>
  );
};

export default Journeys;
