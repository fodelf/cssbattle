/*
 * @Descripttion: 
 * @version: 
 * @Author: pym
 * @Date: 2021-10-05 17:07:55
 * @LastEditors: pym
 * @LastEditTime: 2021-10-10 19:58:22
 */
import { Button, Table, Modal, Popconfirm } from 'antd'
import { useEffect, useState } from 'react'
import { getAuditionCssList, createCss, deleteCss } from '@/api/manage'
import styles from '../../index.less' 
import { message } from 'antd'

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
      render: (text: any, record: any, index: number) => {
        return (
          <Popconfirm
            title="是否确定删除?"
            onConfirm={()=>deleteCssAudition(record)}
            okText="确定"
            cancelText="取消"
          >
            <span>删除</span>
          </Popconfirm>
        )
      } 
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

  const deleteCssAudition = (item: any)=> {
    let params = {
      id: item.id,
      auditionId: props.match.params.id
    }
    deleteCss(params).then((res:any) => {
      message.success('删除成功')
      queryCssList()
    })
  }

  const changeSelected = (selectedRowKeys: any, selectedRows: any)=>{
    console.log(selectedRowKeys)
    setSelected(selectedRowKeys)
  }

  const submitImg = ()=> {
    console.log('ffff')
    createCss({
      auditionId: props.match.params.id,
      cssIdList: selectedRowKeys
    }).then((res: any)=> {
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
        locale={{emptyText: '暂无数据'}}
      />
      <Modal title="选择图片" visible={cssVisible} onOk={submitImg} onCancel={()=>setCssVisible(false)} okText="确认" cancelText="取消">
        <Table
          rowSelection={rowSelection}
          columns={cssColumns}
          dataSource={imgList}
          pagination={false}
          scroll={{ y: 400 }}
          locale={{emptyText: '暂无数据'}}
        />
      </Modal>
    </div>
  )
 }

 export default CSSManage