import AppText from '@components/AppText';
import Space from '@components/Space';
import { fontFamilies } from '@constants/fontFamilies';
import { globalColor } from '@constants/globalColor';
import { isAndroid } from '@constants/index';
import { ScreenName } from '@constants/ScreenName';
import React, { useEffect, useState } from 'react';
import { FlatList, Pressable, View } from 'react-native';
import ImageColors from 'react-native-image-colors';
import { SafeAreaView } from 'react-native-safe-area-context';
import AntDesign from 'react-native-vector-icons/AntDesign';
import { iBook } from 'src/types/iBook';
import { defaultListChapter, IChapter } from '../../../types/iChapter';
import { _getChapterByIdBook } from '../apis';

const ChapterAudio = ({ navigation, route }: any) => {
    const { bookDetail } = route?.params;
    const [book, setBook] = useState<iBook>(bookDetail);
    const [chapter, setChapter] = useState<IChapter[]>(defaultListChapter);
    const [background, setBackground] = useState('white');

    useEffect(() => {
        getChapterByIdBook();
    }, []);

    const getChapterByIdBook = async () => {
        try {
            const response = await _getChapterByIdBook(book._id);
            if (response.status) {
                setChapter(response.data);
            }
        } catch (error) {
            console.log('Error getChapterByIdBook: ', error);
        }
    }
    useEffect(() => {
        getImageColors();
    }, [])
    const getImageColors = async () => {
        const result: any = await ImageColors.getColors(book.image, {
            fallback: '#fff',
            cache: true,
            key: book.image,
        });
        setBackground(isAndroid ? result.average : result.secondary);
    };

    return (
        <SafeAreaView className='flex-1' style={{ backgroundColor: background }} >
            <View className='flex-row justify-between h-16 items-center px-3'>
                <Pressable onPress={() => {
                    navigation.goBack()
                }}>
                    <AntDesign name='left' size={30} color={globalColor.text_dark} />
                </Pressable>
                <AppText size={28} color={globalColor.text_light} text={book.title} font={fontFamilies.robotoBold} />
                <Space width={1} />
            </View>
            <FlatList
                data={chapter}
                keyExtractor={(item) => item._id}
                renderItem={({ item }) => (
                    <Pressable onPress={() => {
                        navigation.navigate(ScreenName.AudioBook, {
                            chapterBook: item,
                            bookDetail: book
                        });
                    }} className='flex-row justify-between items-center p-6 border-b border-gray-200'>
                        <AppText size={16} color={globalColor.text_light} text={item?.title} font={fontFamilies.robotoRegular} />
                        <AntDesign name='right' size={20} color={globalColor.text_dark} />
                    </Pressable>
                )}
            />
        </SafeAreaView>
    )
}

export default ChapterAudio