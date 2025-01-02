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
import { _getNotifications } from '../apis';


const Notification = ({ navigation }: any) => {
    const [notifications, setNotifications] = useState<any[]>([]);

    useEffect(() => {
        const unsubscribe = navigation.addListener('focus', () => {
            getNotification();
        }
        );
        return unsubscribe;
    }, [navigation]);

    const getNotification = async () => {
        try {
            const response = await _getNotifications();
            if (response.data) {
                setNotifications(response.data);
            }
        } catch (error) {
            console.log('error', error);
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
                    <AppText size={20} color={globalColor.dark} text='Thông báo' font={fontFamilies.robotoBold} />
                    <Space width={30} />
                </View>
                {
                    notifications.length > 0
                        ?
                        <View className='flex-1'>
                            <FlatList
                                data={notifications}
                                keyExtractor={(item, index) => index.toString()}
                                contentContainerStyle={{ paddingBottom: 20 }}
                                renderItem={({ item }) => {
                                    return (
                                        <Pressable
                                            onPress={() => {
                                                navigation.navigate(ScreenName.NotificationDetail, { id: item.notification._id })
                                            }}
                                            className='px-5'>
                                            <View className={`px-8 py-2 h-20 flex-row border border-gray-300 mt-2 rounded-xl ${item.isRead == false ? 'bg-green-200' : ''}`}>
                                                <Image source={MAIN.ICON_NOTIFICATION} className='w-14 h-14' />
                                                <View className='px-4 justify-center flex-1'>
                                                    <AppText numberOfLines={2} size={16} color={globalColor.dark} text={item.notification.title} font={fontFamilies.robotoBold} />
                                                    <AppText size={14} color={globalColor.dark} text={item.notification.content} font={fontFamilies.robotoRegular} />
                                                </View>
                                            </View>
                                        </Pressable>
                                    )
                                }}
                            />
                        </View>
                        :
                        <View className='flex-1 justify-center items-center'>
                            <AppText size={20} color={globalColor.dark} text='Chưa có thông báo mới' font={fontFamilies.robotoBold} />
                        </View>
                }
            </SafeAreaView>
        </ImageBackground>
    )
}

export default Notification