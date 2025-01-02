
import { LOGIN, MAIN } from '@assets/images'
import AppButton from '@components/AppButton'
import AppText from '@components/AppText'
import { envConfig } from '@constants/envConfig'
import { fontFamilies } from '@constants/fontFamilies'
import { globalColor } from '@constants/globalColor'
import { ScreenName } from '@constants/ScreenName'
import { useNavigation } from '@react-navigation/native'
import { saveToken, saveUserLocalStorage } from '@utils/storage'
import React, { useCallback, useEffect, useState } from 'react'
import { Alert, Image, ImageBackground, Platform, View } from 'react-native'
import { authorize } from 'react-native-app-auth'
import AzureAuth from 'react-native-azure-auth'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useDispatch } from 'react-redux'
import { setAuth, setMajorId, setUserRedux, setUserId } from '../../redux/authReducer'
import { _loginMS, _postFCMToken, iPostFCMToken } from './apis'
import { api } from '../../apis/configAPI'
import { getUniqueId } from 'react-native-device-info'
import messaging from '@react-native-firebase/messaging'


const azureauth = new AzureAuth({
  clientId: envConfig.CLIENT_ID,
  tenant: envConfig.TENANT,
});

const configs: any = {
  iddentityserver: {
    issuer: envConfig.ISSUER,
    clientId: envConfig.CLIENT_ID,
    redirectUrl:
      Platform.OS === 'ios'
        ? envConfig.REDIRECT_URL_IOS
        : envConfig.REDIRECT_URL_ANDROID,
    scopes: envConfig.SCOPES,
    additionalParameters: envConfig.ADDITIONAL_PARAMETERS,
  },
};

const LoginScreen = () => {
  const navigation: any = useNavigation();
  const [isLoading, setIsLoading] = useState(false);
  const dispatch = useDispatch();
//   const [deviceId, setDeviceId] = useState<string>('');

//   useEffect(() => {
//     const getDeviceId = async () => {
//         const deviceId = await getUniqueId();
//         setDeviceId(deviceId);
//     }
//     getDeviceId();
// }, []);

  const handleLogin = useCallback(async (provider: any) => {
    setIsLoading(true);
    try {
      const response = await authorize(configs[provider]);
      if (response) {
        const info = await azureauth.auth.msGraphRequest({
          token: response.accessToken,
          path: '/me',
        });
        login(info);
      }
    } catch (error) {
      setIsLoading(false);
      console.log('error', error);
    }
  }, []);

  const isValidStudentEmail = (email: string) => {
    const studentEmailPattern = /@(student\.iuh\.edu\.vn|iuh\.edu\.vn)$/;
    return studentEmailPattern.test(email);
  };

  const login = async (userInfo: any) => {
    const user: any = {
      email: userInfo.mail,
      password: userInfo.id,
    }
    try {
      if (isValidStudentEmail(userInfo.mail)) {
        const res = await _loginMS(user);
        if (res.data.user.status === 'pending') {
          api.defaults.headers.common.Authorization = `Bearer ${res.data.accessToken}`;
                try {
                    const token = await messaging()
                        .registerDeviceForRemoteMessages()
                        .then(() => messaging().getToken());
                    console.log(token);
                    const data: iPostFCMToken = {
                        deviceId: await getUniqueId(),
                        fcmToken: token,
                        platform: Platform.OS,
                        userId: res.data.user._id,
                    }
                    await _postFCMToken(data);
                } catch (error) {
                    console.log(error);
                }
          navigation.navigate(ScreenName.UserFormScreen, {
            email: userInfo.mail,
            type: 'microsoft',
            accessToken: res.data.accessToken,
          });
        }
        if (res.data.user.status === 'active') {
          api.defaults.headers.common.Authorization = `Bearer ${res.data.accessToken}`;
                try {
                    const token = await messaging()
                        .registerDeviceForRemoteMessages()
                        .then(() => messaging().getToken());
                    console.log(token);
                    const data: iPostFCMToken = {
                        deviceId: await getUniqueId(),
                        fcmToken: token,
                        platform: Platform.OS,
                        userId: res.data.user._id,
                    }
                    await _postFCMToken(data);
                } catch (error) {
                    console.log(error);
                }
          dispatch(setUserId(res.data.user._id));
          dispatch(setMajorId(res.data.user.majors));
          dispatch(setUserRedux(res.data.user));
          dispatch(setAuth(res.data.accessToken));
          await saveToken(res.data.accessToken);
          await saveUserLocalStorage(res.data.user);
          setIsLoading(false);
        }

      } else {
        Alert.alert('Thông báo', 'Vui lòng sử dụng email sinh viên hoặc giáo viên để đăng nhập');
      }
      setIsLoading(false);
    } catch (error) {
      setIsLoading(false);
      console.log('error', error);

    }
  };

  return (
    <ImageBackground source={LOGIN.BACKGROUND} className='flex-1' >
      <SafeAreaView className='flex-1 justify-between items-center py-5'>
        <Image resizeMode='stretch' source={MAIN.LOGOIUH} className='w-9/12 h-40' />
        <View className='justify-center items-center mb-40'>
          <AppText text='Chào mừng đến với Thư viện IUH' color='white' size={24} font={fontFamilies.robotoBold} />
          <AppText text='Vui lòng đăng nhập để tiếp tục' color='white' size={16} />
        </View>
        <View className='w-full items-center'>
          <AppButton
            icon={<Image source={LOGIN.ICONMAIL} style={{ width: 24, height: 24 }} />}
            loading={isLoading}
            onPress={() => { handleLogin('iddentityserver') }}
            title='Tiếp tục với email Microsoft'
            type='primary'
            color={globalColor.primary}
            styles={{ width: '80%' }}
            textStyleProps={{ color: globalColor.white, fontSize: 18, fontFamily: fontFamilies.robotoBold }}
          />
          <AppButton
            onPress={() => {
              navigation.navigate(ScreenName.LoginWithAccount);
            }}
            title='Tiếp tục với tài khoản mật khẩu'
            type='primary'
            color={globalColor.primary_2}
            styles={{ width: '80%' }}
            textStyleProps={{ color: globalColor.white, fontSize: 18, fontFamily: fontFamilies.robotoBold }}
          />
        </View>
      </SafeAreaView>
    </ImageBackground>
  )
}

export default LoginScreen;