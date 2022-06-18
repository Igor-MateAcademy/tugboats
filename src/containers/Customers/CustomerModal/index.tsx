import React, { useState } from 'react';
import { Form, Modal, Input, Button } from 'antd';
import { PlusOutlined, CloudUploadOutlined } from '@ant-design/icons';

import { Customer } from 'models';

import { useStore } from 'stores';

interface Props {
  children: React.ReactNode;
  update: () => void;
  customer?: Customer;
}

const { Item, useForm } = Form;

const CustomerModal: React.FC<Props> = ({ children, update, customer }) => {
  const [form] = useForm();
  const { customersStore } = useStore();

  const [open, setOpen] = useState<boolean>(false);
  const [customerData, setCustomerData] = useState<Partial<Customer>>(customer ? { ...customer } : {});

  const onToggle = () => {
    !open && form.resetFields();

    setOpen(!open);
  };

  const inputHandler = (field: keyof Customer, value: string) => {
    setCustomerData({
      ...customerData,
      [field]: value,
    });
  };

  const submit = async () => {
    if (customer) {
      await customersStore.updateCustomer(customer.id, customerData);
    } else {
      await customersStore.createCustomer(customerData);
    }

    onToggle();
    update();
  };

  return (
    <>
      {React.cloneElement(children as React.ReactElement<any>, {
        onClick: onToggle,
      })}
      <Modal visible={open} onCancel={onToggle} footer={null}>
        <Form form={form} layout="vertical" onFinish={submit} validateTrigger={['onBlur', 'onChange', 'onSubmit']} initialValues={ customer ? { ...customer } : {} }>
          <Item name="firstName" label="First name" rules={[
            { required: true, message: 'This field is required' },
          ]}>
            <Input placeholder="First name" onChange={e => {
              inputHandler('firstName', e.target.value);
            }} />
          </Item>

          <Item name="lastName" label="Last name" rules={[
            { required: true, message: 'This field is required' },
          ]}>
            <Input placeholder="Last name" onChange={e => {
              inputHandler('lastName', e.target.value);
            }} />
          </Item>

          <Item name="phone" label="Phone" rules={[
            { required: true, message: 'This field is required' },
            { pattern: /^\+?[0-9]{0,15}$/g, message: 'Incorrect phone number. For example, +380123456789' }
          ]}>
            <Input placeholder="+380563457964" onChange={e => {
              inputHandler('phone', e.target.value);
            }} />
          </Item>

          <Button style={{ width: '40%' }} icon={customer ? <CloudUploadOutlined /> : <PlusOutlined />} htmlType="submit">
            {customer ? 'Save' : 'Create'}
          </Button>
        </Form>
      </Modal>
    </>
  );
};

export default CustomerModal;
