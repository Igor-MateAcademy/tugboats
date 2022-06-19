import React, { useState } from 'react';
import { Modal, Form, Input, Select, Button } from 'antd';
import { CloudUploadOutlined, PlusOutlined } from '@ant-design/icons';

import { useStore } from 'stores';

import { Sailor } from 'models';

interface Props {
  children: React.ReactNode;
  sailor?: Sailor;
  update: () => void;
  isComplected?: boolean;
}

const { Item, useForm } = Form;

const SailorModal: React.FC<Props> = ({ children, sailor, update, isComplected }) => {
  const { sailorsStore } = useStore();
  const [form] = useForm();

  const [visible, setVisible] = useState(false);
  const [sailorData, setSailorData] = useState<Partial<Sailor>>(sailor ? { ...sailor } : { sailorType: 'SAILOR' });

  const onOpen = () => {
    !visible && form.resetFields();

    setVisible(!visible);
  };

  const inputHandler = (field: keyof Sailor, value: string) => {
    setSailorData({
      ...sailorData,
      [field]: value,
    });
  };

  const submit = async () => {
    if (sailor) {
      try {
        await sailorsStore.updateSailor(sailor.id, sailorData);
      } catch (e) {
        console.log(e);
      }
    } else {
      try {
        await sailorsStore.createSailor(sailorData);
      } catch (e) {
        console.log(e);
      }
    }

    onOpen();
    await update();
  };

  return (
    <>
      {React.cloneElement(children as React.ReactElement<any>, {
        onClick: onOpen,
      })}

      <Modal visible={visible} onCancel={onOpen} footer={null}>
        <h2>
          Sailor
        </h2>

        <Form
          form={form}
          layout="vertical"
          onFinish={submit}
          validateTrigger={['onSubmit', 'onBlur', 'onChange']}
          initialValues={sailor ? { ...sailor } : { sailorType: 'SAILOR' }}
        >
          <Item name="firstName" label="First Name" rules={[{ required: true, message: 'This field is required' }]}>
            <Input placeholder="First name" onChange={e => {
              inputHandler('firstName', e.target.value);
            }} disabled={isComplected} />
          </Item>

          <Item name="lastName" label="Last Name" rules={[{ required: true, message: 'This field is required' }]}>
            <Input placeholder="Last name" onChange={e => {
              inputHandler('lastName', e.target.value);
            }} disabled={isComplected} />
          </Item>

          <Item name="sailorType" label="Role" rules={[{ required: true, message: 'This field is required' }]}>
            <Select options={[
              {
                label: 'Captain',
                value: 'CAPTAIN',
              },
              {
                label: 'Mechanic',
                value: 'MECHANIC',
              },
              {
                label: 'Sailor',
                value: 'SAILOR',
              },
            ]}
              onSelect={(e: string) => {
                inputHandler('sailorType', e);
              }}
              disabled={isComplected}
            />
          </Item>

          {!isComplected && (
            <Button
              htmlType="submit"
              icon={sailor ? <CloudUploadOutlined /> : <PlusOutlined />}
              size="large"
              style={{ width: '40%' }}
            >
              {sailor ? 'Save' : 'Create'}
            </Button>
          )}
        </Form>
      </Modal>
    </>
  );
};

export default SailorModal;
