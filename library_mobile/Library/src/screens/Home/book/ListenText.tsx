import AppText from '@components/AppText';
import { fontFamilies } from '@constants/fontFamilies';
import { globalColor } from '@constants/globalColor';
import { isAndroid } from '@constants/index';
import React, { useEffect, useRef, useState } from 'react';
import { FlatList, Pressable, Modal as RNModal, SafeAreaView, Text, View } from 'react-native';
import { Modal } from 'react-native-paper';
import Toast from 'react-native-toast-message';
import Tts, { Voice } from 'react-native-tts';
import AntDesign from 'react-native-vector-icons/AntDesign';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { IChapter } from 'src/types/iChapter';
import { _getBookContent, _getChapters, iBookContent } from '../apis';

function splitIntoSentences(content: string) {
    const contentWithoutFirstLine = content.split('\n').slice(1);
    return contentWithoutFirstLine.filter(sentence => sentence.trim() !== '');
}

const ListentText = ({ navigation, route }: any) => {
    const { bookId } = route.params;
    const currentSentenceIndex = useRef(0);
    const currentPage = useRef(2);
    const isPaused = useRef(false);
    const renderIndex = useRef(0);
    const speechRate = useRef(0.5);
    const voices = useRef<Voice[]>([]);
    const pages = useRef<number>(0);
    const currentVoice = useRef('vi-VN-language');
    const [sentences, setSentences] = useState<string[]>([]);
    const [renderTrigger, setRenderTrigger] = useState(0);
    const flatListRef = useRef<FlatList>(null);
    const [isPlaying, setIsPlaying] = useState<boolean>(false);
    const [chapter, setChapter] = useState<IChapter[]>([]);
    const speechRates = [
        { id: 0.1, label: 'x0.5', value: 0.1 },
        { id: 0.5, label: 'x1.0', value: 0.5 },
        { id: 0.75, label: 'x1.5', value: 0.75 },
        { id: 0.99, label: 'x2.0', value: 0.99 },
    ]
    const listVoices = isAndroid ? [
        {
            name: 'Nữ',
            id: 'vi-VN-language'
        },
        {
            name: 'Nam',
            id: 'vi-vn-x-vid-local'
        },
        {
            name: 'Nữ cao giọng',
            id: 'vi-vn-x-gft-local'
        },
        {
            name: 'Nam truyền cảm',
            id: 'vi-vn-x-vif-network'
        },
    ] : [
        {
            name: 'Nữ',
            id: 'com.apple.voice.compact.vi-VN.Linh'
        },

    ];
    const [mode, setMode] = useState<'light' | 'dark'>('light');
    const [fontSize, setFontSize] = useState<'small' | 'medium' | 'large'>('medium');
    const [isModalVisible, setIsModalVisible] = useState<boolean>(false);
    const [modalVisible, setModalVisible] = useState<boolean>(false);

    useEffect(() => {
        Tts.setDefaultRate(speechRate.current);
        Tts.setDefaultVoice(currentVoice.current);
        Tts.setDefaultLanguage('vi-VN');


        const onTtsFinish = () => {
            if (!isPaused.current && currentSentenceIndex.current < sentences.length - 1) {
                currentSentenceIndex.current += 1;
                renderIndex.current = currentSentenceIndex.current;
                setRenderTrigger((prev) => prev + 1);
                Tts.speak(sentences[currentSentenceIndex.current]);
            } else if (currentSentenceIndex.current >= sentences.length - 1) {
                nextPage();
            }
        };

        Tts.getInitStatus().then(() => {
            Tts.voices().then(availableVoices => {
                console.log('Voices');
                const vietnameseVoices = availableVoices.filter(voice => voice.language === 'vi-VN');
                if (vietnameseVoices.length > 0) {
                    voices.current = vietnameseVoices;
                    currentVoice.current = vietnameseVoices[0]?.id;
                } else {
                    console.log('No Vietnamese voices available.');
                }
            });
        }, (err: any) => {
            if (err.code === 'no_engine') {
                Tts.requestInstallEngine();
            }
        });

        const finishListener = Tts.addListener('tts-finish', onTtsFinish);
        if (sentences.length > 0) {
            Tts.speak(sentences[0]);
            // startReading();
            scrollToIndex(1);
        }

        return () => {
            Tts.stop();
            finishListener.remove();
        };
    }, [sentences]);

    useEffect(() => {
        getContent();
        getChapterByIdBook();
    }, []);

    useEffect(() => {
        scrollToIndex(renderIndex.current);
    }, [renderTrigger]);

    const getContent = async () => {
        const data:iBookContent = {
            bookId: bookId,
            page: currentPage.current
        }
        const res: any = await _getBookContent(data);
        if (res.data) {
            pages.current = res.data.page;
            const a = splitIntoSentences(res.data.content.content);
            if (a.length === 0) {
                console.log('Page is empty');
                nextPage();
            }
            const content = res.data.content.content;
            setSentences(splitIntoSentences(content));
        }
    };

    const nextPage = async () => {
        if (currentPage.current === pages.current) {
            Toast.show({
                type: 'info',
                text1: 'Bạn đã ở trang cuối',
                position: 'top',
            });
            return;
        }
        Tts.stop();
        isPaused.current = false;
        currentPage.current += 1;
        currentSentenceIndex.current = 0;
        renderIndex.current = 0;
        setRenderTrigger((prev) => prev + 1);

        await getContent();
        scrollToIndex(0);
    };

    const prevPage = async () => {
        if (currentPage.current === 1) {
            Toast.show({
                type: 'info',
                text1: 'Bạn dã ở trang đầu',
                position: 'top',
            });
            return;
        }
        Tts.stop();
        isPaused.current = false;
        currentPage.current -= 1;
        currentSentenceIndex.current = 0;
        renderIndex.current = 0;
        setRenderTrigger((prev) => prev + 1);

        await getContent();

    }

    const getChapterByIdBook = async () => {
        try {
            const response = await _getChapters(bookId);
            if (response.data) {
                setChapter(response.data);
            }
        } catch (error) {
            console.log('Error getChapterByIdBook: ', error);
        }
    }

    const nextIndexSentence = () => {
        Tts.stop();
        if (currentSentenceIndex.current < sentences.length - 1) {
            currentSentenceIndex.current += 1;
            renderIndex.current = currentSentenceIndex.current;
            setRenderTrigger((prev) => prev + 1);
            Tts.speak(sentences[currentSentenceIndex.current]);
        }
    }

    const prevIndexSentence = () => {
        Tts.stop();
        if (currentSentenceIndex.current > 0) {
            currentSentenceIndex.current -= 1;
            renderIndex.current = currentSentenceIndex.current;
            setRenderTrigger((prev) => prev + 1);
            Tts.speak(sentences[currentSentenceIndex.current]);
        }
    }

    const startReading = () => {
        setIsPlaying(false);
        if (isPaused.current) {
            isPaused.current = false;
            Tts.speak(sentences[currentSentenceIndex.current]);
        } else {
            currentSentenceIndex.current = 0;
            renderIndex.current = 0;
            setRenderTrigger((prev) => prev + 1);
            Tts.speak(sentences[0]);
        }
    };

    const pauseReading = () => {
        setIsPlaying(true);
        isPaused.current = true;
        Tts.stop();
    };

    const resetReading = () => {
        isPaused.current = false;
        Tts.stop();
        currentSentenceIndex.current = 0;
        renderIndex.current = 0;
        setRenderTrigger((prev) => prev + 1);
        Tts.speak(sentences[0]);
    };

    const changeRate = (rate: number) => {
        setIsModalVisible(false);
        pauseReading();
        speechRate.current = rate;
        Tts.setDefaultRate(rate);
        startReading();
    };

    const switchVoice = (voiceId: string) => {
        setIsModalVisible(false);
        pauseReading();
        currentVoice.current = voiceId;
        Tts.setDefaultVoice(voiceId);
        startReading();
    };

    const renderItem = ({ item, index }: { item: string; index: number }) => (
        <Text style={[{
            color: mode == 'light' ? globalColor.text_dark : globalColor.text_light,
            fontSize: fontSize === 'small' ? 14 : fontSize === 'medium' ? 16 : 18,
            marginTop: 5,
        }, renderIndex.current === index && {
            // backgroundColor: mode == 'light' ? 'yellow' : 'gray',
            fontWeight: 'bold',
            color: mode == 'light' ? globalColor.primary_2 : globalColor.dark,
        }]}>
            {item}
        </Text>
    );

    const scrollToIndex = (index: number) => {
        if (index > 0) {
            flatListRef.current?.scrollToIndex({ animated: true, index, viewPosition: 0.2 });
        }
    };

    const switchMode = (
        mode: 'light' | 'dark'
    ) => {
        setMode(mode);
    }

    const switchFontSize = (size: 'small' | 'medium' | 'large') => {
        setFontSize(size);
    }

    const Item = ({ item }: { item: IChapter }) => (
        <Pressable
            className='flex-row justify-between items-center p-4 mb-2 border-b bg-slate-200 rounded-md'
            onPress={() => {
                currentPage.current = item.startPage + 1;
                console.log('currentPage.current', currentPage.current);
                Tts.stop();
                isPaused.current = false;
                currentPage.current -= 1;
                currentSentenceIndex.current = 0;
                renderIndex.current = 0;
                setRenderTrigger((prev) => prev + 1);
                getContent();

                setModalVisible(false);

            }}>
            <AppText font={fontFamilies.robotoBold} text={item.title} />
            <AppText text={item.startPage} />
        </Pressable>
    )

    return (
        <>
            <SafeAreaView className={`flex-1`}>
                <View className={`flex-row justify-between h-16 items-center px-3 ${mode == 'light' ? '' : 'bg-primary-dark'}`}>
                    <Pressable onPress={() => {
                        navigation.goBack()
                    }}>
                        <AntDesign name='left' size={30} color={globalColor.text_dark} />
                    </Pressable>
                    <AppText size={20} color={globalColor.text_dark} text='Sách nói' font={fontFamilies.robotoBold} />
                    <View className='flex-row w-20 justify-between'>
                        <Pressable onPress={() => {
                            setModalVisible(true);
                        }}>
                            <AntDesign name='menu-unfold' size={30} color={globalColor.text_dark} />
                        </Pressable>
                        <Pressable onPress={() => {
                            setIsModalVisible(true);
                        }}>
                            <AntDesign name='setting' size={30} color={globalColor.text_dark} />
                        </Pressable>
                    </View>
                </View>
                <View className={`flex-1 ${mode == 'light' ? 'bg-gray-300' : 'bg-slate-700'}`}>
                    <View className='flex-1 py-4 px-8'>
                        <FlatList
                            style={{ flex: 1, padding: 8, backgroundColor: mode == 'light' ? globalColor.bg_light : globalColor.bg_dark }}
                            showsVerticalScrollIndicator={false}
                            ref={flatListRef}
                            data={sentences}
                            renderItem={renderItem}
                            contentContainerStyle={{ padding: 8 }}
                            keyExtractor={(item, index) => index.toString()}
                            getItemLayout={(data, index) => ({
                                length: 30,
                                offset: 30 * index,
                                index,
                            })}
                        />
                    </View>
                    <View className='w-full h-1.5/10  justify-center items-center flex-row'>
                        <View className='flex-row w-3/4 h-6/10 rounded-xl justify-between items-center bg-blue-300 px-2 border border-cyan-500'>
                            <Pressable
                                onPress={prevPage}
                            >
                                <AntDesign name='stepbackward' size={32} color={globalColor.text_dark} />
                            </Pressable>
                            <Pressable
                                onPress={prevIndexSentence}
                            >
                                <AntDesign name='banckward' size={32} color={globalColor.text_dark} />
                            </Pressable>
                            <Pressable
                                onPress={() => {
                                    if (isPlaying) {
                                        startReading();
                                    } else {
                                        pauseReading();
                                    }
                                }}
                            >
                                <AntDesign name={
                                    isPlaying ? 'play' : 'pause'
                                } size={40} color={globalColor.text_dark} />
                            </Pressable>
                            <Pressable
                                onPress={nextIndexSentence}
                            >
                                <AntDesign name='forward' size={32} color={globalColor.text_dark} />
                            </Pressable>
                            <Pressable
                                onPress={nextPage}
                            >
                                <AntDesign name='stepforward' size={32} color={globalColor.text_dark} />
                            </Pressable>
                        </View>
                    </View>
                </View>
            </SafeAreaView>
            <Modal
                visible={isModalVisible}
                onDismiss={() => { setIsModalVisible(false) }}
                contentContainerStyle={{ height: '60%', width: '100%', backgroundColor: mode == 'light' ? globalColor.bg_light : globalColor.bg_dark, borderRadius: 10, padding: 15 }}
            >
                <View className='flex-1 w-full h-4/10'>
                    <View className='flex-row w-full h-24 justify-around items-center'>
                        <Pressable
                            onPress={() => switchMode('light')}
                            className={`flex-row border p-2 rounded-xl ${mode == 'light' ? 'bg-primary-dark' : 'border-gray-300'} `}>
                            <MaterialIcons name='light-mode' size={30} color={globalColor.text_dark} />
                            <AppText text='Chế độ sáng' size={20} color={globalColor.text_dark} />
                        </Pressable>
                        <Pressable
                            onPress={() => switchMode('dark')}
                            className={`flex-row border p-2 rounded-xl ${mode == 'dark' ? 'bg-primary-dark' : 'border-gray-300'} `}>
                            <MaterialIcons name='dark-mode' size={30} color={globalColor.text_dark} />
                            <AppText text='Chế độ tối' size={20} color={globalColor.text_dark} />
                        </Pressable>
                    </View>
                    <AppText font={fontFamilies.robotoBold} text='Tốc độ đọc' size={20} color={globalColor.text_dark} />
                    <View className='flex-row w-full h-24 justify-around items-center'>
                        {speechRates.map(rate => (
                            <Pressable
                                key={rate.id}
                                onPress={() => changeRate(rate.value)}
                                className={`flex-row border p-2 rounded-xl ${speechRate.current == rate.id ? 'bg-primary-dark' : ''}`}>
                                <AppText text={rate.label} size={20} color={globalColor.text_dark} />
                            </Pressable>
                        ))}
                    </View>
                    <AppText font={fontFamilies.robotoBold} text='Giọng đọc' size={20} color={globalColor.text_dark} />
                    <View className='flex-row w-full h-24 justify-around items-center'>
                        {listVoices.map(v => (
                            <Pressable
                                key={v.id}
                                onPress={() => switchVoice(v.id)}
                                className={`flex-row p-2 border border-gray-200 ${currentVoice.current == v.id ? 'bg-primary-dark' : ''}`}>
                                <AppText text={v.name} size={20} color={globalColor.text_dark} />
                            </Pressable>
                        ))}
                    </View>
                    <AppText font={fontFamilies.robotoBold} text='Cỡ chữ' size={20} color={globalColor.text_dark} />
                    <View className='flex-row w-full h-24 justify-around items-center'>
                        <Pressable
                            onPress={() => switchFontSize('small')}
                            className={`flex-row border p-2 rounded-xl ${fontSize == 'small' ? 'bg-primary-dark' : 'border-gray-200'}`}>
                            <MaterialIcons name='format-size' size={20} color={globalColor.text_dark} />
                            <AppText text='Nhỏ' size={14} color={globalColor.text_dark} />
                        </Pressable>
                        <Pressable
                            onPress={() => switchFontSize('medium')}
                            className={`flex-row border p-2 rounded-xl ${fontSize == 'medium' ? 'bg-primary-dark' : 'border-gray-200'}`}>
                            <MaterialIcons name='format-size' size={24} color={globalColor.text_dark} />
                            <AppText text='Vừa' size={16} color={globalColor.text_dark} />
                        </Pressable>
                        <Pressable
                            onPress={() => switchFontSize('large')}
                            className={`flex-row border p-2 rounded-xl ${fontSize == 'large' ? 'bg-primary-dark' : 'border-gray-200'}`}>
                            <MaterialIcons name='format-size' size={32} color={globalColor.text_dark} />
                            <AppText text='Lớn' size={20} color={globalColor.text_dark} />
                        </Pressable>
                    </View>
                </View>
            </Modal>
            <RNModal animationType="slide" transparent={true} visible={modalVisible} onDismiss={() => setModalVisible(!modalVisible)}>
                <View className={`flex-1 bg-gray-300 w-full h-5/6 absolute bottom-0 rounded-tl-3xl rounded-tr-3xl`}>
                    <View className={`h-16 w-full justify-center items-center border-b`}>
                        <Pressable className='absolute left-3' onPress={() => {
                            setModalVisible(!modalVisible);
                        }}>
                            <MaterialIcons name='clear' size={28} color={globalColor.primary} />
                        </Pressable>
                        <View className='flex-row justify-center items-center w-4/6'>

                            <AppText color={globalColor.primary} size={20} font={fontFamilies.robotoBold} text='Mục lục' />
                        </View>
                    </View>
                    <View className=' flex-1 bg-white'>
                        <FlatList
                            showsVerticalScrollIndicator={false}
                            data={chapter}
                            contentContainerStyle={{ padding: 8 }}
                            keyExtractor={(item) => item._id}
                            renderItem={({ item }) => (
                                <Item item={item} />
                            )}
                        />
                    </View>
                </View>
            </RNModal>
        </>
    );
};

export default ListentText;
