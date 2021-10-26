/*
 * @Descripttion: 
 * @version: 
 * @Author: pym
 * @Date: 2021-09-04 18:20:12
 * @LastEditors: pym
 * @LastEditTime: 2021-10-16 16:13:02
 */
import { Menu, Dropdown, Breadcrumb, Button, Avatar } from 'antd';
import { DownOutlined, UserOutlined } from '@ant-design/icons'
import styles from './index.less'
import { Link, history } from 'umi'
const Header: React.FC = () => { 
  const toLogin = ()=> {
    history.push('/index/login')
  }

  const logout = ()=> {
    localStorage.clear()
    history.push('/index/login')
  }

  const breadRoutes = {
    routes: [
      {
        path: '/index', 
        breadcrumbName: 'Css Battle',
      }
    ]
  }


  const menu = (
    <p className="menuContent">
      游戏的目标是编写 HTML/CSS 以尽可能少的代码复制给定的目标图像。<br/>
      在目标页面中，在左侧的编辑器区域开始编码。当您开始输入时，中间的输出区域将开始呈现您的代码。当您确信输出与目标图像匹配时，点击提交按钮以查看您的分数。<br/>
      需要注意的要点：<br/>
      1) 您在编辑器中编写的内容会按原样呈现。我们不做任何改变。这意味着你甚至没有得到 DOCTYPE <br/>
      2) 由于这是“CSS”之战，因此您不能在代码中使用 JavaScript 或图像。事实上，任何外部资产都是不允许的。生成目标图像所需的所有代码只能在给定的编辑器中编写。<br/>
      现在去攀登排行榜吧！
    </p>
  )

  const userMenu = (
    <Menu>
      <Menu.Item onClick={logout}>
         <span>退出登录</span>
      </Menu.Item>
    </Menu>
  )
  
  return (
    <div className={styles.pageHead}>
      <Breadcrumb>
        {
          breadRoutes.routes.map((route,index) => {
            return (
              <Breadcrumb.Item key={index}>
                <Link to={route.path} style={{color: 'rgb(244, 218, 49)'}}>
                  <i className={styles.logoIndex}></i>
                </Link>
              </Breadcrumb.Item>
            )
          })
        }
      </Breadcrumb>
      <div className={styles.headRight}>
        <span className={styles.battleLearn} onClick={()=> {history.push('/index/learn')}}>CSSBattle Learn</span>
        <Dropdown overlay={menu} placement="bottomRight" overlayClassName="dropdownHead" trigger={['click']}> 
          <a className="ant-dropdown-link" onClick={e => e.preventDefault()}>
          怎么玩？ <DownOutlined />
          </a>
        </Dropdown>
        {
          localStorage.getItem('token') ?
          <>
            <Dropdown overlay={userMenu} placement="bottomRight" overlayClassName="dropdownHead" trigger={['click']}> 
              <a className="ant-dropdown-link" onClick={e => e.preventDefault()}>
                <div className={styles.avator}><i></i></div> <span>{localStorage.getItem('username')}</span>   <DownOutlined />
              </a>
            </Dropdown>
          </>
          :
          <Button type='primary' className={styles.loginBtn} onClick={toLogin}>登录/注册</Button>
        }
      </div>
       
    </div>
  )
}

export default Header