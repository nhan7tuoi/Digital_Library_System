import { LOGIN, MAIN } from '@assets/images'
import AppButton from '@components/AppButton'
import AppText from '@components/AppText'
import { fontFamilies } from '@constants/fontFamilies'
import { globalColor } from '@constants/globalColor'
import { ScreenName } from '@constants/ScreenName'
import messaging from '@react-native-firebase/messaging'
import { setAuth, setMajorId, setUser, setUserId } from '@redux/authReducer'
import { Input } from '@rneui/themed'
import { saveToken, saveUserLocalStorage } from '@utils/storage'
import React, { useEffect, useState } from 'react'
import { Image, ImageBackground, Platform, ScrollView, View } from 'react-native'
import { getUniqueId } from 'react-native-device-info'
import { SafeAreaView } from 'react-native-safe-area-context'
import Toast from 'react-native-toast-message'
import AntDesign from 'react-native-vector-icons/AntDesign'
import Entypo from 'react-native-vector-icons/Entypo'
import { useDispatch } from 'react-redux'
import { api } from '../../apis/configAPI'
import { _login, _postFCMToken, iLogin, iPostFCMToken } from './apis'


const LoginWithAccount = ({ navigation, route }: any) => {
    const { userEmail = '', userPassword = '' } = route?.params || {};
    const [email, setEmail] = useState<string>(userEmail);
    const [password, setPassword] = useState<string>(userPassword);
    const dispatch = useDispatch();
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [loadingLoginMail, setLoadingLoginMail] = useState<boolean>(false);
    const [showPassword, setShowPassword] = useState<boolean>(false);
    const [deviceId, setDeviceId] = useState<string>('');

    useEffect(() => {
        if (userEmail && userPassword) {
            setEmail(userEmail);
            setPassword(userPassword);
        }
    }, [userEmail, userPassword]);

    useEffect(() => {
        const getDeviceId = async () => {
            const deviceId = await getUniqueId();
            setDeviceId(deviceId);
        }
        getDeviceId();
    }, []);



    const validate = () => {
        const emailRegex = /@(student\.iuh\.edu\.vn|iuh\.edu\.vn)$/;
        if (!email || !password) {
            Toast.show({
                type: 'error',
                text1: 'Lỗi',
                text2: 'Vui lòng nhập đầy đủ thông tin',
                position: 'bottom',
            });
            return false;
        }
        if (!emailRegex.test(email)) {
            Toast.show({
                type: 'error',
                text1: 'Lỗi',
                text2: 'Email không hợp lệ',
                position: 'bottom',
            });
            return false;
        }
        return true;
    }

    const handleLogin = async () => {
        if (!validate()) return;
        const user: iLogin = { email, password };
        try {
            const res = await _login(user);
            if (res.data) {
                api.defaults.headers.common.Authorization = `Bearer ${res.data.accessToken}`;
                try {
                    const token = await messaging()
                        .registerDeviceForRemoteMessages()
                        .then(() => messaging().getToken());
                    console.log(token);
                    const data: iPostFCMToken = {
                        deviceId: deviceId,
                        fcmToken: token,
                        platform: Platform.OS,
                        userId: res.data.user._id,
                    }
                    await _postFCMToken(data);
                } catch (error) {
                    console.log(error);
                }
                console.log(res.data.accessToken);
                dispatch(setUserId(res.data.user._id));
                dispatch(setMajorId(res.data.user.majors));
                dispatch(setUser(res.data.user));
                dispatch(setAuth(res.data.accessToken));
                await saveToken(res.data.accessToken);
                await saveUserLocalStorage(res.data.user);
                setIsLoading(false);
            }
        } catch (error: any) {
            Toast.show({
                type: 'error',
                text1: 'Đăng nhập thất bại',
                text2: error?.response?.data?.error?.message,
                position: 'bottom',
            });
            console.log(error);
        } finally {
            setIsLoading(false);
        }
    }

    const navigateToRegister = () => {
        navigation.navigate(ScreenName.RegisterScreen);
    };
    const navigateToForget = () => {
        navigation.navigate(ScreenName.ForgetScreen);
    };

    return (
        <ImageBackground className='flex-1' source={MAIN.BACKGROUND}>
            <SafeAreaView className='flex-1 px-3'>
                <View className='justify-around items-center h-[350px]'>
                    <Image
                        resizeMode='stretch'
                        source={MAIN.LOGOIUH}
                        className='w-72 h-36 mx-auto'
                    />
                    <AppText size={40} font={fontFamilies.robotoBold} color={globalColor.primary_2} text={'Đăng nhập'} />
                </View>
                <ScrollView className='flex-1'>
                    <Input
                        leftIcon={<AntDesign name='mail' size={24} color={globalColor.dark} />}
                        label='Email'
                        value={email}
                        onChangeText={setEmail}
                        placeholder='Nhập email'
                    />
                    <Input
                        leftIcon={<AntDesign name='lock' size={24} color={globalColor.dark} />}
                        rightIcon={<Entypo onPress={
                            () => setShowPassword(!showPassword)
                        } name={
                            showPassword ? 'eye' : 'eye-with-line'
                        } size={24} color={globalColor.dark} />}
                        label='Mật khẩu'
                        value={password}
                        onChangeText={setPassword}
                        placeholder='Nhập mật khẩu'
                        secureTextEntry={showPassword}
                    />
                    <View className='flex-row justify-between px-2'>
                        <AppText
                            onPress={navigateToForget}
                            text={'Quên mật khẩu?'}
                            color={globalColor.primary_2}
                            size={16}
                            font={fontFamilies.robotoBold}
                        />
                        <AppText
                            onPress={navigateToRegister}
                            text={'Đăng ký'}
                            color={globalColor.primary_2}
                            size={16}
                            font={fontFamilies.robotoBold}
                        />
                    </View>
                    <View className='px-4 pt-8'>
                        <AppButton
                            title={'Đăng nhập'}
                            onPress={handleLogin}
                            loading={isLoading}
                            styles={{ backgroundColor: globalColor.primary_2 }}
                            textStyleProps={{ color: globalColor.white, fontFamily: fontFamilies.robotoBold, fontSize: 24 }}
                        />
                    </View>
                    <View>
                        <AppText
                            text={'Hoặc đăng nhập bằng'}
                            color={globalColor.dark}
                            size={16}
                            font={fontFamilies.robotoBold}
                            styles={{ textAlign: 'center' }}
                        />
                        <View className='flex-row justify-center pt-4'>
                            <AppButton
                                loading={loadingLoginMail}
                                icon={<Image source={LOGIN.ICONMAIL} style={{ width: 24, height: 24 }} />}
                                onPress={() => { }}
                                title={'Email sinh viên - GV'}
                                styles={{ backgroundColor: globalColor.white, width: 250 }}
                                textStyleProps={{ color: globalColor.text_dark, fontFamily: fontFamilies.robotoBold, fontSize: 16 }}
                            />
                        </View>
                    </View>
                </ScrollView>
            </SafeAreaView>
        </ImageBackground>
    )
}

export default LoginWithAccount