import React, { useState, useEffect } from 'react';
import { Input, Select, Form, Button, Modal, Divider, TimePicker, DatePicker } from 'antd';
import { CloudUploadOutlined, PlusOutlined, DeleteOutlined } from '@ant-design/icons';
import moment from 'moment';

import { useStore } from 'stores';

import { CreateJourney, Customer, Boat, Journey } from 'models';

import styles from './styles.module.scss';

interface Props {
  children: React.ReactNode;
  update: () => void;
  journey?: Journey;
  inTransit?: boolean;
}

const { useForm, Item } = Form;

const JourneyModal: React.FC<Props> = ({ children, update, journey, inTransit }) => {
  const [form] = useForm();
  const { journeysStore, boatsStore, customersStore } = useStore();

  const [open, setOpen] = useState<boolean>(false);
  const [info, setInfo] = useState<Partial<CreateJourney>>(journey ? { ...journey, startDate: moment(journey.startDate), endDate: moment(journey.endDate) } : { cargoType: 'FURNITURE' });
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [freeBoats, setFreeBoats] = useState<Boat[]>([]);

  const onOpen = () => {
    !open && form.resetFields();

    setOpen(!open);
  };

  const submit = async () => {
    if (journey) {
      await journeysStore.updateJourney(journey.id, {
        ...info,
        startDate: moment(info.startDate).seconds(0).format('YYYY-MM-DD H:mm:ss'),
        endDate: moment(info.endDate).seconds(0).format('YYYY-MM-DD H:mm:ss'),
      });
    } else {
      await journeysStore.createJourney({
        ...info,
        startDate: moment(info.startDate).seconds(0).format('YYYY-MM-DD H:mm:ss'),
        endDate: moment(info.endDate).seconds(0).format('YYYY-MM-DD H:mm:ss'),
      });
    }

    onOpen();
    await update();
  };

  const init = async () => {
    const _boats = await boatsStore.getFreeBoats();
    const _customers = await customersStore.getCustomers();

    setFreeBoats(journey ? [..._boats, journey.boat] : [..._boats]);
    setCustomers(_customers);
  };

  const fieldHandler = (field: keyof CreateJourney, value: string | number) => {
    setInfo({
      ...info,
      [field]: value,
    });
  };

  const deleteJourney = async () => {
    journey && await journeysStore.deleteJourney(journey.id);

    onOpen();
    await update();
  };

  useEffect(() => {
    init();
  }, []);

  return (
    <>
      {React.cloneElement(children as React.ReactElement<any>, {
        onClick: onOpen,
      })}

      <Modal footer={null} onCancel={onOpen} visible={open} centered>
        <Form
          layout="vertical"
          onFinish={submit}
          validateTrigger={['onSubmit', 'onChange', 'onBlur']}
          initialValues={journey ? {
            ...info,
            customerId: journey.customer.id,
            boatId: journey.boat.id,
          } : {
            ...info
          }}
          form={form}
        >
          <Item name="customerId" label="Customer" rules={[{ required: true, message: 'This field is required' }]}>
            <Select placeholder="Customer" options={customers.map(c => ({ label: `${c.firstName} ${c.lastName}`, value: c.id }))} onSelect={(e: number) => {
              fieldHandler('customerId', e);
            }} disabled={inTransit} />
          </Item>

          <Item name="boatId" label="Boat" rules={[{ required: true, message: 'This field is required' }]}>
            <Select placeholder="Boat" options={freeBoats.map(b => ({ label: b.name, value: b.id }))} onSelect={(e: number) => {
              fieldHandler('boatId', e);
            }} disabled={inTransit} />
          </Item>

          <Divider />

          <div className={styles.date}>
            <Item label="Date" name="startDate" rules={[{ required: true, message: 'Start field is required' }]}>
              <DatePicker format="DD-MM-YYYY" onChange={e => {
                e && setInfo({
                  ...info,
                  startDate: moment(info.startDate).date(e.date()),
                });
              }} disabled={inTransit} />
            </Item>

            <Item label="Time" name="startDate">
              <TimePicker format="H:mm" onChange={e => {
                e && setInfo({
                  ...info,
                  startDate: moment(info.startDate).hours(e.hours()).minutes(e.minutes()),
                });
              }}
              disabled={inTransit}
              />
            </Item>
          </div>

          <div className={styles.date}>
            <Item label="Date" name="endDate" rules={[{ required: true, message: 'To field is required' }]}>
              <DatePicker format="DD-MM-YYYY" onChange={e => {
                e && setInfo({
                  ...info,
                  endDate: moment(info.endDate).date(e.date()),
                });
              }} disabled={inTransit} />
            </Item>

            <Item label="Time" name="endDate">
              <TimePicker format="H:mm" onChange={e => {
                e && setInfo({
                  ...info,
                  endDate: moment(info.endDate).hours(e.hours()).minutes(e.minutes()),
                });
              }} disabled={inTransit} />
            </Item>
          </div>

          <Divider />

          <Item name="beginning" label="Beginning" rules={[{ required: true, message: 'This field is required' }]}>
            <Input placeholder="From" onChange={e => {
              fieldHandler('beginning', e.target.value);
            }} disabled={inTransit} />
          </Item>

          <Item name="destination" label="Destination" rules={[{ required: true, message: 'This field is required' }]}>
            <Input placeholder="To" onChange={e => {
              fieldHandler('destination', e.target.value);
            }} disabled={inTransit} />
          </Item>

          <Divider />

          <Item name="cargoType" label="Cargo type" rules={[{ required: true, message: 'This field is required' }]}>
            <Select placeholder="Type" options={[
              {
                label: 'Furniture',
                value: 'FURNITURE',
              },
              {
                label: 'Materials',
                value: 'MATERIALS',
              },
              {
                label: 'Cars',
                value: 'CARS',
              },
            ]} onSelect={(e: string) => {
              fieldHandler('cargoType', e);
            }} disabled={inTransit} />
          </Item>

          <Item name="weight" label="Weight" rules={[{ required: true, message: 'This field is required' }]}>
            <Input placeholder="Value" onChange={e => {
              fieldHandler('weight', +e.target.value);
            }} disabled={inTransit} />
          </Item>

          {!inTransit && (
            <>
              <Button htmlType="submit" icon={journey ? <CloudUploadOutlined /> : <PlusOutlined />} style={{ width: '40%' }} size="large">
                {journey ? 'Save' : 'Create'}
              </Button>

              {journey && (
                <Button type="default" size="large" style={{ width: '40%', marginLeft: '20px' }} icon={<DeleteOutlined />} onClick={deleteJourney} danger>
                  Remove
                </Button>
              )}
            </>
          )}
        </Form>
      </Modal>
    </>
  );
};

export default JourneyModal;
