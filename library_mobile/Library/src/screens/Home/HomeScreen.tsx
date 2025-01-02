import { MAIN } from '@assets/images';
import AppText from '@components/AppText';
import { fontFamilies } from '@constants/fontFamilies';
import { globalColor } from '@constants/globalColor';
import { WIDTH } from '@constants/index';
import { ScreenName } from '@constants/ScreenName';
import messaging from '@react-native-firebase/messaging';
import { getUserLocalStorage } from '@utils/storage';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Alert, BackHandler, FlatList, Image, ImageBackground, Pressable, ScrollView, useColorScheme, View } from 'react-native';
import { Badge } from 'react-native-paper';
import Carousel from 'react-native-reanimated-carousel';
import { SafeAreaView } from 'react-native-safe-area-context';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { iBook } from 'src/types/iBook';
import { _getBooksMajors, _getBooksTopRated, _getBooksTopViewed, _getNotifications, _getRecommendBooks } from './apis';
import { useSelector } from 'react-redux';


const HomeScreen = ({ navigation }: any) => {
    const colorScheme = useColorScheme();
    const [listNewBook, setListNewBook] = useState<iBook[]>([]);
    const [listRecommendBook, setListRecommendBook] = useState<iBook[]>([]);
    const [listRecomendByMajors, setListRecomendByMajors] = useState<iBook[]>([]);
    const [listBookTopView, setListBookTopView] = useState<iBook[]>([]);
    const [listBookTopRate, setListBookTopRate] = useState<iBook[]>([]);
    const [loadImage, setLoadImage] = useState<boolean>(false);
    const [loading, setLoading] = useState<boolean>(false);
    const [notifications, setNotifications] = useState<any>(null);
    const user = useSelector((state: any) => state.auth.user);

    useEffect(() => {
        messaging().getInitialNotification().then(async (remoteMessage: any) => {
            const data = remoteMessage.data
            navigationToNotification(data.notification_id);
        })
        messaging().onMessage(async (remoteMessage: any) => {
            if (remoteMessage.data) {
                getNotification();
            }
        });
    }, []);

    const navigationToNotification = (notification_id: string) => {
        navigation.navigate(ScreenName.NotificationDetail, { notification_id });
    };

    useEffect(() => {
        const unsubscribe = navigation.addListener('focus', () => {
            getNotification();
            getBookTopRate();
            getBookTopView();
            getRecommendBook();
            getRecommendBookByMajors();
        });
        return unsubscribe;
    }, [navigation]);

    useEffect(() => {
        const backAction = () => {
            if (navigation.isFocused()) {
                Alert.alert(
                    'Thoát ứng dụng',
                    'Bạn có chắc chắn muốn thoát ứng dụng không?',
                    [
                        {
                            text: 'Hủy',
                            onPress: () => null,
                            style: 'cancel'
                        },
                        {
                            text: 'Đồng ý',
                            onPress: () => BackHandler.exitApp()
                        },
                    ],
                    { cancelable: false }
                );
                return true;
            } else {
                return false;
            }

        };

        const backHandler = BackHandler.addEventListener(
            'hardwareBackPress',
            backAction
        );

        return () => backHandler.remove();
    }, []);



    const getNotification = async () => {
        try {
            const response = await _getNotifications();
            if (response.data) {
                const data = response.data.filter((item: any) => item.isRead == false);
                setNotifications(data);
            }
        } catch (error) {
            console.log('error', error);
        }
    }
    const getBookTopRate = async () => {
        try {
            const response = await _getBooksTopRated();
            if (response.data) {
                setListBookTopRate(response.data);
            }
        } catch (error) {
            console.log('error', error);
        }
    }

    const getBookTopView = async () => {
        try {
            const response = await _getBooksTopViewed();
            if (response.data) {
                setListBookTopView(response.data);
            }
        } catch (error) {
            console.log('error', error);
        }
    }
    const getRecommendBook = async () => {
        try {
            const response = await _getRecommendBooks();
            if (response.data) {
                setListRecommendBook(response.data);
            }
        } catch (error) {
            console.log('error', error);
        }
    }

    const getRecommendBookByMajors = async () => {
        try {
            const response = await _getBooksMajors();
            if (response.data) {
                setListRecomendByMajors(response.data);
                setLoadImage(false);
                setLoading(false);
            }
        } catch (error) {
            console.log('error', error);
        }
    }


    return (
        <ImageBackground source={MAIN.BACKGROUND} style={{ flex: 1 }}>
            <SafeAreaView className='flex-1 px-3'>
                <View className='flex-row justify-between py-4 pb-8'>
                    <Pressable
                        onPress={() => { navigation.navigate(ScreenName.AccountDetail) }}
                    >
                        <Image source={{ uri: user.image }} className='w-10 h-10 rounded-full' />
                    </Pressable>
                    <Pressable
                        onPress={() => { navigation.navigate(ScreenName.Notification) }}
                    >
                        <Ionicons name='notifications-sharp' size={40} color={globalColor.primary} />
                        <Badge className='absolute'>
                            {notifications?.length}
                        </Badge>
                    </Pressable>
                    <Pressable
                        onPress={() => { navigation.navigate(ScreenName.SearchScreen) }}
                        className='w-4/6 bg-white items-center flex-row rounded-xl px-4 border border-gray-200'>
                        <Ionicons name='search' size={32} />
                        <AppText size={16} color={globalColor.text_dark} text='Tên sách, tên khoa ....' />
                    </Pressable>
                </View>
                <ScrollView showsVerticalScrollIndicator={false}>
                    <View className='absolute'>
                        <AppText size={20} font={fontFamilies.robotoBold} text='Sách theo khoa của bạn' />
                    </View>
                    <View className='h-72 justify-center items-center'>
                        <Carousel
                            loop
                            mode='parallax'
                            width={WIDTH}
                            height={350}
                            autoPlay={true}
                            autoPlayInterval={1000}
                            modeConfig={{
                                parallaxScrollingScale: 0.8,
                                parallaxScrollingOffset: 250,
                            }}
                            data={listRecomendByMajors}
                            renderItem={({ item }) => {
                                return (
                                    <Pressable
                                        onPress={() => navigation.navigate(ScreenName.BookDetail, { item })}
                                        className="w-60 h-80 px-3 mx-1 py-2 rounded-md bg-white justify-center items-center">
                                        {
                                            loadImage ? (
                                                <View className="w-44 h-48 rounded-md justify-center items-center">
                                                    <ActivityIndicator size="large" color={globalColor.primary} />
                                                </View>
                                            ) : (
                                                <Image resizeMode='stretch' source={{ uri: item.image }} className="w-48 h-56 rounded-md" />
                                            )
                                        }
                                        <View className="w-32 justify-center items-center pt-2">
                                            <AppText center numberOfLines={2} size={16} font={fontFamilies.robotoBold} text={item.title} />
                                            <AppText numberOfLines={1} size={12} text={item.author} />
                                        </View>
                                    </Pressable>
                                )
                            }}
                        />
                    </View>
                    <View className='py-4'>
                        {
                            listRecommendBook.length > 0 && (
                                <>
                                    <View className='py-2'>
                                        <AppText size={20} font={fontFamilies.robotoBold} text='Gợi ý dành riêng cho bạn' />
                                    </View>
                                    <FlatList
                                        showsHorizontalScrollIndicator={false}
                                        data={listRecommendBook}
                                        renderItem={({ item }) => {
                                            return (
                                                <Pressable
                                                    onPress={() => navigation.navigate(ScreenName.BookDetail, { item })}
                                                    className="px-3 mx-1 py-2 rounded-md bg-white">
                                                    {
                                                        loadImage ? (
                                                            <View className="w-36 h-44 rounded-md justify-center items-center">
                                                                <ActivityIndicator size="large" color={globalColor.primary} />
                                                            </View>
                                                        ) : (
                                                            <Image resizeMode='stretch' source={{ uri: item.image }} className="w-36 h-44 rounded-md" />
                                                        )
                                                    }
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

                        {
                            listBookTopRate.length > 0 && (
                                <>
                                    <View className='py-2'>
                                        <AppText size={20} font={fontFamilies.robotoBold} text='Sách đánh giá cao' />
                                    </View>
                                    <FlatList
                                        data={listBookTopRate}
                                        horizontal={true}
                                        showsHorizontalScrollIndicator={false}
                                        renderItem={({ item }) => (
                                            <Pressable
                                                onPress={() => navigation.navigate(ScreenName.BookDetail, { item })}
                                                className="flex-row items-center mx-2 p-3 bg-white rounded-md shadow-md w-72 h-36"
                                            >
                                                {loadImage ? (
                                                    <View className="w-28 h-32 rounded-md justify-center items-center bg-gray-200">
                                                        <ActivityIndicator size="large" color={globalColor.primary} />
                                                    </View>
                                                ) : (
                                                    <Image
                                                        source={{ uri: item.image }}
                                                        resizeMode="cover"
                                                        className="w-24 h-32 rounded-md"
                                                    />
                                                )}
                                                <View className="flex-1 pl-4">
                                                    <AppText
                                                        numberOfLines={4}
                                                        size={16}
                                                        font={fontFamilies.robotoBold}
                                                        text={item.title}
                                                        className="text-lg font-semibold text-gray-900"
                                                    />
                                                    <AppText
                                                        numberOfLines={2}
                                                        size={13}
                                                        text={item.author}
                                                        className="text-sm text-gray-500 mt-1"
                                                    />
                                                </View>
                                            </Pressable>
                                        )}
                                        keyExtractor={(item, index) => index.toString()}
                                    />
                                </>
                            )
                        }
                        {
                            listBookTopView.length > 0 && (
                                <>
                                    <View className='py-2'>
                                        <AppText size={20} font={fontFamilies.robotoBold} text='Sách có lượt đọc cao nhất' />
                                    </View>
                                    <FlatList
                                        showsHorizontalScrollIndicator={false}
                                        data={listBookTopView}
                                        renderItem={({ item }) => {
                                            return (
                                                <Pressable
                                                    onPress={() => navigation.navigate(ScreenName.BookDetail, { item })}
                                                    className="px-3 mx-1 py-2 rounded-md bg-white">
                                                    {
                                                        loadImage ? (
                                                            <View className="w-36 h-44 rounded-md justify-center items-center">
                                                                <ActivityIndicator size="large" color={globalColor.primary} />
                                                            </View>
                                                        ) : (
                                                            <Image resizeMode='stretch' source={{ uri: item.image }} className="w-36 h-44 rounded-md" />
                                                        )
                                                    }
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
                        {/* {
                            listBook2.length > 0 && (
                                <>
                                    <View className='py-2'>
                                        <AppText size={20} font={fontFamilies.robotoBold} text='Sách demo' />
                                    </View>
                                    <FlatList
                                        showsHorizontalScrollIndicator={false}
                                        data={listBook2}
                                        renderItem={({ item }) => {
                                            return (
                                                <Pressable
                                                    onPress={() => navigation.navigate(ScreenName.BookDetail, { item })}
                                                    className="px-3 mx-1 py-2 rounded-md bg-white">
                                                    {
                                                        loadImage ? (
                                                            <View className="w-36 h-44 rounded-md justify-center items-center">
                                                                <ActivityIndicator size="large" color={globalColor.primary} />
                                                            </View>
                                                        ) : (
                                                            <Image resizeMode='stretch' source={{ uri: item.image }} className="w-36 h-44 rounded-md" />
                                                        )
                                                    }
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
                        } */}
                    </View>
                </ScrollView>
            </SafeAreaView >
        </ImageBackground>
    )
}

export default HomeScreen;