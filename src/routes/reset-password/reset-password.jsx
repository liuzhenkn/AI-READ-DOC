import { useEffect } from 'react';
import { Button, Input, Form, message } from 'antd';
import { useNavigate } from 'react-router-dom';
import http from '../../http';
import regex from '../../utils/regex';
import styles from './reset-password.module.css';

const ResetPassword = () => {
  const token = new URLSearchParams(window.location.search).get('token')
  const [form] = Form.useForm();
  const navigate = useNavigate();

  const onFinish = async (values) => {
    const password = values.password
    await http.post('/api/user/reset_password', { password, token })
    message.success("Your password has been reset successfully.")
    navigate('/', { replace: true })
  }

  useEffect(() => {
    if (!token) {
      navigate('/', { replace: true })
    }
  }, [])

  return (
    <div className={styles.container}>
      <div className={styles.title}>Reset Password</div>
      <Form
        labelCol={{ span: 7 }}
        wrapperCol={{ span: 17 }}
        onFinish={onFinish}
        form={form}
      >
        <Form.Item
          label="New Password"
          name="password"
          rules={[
            { required: true, message: 'Please input your new password!' },
            { pattern: regex.password, message: 'Password must contain case, digits, and special characters!' },
          ]}
        >
          <Input
            type="password"
            placeholder="Password must contain case, digits, and special characters"
          />
        </Form.Item>
        <Form.Item
          label="Repeat New Password"
          name="repeat"
          rules={[
            { validator: (rule, value) => {
                if (value !== form.getFieldValue('password')) {
                  return Promise.reject('Password does not match!')
                }
                return Promise.resolve()
              }
            }
          ]}
        >
          <Input
            type="password"
            placeholder="Repeat your new password"
          />
        </Form.Item>
        <div className={styles.formFooter}>
          <Button htmlType="submit" type="primary">Confirm</Button>
        </div>
      </Form>
    </div>
  )
}

export default ResetPassword;
