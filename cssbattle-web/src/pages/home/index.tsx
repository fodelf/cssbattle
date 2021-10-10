/*
 * @Descripttion:
 * @version:
 * @Author: pym
 * @Date: 2021-08-28 11:39:09
 * @LastEditors: 吴文周
 * @LastEditTime: 2021-10-10 22:01:38
 */
import { Button, List, Skeleton, Avatar, Tag } from 'antd';
import { getImgList, getBattleTypeList, getRankList } from '@/api/home';
import { getUserInfo } from '@/api/login';
import React, { useEffect, useState } from 'react';
import { history } from 'umi';
import styles from './index.less';

const CurrentBattle: React.FC = (props) => {
  const toLogin = () => {
    history.push('/index/login');
  };

  const toManage = () => {
    history.push('/index/manage');
  };

  return (
    <>
      <p className={styles.battleTit}>欢迎</p>
      <div className={styles.battleCondition}>
        <div>
          <p className={styles.firstTit}>欢迎来到 CSSBattle！</p>
          <p className={styles.secondTit}>
            CSS 代码对战游戏来了！使用您的 CSS
            技能以尽可能少的代码复制目标。请随意查看以下目标并测试您的 CSS 技能
          </p>
          {!localStorage.getItem('token') ? (
            <div className={styles.btn}>
              <Button type="primary" onClick={toLogin}>
                登录/注册
              </Button>
              {/* <Button type="primary" onClick={toManage}>
                前端面试管理
              </Button> */}
            </div>
          ) : (
            <div className={styles.btn}>
              {/* <Button type="primary" onClick={toManage}>
                前端面试管理
              </Button> */}
            </div>
          )}
        </div>
      </div>
    </>
  );
};

const BattleImg: React.FC = () => {
  const [imgList, setImgList] = useState([]);

  useEffect(() => {
    getList();
  }, []);

  const getList = () => {
    let params = {
      type: '',
    };
    getImgList(params).then((res) => {
      console.log(res);
      let list = res.data.data.imgList;
      setImgList(list);
    });
  };

  const getDetailImg = (item: any) => {
    history.push(`/play/${item.id}`);
  };

  return (
    <div className={styles.imgContainer}>
      <p className={styles.battleTit}>Battle</p>
      <div className={styles.imgListContainer}>
        {imgList.map((item: any) => {
          return (
            <div
              className={styles.imgItem}
              key={item.id}
              onClick={() => getDetailImg(item)}
            >
              <img src={item.imgUrl} alt="" />
            </div>
          );
        })}
      </div>
    </div>
  );
};

const BattleType: React.FC = () => {
  const [battleTypeList, setBattleTypeList] = useState([]);

  useEffect(() => {
    getTypeList();
  }, []);

  const getTypeList = () => {
    getBattleTypeList().then((res) => {
      setBattleTypeList(res.data.data);
    });
  };

  const toPlay = (id: number) => {
    history.push(`/index/play/${id}`);
  };

  return (
    <div className={styles.typeContainer}>
      <p className={[styles.battleTit, styles.battleTitTop].join(' ')}>
        Battle
      </p>
      <div className={styles.typeListContainer}>
        {battleTypeList.map((item: any, index: number) => {
          return (
            <div className={styles.typeItem} key={index}>
              <p className={styles.typeTit}>
                Battle #{item.type} - {item.des}
              </p>
              <div className={styles.imgList}>
                {(item.imgList || []).map((imgItem: any) => {
                  return (
                    <div
                      className={styles.imgItem}
                      onClick={() => toPlay(imgItem)}
                    >
                      <img
                        src={`https://cdn.wuwenzhou.com.cn/imgs/${imgItem}%402x.png`}
                        alt=""
                      />
                      <Tag color="rgba(0,0,0,.9)" className={styles.imgTag}>
                        #{imgItem}
                      </Tag>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

const BattleRank: React.FC = () => {
  const [rankList, setRankList] = useState([]);

  useEffect(() => {
    queryRankList();
  }, []);

  const queryRankList = () => {
    getRankList().then((res) => {
      setRankList(res.data.data || []);
    });
  };

  return (
    <List
      itemLayout="horizontal"
      dataSource={rankList}
      renderItem={(item: any, index: number) => (
        <List.Item>
          {/* <Skeleton avatar title={false} active> */}
          <List.Item.Meta
            avatar={
              <Avatar
                src={item.userIcon || require('@/assets/imgs/avator.svg')}
              />
            }
            title={item.userName}
            description={`${item.score.toFixed(2)}（${item.target}个目标）`}
          />
          <div className={styles.rank}>
            {index > 2 ? `${index + 1}th` : <i className={styles.rankBg}></i>}
          </div>
          {/* </Skeleton> */}
        </List.Item>
      )}
    />
  );
};

const Home: React.FC = () => {
  useEffect(() => {
    // 判断用户是否登录
    let token = localStorage.getItem('token');
    if (token) {
      getUserInfo({
        token,
      }).then((res) => {
        if (res.data.data.userId) {
          localStorage.setItem('userId', res.data.data.UserId);
        } else {
          localStorage.setItem('userId', `${new Date().getTime()}`);
        }
      });
    } else {
      localStorage.setItem('userId', `${new Date().getTime()}`);
    }
  }, []);

  return (
    <div className={styles.battleContainer}>
      <div className={styles.battleLeft}>
        <CurrentBattle></CurrentBattle>
        <BattleType></BattleType>
      </div>
      <div className={styles.battleRight}>
        <p
          className={[
            styles.battleTit,
            styles.battleTitTop,
            styles.battleRankTit,
          ].join(' ')}
        >
          排名榜
        </p>
        <BattleRank></BattleRank>
      </div>
    </div>
  );
};

export default Home;
