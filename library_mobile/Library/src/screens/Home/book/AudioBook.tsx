import { MAIN } from '@assets/images';
import AppText from '@components/AppText';
import Space from '@components/Space';
import { fontFamilies } from '@constants/fontFamilies';
import { globalColor } from '@constants/globalColor';
import { ScreenName } from '@constants/ScreenName';
import Slider from '@react-native-community/slider';
import React, { useEffect, useRef, useState } from 'react';
import { Animated, Easing, Image, Pressable, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import SoundPlayer from 'react-native-sound-player';
import AntDesign from 'react-native-vector-icons/AntDesign';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { iBook } from 'src/types/iBook';
import { IChapter } from 'src/types/iChapter';

const AudioBook = ({ navigation, route }: any) => {
    const { bookDetail, chapterBook } = route?.params;
    const [book, setBook] = useState<iBook>(bookDetail);
    const [chapter, setChapter] = useState<IChapter>(chapterBook);
    const [isPlaying, setIsPlaying] = useState(false);
    const [position, setPosition] = useState(0);
    const [duration, setDuration] = useState(0);
    const [currentTime, setCurrentTime] = useState(0);

    const spinValue = useRef(new Animated.Value(0)).current;
    const spinAnimation = useRef<any>(null);

    useEffect(() => {
        const setupSoundPlayer = async () => {
            try {
                toggleSpinning();
                SoundPlayer.playUrl(chapter.audioLink);
                const info = await SoundPlayer.getInfo();
                setDuration(info.duration);
                setCurrentTime(info.currentTime);
            } catch (e) {
                console.log('Cannot play the sound file', e);
            }
        };

        setupSoundPlayer();

        const interval = setInterval(async () => {
            try {
                const info = await SoundPlayer.getInfo();
                setPosition(info.currentTime);
                setCurrentTime(info.currentTime);
            } catch (e) {
                console.log('Error getting sound info', e);
            }
        }, 1000);

        return () => {
            clearInterval(interval);
            SoundPlayer.stop();
        };
    }, []);


    const playSound = () => {
        try {
            toggleSpinning();
            SoundPlayer.play();
        } catch (e) {
            console.log('Cannot play the sound file', e);
        }
    }

    const pauseSound = () => {
        try {
            toggleSpinning();
            SoundPlayer.pause();
        } catch (error) {
            console.log('Error pause sound', error);
        }
    };

    const stopSound = () => {
        try {
            SoundPlayer.stop();
            setPosition(0);
        } catch (error) {
            console.log('Error stop sound', error);
        }
    };

    const seekTo = async (value: number) => {
        try {
            SoundPlayer.seek(value);
            setPosition(value);
        } catch (e) {
            console.log('Error seeking sound', e);
        }
    };

    const rewind = async () => {
        try {
            SoundPlayer.seek(position - 30);
            setPosition(position - 30);
        } catch (e) {
            console.log('Error rewinding sound', e);
        }
    }

    const forward = async () => {
        try {
            SoundPlayer.seek(position + 30);
            setPosition(position + 30);
        } catch (e) {
            console.log('Error forwarding sound', e);
        }
    }


    const startSpinning = () => {
        spinValue.setValue(0);
        spinAnimation.current = Animated.loop(
            Animated.timing(spinValue, {
                toValue: 1,
                duration: 8000,
                useNativeDriver: true,
                easing: Easing.linear,
            })
        );
        spinAnimation.current.start();
    };

    const stopSpinning = () => {
        if (spinAnimation.current) {
            spinAnimation.current.stop();
        }
    };

    const toggleSpinning = () => {
        if (spinAnimation.current) {
            stopSpinning();
            spinAnimation.current = null;
        } else {
            startSpinning();
        }
    };

    const spin = spinValue.interpolate({
        inputRange: [0, 1],
        outputRange: ['0deg', '360deg'],
    });

    const formatTime = (time: number) => {
        const minutes = Math.floor(time / 60);
        const seconds = Math.floor(time % 60);
        return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
    };


    return (
        <SafeAreaView className='flex-1' style={{ backgroundColor: globalColor.bg_dark }}>
            <View className='flex-row justify-between h-16 items-center px-3'>
                <Pressable onPress={() => {
                    stopSound();
                    navigation.goBack();
                }}>
                    <AntDesign name='left' size={30} color={globalColor.text_dark} />
                </Pressable>
                <AppText size={20} color={globalColor.text_light} text={book?.title} font={fontFamilies.robotoBold} />
                <Space width={30} />
            </View>
            <View className='h-6/10 justify-center items-center'>
                <Animated.View
                    className='w-96 h-96 justify-center items-center rounded-full bg-black'
                    style={{
                        transform: [{ rotate: spin }],
                    }}
                >
                    <Image className='h-9/10 w-9/12' resizeMode='stretch' source={MAIN.DIANHAC} />
                </Animated.View>
                <Image
                    className='absolute top-1/4 rounded-xl'
                    source={{ uri: book.image }}
                />
            </View>
            <View className='p-4'>
                <AppText size={20} text={chapter.title} font={fontFamilies.robotoBold} />
            </View>
            <View className='w-full h-05/10 justify-center items-center'>
                <View className='flex-row justify-between w-full px-4 py-2'>
                    <AppText text={formatTime(currentTime)} size={16} color={globalColor.text_light} />

                    <AppText text={formatTime(duration)} size={16} color={globalColor.text_light} />
                </View>
                <Slider
                    style={{ width: '90%', height: 5 }}
                    minimumValue={0}
                    maximumValue={duration}
                    value={position}
                    onSlidingComplete={seekTo}
                    thumbTintColor={globalColor.primary}
                    minimumTrackTintColor={globalColor.white}
                    maximumTrackTintColor={globalColor.text_light}
                />
            </View>
            <View className='flex-1 w-full flex-row justify-center items-start'>
                <View className='flex-row w-full justify-around items-center'>
                    <Pressable onPress={stopSound}>
                        <AntDesign name='stepbackward' size={30} color={globalColor.text_light} />
                    </Pressable>
                    <Pressable onPress={rewind}>
                        <AntDesign name='fastbackward' size={30} color={globalColor.text_light} />
                    </Pressable>
                    <Pressable onPress={() => {
                        isPlaying ? playSound() : pauseSound();
                        setIsPlaying(!isPlaying);
                    }}>
                        <AntDesign name={isPlaying ? 'play' : 'pause'} size={60} color={globalColor.text_light} />
                    </Pressable>
                    <Pressable onPress={forward}>
                        <AntDesign name='fastforward' size={30} color={globalColor.text_light} />
                    </Pressable>
                    <Pressable onPress={stopSound}>
                        <AntDesign name='stepforward' size={30} color={globalColor.text_light} />
                    </Pressable>
                </View>
            </View>
            <View className='flex-row justify-around pb-4'>
                <Pressable
                    className='justify-center items-center'
                    onPress={() => {
                        navigation.navigate(ScreenName.ChapterAudio, { bookDetail: bookDetail });
                    }}
                >
                    <AntDesign name='bars' size={30} color={globalColor.text_light} />
                    <AppText font={fontFamilies.robotoBold} color={globalColor.white} size={16} text='Chương' />
                </Pressable>
                <Pressable className='justify-center items-center'>
                    <MaterialCommunityIcons name='speedometer' size={30} color={globalColor.text_light} />
                    <AppText font={fontFamilies.robotoBold} color={globalColor.white} size={16} text='Tốc độ' />
                </Pressable>
            </View>
        </SafeAreaView>
    );
};

export default AudioBook;
