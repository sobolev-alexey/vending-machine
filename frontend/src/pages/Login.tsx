import React, { useContext, useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Form, Input, Space } from "antd";
import { AppContext } from '../context/globalState';
import { CustomAuthHeader } from "../components";
import callApi from '../utils/callApi';

const Login = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { isLoggedIn, login, successCallback, errorCallback } = useContext(AppContext);
  const [username, setName] = useState("");
  const [password, setPassword] = useState("");
  const [revealFields, setRevealFields] = useState(false);
  const pathname = location.pathname;
  const [loginForm] = Form.useForm();

  useEffect(() => {
    isLoggedIn && navigate("/buyer");
  }, [isLoggedIn]); // eslint-disable-line react-hooks/exhaustive-deps

  const onFinish = async () => {
    const response = await callApi('post', 'auth/login', { username, password });
    if (response?.error) {
      errorCallback(response?.error?.response?.data?.message);
    } else {
      successCallback('Login successful', '');
      await login({ token: response?.access_token });
      navigate('/buyer');
    }
  };

  return (
    <div className="login-main-section">
      <CustomAuthHeader pathname={pathname} />
      <div className="login-content">
        <h5> Login </h5> <br />
        <br />
        <Form
          form={loginForm}
          size="large"
          layout="vertical"
          name="login-form"
          onFinish={onFinish}
          validateTrigger="onSubmit"
        >
          <Form.Item
            name="username"
            label="Name"
            hasFeedback
            onChange={(e: any) => setRevealFields(true) || setName(e.target.value)}
            rules={[
              {
                required: true,
                message: "Please provide your name!",
              },
            ]}
          >
            <Input className="rounded-input" />
          </Form.Item>
          <div className={revealFields ? "reveal-fields" : "hide-fields"}>
            <Form.Item
              name="password"
              label="Password"
              hasFeedback
              onChange={(e: any) => setPassword(e.target.value)}
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
              <Input.Password className="rounded-input" />
            </Form.Item>
          </div>
          <br />
          <Space size={25}>
            <button className="login-btn-inverse" type="submit">
              Login
            </button>
          </Space>
        </Form>
      </div>
    </div>
  );
};

export default Login;