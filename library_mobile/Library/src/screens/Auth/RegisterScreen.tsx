import { MAIN } from '@assets/images';
import AppButton from '@components/AppButton';
import AppText from '@components/AppText';
import Space from '@components/Space';
import { fontFamilies } from '@constants/fontFamilies';
import { globalColor } from '@constants/globalColor';
import { ScreenName } from '@constants/ScreenName';
import { Input } from '@rneui/themed';
import React, { useState } from 'react';
import { Image, ImageBackground, Pressable, ScrollView, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Toast from 'react-native-toast-message';
import AntDesign from 'react-native-vector-icons/AntDesign';
import { _sendVerifyCode } from './apis';

const RegisterScreen = ({ navigation }: any) => {
    const [email, setEmail] = useState<string>('');
    const [isLoading, setIsLoading] = useState<boolean>(false);

    const validate = () => {
        const emailRegex = /@(student\.iuh\.edu\.vn|iuh\.edu\.vn)$/;
        if (!email) {
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

    const handleRegister = async () => {
        if (!validate()) return;
        setIsLoading(true);
        try {
            const res = await _sendVerifyCode(email);
            if (res.data) {
                Toast.show({
                    type: 'success',
                    text1: 'Thành công',
                    text2: 'Mã xác nhận đã được gửi đến email của bạn',
                    position: 'bottom',
                });
                navigation.navigate(ScreenName.VerifyCodeScreen, { email });
            }
        } catch (error: any) {
            Toast.show({
                type: 'error',
                text1: 'Lỗi',
                text2: error?.response?.data?.error?.message,
                position: 'bottom',
            });
        } finally {
            setIsLoading(false);
        };
    }

    return (
        <ImageBackground className='flex-1' source={MAIN.BACKGROUND}>
            <SafeAreaView className='flex-1'>
                <View className='flex-row justify-between h-16 items-center px-3'>
                    <Pressable onPress={() => {
                        navigation.goBack();
                    }}>
                        <AntDesign name='left' size={30} color={globalColor.text_dark} />
                    </Pressable>
                    <Space width={30} />
                </View>
                <View className='justify-around items-center h-[250px]'>
                    <Image
                        resizeMode='stretch'
                        source={MAIN.LOGOIUH}
                        className='w-72 h-36 mx-auto'
                    />
                    <AppText size={40} font={fontFamilies.robotoBold} color={globalColor.primary_2} text={'Đăng ký'} />
                </View>
                <ScrollView className='flex-1 px-3'>
                    <Input
                        leftIcon={<AntDesign name='mail' size={24} color={globalColor.dark} />}
                        label='Email'
                        value={email}
                        onChangeText={setEmail}
                        placeholder='Nhập email'
                    />
                    <View className='px-4 pt-8'>
                        <AppButton
                            title={'Đăng ký'}
                            onPress={handleRegister}
                            loading={isLoading}
                            styles={{ backgroundColor: globalColor.primary_2 }}
                            textStyleProps={{ color: globalColor.white, fontFamily: fontFamilies.robotoBold, fontSize: 24 }}
                        />
                    </View>
                </ScrollView>
            </SafeAreaView>
        </ImageBackground>
    )
}

export default RegisterScreen