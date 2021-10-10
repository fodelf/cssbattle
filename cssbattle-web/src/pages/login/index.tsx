/*
 * @Descripttion:
 * @version:
 * @Author: pym
 * @Date: 2021-09-09 16:44:58
 * @LastEditors: pym
 * @LastEditTime: 2021-10-10 11:52:11
 */
import { Input, Form, Button, Tabs, message } from 'antd';
import { UserOutlined, LockOutlined } from '@ant-design/icons';
import { useState } from 'react';
import styles from './index.less';
import { login, register } from '@/api/login';
import { history } from 'umi';
const { TabPane } = Tabs;

const Login: React.FC = (props: any) => {
  const [loading, setLoading] = useState(false);
  const [action, setAction] = useState('signIn');

  const changeKey = (key: string) => {
    setAction(key);
  };

  const onFinish = (values: any) => {
    console.log(values);
    if (action === 'signIn') {
      signIn(values);
    } else {
      signUp(values);
    }
  };

  const signIn = (values: any) => {
    let params = {
      username: values.username,
      password: values.password,
    };
    login(params).then((res) => {
      // if (res.data.data.login) {
        message.success('登录成功！');
        localStorage.setItem('token', res.data.data.token);
        localStorage.setItem('username', values.username);
        history.push('/index');
      // } else {
      //   message.error('登录失败！');
      // }
    });
  };

  const signUp = (values: any) => {
    let params = {
      username: values.username,
      password: values.password,
    };
    debugger;
    register(params).then((res) => {
      debugger;
      console.log(res)
      message.success('注册成功，请登录！');
      setAction('signIn');
    });
  };

  const onFinishFailed = (errorInfo: any) => {
    console.log(errorInfo);
  };

  return (
    <div className={styles.loginContainer}>
      <div className={styles.loginContent}>
        {/* <p className={styles.loginTitle}>登录/注册</p> */}
        <Tabs defaultActiveKey="action" onChange={changeKey}>
          <TabPane tab="登录" key="signIn"></TabPane>
          <TabPane tab="注册" key="signUp"></TabPane>
        </Tabs>
        <Form
          autoComplete="off"
          onFinish={onFinish}
          onFinishFailed={onFinishFailed}
        >
          <Form.Item
            name="username"
            rules={[{ required: true, message: '请输入用户名' }]}
          >
            <Input
              size="large"
              autoComplete="new-username"
              prefix={<UserOutlined />}
              placeholder="请输入用户名"
            />
          </Form.Item>
          <Form.Item
            name="password"
            rules={[{ required: true, message: '请输入密码' }]}
          >
            <Input
              size="large"
              autoComplete="new-password"
              prefix={<LockOutlined />}
              type="password"
              placeholder="请输入密码"
            />
          </Form.Item>
          <Form.Item>
            <Button
              loading={loading}
              style={{ fontSize: 18 }}
              type="primary"
              htmlType="submit"
            >
              {action === 'signIn' ? '登录' : '注册'}
            </Button>
          </Form.Item>
        </Form>
      </div>
    </div>
  );
};

export default Login;
