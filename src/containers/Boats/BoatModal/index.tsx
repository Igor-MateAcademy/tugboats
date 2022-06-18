import React, { useState, useEffect } from 'react';
import { Modal, Form, Input, Select, Button, Divider } from 'antd';
import { PlusOutlined, CloudUploadOutlined } from '@ant-design/icons';
import * as _ from 'lodash';

import { useStore } from 'stores';

import { Boat, Sailor, Team } from 'models';

interface Props {
  children: React.ReactNode;
  update: () => void;
  boat?: Boat;
  sailors: Sailor[];
  allSailors: Sailor[];
}

const { Item, useForm } = Form;
const { Option } = Select;

const BoatModal: React.FC<Props> = ({ children, update, boat, allSailors }) => {
  const [form] = useForm();
  const { boatsStore, sailorsStore } = useStore();

  const [visible, setVisible] = useState(false);
  const [boatData, setBoatData] = useState<Partial<Boat>>(boat ? { ...boat } : { boatType: 'CARGO' });
  const [sailorsForSelect, setSailorsForSelect] = useState<Sailor[]>([]);
  const [selectedSailors, setSelectedSailors] = useState<Partial<Team>>({});

  const onOpen = () => {
    !visible && form.resetFields();

    setVisible(!visible);
  };

  const init = async () => {
    const _free = await sailorsStore.getFreeSailors();

    if (boat) {
      const _all = [...boat.sailors, ..._free];

      setSailorsForSelect(_all);
      setSelectedSailors({
        mechanic: boat.sailors.find(s => s.sailorType === 'MECHANIC'),
        sailor: boat.sailors.find(s => s.sailorType === 'SAILOR'),
        captain: boat.sailors.find(s => s.sailorType === 'CAPTAIN'),
      });
    } else {
      setSailorsForSelect(_free);
    }
  };

  const infoHandler = (field: keyof Boat, value: string) => {
    setBoatData({
      ...boatData,
      [field]: value,
    });
  };

  const selectHandler = (role: keyof Team, id: number) => {
    const _sailor = getSailorById(id);

    setSelectedSailors({
      ...selectedSailors,
      [role]: _sailor,
    });
  };

  const submit = async () => {
    if (boat) {
      await boatsStore.updateBoat(boat.id, boatData, selectedSailors);
    } else {
      try {
        await boatsStore.createBoat(boatData, selectedSailors);
      } catch (e) {
        console.log(e);
      }
    }

    onOpen();
    await update();
  };

  const getSailorById = (id: number) => {
    const _sailor = allSailors.filter(s => s.id == id);

    return _sailor[0];
  };

  useEffect(() => {
    init();
  }, []);

  return (
    <>
      {React.cloneElement(children as React.ReactElement<any>, {
        onClick: onOpen,
      })}

      <Modal
        visible={visible}
        onCancel={onOpen}
        footer={null}
      >
        <h2>
          Boat
        </h2>

        <Form
          layout="vertical"
          validateTrigger={['onBlur', 'onChange', 'onSubmit']}
          form={form}
          initialValues={boat ? {
            name: boat.name,
            boatType: boat.boatType,
            mechanic: selectedSailors.mechanic?.id,
            sailor: selectedSailors.sailor?.id,
            captain: selectedSailors.captain?.id,
          } : {
            boatType: 'CARGO',
          }}
          onFinish={submit}
        >
          <Item name="name" label="Boat name" rules={[{ required: true, message: 'This field is required' }]}>
            <Input placeholder="Boat name..." onChange={e => {
              infoHandler('name', e.target.value);
            }} />
          </Item>

          <Item name="boatType" label="Boat type" rules={[{ required: true, message: 'This field is required' }]}>
            <Select
              options={[
                {
                  label: 'Cargo',
                  value: 'CARGO',
                },
                {
                  label: 'Vessel',
                  value: 'VESSEL',
                },
                {
                  label: 'Barge',
                  value: 'BARGE',
                },
              ]}
              onSelect={(e: string) => {
                infoHandler('boatType', e);
              }}
            />
          </Item>

          <Divider />

          <Item name="mechanic" label="Mechanic" rules={[{ required: true, message: 'This field is required' }]}>
            <Select onSelect={(id: number) => {
              selectHandler('mechanic', id);
            }}>
              {sailorsForSelect.filter(s => s.sailorType === 'MECHANIC').map(s => (
                <Option key={s.id} value={s.id}>
                  {`${s.firstName} ${s.lastName}`}
                </Option>
              ))}
            </Select>
          </Item>

          <Item name="sailor" label="Sailor" rules={[{ required: true, message: 'This field is required' }]}>
            <Select onSelect={(id: number) => {
              selectHandler('sailor', id);
            }}>
              {sailorsForSelect.filter(s => s.sailorType === 'SAILOR').map(s => (
                <Option key={s.id} value={s.id}>
                  {`${s.firstName} ${s.lastName}`}
                </Option>
              ))}
            </Select>
          </Item>

          <Item name="captain" label="Captain" rules={[{ required: true, message: 'This field is required' }]}>
            <Select onSelect={(id: number) => {
              selectHandler('captain', id);
            }}>
            {sailorsForSelect.filter(s => s.sailorType === 'CAPTAIN').map(s => (
                <Option key={s.id} value={s.id}>
                  {`${s.firstName} ${s.lastName}`}
                </Option>
              ))}
            </Select>
          </Item>

          <Button
            style={{ width: '40%' }}
            htmlType="submit"
            icon={boat ? <CloudUploadOutlined /> : <PlusOutlined />}
          >
            {boat ? 'Save' : 'Create'}
          </Button>
        </Form>
      </Modal>
    </>
  );
};

export default BoatModal;
