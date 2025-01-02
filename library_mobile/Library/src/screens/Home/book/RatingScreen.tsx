import AppButton from '@components/AppButton'
import AppInput from '@components/AppInput'
import AppText from '@components/AppText'
import Loading from '@components/Loading'
import Rate from '@components/Rate'
import Space from '@components/Space'
import { fontFamilies } from '@constants/fontFamilies'
import { globalColor } from '@constants/globalColor'
import React, { useEffect, useRef, useState } from 'react'
import { Animated, Easing, FlatList, Image, Keyboard, Pressable, View } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import AntDesign from 'react-native-vector-icons/AntDesign'
import { IReview } from 'src/types/iReview'
import { _createReview, _getReviews } from '../apis'
import Toast from 'react-native-toast-message'
import { useSelector } from 'react-redux'


const RatingScreen = ({ navigation, route }: any) => {
    const { id, userId } = route?.params;
    const user = useSelector((state: any) => state.auth.user);
    const [loading, setLoading] = useState<boolean>(false);
    const [loadingBtn, setLoadingBtn] = useState<boolean>(false);
    const [reviews, setReviews] = useState<IReview[]>([]);
    const [content, setContent] = useState<string>('');
    const [rating, setRating] = useState<number>(1);
    const [userReview, setUserReview] = useState<boolean>(false);
    const [showReviewForm, setShowReviewForm] = useState(false);
    const animation = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        const unsubscribe = navigation.addListener('focus', () => {
            getReviews();
        }
        );
        return unsubscribe;
    }, [navigation]);

    const getReviews = async () => {
        try {
            setLoading(true);
            const response = await _getReviews(id);
            if (response.data) {
                setReviews(response.data);
                const hasUserReviewed = response.data?.some((item: { user: { _id: any } }) => userId === item.user._id);
                setUserReview(hasUserReviewed);
                setLoading(false);
            }
        } catch (error) {
            setLoading(false);
            console.log('error', error);
        }
    }


    const createReview = async () => {
        try {
            setLoadingBtn(true);
            const existingReview = reviews.find(review => review.user._id === userId);
            const response = await _createReview({
                bookId: id,
                content,
                rating
            });
            if (response.data) {
                if (existingReview) {
                    setReviews(reviews.map(review =>
                        review._id === existingReview._id ? { ...review, content, rating, updatedAt: new Date() } : review
                    ));
                } else {
                    const newReview: IReview = {
                        _id: new Date().getTime().toString(),
                        user: { _id: userId,image: user.image, name: user.name },
                        book: id,
                        content,
                        rating,
                        createdAt: new Date(),
                        updatedAt: new Date()
                    };

                    setReviews([...reviews, newReview]);
                }
                setContent('');
                setLoadingBtn(false);
                Keyboard.dismiss();
                toggleReviewForm();
            }
        } catch (error:any) {
            setLoadingBtn(false);
            Toast.show({
                type: 'error',
                text1: 'Đánh giá thất bại',
                text2: 'Vui lòng thử lại',
                position: 'bottom',
            });
            console.log('error', error);
        }
    }

    const toggleReviewForm = () => {
        if (showReviewForm) {
            Animated.timing(animation, {
                toValue: 0,
                duration: 300,
                easing: Easing.linear,
                useNativeDriver: true,
            }).start(() => setShowReviewForm(false));
        } else {
            setShowReviewForm(true);
            Animated.timing(animation, {
                toValue: 1,
                duration: 300,
                easing: Easing.linear,
                useNativeDriver: true,
            }).start();
        }
    };

    return (
        loading ? <Loading /> :
            <SafeAreaView className='flex-1'>
                <View className='flex-row justify-between h-16 items-center px-3'>
                    <Pressable onPress={() => {
                        navigation.goBack()
                    }}>
                        <AntDesign name='left' size={30} color={globalColor.text_dark} />
                    </Pressable>
                    <AppText size={20} text='Đánh giá' font={fontFamilies.robotoBold} />
                    <Space width={30} />
                </View>
                <View className='pl-3'>
                    <AppText size={20} text='Tất cả đánh giá' font={fontFamilies.robotoBold} />
                </View>
                {reviews.length > 0 ?
                    (<FlatList
                        className='px-4'
                        showsVerticalScrollIndicator={false}
                        data={reviews}
                        renderItem={({ item }) => {
                            return (
                                <View className='py-4 px-4 my-4 bg-gray-50 rounded-lg'>
                                    <View className='flex-row justify-between pb-2 '>
                                        <View className='flex-row'>
                                            <View className='w-9 h-9 rounded-full border border-red-500 justify-center items-center'>
                                                <Image source={{ uri: item.user.image }} className='w-8 h-8' />
                                            </View>
                                            <View className='pl-3'>
                                                <AppText text={
                                                    userId === item.user._id ? 'Bạn' : item.user.name
                                                }
                                                    font={fontFamilies.robotoBold} />
                                                <View>
                                                    <Rate rating={item.rating} />
                                                </View>
                                            </View>
                                        </View>
                                        <AppText text={
                                            new Date(item.updatedAt).toLocaleDateString('vi-VN', {
                                                year: 'numeric',
                                                month: 'numeric',
                                                day: 'numeric',
                                                hour: 'numeric',
                                                minute: 'numeric',
                                                second: 'numeric',
                                            })
                                        } />
                                    </View>
                                    <AppText text={item.content} />
                                </View>
                            )
                        }}
                    />)
                    : (<View className='flex-1'>
                        <View className='flex-row justify-center items-center pt-4'>
                            <AppText text={'Chưa có đánh giá'} />
                        </View>
                    </View>)}

                {showReviewForm == false ? (
                    <View className='px-4'>
                        <AppButton
                            color={globalColor.primary}
                            styles={{ borderRadius: 10 }}
                            onPress={toggleReviewForm}
                            title='Đánh giá'
                        />
                    </View>
                ) : (
                    <Animated.View
                        style={{
                            opacity: animation,
                            transform: [
                                {
                                    translateY: animation.interpolate({
                                        inputRange: [0, 1],
                                        outputRange: [100, 0],
                                    }),
                                },
                            ],
                        }}
                        className='px-2 h-26 w-full pt-4 border-t'
                    >
                        {userReview && (
                            <AppText
                                color={globalColor.warning}
                                font={fontFamilies.robotoBold}
                                text={'Bạn đã đánh giá rồi, hãy gửi tiếp nếu bạn muốn cập nhật đánh giá của mình.'}
                            />
                        )}
                        <View className='flex-row px-6 justify-between'>
                            <View className='w-full'>
                                <AppInput
                                    textAreal
                                    value={content}
                                    onChangeText={setContent}
                                    placeholder='Viết đánh giá...'
                                    placehodelColor={globalColor.text_dark}
                                />
                            </View>
                        </View>
                        <AppText text={`Chọn sao đánh giá (${rating})`} font={fontFamilies.robotoBold} />
                        <View className='h-16 py-2 justify-center items-center'>
                            <Rate
                                styleItem={{ marginHorizontal: 15 }}
                                sizeStart={40}
                                rating={rating}
                                setRating={setRating}
                                onRating={true}
                            />
                        </View>
                        <AppButton
                            loading={loadingBtn}
                            color={globalColor.primary}
                            styles={{ borderRadius: 10 }}
                            onPress={createReview}
                            title='Gửi'
                        />
                    </Animated.View>
                )}
            </SafeAreaView>
    )
}

export default RatingScreen