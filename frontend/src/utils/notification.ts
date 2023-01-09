import { notification } from 'antd';

export const errorCallback = (error = null) => {
  notification['error']({
    key: 'error',
    duration: 10,
    message: 'Error',
    description:
      error || 'There was an error loading data. Please see console output for details.',
  });
  console.error(error);
};

export const successCallback = (message?: string, description?: string) => {
  notification['success']({
    duration: 15,
    message,
    description
  });
}

export const infoCallback = (message?: string, description?: string) => {
  notification['info']({
    duration: 10,
    message,
    description
  });
}