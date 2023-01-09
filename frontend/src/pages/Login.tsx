import React, { useContext, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { LockOutlined, UserOutlined } from '@ant-design/icons';
import { Button, Form, Input } from 'antd';
import { AppContext } from '../context/globalState';
import { CustomAuthHeader } from "../components";
import callApi from '../utils/callApi';

const Login = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { isLoggedIn, login, successCallback, errorCallback, user } = useContext(AppContext);
  const pathname = location.pathname;
  const [loginForm] = Form.useForm();

  useEffect(() => {
    isLoggedIn && user && navigate(`/${user.role}` || "/buyer");
  }, [isLoggedIn]); // eslint-disable-line react-hooks/exhaustive-deps

  const onFinish = async ({ username, password }: { username: string, password: string }) => {
    const response = await callApi('post', 'auth/login', { username, password });
    if (response?.error) {
      errorCallback(response?.error?.response?.data?.message);
    } else {
      successCallback('Login successful', '');
      await login({ token: response?.access_token });
      const userResponse = await callApi('get', 'users'); 
      if (!userResponse?.error) {
        await login({ userData: userResponse });
        navigate(`/${userResponse.role}`);
      }
    }
  };

  return (
      <div className="login-content">
        <h3>Login</h3>
        <br />
        <Form
          form={loginForm}
          layout="vertical"
          name="login-form"
          className="login-form"
          onFinish={onFinish}
          validateTrigger="onSubmit"
        >
          <Form.Item
            name="username"
            rules={[
              {
                required: true,
                message: "Please provide your name!",
              },
            ]}
          >
            <Input 
              className="rounded-input" 
              prefix={<UserOutlined className="site-form-item-icon" />} 
              placeholder="Username" 
            />
          </Form.Item>
          <Form.Item
            name="password"
            rules={[
              { 
                validator: (_, value) => 
                  (!value || (value.length > 5 && value.length < 33)) 
                  ? Promise.resolve() 
                  : Promise.reject(`Password must be between ${6} and ${32} characters`) 
              },
              {
                required: true,
                message: "Please provide your password!",
              },
            ]}
          >
            <Input.Password 
              className="rounded-input" 
              prefix={<LockOutlined className="site-form-item-icon" />}
              type="password"
              placeholder="Password"
            />
          </Form.Item>
          <Form.Item>
            <br />
            <Button className="login-form-button" type="primary" htmlType="submit">
              Login
            </Button>
          </Form.Item>
          <Form.Item>
            <CustomAuthHeader pathname={pathname} />
          </Form.Item>
        </Form>
      </div>
  );
};

export default Login;