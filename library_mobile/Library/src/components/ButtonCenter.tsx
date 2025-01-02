import { fontFamilies } from '@constants/fontFamilies';
import React from 'react';
import { Pressable, StyleProp, ViewStyle } from 'react-native';
import AppText from './AppText';

interface Props {
    icon?: React.ReactNode;
    label?: string;
    sizeLabel?: number;
    onPress: () => void;
    fontLabel?: 'bold' | 'normal';
    colorLabel?: string;
    style?: StyleProp<ViewStyle>;
}

const ButtonCenter = (props: Props) => {
    const {
        icon,
        label,
        sizeLabel = 12,
        onPress,
        fontLabel = 'normal',
        colorLabel = 'black',
        style
    } = props;
    return (
        <Pressable
            className='justify-center items-center'
            onPress={onPress}
            style={style}
        >
            {icon}
            <AppText
                font={fontLabel == 'bold' ? fontFamilies.robotoBold : fontFamilies.robotoRegular}
                text={label}
                size={sizeLabel}
                color={colorLabel}

            />
        </Pressable>
    )
}

export default ButtonCenter