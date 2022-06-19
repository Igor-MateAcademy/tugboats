import React, { useState, useEffect } from 'react';
import { observer } from 'mobx-react';
import { PlusOutlined, CloseOutlined, EditOutlined, UserOutlined, PhoneOutlined } from '@ant-design/icons';
import cn from 'classnames';

import { Layout } from 'containers';
import CustomerModal from './CustomerModal';

import { useStore } from 'stores';

import { Customer } from 'models';

import styles from './styles.module.scss';

const Customers: React.FC = () => {
  const { customersStore } = useStore();

  const [customers, setCustomers] = useState<Customer[]>([]);

  const init = async () => {
    try {
      const _customers = await customersStore.getCustomers();

      setCustomers(_customers);
    } catch (e) {
      console.log(e);
    }
  };

  const deleteCustomer = async (id: number) => {
    await customersStore.deleteCustomer(id);

    init();
  };

  useEffect(() => {
    init();
  }, []);

  return (
    <Layout>
      <h2 className={styles.title}>
        Customers
      </h2>

      <ul className={styles.list}>
        <li className={styles.item} key={'new'}>
          <CustomerModal update={init}>
            <button className={cn(styles.button, styles.button_new)}>
              <div>
                <PlusOutlined className={styles.icon} />
              </div>

              <div className={styles.text}>
                Create New Customer
              </div>
            </button>
          </CustomerModal>
        </li>

        {customers.map(item => (
          <li className={styles.item} key={item.id}>
            <div className={styles.button}>
              <CustomerModal customer={item} update={init}>
                <button className={styles.edit}>
                  <EditOutlined className={styles.icon} />
                </button>
              </CustomerModal>

              <button className={styles.delete} onClick={() => {
                deleteCustomer(item.id);
              }}>
                <CloseOutlined className={styles.cross} />
              </button>

              <div className={styles.part}>
                <UserOutlined className={styles.icon} />

                <span className={styles.text}>
                  {`${item.firstName} ${item.lastName}`}
                </span>
              </div>

              <div className={styles.part}>
                <PhoneOutlined className={styles.icon} />

                <span className={styles.text}>
                  {item.phone}
                </span>
              </div>
            </div>
          </li>
        ))}
      </ul>
    </Layout>
  );
};

export default observer(Customers);
