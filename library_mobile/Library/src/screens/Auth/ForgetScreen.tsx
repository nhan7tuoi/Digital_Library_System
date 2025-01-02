import { MAIN } from '@assets/images'
import AppButton from '@components/AppButton'
import AppText from '@components/AppText'
import Space from '@components/Space'
import { fontFamilies } from '@constants/fontFamilies'
import { globalColor } from '@constants/globalColor'
import { Input } from '@rneui/themed'
import React, { useEffect, useState } from 'react'
import { ImageBackground, Pressable, View } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import Toast from 'react-native-toast-message'
import AntDesign from 'react-native-vector-icons/AntDesign'
import { useCountdown } from '../../hooks/useCountDown'

const ForgetScreen = ({ navigation }: any) => {
    const [email, setEmail] = useState<string>('');
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [count, {
        startCountdown,
        resetCountdown
    }] = useCountdown({
        countStart: 60,
        countStop: 0,
        intervalMs: 1000,
    });
    useEffect(() => {
        if (isLoading) {
            startCountdown();
        } else {
            resetCountdown();
        }
        if (count === 0) {
            setIsLoading(false);
        }
    }, [isLoading, count, startCountdown, resetCountdown])

    const validate = () => {
        const emailRegex = /@(student\.iuh\.edu\.vn|iuh\.edu\.vn)$/;
        if (!emailRegex.test(email)) {
            Toast.show({
                type: 'error',
                text1: 'Lỗi',
                text2: 'Email không hợp lệ',
                position: 'bottom',
            });
            return false;
        }
        if (!email) {
            Toast.show({
                type: 'error',
                text1: 'Lỗi',
                text2: 'Vui lòng nhập đầy đủ thông tin',
                position: 'bottom',
            });
            return false;
        }
        return true;
    }

    const handleForget = async () => {
        if (!validate()) return;
        setIsLoading(true);
        try {
            // Call api forget
            Toast.show({
                type: 'success',
                text1: 'Thành công',
                text2: 'Vui lòng kiểm tra email để lấy lại mật khẩu',
                position: 'bottom',
            });
        } catch (error) {
            console.log(error);
        }
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
                    <AppText size={20} color={globalColor.text_dark} text={'Quên mật khẩu'} font={fontFamilies.robotoBold} />
                    <Space width={30} />
                </View>
                <View className='p-2'>
                    <Input
                        leftIcon={<AntDesign name='mail' size={24} color={globalColor.dark} />}
                        label='Email'
                        placeholder='Nhập email'
                        value={email}
                        onChangeText={setEmail}
                    />
                    <View className='py-4 px-8'>
                        <AppButton
                            disable={isLoading}
                            color={globalColor.primary_2}
                            textStyleProps={{ fontFamily: fontFamilies.robotoBold, fontSize: 20 }}
                            onPress={handleForget}
                            title={`${isLoading ? `Thử lại (${count})` : 'Gửi'} `} />
                    </View>
                    <View className='px-8 justify-center items-center'>
                        <AppText size={16} color={globalColor.text_dark} font={fontFamilies.robotoBold} text='Nếu chưa nhận được mail vui lòng Gửi lại' />
                    </View>
                </View>
            </SafeAreaView>
        </ImageBackground>
    )
}

export default ForgetScreen