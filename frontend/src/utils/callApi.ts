import axios from "axios";
import { notification } from 'antd';

const callApi = async (mode: string, url: string, payload?: any) => {
  try {
    const serverAPI = import.meta.env.VITE_API_BASE;
    const token = await sessionStorage.getItem('vending-token') || '';

    const headers: any = {
      "Content-Type": "application/json",
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Headers": "*",
      "Authorization": `Bearer ${token}`
    };

    let response;
    switch (mode) {
      case "post":
        response = await axios.post(`${serverAPI}/${url}`, payload, { headers });
        break;
      case "put":
        response = await axios.put(`${serverAPI}/${url}`, payload, { headers });
        break;
      case "delete":
        response = await axios.delete(`${serverAPI}/${url}`, { headers });
        break;
      case "get":
      default:
        response = await axios.get(`${serverAPI}/${url}`, { headers });
    }

    return response?.data;
  } catch (error: any) {
    // errorCallback(error?.response?.data?.message)
    // if (error?.response?.status === 401 && error?.response?.data?.message === 'Unauthorized') {
    //   window.location = '/login';
    // }
    return { error };
  }
};

const errorCallback = (error = null) => {
  notification['error']({
    key: 'error',
    duration: 10,
    message: 'Error',
    description:
      error || 'There was an error loading data. Please see console output for details.',
  });
  console.error(error);
};

export default callApi;