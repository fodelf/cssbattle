/*
 * @Descripttion: 
 * @version: 
 * @Author: pym
 * @Date: 2021-10-05 17:08:11
 * @LastEditors: pym
 * @LastEditTime: 2021-10-05 17:36:04
 */
import { useState } from 'react'
import { Button, Table } from 'antd'
import { history } from 'umi'

interface DataType {
  key: React.Key;
  name: string;
  age: number;
  address: string;
}

const PratiseManage: React.FC = ()=> {
  const columns = [
    {
      title: 'Name',
      dataIndex: 'name',
      render: (text: string) => <a>{text}</a>,
    },
    {
      title: 'Age',
      dataIndex: 'age',
    },
    {
      title: 'Address',
      dataIndex: 'address',
    },
  ]

  const [pratiseList, setPratiseList] = useState<DataType[]>([])
  const [selectedRowKeys, setSelectedRowKeys] = useState([])

  const changeSelected = (selectedRowKeys: React.Key[], selectedRows: DataType[])=>{
    // setSelectedRowKeys(selectedRowKeys)
  }

  const addPratise = ()=> {
    history.push('/index/manage/addPratise')
  }

  const rowSelection = {
    selectedRowKeys,
    onChange: changeSelected,
  };
  return (
    <div>
      <div>
        <Button type='primary' onClick={addPratise}>自定义习题</Button>
        <Button type='primary'>从习题库中选择</Button>
      </div>
      <Table
        rowSelection={rowSelection}
        columns={columns}
        dataSource={pratiseList}
      />
    </div>
  )
 }

 export default PratiseManage