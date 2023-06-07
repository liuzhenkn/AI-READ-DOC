import { useState } from 'react';
import { Form, Input, Button, message } from 'antd';
import { connect } from 'react-redux';
import { EyeInvisibleOutlined, EyeTwoTone } from '@ant-design/icons';
import { formatTime } from '../../utils/date';
import { fetchUser, fetchHistory } from '../../stores/actions';
import http from '../../http';
import BaseModal from '../../components/BaseModal/BaseModal';
import styles from './LoginModal.module.css';
import regex from '../../utils/regex';

const LoginModal = (props) => {
  const [form] = Form.useForm();
  const [forgetForm] = Form.useForm();
  const { isLogin, user } = props;
  const [waiting, setWaiting] = useState(false);
  const [loginType, setLoginType] = useState('');

  const onFinish = async (values) => {
    await http.post('/api/user/login', values)
    window.location.reload()
  }

  const onForget = async (values) => {
    await http.post('/api/user/forgot_password', values)
    message.success("One email has been sent to your email, please check it.")
    setLoginType('email')
  }

  const onLogout = async () => {
    await http.post('/api/user/logout')
    window.location.href = '/'
  }

  const onRegister = async () => {
    await form.validateFields()
    const values = form.getFieldsValue()
    await http.post('/api/user/register', values)
    setWaiting(true)
  }

  const onFacebookLogin = async () => {
    const res = await http.get('/api/oauth/facebook_login')
    location.replace(res?.oauth_url)
  }

  const onGoogleLogin = async () => {
    const res = await http.get('/api/oauth/google_login')
    location.replace(res?.oauth_url)
  }

  const onChecked = () => {
    setWaiting(false)
    setLoginType('email')
  }

  const onUpgrade = () => {
    props.openPriceModal()
    props.onCancel()
  }

  const renderLoginForm = () => (
    <Form
      labelCol={{ span: 4 }}
      wrapperCol={{ span: 20 }}
      form={form}
      initialValues={{}}
      onValuesChange={(e) => {console.log(e)}}
      onFinish={onFinish}
    >
      <Form.Item
        label="Email"
        name="email"
        rules={[
          { required: true, message: 'Please input your email!' },
          { pattern: regex.email, message: 'Please input a valid email!' }
        ]}
      >
        <Input placeholder="Email" />
      </Form.Item>
      <Form.Item
        label="Password"
        name="password"
        rules={[
          { required: true, message: 'Please input your password!' },
          { pattern: regex.password, message: 'Password must contain case, digits, and special characters!' },
        ]}
      >
        <Input.Password
          placeholder="Password must contain case, digits, and special characters"
          iconRender={(visible) => (visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />)}
        />
      </Form.Item>
      <div className={styles.loginModalFooter}>
        <Button type="link" onClick={() => setLoginType('forget')}>Forgot Password?</Button>
        <Button style={{marginRight: 10}} onClick={onRegister}>Sign Up</Button>
        <Button htmlType="submit" type="primary">Sign in</Button>
      </div>
    </Form>
  )

  const renderText = () => {
    if (user?.plan?.type === 'FREE') {
      return (
        <div className={styles.loginModalContent}>
          <div className={styles.loginModalContentText}>{`Hey, ${user.email}, you are Free Account now, the features will be limited.`}</div>
          <Button type="primary" onClick={onUpgrade}>Upgrade to VIP</Button>
          <Button type="link" onClick={onLogout}>Logout</Button>
        </div>
      )
    }

    return (
      <div className={styles.loginModalContent}>
        <div className={styles.loginModalContentText}>{`Hey, ${user.email}, you are VIP Account now, all the features are unlocked.`}</div>
        <div className={styles.loginModalContentText}>The VIP will expire at {formatTime(user?.expires_at, 'DD/MM/YYYY')}.</div>
        <Button type="primary" onClick={onLogout}>Logout</Button>
      </div>
    )
  }

  const renderLogin = () => {
    if(isLogin) {
      return renderText()
    }

    if (!loginType) {
      return (
        <div className={styles.loginModalContent}>
          <div className={styles.loginModalContentText}>Hey, you are not login, login with</div>
          <Button type="primary" style={{marginRight: 10}} onClick={() => setLoginType('email')}>Email</Button>
          <Button type="primary" style={{marginRight: 10}} onClick={onFacebookLogin}>Facebook</Button>
          <Button type="primary" onClick={onGoogleLogin}>Google</Button>
        </div>
      )
    }

    if (loginType === 'forget') {
      return (
        <div className={styles.loginModalContent}>
          <Form
            labelCol={{ span: 4 }}
            wrapperCol={{ span: 20 }}
            form={forgetForm}
            initialValues={{}}
            onFinish={onForget}
          >
            <Form.Item
              label="Email"
              name="email"
              rules={[
                { required: true, message: 'Please input your email!' },
                { pattern: regex.email, message: 'Please input a valid email!' }
              ]}
            >
              <Input placeholder="Your Email" />
            </Form.Item>
            <div className={styles.loginModalFooter}>
              <Button type="link" onClick={() => setLoginType('email')}>Cancel</Button>
              <Button htmlType="submit" type="primary">Confirm</Button>
            </div>
          </Form>
        </div>
      )
    }

    return renderLoginForm()
  }

  const renderModalContent = () => {
    if (waiting) {
      return (
        <div className={styles.loginModalContent}>
          <div className={styles.loginModalContentText}>
            Please check your email to activate your account, and login again.
          </div>
          <Button type="primary" onClick={onChecked}>Checked</Button>
        </div>
      )
    }

    return renderLogin()
  }

  return (
    <BaseModal title="My Account" width={600} {...props} destroyOnClose={true}>
      {renderModalContent()}
    </BaseModal>
  )
}

export default connect(
  (state) => ({
    user: state.user,
    isLogin: state.isLogin,
  }),
  (dispatch) => ({
    fetchHistory: () => dispatch(fetchHistory()),
    fetchUser: () => dispatch(fetchUser()),
  })
)(LoginModal);