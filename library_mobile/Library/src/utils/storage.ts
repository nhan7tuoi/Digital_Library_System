import AsyncStorage from '@react-native-async-storage/async-storage';


export const clearToken = async () => {
    try {
        await AsyncStorage.removeItem('token');
    } catch (e) {
        console.log(e);
    }
};

export const getToken = async () => {
    try {
        const token = await AsyncStorage.getItem('token');
        return token;
    } catch (e) {
        console.log(e);
    }
};

export const saveToken = async (token: string) => {
    try {
        await AsyncStorage.setItem('token', token);
    } catch (e) {
        console.log(e);
    }
};

export const saveUserLocalStorage = async (user: any) => {
    try {
        await AsyncStorage.setItem('user', JSON.stringify(user));
    } catch (e) {
        console.log(e);
    }
};

export const getUserLocalStorage = async () => {
    try {
        const user = await AsyncStorage.getItem('user');
        if (user) {
            return JSON.parse(user);
        }
        return null;
    } catch (e) {
        console.log(e);
    }
};

export const clearUserLocalStorage = async () => {
    try {
        await AsyncStorage.removeItem('user');
    } catch (e) {
        console.log(e);
    }
};

export const logout = async () => {
    try {
        await clearToken();
        await clearUserLocalStorage();
    } catch (e) {
        console.log(e);
    }
}
