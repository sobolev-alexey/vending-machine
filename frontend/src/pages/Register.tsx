import React, { useContext, useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Form, Input, Space } from "antd";
import { AppContext } from '../context/globalState';
import { CustomAuthHeader } from "../components";
import callApi from '../utils/callApi';

const Register = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { isLoggedIn, setUser, successCallback, errorCallback } = useContext(AppContext);
  const [username, setName] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [revealFields, setRevealFields] = useState(false);
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

  const onFinish = async () => {
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
    <div className="login-main-section">
      <CustomAuthHeader pathname={pathname} />
      <div className="login-content">
        <h5> Register </h5> <br />
        <br />
        <Form
          form={registerForm}
          size="large"
          layout="vertical"
          name="register-form"
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
            <Form.Item
              name="confirm"
              label="Confirm Password"
              dependencies={["password"]}
              hasFeedback
              onChange={(e: any) => setConfirm(e.target.value)}
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
              <Input.Password className="rounded-input" />
            </Form.Item>
          </div>
          <br />
          <Space size={25}>
            <button className="login-btn-inverse" type="submit">
              Register
            </button>
          </Space>
        </Form>
      </div>
    </div>
  );
};

export default Register;