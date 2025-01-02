import { MAIN } from '@assets/images';
import AppButton from '@components/AppButton';
import AppText from '@components/AppText';
import Loading from '@components/Loading';
import { fontFamilies } from '@constants/fontFamilies';
import { globalColor } from '@constants/globalColor';
import { Input } from '@rneui/themed';
import { _getMajors } from '@screens/Auth/apis';
import React, { useEffect, useState } from 'react';
import { ImageBackground, Pressable, ScrollView, View } from 'react-native';
import DatePicker from 'react-native-date-picker';
import DropDownPicker from 'react-native-dropdown-picker';
import { SafeAreaView } from 'react-native-safe-area-context';
import Toast from 'react-native-toast-message';
import AntDesign from 'react-native-vector-icons/AntDesign';
import { useDispatch } from 'react-redux';
import { eGender } from '../../types/iUser';
import { _updateUser } from './apis';


const UpdateInfoUser = ({ navigation, route }: any) => {
    const { user } = route?.params;
    const [name, setName] = useState(user?.name);
    const [majors, setMajors] = useState<any[]>([]);
    const [date, setDate] = useState(user?.dob ? new Date(user?.dob) : new Date());
    const [openPicker, setOpenPicker] = useState<boolean>(false)
    const [code, setCode] = useState<string>(user?.code);
    const [open, setOpen] = useState(false);
    const [value, setValue] = useState(user?.majors._id);
    const [selectedGender, setSelectedGender] = useState<string>(user?.gender);
    const [loading, setLoading] = useState<boolean>(false);
    const dispatch = useDispatch();

    useEffect(() => {
        getMajors();
    }, [])

    const getMajors = async () => {
        try {
            const res = await _getMajors();
            if (res.data) {
                setMajors(res.data);
            }
        } catch (error: any) {
            console.log(error?.response?.data?.error?.message)
        }
    }

    const validate = () => {
        if (!name || !code) {
            Toast.show({
                type: 'error',
                text1: 'Lỗi',
                text2: 'Vui lòng điền đầy đủ thông tin',
                position: 'bottom',
            });
            return false;
        }

        const now = new Date();
        const age = now.getFullYear() - date.getFullYear();
        if (age < 18) {
            Toast.show({
                type: 'error',
                text1: 'Lỗi',
                text2: 'Bạn chưa đủ 18 tuổi',
                position: 'bottom',
            });
            return false;
        }
        if (code.length !== 8) {
            Toast.show({
                type: 'error',
                text1: 'Lỗi',
                text2: 'Mã số sinh viên không hợp lệ',
                position: 'bottom',
            });
            return false;
        }
        return true;
    }

    const handleConfirm = async () => {
        if (!validate()) return;
        try {
            const data = {
                name,
                code,
                dob: date,
                gender: selectedGender,
                majors: value
            };
            const res = await _updateUser(data);
            if (res.data) {
                Toast.show({
                    type: 'success',
                    text1: 'Thành công',
                    text2: 'Cập nhật thông tin thành công',
                    position: 'bottom',
                });
                navigation.goBack();
            }
        }
        catch (error: any) {
            console.log(error)
            Toast.show({
                type: 'error',
                text1: 'Lỗi',
                text2: error?.response?.data?.error?.message,
                position: 'bottom',
            });

        }
    }


    return (
        <>
            {loading ? <Loading /> :
                <ImageBackground className='flex-1' source={MAIN.BACKGROUND}>
                    <SafeAreaView>
                        <View className="flex-row justify-center items-center h-16 px-3 bg-primary-dark">
                            <Pressable
                                onPress={() => navigation.goBack()}
                                className="absolute left-2 z-10"
                            >
                                <AntDesign name='left' size={30} color={globalColor.text_light} />
                            </Pressable>
                            <AppText color={globalColor.white} size={24} font={fontFamilies.robotoBold} text='Chỉnh sửa thông tin cá nhân' />
                        </View>
                        <ScrollView className='p-2'>
                            <View>
                                <Input

                                    leftIcon={<AntDesign name='idcard' size={24} color={globalColor.dark} />}
                                    label='Họ và tên'
                                    value={name}
                                    onChangeText={setName}
                                />
                            </View>
                            <View>
                                <Input
                                    leftIcon={<AntDesign name='idcard' size={24} color={globalColor.dark} />}
                                    label='Mã số sinh viên / giảng viên'
                                    placeholder='Nhập mã'
                                    value={code}
                                    keyboardType='number-pad'
                                    onChangeText={setCode}
                                />
                            </View>
                            <View className='px-2'>
                                <AppText text='Ngày sinh' className='mb-' />
                                <Pressable
                                    onPress={() => setOpenPicker(true)}
                                    className='h-[50px] rounded-lg border border-primary-dark justify-center px-2 mt-2'>
                                    <AppText
                                        text={date.toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric' })}
                                        size={16}
                                        color={globalColor.dark}
                                    />
                                </Pressable>
                                <DatePicker
                                    locale='vi'
                                    modal
                                    mode='date'
                                    open={openPicker}
                                    date={date}
                                    onConfirm={(date) => {
                                        setOpenPicker(false)
                                        setDate(date)
                                    }}
                                    onCancel={() => {
                                        setOpenPicker(false)
                                    }}
                                />
                            </View>
                            <View>

                            </View>

                        </ScrollView>
                        <View className='p-4 pt-6'>
                            <AppText text='Chọn lại nếu muốn thay đổi' color={globalColor.warning} font={fontFamilies.robotoBold} styles={{ paddingBottom: 5 }} />
                            <DropDownPicker
                                listMode='MODAL'
                                open={open}
                                value={value}
                                items={majors ? majors.map((major, index) => ({
                                    label: major.name,
                                    value: major._id ?? `major-${index}`
                                })) : []}
                                setOpen={setOpen}
                                setValue={setValue}
                                setItems={setMajors}
                                placeholder={'Chuyên ngành'}
                                modalAnimationType='slide'
                                modalTitle='Chọn chuyên ngành'
                                modalTitleStyle={{ color: globalColor.primary_2, fontFamily: fontFamilies.robotoBold }}
                                modalContentContainerStyle={{ padding: 10 }}
                                modalProps={{ animationType: 'slide' }}
                                style={{ borderColor: globalColor.primary_2, backgroundColor: 'transparent' }}
                            />
                        </View>
                        <View className="px-4 justify-center">
                            <AppText text="Giới tính" />
                            <View className="flex-row justify-around mt-2">
                                <Pressable
                                    onPress={() => setSelectedGender(eGender.nam)}
                                    className="flex-row w-14 justify-between items-center"
                                >
                                    <View
                                        className={`h-4 w-4 rounded-full ${selectedGender === 'Male' ? 'bg-blue-500' : 'bg-transparent border border-gray-400'}`}
                                    />
                                    <AppText text="Nam" />
                                </Pressable>
                                <Pressable
                                    onPress={() => setSelectedGender(eGender.nu)}
                                    className="flex-row w-14 justify-between items-center"
                                >
                                    <View
                                        className={`h-4 w-4 rounded-full ${selectedGender === 'Female' ? 'bg-blue-500' : 'bg-transparent border border-gray-400'}`}
                                    />
                                    <AppText text="Nữ" />
                                </Pressable>
                            </View>
                        </View>
                        <View className='px-4 pt-6'>
                            <AppButton
                                title='Xác nhận'
                                color={globalColor.primary_2}
                                onPress={() => {
                                    handleConfirm()
                                }}
                                textStyleProps={{ color: globalColor.white, fontFamily: fontFamilies.robotoBold, fontSize: 22 }}
                            />
                        </View>
                    </SafeAreaView>
                </ImageBackground >
            }
        </>

    )
}

export default UpdateInfoUser;