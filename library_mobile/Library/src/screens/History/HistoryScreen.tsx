import { MAIN } from '@assets/images';
import AppText from '@components/AppText';
import { ButtobnCenter } from '@components/index';
import { fontFamilies } from '@constants/fontFamilies';
import { globalColor } from '@constants/globalColor';
import { ScreenName } from '@constants/ScreenName';
import { formatDistanceToNow, parseISO } from 'date-fns';
import { vi } from 'date-fns/locale';
import React, { useEffect, useState } from 'react';
import { Image, ImageBackground, View } from 'react-native';
import RNFetchBlob from 'react-native-blob-util';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
    SwipeableFlatList,
    SwipeableQuickActionButton,
    SwipeableQuickActions,
} from 'react-native-swipe-list';
import Toast from 'react-native-toast-message';
import { iHistory } from 'src/types/iHistory';
import { _deleteHistory, _getHistoryByUser } from './apis';


const HistoryScreen = ({ navigation }: any) => {
    const [history, setHistory] = useState<iHistory[]>([]);
    const { fs } = RNFetchBlob;
    const { DocumentDir } = fs.dirs;

    useEffect(() => {
        const unsubscribe = navigation.addListener('focus', () => {
            getHistory();
        });
        return unsubscribe;
    }, [navigation]);

    const getHistory = async () => {
        try {
            const response = await _getHistoryByUser();
            if (response.data) {
                setHistory(response.data);
            }
        } catch (error) {
            console.log(error);
        }
    }

    const itemHistory = ({ item }: { item: iHistory }) => {
        const updatedAt = formatDistanceToNow(parseISO(item?.updatedAt.toString()), { addSuffix: true, locale: vi });
        return (
            <View className='w-full flex-row items-center justify-between py-4 border-b border-gray-300'>
                <View className='flex-row items-center'>
                    <Image
                        source={{ uri: item?.book?.image }}
                        className='w-16 h-24 mr-4'
                        style={{ borderRadius: 8 }}
                    />
                    <View className='w-1/2'>
                        <AppText
                            text={item?.book?.title}
                            font={fontFamilies.robotoBold}
                            size={18}
                        />
                        <AppText
                            text={`Trang: ${item?.page}`}
                            font={fontFamilies.robotoRegular}
                            size={16}
                        />
                        <AppText
                            text={`Tác giả: ${item?.book?.author}`}
                            font={fontFamilies.robotoRegular}
                            size={16}
                        />
                    </View>
                </View>
                <View className='h-full w-1/4 '>
                    <AppText
                        text={`${updatedAt}`}
                        font={fontFamilies.robotoRegular}
                        size={12}
                    />
                    <View className='flex-1 justify-end'>
                        <View className='pb-4'>
                            <AppText onPress={
                                () => navigation.navigate(ScreenName.BookDetail, { item: item.book })
                            } text={'Xem chi tiết'} color={globalColor.primary} />
                        </View>
                        <ButtobnCenter
                            label={'Đọc tiếp'}
                            colorLabel={globalColor.white}
                            sizeLabel={14}
                            onPress={() => navigation.navigate(ScreenName.ReadText,
                                {
                                    id: item.book._id,
                                    path: `${DocumentDir}/book_${item?.book?._id}.pdf`,
                                    book: item.book
                                }
                            )}
                            style={{ width: 80, height: 36, backgroundColor: globalColor.primary, borderRadius: 8 }}
                        />
                    </View>
                </View>
            </View>
        );
    }

    const handleDelete = async (id: string) => {
        try {
            const response = await _deleteHistory(id);
            if (response.data) {
                console.log(response.data);
                setHistory(history.filter(item => item._id !== id));
                Toast.show({
                    type: 'success',
                    text1: 'Xoá thành công',
                    visibilityTime: 2000,
                    autoHide: true,
                    position: 'bottom',
                });
            }
        } catch (error) {
            console.log(error);
            Toast.show({
                type: 'error',
                text1: 'Xoá thất bại',
                visibilityTime: 2000,
                autoHide: true,
                position: 'bottom',
            });

        }
    }


    return (
        <ImageBackground source={MAIN.BACKGROUND} style={{ flex: 1 }}>
            <SafeAreaView className='flex-1 px-4'>
                <View className='py-4'>
                    <AppText
                        text={'Lịch sử đã đọc'}
                        font={fontFamilies.robotoBold}
                        size={24}
                    />
                </View>
                <View className='flex-1'>
                    {/* <FlatList
                        showsVerticalScrollIndicator={false}
                        data={history}
                        renderItem={itemHistory}
                        keyExtractor={(item: iHistory) => item._id}
                    /> */}
                    <SwipeableFlatList
                        showsVerticalScrollIndicator={false}
                        data={history}
                        renderItem={itemHistory}
                        keyExtractor={(item: iHistory) => item._id}
                        renderRightActions={({ item }) => (
                            <SwipeableQuickActions style={{ justifyContent: 'center', alignItems: 'center' }}>
                                <SwipeableQuickActionButton
                                    onPress={() => handleDelete(item._id)}
                                    style={{
                                        padding: 10,
                                        borderWidth: 1,
                                        borderRadius: 8,
                                    }} textStyle={{ fontWeight: 'bold', color: 'red' }} text="Xoá" />
                            </SwipeableQuickActions>
                        )}
                    />
                </View>
            </SafeAreaView>
        </ImageBackground>
    );
};



export default HistoryScreen;
