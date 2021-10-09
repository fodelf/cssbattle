/*
 * @Descripttion: 
 * @version: 
 * @Author: pym
 * @Date: 2021-09-05 10:43:43
 * @LastEditors: pym
 * @LastEditTime: 2021-09-05 12:49:40
 */
import Header from '@/components/header/index'
import styles from './index.less'

const Layout: React.FC = (props) => { 
  console.log(props,'12333')
  return (
    <>
      <Header></Header>
      <div className={styles.container}>
        { props.children }
      </div>
    </>
  )
}

export default Layout