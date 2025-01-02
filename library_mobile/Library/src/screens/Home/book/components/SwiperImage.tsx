import { HOME } from '@assets/images'
import { globalColor } from '@constants/globalColor'
import React from 'react'
import { Image, View } from 'react-native'
import Swiper from 'react-native-swiper'

const SwiperImage = () => {
    return (
        <Swiper
            autoplay
            autoplayTimeout={2}
            loop
            autoplayDirection
            scrollEnabled
            dotColor='white'
            paginationStyle={{
                bottom: -20,
            }}
            activeDotColor={globalColor.primary}

            activeDot={
                <View
                    style={{
                        backgroundColor: globalColor.primary,
                        width: 20,
                        height: 10,
                        borderRadius: 5,
                        marginLeft: 3,
                        marginRight: 3,
                        marginTop: 3,

                    }}
                />
            }
        >
            <View className=' flex-1 justify-center items-center rounded-2xl '>
                <Image resizeMode='contain' className='flex-1' source={HOME.SLIDE1} />
            </View>
            <View className=' flex-1 justify-center items-center rounded-2xl '>
                <Image resizeMode='contain' className='flex-1' source={HOME.SLIDE2} />
            </View>
            <View className=' flex-1 justify-center items-center rounded-2xl '>
                <Image resizeMode='contain' className='flex-1' source={HOME.SLIDE3} />
            </View>
        </Swiper>
    )
}

export default SwiperImage