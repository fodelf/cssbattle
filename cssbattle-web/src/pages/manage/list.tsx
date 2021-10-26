/*
 * @Descripttion:
 * @version:
 * @Author: pym
 * @Date: 2021-10-07 10:11:28
 * @LastEditors: pym
 * @LastEditTime: 2021-10-24 11:12:53
 */
import {
  Row,
  Col,
  Button,
  Table,
  Modal,
  Form,
  Input,
  Breadcrumb,
  Popover,
  Popconfirm,
  message,
} from 'antd';
import styles from './index.less';
import { history } from 'umi';
import { getList, createAudition, deleteAudition, refreshAudition } from '@/api/manage';
import { useEffect, useState, useRef } from 'react';

const InterViewList: React.FC = (props: any) => {
  const [auditionList, setAuditionList] = useState([]);
  const [currentType, setCurrentType] = useState(0);
  const [isModalVisible, setModalVisible] = useState(false);

  const auditionRef = useRef(null);
  console.log(location);
  const linkValue = `${location.origin}/index/audition/${props.match.params.id}`;
  const columns = [
    {
      title: '面试名称',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: '创建时间',
      dataIndex: 'createTime',
      key: 'createTime',
    },
    {
      title: '使用次数',
      dataIndex: 'count',
      key: 'count',
    },
    {
      title: '面试状态',
      dataIndex: 'state',
      key: 'state',
      render: (text: any, record: any, index: number) => {
        return (
          <span>{text === 0 ? '未开始' : text === 1 ? '进行中' : '已结束' }</span>
        )
      }
    },
    {
      title: '操作',
      dataIndex: 'action',
      key: 'action',
      render: (text: any, record: any, index: number) => {
        return (
          <>
            <span onClick={() => editAudition(record)}>编辑</span>
            <Popconfirm
              title="是否确定删除?"
              onConfirm={() => deleteAu(record)}
              okText="确定"
              cancelText="取消"
            >
              <span>删除</span>
            </Popconfirm>
            <Popconfirm
              title="是否确定重新使用这个面试?"
              onConfirm={() => resetAudition(record)}
              okText="确定"
              cancelText="取消"
            >
              <span>重置面试</span>
            </Popconfirm>
            <Popover
              content={
                <Input
                  className={styles.shareInput}
                  value={`${location.origin}/index/audition/${record.id}`}
                  addonAfter={
                    <span
                      style={{ cursor: 'pointer' }}
                      onClick={handleInputSelect}
                    >
                      复制
                    </span>
                  }
                  ref={auditionRef}
                  readOnly
                />
              }
              title="分享面试链接"
              trigger="click"
            >
              <span>分享面试</span>
            </Popover>
            <span onClick={() => shareAudition(record)}>进入面试</span>
          </>
        );
      },
    },
  ];

  useEffect(() => {
    queryAuditionList();
  }, []);

  const queryAuditionList = () => {
    getList().then((res) => {
      console.log(res.data.data);
      setAuditionList(res.data.data || []);
    });
  };

  const resetAudition = (item: any)=> {
    refreshAudition({
      id: item.id
    }).then((res) => {
      message.success('重置成功');
      queryAuditionList()
    });
  }

  const deleteAu = (item: any) => {
    deleteAudition({
      id: item.id,
    }).then((res) => {
      message.success('删除成功');
      queryAuditionList()
    });
  };

  const handleInputSelect = () => {
    if (auditionRef !== null) {
      auditionRef.current.input.select();
      document.execCommand('copy');
    }
  };

  const shareAudition = (record: any) => {
    history.push(`/index/audition/${record.id}`);
  };

  const editAudition = (record: any) => {
    history.push(`/index/detail/${record.id}/cssManage`);
  };

  const onFinish = (values: any) => {
    console.log('Success:', values);
    createAudition({ name: values.name, type: currentType }).then((res) => {
      history.push(`/index/detail/${res.data.data.InsertedID}/cssManage`);
    });
  };

  return (
    <Row className={styles.manageContent}>
      <Col span={3} className={styles.manageLeft}>
        <p className={styles.title}>面试合集</p>
        <ul className={styles.list}>
          <li className={currentType === 0 ? styles.active : ''}>前端面试</li>
        </ul>
      </Col>
      <Col span={21} className={styles.manageRight}>
        <Breadcrumb>
          <Breadcrumb.Item onClick={() => history.push('/index')}>
            首页
          </Breadcrumb.Item>
          <Breadcrumb.Item>面试列表</Breadcrumb.Item>
        </Breadcrumb>
        <div className={styles.mainContent}>
          <Button
            type="primary"
            onClick={() => setModalVisible(true)}
            className={styles.topBtn}
          >
            创建面试
          </Button>
          <Table
            bordered
            columns={columns}
            dataSource={auditionList}
            pagination={false}
            locale={{ emptyText: '暂无数据' }}
          />
        </div>
      </Col>
      <Modal
        title="创建面试"
        visible={isModalVisible}
        footer={null}
        onCancel={() => setModalVisible(false)}
      >
        <Form
          name="basic"
          labelCol={{ span: 8 }}
          wrapperCol={{ span: 16 }}
          autoComplete="off"
          onFinish={onFinish}
        >
          <Form.Item
            label="面试名称"
            name="name"
            rules={[{ required: true, message: '请输入面试名称!' }]}
          >
            <Input />
          </Form.Item>
          <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
            <Button type="primary" htmlType="submit">
              确认
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </Row>
  );
};

export default InterViewList;
