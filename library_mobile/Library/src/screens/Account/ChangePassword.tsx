import { MAIN } from '@assets/images'
import AppButton from '@components/AppButton'
import AppText from '@components/AppText'
import Space from '@components/Space'
import { fontFamilies } from '@constants/fontFamilies'
import { globalColor } from '@constants/globalColor'
import { clearAuth } from '@redux/authReducer'
import { Input } from '@rneui/base'
import { _verifyCode, iVerifyCode } from '@screens/Auth/apis'
import { logout } from '@utils/storage'
import React, { useEffect, useState } from 'react'
import { ImageBackground, Pressable, TextInput, View } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import Toast from 'react-native-toast-message'
import AntDesign from 'react-native-vector-icons/AntDesign'
import Entypo from 'react-native-vector-icons/Entypo'
import { useDispatch, useSelector } from 'react-redux'
import { useCountdown } from '../../hooks/useCountDown'
import { _sendCodeToUpdate, _updatePassWord } from './apis'


const ChangePassword = ({ navigation }: any) => {
    const dispatch = useDispatch();
    const user = useSelector((state: any) => state.auth.user);
    const [typeVerify, setTypeVerify] = useState<boolean>(false);
    const email = user?.email;
    const [code, setCode] = useState(["", "", "", ""]);
    const inputRefs: any = [
        React.useRef(null),
        React.useRef(null),
        React.useRef(null),
        React.useRef(null),
    ];
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [count, {
        startCountdown,
        resetCountdown
    }] = useCountdown({
        countStart: 60,
        countStop: 0,
        intervalMs: 1000,
    });
    const [showPassword, setShowPassword] = useState<boolean>(true);
    const [password, setPassword] = useState<string>('');
    const [confirmPassword, setConfirmPassword] = useState<string>('');
    const [showRePassword, setShowRePassword] = useState<boolean>(true);

    useEffect(() => {
        handleSendCode();
    }, [])

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

    const handleSendCode = async () => {
        setIsLoading(true);
        try {
            const res = await _sendCodeToUpdate(email);
            if (res.data) {
                Toast.show({
                    type: 'success',
                    text1: 'Thành công',
                    text2: 'Mã xác nhận đã được gửi đến email của bạn',
                    position: 'bottom',
                });

            }
        } catch (error: any) {
            Toast.show({
                type: 'error',
                text1: 'Lỗi',
                text2: error?.response?.data?.error?.message,
                position: 'bottom',
            });
        }
    }

    const handleChangeText = (text: string, index: number) => {
        const newCode = [...code];
        newCode[index] = text;
        setCode(newCode);

        if (text.length === 1 && index < inputRefs.length - 1) {
            inputRefs[index + 1].current?.focus();
        } else if (text.length === 0 && index > 0 && code[index] === "") {
            inputRefs[index - 1].current?.focus();
        }
    }

    const handleResendCode = async () => {
        setIsLoading(true);
        try {
            const res = await _sendCodeToUpdate(email);
            if (res.data) {
                Toast.show({
                    type: 'success',
                    text1: 'Thành công',
                    text2: 'Mã xác nhận đã được gửi đến email của bạn',
                    position: 'bottom',
                });

            }
        } catch (error: any) {
            Toast.show({
                type: 'error',
                text1: 'Lỗi',
                text2: error?.response?.data?.error?.message,
                position: 'bottom',
            });
        }
    }

    const handleVerifyCode = async () => {
        const data: iVerifyCode = {
            email,
            verificationCode: code.join(""),
        }
        try {
            const res = await _verifyCode(data);
            if (res.data) {
                setTypeVerify(true);
            }
        } catch (error: any) {
            console.log(error);
            Toast.show({
                type: 'error',
                text1: 'Lỗi',
                text2: error?.response?.data?.error?.message,
                position: 'bottom',
            });
        }
    }

    const validatePassword = () => {
        if (password.length < 8) {
            Toast.show({
                type: 'error',
                text1: 'Lỗi',
                text2: 'Mật khẩu phải chứa ít nhất 8 ký tự',
                position: 'bottom',
            });
            return false;
        }
        const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
        if (!regex.test(password)) {
            Toast.show({
                type: 'error',
                text1: 'Lỗi',
                text2: 'Mật khẩu phải chứa ít nhất 1 chữ hoa, 1 chữ thường, 1 số và 1 ký tự đặc biệt',
                position: 'bottom',
            });
            return false;
        }
        if (password !== confirmPassword) {
            Toast.show({
                type: 'error',
                text1: 'Lỗi',
                text2: 'Mật khẩu không khớp',
                position: 'bottom',
            });
            return false;
        }
        return true;
    }


    const updatePassword = async () => {
        if (!validatePassword()) {
            return;
        }
        try {
            const data = {
                email,
                password,
            }
            const res = await _updatePassWord(data);
            Toast.show({
                type: 'success',
                text1: 'Thành công',
                text2: 'Đổi mật khẩu thành công, Vui lòng đăng nhập lại',
                position: 'bottom',
            });
            logout();
            dispatch(clearAuth());
        } catch (error: any) {
            console.log(error);
            Toast.show({
                type: 'error',
                text1: 'Lỗi',
                text2: error?.response?.data?.error?.message,
                position: 'bottom',
            });
        }
    }

    return (
        <ImageBackground source={MAIN.BACKGROUND} className='flex-1 pt-2'>
            <SafeAreaView className='flex-1'>
                <View className='flex-row justify-between h-16 items-center px-3'>
                    <Pressable onPress={() => {
                        navigation.goBack()
                    }}>
                        <AntDesign name='left' size={30} color={globalColor.text_dark} />
                    </Pressable>
                    <AppText size={20} color={globalColor.dark} text='Đổi mật khẩu' font={fontFamilies.robotoBold} />
                    <Space width={30} />
                </View>
                {
                    typeVerify ? (
                        <View className='px-2'>
                            <View className='h-[300px] justify-around items-center'>
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
                                    placeholder='Nhập mật khẩu mới'
                                    secureTextEntry={showPassword}
                                />
                                <Input
                                    leftIcon={<AntDesign name='lock' size={24} color={globalColor.dark} />}
                                    rightIcon={<Entypo onPress={
                                        () => setShowRePassword(!showRePassword)
                                    } name={
                                        showRePassword ? 'eye' : 'eye-with-line'
                                    } size={24} color={globalColor.dark} />}
                                    label='Nhập lại mật khẩu'
                                    value={confirmPassword}
                                    onChangeText={setConfirmPassword}
                                    placeholder='Nhập lại mật khẩu mới'
                                    secureTextEntry={showRePassword}
                                />
                                <AppButton
                                    color={globalColor.primary_2}
                                    title='Xác nhận'
                                    onPress={() => {
                                        updatePassword();
                                    }}
                                    textStyleProps={{ color: globalColor.white, fontFamily: fontFamilies.robotoBold, fontSize: 22 }}
                                />
                            </View>
                        </View>
                    ) :
                        <View className='justify-center items-center'>
                            <AppText text='Vui lòng nhập mã xác nhận đã được gửi đến email của bạn' font={fontFamilies.robotoRegular} />
                            <View className='h-[300px] justify-around items-center'>
                                <View className="flex-row justify-center">
                                    {inputRefs.map((ref: any, index: any) => (
                                        <React.Fragment key={index}>
                                            <TextInput
                                                ref={ref}
                                                maxLength={1}
                                                value={code[index]}
                                                onChangeText={(text) => handleChangeText(text, index)}
                                                className="w-14 h-14 mx-2 text-3xl font-bold text-center border-2 border-black text-black rounded-lg"
                                            />
                                            {index < inputRefs.length - 1 && <Space width={10} />}
                                        </React.Fragment>
                                    ))}
                                </View>
                                <View className='w-full px-20'>
                                    <AppButton
                                        color={globalColor.primary_2}
                                        title="Xác nhận"
                                        onPress={() => {
                                            handleVerifyCode();
                                        }}
                                        textStyleProps={{ color: globalColor.white, fontFamily: fontFamilies.robotoBold, fontSize: 22 }}
                                    />
                                </View>
                                <AppText onPress={() => {
                                    handleResendCode();
                                }} disabled={isLoading} color={isLoading ? globalColor.text_dark : globalColor.primary} font={fontFamilies.robotoBold} size={16} text={`${isLoading ? `${count}s` : "Gửi lại mã xác nhân"}`} />
                            </View>
                        </View>
                }
            </SafeAreaView>
        </ImageBackground>
    )
}

export default ChangePassword