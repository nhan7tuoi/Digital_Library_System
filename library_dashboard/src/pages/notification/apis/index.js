import {api,api2} from '../../../apis/config';

const _getNotifications = async () => {
    const url = '/notifications';
    const response = await api.get(url);
    return response;
};

const _createNotification = async (data) => {
    const url = '/notification';
    const response = await api.post(url,data);
    return response;
};

const _updateNotification = async (data) => {
    const url = '/notification';
    const response = await api.put(url,data);
    return response;
}

const _sendNotification = async (id) => {
    const url = '/notification';
    const response = await api.put(url,{
        id
    });
    return response;
}

const _deleteNotification = async (bookId) => {
    const url = `/notifications/${bookId}`;
    return  await api.delete(url);
}

export {_getNotifications,_createNotification,_updateNotification,_sendNotification,_deleteNotification};