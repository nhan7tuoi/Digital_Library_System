import { api } from '../../../apis/configAPI';

export type iLogin = {
    email: string,
    password: string,
};
const _login = async (data: iLogin) => {
    const url = '/auth/login';
    return api.post(url, data);
};

const _loginMS = async (data: iLogin) => {
    const url = '/auth/login-microsoft';
    return api.post(url, data);
}

export type iPostFCMToken = {
    userId: string,
    fcmToken: string,
    deviceId: string,
    platform: string,
};
const _postFCMToken = async (data: iPostFCMToken) => {
    const url = '/users/fcm-token';
    return api.post(url, data);
};

export type iRegister = {
    password: string,
    repassword: string,
    email: string,
    name: string
    dob: Date,
    code: string,
    gender: string,
    majors: string, 
}

const _register = async(data:iRegister)=>{
    const url = '/auth/register';
    return api.post(url,data);
}

export type iUpdateUser = {
    name: string,
    dob: Date,
    code: string,
    majors: string,
    gender: string,
}

const _updateUser = async(data:iUpdateUser)=>{
    const url = "/users/update-user";
    return api.post(url,data);
}

const _sendVerifyCode = async(email:string)=>{
    const url = '/auth/send-code';
    return api.post(url,{email});
}

export type iVerifyCode = {
    email: string,
    verificationCode: string,
};

const _verifyCode = async(data:iVerifyCode)=>{
    const url = '/auth/verify-code';
    return api.post(url,data);
}

const _getMajors = async()=>{
    const url = '/majors';
    return api.get(url);
}

export {
    _getMajors,
    _login,
    _loginMS,
    _postFCMToken,
    _register,
    _sendVerifyCode,
    _updateUser,
    _verifyCode
};

