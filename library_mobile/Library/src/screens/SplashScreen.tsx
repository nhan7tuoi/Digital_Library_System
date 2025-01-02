
import { globalColor } from '@constants/globalColor';
import React from 'react';
import {
  ActivityIndicator,
  Image,
  useColorScheme,
  View
} from 'react-native';
import { MAIN } from '../assets/images';

const SplashScreen = () => {
  const colorScheme = useColorScheme();

  return (
    <View
      style={{ backgroundColor: colorScheme === 'dark' ? globalColor.bg_dark : globalColor.bg_light }}
      className={`flex-1 items-center justify-center `}>
      <Image resizeMode='contain' source={MAIN.LOGOIUH} className="w-72 h-72" />
      <ActivityIndicator
        size={50}
        className="color-primary absolute bottom-10"
      />
    </View>
  );
};

export default SplashScreen;
