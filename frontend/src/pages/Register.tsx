import React, { useContext, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Form, Input, Button } from "antd";
import { LockOutlined, UserOutlined } from '@ant-design/icons';
import { AppContext } from '../context/globalState';
import { CustomAuthHeader } from "../components";
import callApi from '../utils/callApi';

const Register = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { isLoggedIn, setUser, successCallback, errorCallback } = useContext(AppContext);
  const pathname = location.pathname;
  const [registerForm] = Form.useForm();

  const callback = async (user: any) => {
    setUser(user);
    await localStorage.setItem('vending-user', JSON.stringify(user));
    user && navigate("/login");
  };

  useEffect(() => {
    isLoggedIn && navigate("/buyer");
  }, [isLoggedIn]); // eslint-disable-line react-hooks/exhaustive-deps

  const onFinish = async ({ username, password }: { username: string, password: string }) => {
    const payload = { username, password, role: 'buyer' };
    const response = await callApi('post', 'auth/register', payload);
    if (response?.error) {
      errorCallback(response?.error);
    } else {
      successCallback('Registration successful', 'Please login with your credentials');
      callback(response);
    }
  };

  return (
      <div className="login-content">
        <h3>Register</h3>
        <br />
        <Form
          form={registerForm}
          layout="vertical"
          name="register-form"
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
          <Form.Item
            name="confirm"
            dependencies={["password"]}
            rules={[
              {
                required: true,
                message: "Please provide your password!",
              },
              { 
                validator: (_, value) => 
                  (!value || (value.length > 5 && value.length < 33)) 
                  ? Promise.resolve() 
                  : Promise.reject(`Password must be between ${6} and ${32} characters`) 
              },
              ({ getFieldValue }) => ({
                validator(rule, value) {
                  if (!value || getFieldValue("password") === value) {
                    return Promise.resolve();
                  }
                  return Promise.reject("The two passwords that you entered do not match!");
                },
              }),
            ]}
          >
            <Input.Password 
              className="rounded-input" 
              prefix={<LockOutlined className="site-form-item-icon" />}
              type="password"
              placeholder="Confirm password"
            />
          </Form.Item>
          <Form.Item>
            <br />
            <Button type="primary" htmlType="submit" className="login-form-button login-btn-inverse">
              Register
            </Button>
          </Form.Item>
          <Form.Item>
            <CustomAuthHeader pathname={pathname} />
          </Form.Item>
        </Form>
      </div>
  );
};

export default Register;