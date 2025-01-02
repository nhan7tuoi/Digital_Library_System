import { MAIN } from '@assets/images'
import React from 'react'
import { Image } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import AppText from './AppText'

const Loading = () => {
    return (
        <SafeAreaView className='flex-1 justify-center items-center'>
            <Image resizeMode='contain' source={MAIN.LOGOIUH} className="w-72 h-72" />
            <AppText size={20} text='Đợi xíu nha...' />
        </SafeAreaView>
    )
}

export default Loading