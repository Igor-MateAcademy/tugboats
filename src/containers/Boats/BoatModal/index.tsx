import React, { useState, useEffect } from 'react';
import { Modal, Form, Input, Select, Button, Divider, Tag } from 'antd';
import { SaveOutlined, PlusOutlined } from '@ant-design/icons';
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

const BoatModal: React.FC<Props> = ({ children, update, boat, sailors, allSailors }) => {
  const [form] = useForm();
  const { boatsStore } = useStore();

  const [visible, setVisible] = useState(false);
  const [team, setTeam] = useState<Team>({
    mechanics: [],
    sailors: [],
    captains: [],
  });
  const [sailorsFiltered, setSailorsFiltered] = useState<Sailor[]>([...sailors]);

  const [boatData, setBoatData] = useState<Partial<Boat>>(boat ? { ...boat } : { boatType: 'CARGO' });

  const onOpen = () => {
    !visible && form.resetFields();

    setVisible(!visible);
  };

  const init = () => {
    if (boat) {
      const fullList = [...sailors, ...boat.sailors];

      setSailorsFiltered(fullList);
      setTeam({
        mechanics: boat.sailors.filter(s => s.sailorType === 'MECHANIC' && s.id).map(s => s.id),
        sailors: boat.sailors.filter(s => s.sailorType === 'SAILOR' && s.id).map(s => s.id),
        captains: boat.sailors.filter(s => s.sailorType === 'CAPTAIN' && s.id).map(s => s.id),
      });
    }
  };

  const infoHandler = (field: keyof Boat, value: string) => {
    setBoatData({
      ...boatData,
      [field]: value,
    });
  };

  const submit = async () => {
    if (boat) {

    } else {
      try {
        boatsStore.createBoat(boatData, team);
      } catch (e) {
        console.log(e);
      }
    }

    onOpen();
    await update();
  };

  const getNameBySailorId = (id: number) => {
    const result = allSailors.find(s => s.id == id);

    return `${result?.firstName} ${result?.lastName}`;
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
            mechanics: team.mechanics,
            sailors: team.sailors,
            captains: team.captains,
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
                  label: 'Velles',
                  value: 'VELLES',
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

          <Item
            name="mechanics"
            label="Mechanics"
            rules={[{ required: true, message: 'Please, select a mechanic' }]}
          >
            <Select
              mode="tags"
              onSelect={(e: number) => {
                setTeam({
                  ...team,
                  mechanics: [...team.mechanics, e],
                });
              }}
              onDeselect={(e: number) => {
                setTeam({
                  ...team,
                  mechanics: team.mechanics.filter(i => i !== e),
                });
              }}
              tagRender={props => {
                const name = getNameBySailorId(props.value);

                return (
                  <Tag
                    closable={props.closable}
                    onClose={props.onClose}
                  >
                    {name}
                  </Tag>
                );
              }}
            >
              {sailors.map(s => s.sailorType === 'MECHANIC' && (
                <Option key={s.id}>
                  {`${s.firstName} ${s.lastName}`}
                </Option>
              ))}
            </Select>
          </Item>

          <Item
            name="sailors"
            label="Sailors"
            rules={[{ required: true, message: 'Please, select a sailor' }]}
          >
            <Select
              mode="tags"
              onSelect={(e: number) => {
                setTeam({
                  ...team,
                  sailors: [...team.sailors, e],
                });
              }}
              onDeselect={(e: number) => {
                setTeam({
                  ...team,
                  sailors: team.sailors.filter(i => i !== e),
                });
              }}
              tagRender={props => {
                const name = getNameBySailorId(props.value);

                return (
                  <Tag
                    closable={props.closable}
                    onClose={props.onClose}
                  >
                    {name}
                  </Tag>
                );
              }}
            >
              {sailorsFiltered.map(s => {
                return (
                  s.sailorType === 'SAILOR' && (
                    <Option key={s.id}>
                      {`${s.firstName} ${s.lastName}`}
                    </Option>
                  )
                );
              })}
            </Select>
          </Item>

          <Item
            name="captains"
            label="Captains"
            rules={[{ required: true, message: 'Please, select a captain' }]}
          >
            <Select
              mode="tags"
              onSelect={(e: number) => {
                setTeam({
                  ...team,
                  captains: [...team.captains, e],
                });
              }}
              onDeselect={(e: number) => {
                setTeam({
                  ...team,
                  captains: team.captains.filter(i => i !== e),
                });
              }}
              tagRender={props => {
                const name = getNameBySailorId(props.value);

                return (
                  <Tag
                    closable={props.closable}
                    onClose={props.onClose}
                  >
                    {name}
                  </Tag>
                );
              }}
            >
              {sailors.map(s => s.sailorType === 'CAPTAIN' && (
                <Option key={s.id}>
                  {`${s.firstName} ${s.lastName}`}
                </Option>
              ))}
            </Select>
          </Item>

          <Button
            htmlType="submit"
            icon={boat ? <SaveOutlined /> : <PlusOutlined />}
          >
            {boat ? 'Save' : 'Create'}
          </Button>
        </Form>
      </Modal>
    </>
  );
};

export default BoatModal;
