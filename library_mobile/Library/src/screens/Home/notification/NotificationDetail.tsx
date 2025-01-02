import { MAIN } from '@assets/images';
import AppText from '@components/AppText';
import Space from '@components/Space';
import { fontFamilies } from '@constants/fontFamilies';
import { globalColor } from '@constants/globalColor';
import { ScreenName } from '@constants/ScreenName';
import React, { useEffect, useState } from 'react';
import { FlatList, Image, ImageBackground, Pressable, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import AntDesign from 'react-native-vector-icons/AntDesign';
import { _getNotificationById, _markAsRead } from '../apis';

const NotificationDetail = ({ navigation, route }: any) => {
    const { id } = route.params;
    const [notificationDetail, setNotificationDetail] = useState<any>({});

    useEffect(() => {
        getNotificationDetail();
    }, []);

    const getNotificationDetail = async () => {
        try {
            await _markAsRead(id);
            const response = await _getNotificationById(id);
            if (response.data) {
                setNotificationDetail(response.data);
            }
        } catch (error) {
            console.log('error2', error);
        }
    }

    return (
        <ImageBackground className='flex-1' source={MAIN.BACKGROUND}>
            <SafeAreaView className='flex-1'>
                <View className='flex-row justify-between h-16 items-center px-3'>
                    <Pressable onPress={() => {
                        navigation.goBack()
                    }}>
                        <AntDesign name='left' size={30} color={globalColor.text_dark} />
                    </Pressable>
                    <AppText size={20} color={globalColor.dark} text='Thông báo chi tiết' font={fontFamilies.robotoBold} />
                    <Space width={30} />
                </View>
                <View className='p-4'>
                    {
                        notificationDetail.length > 0 && (
                            <>
                                <View className='py-2'>
                                    <AppText size={20} font={fontFamilies.robotoBold} text='Sách hay dành riêng cho bạn' />
                                </View>
                                <FlatList
                                    showsHorizontalScrollIndicator={false}
                                    data={notificationDetail}
                                    renderItem={({ item }) => {
                                        return (
                                            <Pressable
                                                onPress={() => navigation.navigate(ScreenName.BookDetail, { item })}
                                                className="px-3 mx-1 py-2 rounded-md bg-white">
                                                <Image resizeMode='stretch' source={{ uri: item.image }} className="w-36 h-44 rounded-md" />
                                                <View className="w-32 justify-center items-center pt-2">
                                                    <AppText center numberOfLines={2} size={14} font={fontFamilies.robotoBold} text={item.title} />
                                                    <AppText numberOfLines={1} size={11} text={item.author} />
                                                </View>
                                            </Pressable>
                                        )
                                    }}
                                    keyExtractor={(item, index) => index.toString()}
                                    horizontal
                                />
                            </>
                        )
                    }

                </View>
            </SafeAreaView>
        </ImageBackground>
    )
}

export default NotificationDetail