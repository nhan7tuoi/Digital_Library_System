import { api } from '../../../apis/configAPI';

const _getProfile = async () => {
    const url = '/me';
    return api.get(url);
};

const _updateImage = async (data: any) => {
    const url = '/users/update-avatar';
    return api.post(url, data, {
        headers: {
            'Content-Type': 'multipart/form-data',
        },
    });
};

export type iUpdateUser = {
    name: string,
};

const _updateUser = async (data: any) => {
    const url = '/users/update-user';
    return api.post(url, data);
};

const _updatePassWord = async (data: any) => {
    const url = '/auth/reset-password';
    return api.post(url, data);
};

const _sendCodeToUpdate = async (email: string) => {
    const url = '/auth/send-code-update';
    return api.post(url, { email });
};

export {
    _getProfile,
    _sendCodeToUpdate,
    _updateImage,
    _updatePassWord,
    _updateUser,
};
