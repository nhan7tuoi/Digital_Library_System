import AppButton from '@components/AppButton'
import AppText from '@components/AppText'
import Space from '@components/Space'
import { fontFamilies } from '@constants/fontFamilies'
import { globalColor } from '@constants/globalColor'
import { ScreenName } from '@constants/ScreenName'
import AsyncStorage from '@react-native-async-storage/async-storage'
import React, { useEffect } from 'react'
import { Image, Pressable, SafeAreaView, ScrollView, View } from 'react-native'
import AntDesign from 'react-native-vector-icons/AntDesign'

const SummaryBook = ({ navigation, route }: any) => {
    const { book, stack,path } = route.params;

    useEffect(() => {
        handleSaveShow(`SHOW_${book._id}`);
    }, [])

    const handleSaveShow = async (key: string) => {
        AsyncStorage.setItem(key, 'YES');
    };

    return (
        <SafeAreaView className='flex-1 bg-gray-100'>
            <View className='flex-row justify-between h-16 items-center px-3'>
                <Pressable onPress={() => {
                    navigation.goBack()
                }}>
                    <AntDesign name='left' size={30} color={globalColor.text_dark} />
                </Pressable>
                <AppText size={20} color={globalColor.text_dark} text='Tóm tắt' font={fontFamilies.robotoBold} />
                <Space width={20} />
            </View>
            <View className='h-2/10 flex-row  items-center px-3'>
                <Image resizeMode='stretch' source={{ uri: book.image }} className='w-24 h-32' />
                <View className='pl-4'>
                    <AppText size={20} color={globalColor.text_dark} text={book.title} font={fontFamilies.robotoBold} />
                    <AppText size={16} color={globalColor.text_dark} text={book.author} font={fontFamilies.robotoRegular} />
                </View>
            </View>
            <ScrollView className='flex-1 px-3' showsVerticalScrollIndicator={false}
            >
                <AppText size={16} color={globalColor.text_dark} text={book.summary} font={fontFamilies.robotoRegular} />
            </ScrollView>
            <View className='px-10 py-2'>
                <AppButton color={globalColor.primary} title={
                    stack == 'LISTEN' ? 'Nghe sách' : 'Đọc sách'
                } onPress={() => {
                    navigation.navigate(
                        stack == 'LISTEN' ? ScreenName.ListenText : ScreenName.ReadText
                        , stack == 'LISTEN' ? { bookId: book._id } : { book,path,id:book._id })
                }
                } />
            </View>
        </SafeAreaView>
    )
}

export default SummaryBook