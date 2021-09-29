/*
 * @Descripttion: 
 * @version: 
 * @Author: pym
 * @Date: 2021-09-14 16:46:32
 * @LastEditors: pym
 * @LastEditTime: 2021-09-14 16:54:17
 */
import styles from './index.less'

const Learn: React.FC = ()=> {
  return (
    <div className={styles.videoContainer}>
      <video src="https://cssbattle.oss-cn-beijing.aliyuncs.com/media/CSSBattle.mp4" controls autoPlay></video>
    </div>
  )
}

export default Learn