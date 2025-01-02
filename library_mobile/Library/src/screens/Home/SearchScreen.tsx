import { MAIN } from '@assets/images'
import AppText from '@components/AppText'
import { fontFamilies } from '@constants/fontFamilies'
import { globalColor } from '@constants/globalColor'
import { ScreenName } from '@constants/ScreenName'
import debounce from 'lodash/debounce'
import React, { useEffect, useRef, useState } from 'react'
import { Image, ImageBackground, Pressable, TextInput, View } from 'react-native'
import { FlatList } from 'react-native-gesture-handler'
import { SafeAreaView } from 'react-native-safe-area-context'
import AntDesign from 'react-native-vector-icons/AntDesign'
import { iBook } from 'src/types/iBook'
import { _findBooks, } from './apis'

const SearchScreen = ({ navigation }: any) => {
    const [searchText, setSearchText] = useState<string>('');
    const [searchResult, setSearchResult] = useState<iBook[]>([]);
    const inputRef: any = useRef(null);
    const debouncedSearch = useRef(
        debounce(async (text: string) => {
            try {
                const response = await _findBooks(text);
                if (response.data) {
                    setSearchResult(response.data);
                }
            } catch (error) {
                console.log(error);
            }
        }, 1500)
    ).current;

    useEffect(() => {
        if (inputRef.current) {
            inputRef.current.focus();
        }
    }, [])

    const handleChangeText = (text: string) => {
        setSearchText(text);
        debouncedSearch(text);
    };

    return (
        <SafeAreaView className='flex-1'>
            <ImageBackground resizeMode='stretch' source={MAIN.BACKGROUND}>
                <View className='h-20  justify-between items-center flex-row px-4 border-blue-200'>
                    <Pressable onPress={() => {
                        navigation.goBack()
                    }}>
                        <AntDesign name='left' size={30} color={globalColor.text_dark} />
                    </Pressable>
                    <View className='w-5/6 h-5/6 justify-center'>
                        <TextInput
                            value={searchText}
                            ref={inputRef}
                            onChangeText={(text) => handleChangeText(text)}
                            className='text-black text-xl w-full h-5/6 border border-gray-300 self-center rounded-2xl px-4 bg-white'
                            placeholder='Tên sách, tên ngành ....'
                            placeholderTextColor={globalColor.text_dark}
                        />
                    </View>
                </View>
            </ImageBackground>
            <View className='flex-1 bg-white'>
                <FlatList
                    data={searchResult}
                    keyExtractor={(item: any) => item.id}
                    numColumns={1}
                    renderItem={({ item }: { item: iBook }) => {
                        return (
                            <Pressable
                                key={item._id}
                                onPress={() => navigation.navigate(ScreenName.BookDetail, { item })}
                                className="flex-row items-center mx-2 p-3 bg-white rounded-md shadow-md w-72 h-36"
                            >
                                <Image
                                    source={{ uri: item.image }}
                                    resizeMode="stretch"
                                    className="w-24 h-32 rounded-md"
                                />
                                <View className="w-7/10 pl-4">
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
                                <View className='w-1/10 pl-4'>
                                    <AppText onPress={
                                        () => navigation.navigate(ScreenName.BookDetail, { item })
                                    } color={globalColor.primary} text={'Xem chi tiết'} font={fontFamilies.robotoBold} size={16} />
                                </View>
                            </Pressable>

                        )
                    }}
                />
            </View>
        </SafeAreaView>
    )
}

export default SearchScreen