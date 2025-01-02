import { fontFamilies } from '@constants/fontFamilies';
import { globalColor } from '@constants/globalColor';
import React, { ReactNode, useState } from 'react';
import { KeyboardType, StyleProp, StyleSheet, TextInput, TextStyle, TouchableOpacity, View, ViewStyle } from 'react-native';
import AntDesign from 'react-native-vector-icons/AntDesign';
import AppText from './AppText';
import Row from './Row';

interface Props {
    label?: string;
    required?: boolean;
    inline?: boolean;
    prefix?: ReactNode;
    affix?: ReactNode;
    keyboardType?: KeyboardType;
    onChangeText?: (text: string) => void;
    textAreal?: boolean;
    clear?: boolean;
    value?: string;
    onClear?: () => void;
    iconClear?: ReactNode;
    inputStyles?: StyleProp<TextStyle>;
    containerStyle?: StyleProp<ViewStyle>;
    placeholder?: string;
    maxLength?: number;
    onEndEditing?: () => string;
    showCount?: boolean;
    noBorder?: boolean;
    placehodelColor?: string;

}

const AppInput = (props: Props) => {
    const {
        label,
        required,
        inline,
        prefix,
        affix,
        keyboardType,
        onChangeText,
        textAreal,
        clear,
        value,
        onClear,
        iconClear,
        inputStyles,
        maxLength,
        onEndEditing,
        placeholder,
        noBorder,
        placehodelColor,
        containerStyle
    } = props;
    const [isError, setIsError] = useState<boolean>(false);
    const [isFocus, setIsFocus] = useState(false);
    const [helpText, setHelpText] = useState('');

    const contentHeight = 200;
    return (
        <View className='py-2' style={{ marginBottom: inline ? 0 : 16 }}>
            {
                label && (
                    <Row justifyContent="flex-start" alignItems="flex-start">
                        {
                            required && (
                                <AppText text='*' color='red' />
                            )
                        }
                        <AppText styles={{ marginBottom: 8, paddingLeft: 5 }} font={fontFamilies.robotoBold} text={label} size={16} />
                    </Row>
                )
            }
            <Row styles={[
                styles.inputContainer,
                styles.center,
                {
                    borderColor: noBorder ? 'transparent' : 'gray',
                },
                containerStyle,
            ]}>
                {prefix && prefix}
                <TextInput
                    placeholder={placeholder}
                    placeholderTextColor={placehodelColor ? placehodelColor : '#0F1414'}
                    value={value}
                    maxLength={maxLength}
                    style={[
                        styles.input,
                        {
                            paddingLeft: prefix ? 12 : 0,
                            paddingRight: clear || affix ? 12 : 0,
                            textAlignVertical: textAreal ? 'top' : 'center',
                            minHeight:
                                contentHeight > 200 ? contentHeight : textAreal ? 70 : 'auto',
                        },
                        inputStyles,
                    ]}
                    keyboardType={keyboardType}
                    onChangeText={onChangeText}
                    numberOfLines={textAreal ? 4 : 1}
                    multiline={textAreal}
                    onFocus={() => setIsFocus(true)}
                    onEndEditing={() => {
                        if (onEndEditing) {
                            const endEditingError = onEndEditing();
                            if (endEditingError) {
                                setIsError(true);
                                setHelpText(endEditingError);
                                return;
                            }
                        }
                        if (required && (!value || value.length === 0)) {
                            setIsError(true);
                            setHelpText('Trường này không được để trống');
                        } else {
                            setIsError(false);
                            setHelpText('');
                        }
                        setIsFocus(false);
                        setIsFocus(false)
                    }}
                />
                {clear && value && value.length > 0 && (
                    <TouchableOpacity
                        onPress={onClear}
                    >
                        {iconClear ?? (
                            <AntDesign name="close" size={18} color={'gray'} />
                        )}
                    </TouchableOpacity>
                )}
            </Row>

            <Row justifyContent="space-between">
                <View style={{ flex: 1 }}>
                    {required && isError && helpText != '' && (
                        <AppText
                            font={fontFamilies.robotoBold}
                            styles={{ marginTop: 8 }}
                            text={helpText}
                            color={globalColor.text_danger}
                            size={12}
                        />
                    )}
                </View>
            </Row>

        </View>
    )
}

const styles = StyleSheet.create({
    input: {
        padding: 0,
        margin: 0,
        color: '#0F1414',
        fontSize: 14,
        flex: 1,
    },
    inputContainer: {
        paddingHorizontal: 12,
        paddingVertical: 8,
        borderRadius: 10,
        borderWidth: 1,
        minHeight: 48,
        borderColor: 'gray',
        justifyContent: 'center',
        alignItems: 'center',
    },
    center: {
        justifyContent: 'center',
        alignItems: 'center',
    },
})

export default AppInput