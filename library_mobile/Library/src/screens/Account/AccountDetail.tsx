import { MAIN } from '@assets/images'
import AppText from '@components/AppText'
import Loading from '@components/Loading'
import Space from '@components/Space'
import { fontFamilies } from '@constants/fontFamilies'
import { globalColor } from '@constants/globalColor'
import { isiOS } from '@constants/index'
import { ScreenName } from '@constants/ScreenName'
import { Input } from '@rneui/themed'
import React, { useEffect, useRef, useState } from 'react'
import { ActivityIndicator, Image, ImageBackground, Keyboard, Pressable, View } from 'react-native'
import ImagePicker from 'react-native-image-crop-picker'
import { SafeAreaView } from 'react-native-safe-area-context'
import Toast from 'react-native-toast-message'
import AntDesign from 'react-native-vector-icons/AntDesign'
import Entypo from 'react-native-vector-icons/Entypo'
import FontAwesome6 from 'react-native-vector-icons/FontAwesome6'
import { useDispatch } from 'react-redux'
import { iUser } from 'src/types/iUser'
import { _getProfile, _updateImage, _updateUser } from './apis'
import { setUserRedux } from '@redux/authReducer'

const AccountDetail = ({ navigation }: any) => {
    const dispatch = useDispatch();
    const [user, setUser] = useState<iUser>();
    const [loadingName, setLoadingName] = useState<boolean>(false);
    const [name, setName] = useState<string>('');
    const inputName: any = useRef(null);
    const inputEmail: any = useRef(null);
    const [loadingImage, setLoadingImage] = useState<boolean>(false);
    const [loadingUser, setLoadingUser] = useState<boolean>(false);

    useEffect(() => {
        const unsubscribe = navigation.addListener('focus', () => {
            getUser();
        }
        );
        return unsubscribe;
    }, [navigation]);

    const getUser = async () => {
        setLoadingUser(true);
        try {
            const response = await _getProfile();
            if (response.data) {
                setUser(response.data);
                setLoadingUser(false);
            }
        } catch (error) {
            setLoadingUser(false);
            console.log('error', error);
        }
    }

    const handleChangeImage = async () => {
        ImagePicker.openPicker({
            width: 300,
            height: 300,
            cropping: true,
            cropperCircleOverlay: true,
            compressImageQuality: 0.5
        }).then(async (image) => {
            if (image) {
                await updateAvatar(image);
            }
        })
    };

    const updateAvatar = async (image: any) => {
        setLoadingImage(true);
        try {
            const data = new FormData();
            data.append('image', {
                uri: isiOS ? image.path.replace('file://', '') : image.path,
                type: image.mime,
                name: `${image.modificationDate}_image_${Date.now()}.jpeg`,
            });
            console.log('data', image);
            const response = await _updateImage(data);
            if (response.data) {
                console.log('response', response.data);
                setUser(response.data);
                dispatch(setUserRedux(response.data));
                setLoadingImage(false)
            }
        } catch (error) {
            setLoadingImage(false);
            Toast.show({
                type: 'error',
                text1: 'Thông báo',
                text2: 'Có lỗi xảy ra, vui lòng thử lại',
            });

            console.log('error', error);
        }
    }

    const handleChangeName = async () => {
        try {
            setLoadingName(true);
            Keyboard.dismiss();
            const data = {
                name: name,
                dob: user?.dob,
                code: user?.code,
                gender: user?.gender,
                majors: user?.majors,
            }
            const response = await _updateUser(data);
            if (response.data) {
                setUser(response.data);
                setLoadingName(false);
            }
        } catch (error) {
            setLoadingName(false);
            Toast.show({
                type: 'error',
                text1: 'Thông báo',
                text2: 'Có lỗi xảy ra, vui lòng thử lại',
            });
            console.log('error', error);
        }
    }

    const btnEditAndSave = (
        value: string,
        onchange: () => void,
        loading: boolean,
        key: string
    ) => {
        if (loading) {
            return (
                <ActivityIndicator
                    size={28}
                    animating={loading}
                    color="rgba(227, 86, 42, 0.5)"
                />
            );
        }

        return value ? (
            <Pressable
                onPress={async () => {
                    onchange();
                }}
            >
                <AppText
                    text={'Lưu'}
                    styles={[
                        {
                            color: globalColor.primary,
                            fontWeight: "700",
                            fontSize: 16,
                        },
                    ]}
                />
            </Pressable>
        ) : (
            <Entypo
                onPress={() => {
                    key === "name"
                        ? inputName.current?.focus()
                        : inputEmail.current?.focus()

                }}
                name="pencil"
                size={20}
                color="rgba(60, 58, 54, 0.8)"
            />
        );
    };

    return (
        loadingUser ? <Loading /> :
            <ImageBackground className='flex-1' source={MAIN.BACKGROUND}>
                <SafeAreaView className='flex-1'>
                    <View className='flex-row justify-between h-16 items-center px-3'>
                        <Pressable onPress={() => {
                            navigation.goBack()
                        }}>
                            <AntDesign name='left' size={30} color={globalColor.text_dark} />
                        </Pressable>
                        <AppText size={20} color={globalColor.dark} text='Thông tin cá nhân' font={fontFamilies.robotoBold} />
                        <Space width={30} />
                    </View>
                    <View className='flex-1 justify-center items-center'>
                        {user && (
                            loadingImage ? (
                                <View className='w-32 h-32 rounded-full bg-gray-300 justify-center items-center'>
                                    <ActivityIndicator size={28} color={globalColor.primary} />
                                </View>
                            ) : (
                                <Pressable onPress={handleChangeImage} >
                                    <Image source={{ uri: user.image }} resizeMode='contain' className='w-32 h-32 rounded-full' />
                                    <Pressable
                                        className='absolute bottom-1 right-1 w-10 h-10 bg-white justify-center items-center rounded-full'>
                                        <Entypo name='camera' size={24} color={globalColor.dark} />
                                    </Pressable>
                                </Pressable>
                            )
                        )}
                        <Input
                            editable={false}
                            label='Họ và tên'
                            value={user && user.name}
                            leftIcon={<AntDesign name='idcard' size={24} color={globalColor.dark} />}
                        />
                        <Input
                            label='Email'
                            editable={false}
                            defaultValue={user && user.email}
                            leftIcon={<AntDesign name='mail' size={24} color={globalColor.dark} />}
                        />
                        <Input
                            label='Mã sinh viên / giáo viên'
                            defaultValue={user && user.code}
                            editable={false}
                            leftIcon={<AntDesign name='idcard' size={24} color={globalColor.dark} />}
                        />
                        <Input
                            label='Khoa'
                            defaultValue={user && user.majors.name}
                            editable={false}
                            leftIcon={<AntDesign name='profile' size={24} color={globalColor.dark} />}
                        />
                        <Input
                            label='Ngày sinh'
                            defaultValue={user && new Date(user.dob).toLocaleDateString()}
                            editable={false}
                            leftIcon={<FontAwesome6 name='cake-candles' size={24} color={globalColor.dark} />}
                        />
                        <Input
                            label='Giới tính'
                            defaultValue={
                                user?.gender === 'Male' ? 'Nam' : 'Nữ'
                            }
                            editable={false}
                            leftIcon={<AntDesign name='user' size={24} color={globalColor.dark} />}
                        />
                    </View>
                    <Pressable
                        className='h-12 justify-center items-center mb-2'
                        onPress={() => {
                            navigation.navigate(ScreenName.UpdateInfoUser, { user: user })
                        }
                        }>
                        <AppText size={20} text='Chỉnh sửa chi tiết cá nhân' color={globalColor.success} font={fontFamilies.robotoBold} />
                    </Pressable>
                </SafeAreaView>
            </ImageBackground>
    )
}

export default AccountDetail