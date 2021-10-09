/*
 * @Descripttion: 
 * @version: 
 * @Author: pym
 * @Date: 2021-10-05 17:07:55
 * @LastEditors: pym
 * @LastEditTime: 2021-10-07 19:27:23
 */
import { Button, Table, Modal } from 'antd'
import { useEffect, useState } from 'react'
import { getAuditionCssList, createCss } from '@/api/manage'
import styles from '../../index.less' 

const CSSManage: React.FC = (props: any)=> {
  const [cssList, setCssList] = useState([])
  const [cssVisible, setCssVisible] = useState(false)
  const [selectedRowKeys, setSelected] = useState<any[]>([])
  const columns = [
    {
      title: '图片',
      dataIndex: 'cssId',
      key:'cssId',
      render: (text: any, record: any, index: number)=> <img className={styles.tableImg} src={`https://cdn.wuwenzhou.com.cn/imgs/${text}%402x.png`} alt=""/>
    },
    {
      title: '创建时间',
      dataIndex: 'createTime',
      key:'createTime'
    },
    {
      title: '操作',
      dataIndex: 'action',
      key: 'action',
      render: (text: any, record: any, index: number) => <span>删除</span>
    },
  ]

  const cssColumns = [
    {
      title: '图片',
      dataIndex: 'cssId',
      key: 'cssId',
      render: (text: any, record: any, index: number)=> <img className={styles.tableImg} src={`https://cdn.wuwenzhou.com.cn/imgs/${text}%402x.png`} alt=""/>
    }
  ]

  let imgList = []
  for(let i=0;i<80;i++) {
    imgList.push({
      cssId: i+1,
      key: `${i+1}`
    })
  }

  useEffect(()=> {
    queryCssList()
  },[])

  const queryCssList = ()=> {
    getAuditionCssList({auditionId: props.match.params.id}).then(res=> {
      setCssList(res.data.data || [])
    })
  }

  const changeSelected = (selectedRowKeys: any, selectedRows: any)=>{
    console.log(selectedRowKeys)
    setSelected(selectedRowKeys)
  }

  const submitImg = ()=> {
    createCss({
      auditionId: props.match.params.id,
      cssIdList: selectedRowKeys
    }).then(res=> {
      setCssVisible(false)
      queryCssList()
    })
  }

  const addImg = ()=> {
    setCssVisible(true)
  }
  
  const rowSelection = {
    selectedRowKeys,
    onChange: changeSelected,
    getCheckboxProps: (record: any) => ({
      disabled: cssList.some((item:any)=>item.cssId == record.key)
    }),
  };

  return (
    <div>
      <div className={styles.topBtn}>
        <Button type='primary'>自定义添加</Button>
        <Button type='primary' onClick={addImg}>从css文件库添加</Button>
      </div>
      <Table
        bordered
        columns={columns}
        dataSource={cssList}
        pagination={false}
      />
      <Modal title="选择图片" visible={cssVisible} onOk={submitImg} onCancel={()=>setCssVisible(false)} okText="确认" cancelText="取消">
        <Table
          rowSelection={rowSelection}
          columns={cssColumns}
          dataSource={imgList}
          pagination={false}
          scroll={{ y: 400 }}
        />
      </Modal>
    </div>
  )
 }

 export default CSSManage