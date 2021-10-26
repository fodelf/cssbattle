/*
 * @Descripttion:
 * @version:
 * @Author: pym
 * @Date: 2021-10-05 17:08:11
 * @LastEditors: 吴文周
 * @LastEditTime: 2021-10-26 09:16:46
 */
import { useEffect, useState } from 'react';
import { Button, Table, Popconfirm, Modal, message } from 'antd';
import { history } from 'umi';
import {
  getAuditionExerciseList,
  getExerciseList,
  deleteExercise,
  createExerciseByLib,
} from '@/api/manage';
import styles from '../../index.less';

interface DataType {
  key: React.Key;
  name: string;
  age: number;
  address: string;
}

const PratiseManage: React.FC = (props: any) => {
  const columns = [
    {
      title: '面试题名称',
      dataIndex: 'name',
    },
    {
      title: '描述',
      dataIndex: 'describe',
    },
    {
      title: '创建时间',
      dataIndex: 'createTime',
    },
    {
      title: '操作',
      dataIndex: 'action',
      key: 'action',
      render: (text: any, record: any, index: number) => {
        return (
          <>
            <span onClick={() => goToDetail(record)}>编辑</span>
            <Popconfirm
              title="是否确定删除?"
              onConfirm={() => deletePratise(record)}
              okText="确定"
              cancelText="取消"
            >
              <span>删除</span>
            </Popconfirm>
          </>
        );
      },
    },
  ];

  const [pratiseList, setPratiseList] = useState<DataType[]>([]);
  const [exciseVisible, setExciseVisible] = useState(false);
  const [selectedRowKeys, setSelected] = useState<any[]>([]);
  const [allExciseList, setAllExciseList] = useState<any[]>([]);

  useEffect(() => {
    queryExciseList();
    queryAllExcise();
  }, []);

  const addPratise = () => {
    history.push(`/index/detail/${props.match.params.id}/addPratise`);
  };

  const goToDetail = (item: any) => {
    history.push(
      `/index/detail/${props.match.params.id}/addPratise?pratiseId=${item.id}`,
    );
  };

  const deletePratise = (item: any) => {
    deleteExercise({
      id: item.id,
      auditionId: props.match.params.id,
    }).then((res) => {
      message.success('删除成功');
      queryExciseList();
    });
  };

  const queryExciseList = () => {
    getAuditionExerciseList({
      auditionId: props.match.params.id,
    }).then((res) => {
      setPratiseList(res.data.data || []);
    });
  };

  const queryAllExcise = () => {
    getExerciseList().then((res) => {
      setAllExciseList(res.data.data || []);
    });
  };

  const changeSelected = (selectedRowKeys: any, selectedRows: any) => {
    setSelected(selectedRowKeys);
  };

  const submitExcise = () => {
    let params = {
      exerciseIdList: selectedRowKeys,
      auditionId: props.match.params.id,
    };
    createExerciseByLib(params).then((res) => {
      message.success('添加面试成功');
      setExciseVisible(false);
      queryExciseList();
    });
  };

  const rowSelection = {
    selectedRowKeys,
    onChange: changeSelected,
    getCheckboxProps: (record: any) => ({
      disabled: allExciseList.some((item: any) => item.id == record.key),
    }),
  };

  const exciseColumns = [
    {
      title: '面试名称',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: '描述',
      dataIndex: 'describe',
      key: 'describe',
    },
    {
      title: '创建时间',
      dataIndex: 'createTime',
      key: 'createTime',
    },
  ];

  return (
    <div>
      <div className={styles.topBtn}>
        <Button type="primary" onClick={addPratise}>
          自定义面试题
        </Button>
        <Button type="primary" onClick={() => setExciseVisible(true)}>
          从面试题库中选择
        </Button>
      </div>
      <Table
        bordered
        columns={columns}
        dataSource={pratiseList}
        pagination={false}
        locale={{ emptyText: '暂无数据' }}
      />
      <Modal
        title="选择面试题"
        width={800}
        visible={exciseVisible}
        onOk={submitExcise}
        onCancel={() => setExciseVisible(false)}
        okText="确认"
        cancelText="取消"
      >
        <Table
          rowSelection={rowSelection}
          columns={exciseColumns}
          dataSource={allExciseList}
          pagination={false}
          rowKey={(record) => record.id}
          scroll={{ y: 700 }}
          locale={{ emptyText: '暂无数据' }}
        />
      </Modal>
    </div>
  );
};

export default PratiseManage;
