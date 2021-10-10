/*
 * @Descripttion: 
 * @version: 
 * @Author: pym
 * @Date: 2021-10-05 16:56:10
 * @LastEditors: pym
 * @LastEditTime: 2021-10-10 17:49:13
 */
import { Row, Col, Breadcrumb } from 'antd'
import { history } from 'umi'
import styles from './index.less'
import { useState } from 'react'

const Manage: React.FC = (props: any)=> {
  console.log(props)
  const [current, setCurrent] = useState('cssManage')

  const clickMenu = (key: string) => {
    setCurrent(key)
    history.push(`/index/detail/${props.match.params.id}/${key}`)
  }

  return (
    <Row className={styles.manageContent}>
      <Col span={3}  className={styles.manageLeft}>
        <ul className={styles.list}>
          <li className={props.location.pathname.includes('cssManage') ? styles.active:''} onClick={()=>clickMenu('cssManage')}>CSS管理</li>
          <li className={props.location.pathname.includes('pratiseManage') ?styles.active:''} onClick={()=>clickMenu('pratiseManage')}>练习管理</li>
        </ul>
      </Col>
      <Col span={21} className={styles.manageRight}>
        <Breadcrumb>
          <Breadcrumb.Item onClick={()=>history.push('/index')}>首页</Breadcrumb.Item>
          <Breadcrumb.Item onClick={()=>history.push('/index/manage')}>面试列表</Breadcrumb.Item>
          <Breadcrumb.Item>面试详情</Breadcrumb.Item>
        </Breadcrumb>
        <div className={styles.mainContent}>
         { props.children }
        </div>
      </Col>
    </Row>
  )
}

export default Manage