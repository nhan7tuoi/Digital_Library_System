import { globalColor } from '@constants/globalColor';
import React, { ReactNode, useState } from 'react';
import { FlatList, Keyboard, StyleSheet, TouchableOpacity, View } from 'react-native';
import AppText from './AppText';
import Row from './Row';

interface MenuItem {
    key: string;
    label: string;
    icon?: ReactNode;
    disable?: boolean;
}

interface Props {
    items: MenuItem[];
    onMenuClick: (key: string) => void;
    children: ReactNode;
    width?: number;
    dropdownStyleProps?: any;
}

const AppDropdown = (props: Props) => {
    const { items, onMenuClick, children, width, dropdownStyleProps } = props;
    const [isVisible, setIsVisible] = useState<boolean>(false);
    const [widthButton, setWidthButton] = useState<number>(0);

    const renderDropdownItem = (item: MenuItem) => (
        <Row
            styles={[
                {
                    paddingVertical: 6,
                },
            ]}
            onPress={
                item.disable
                    ? undefined
                    : () => {
                        onMenuClick(item.key);
                        setIsVisible(false);
                    }
            }
            key={item.key}
        >
            {item.icon && item.icon}

            <View style={{ flex: 1, paddingLeft: item.icon ? 8 : 0 }}>
                <AppText
                    color={globalColor.text_dark}
                    text={item.label ?? ''}
                />
            </View>
        </Row>
    );
    return (
        <View style={{ flex: 0.7, position: 'relative', zIndex: 9999 }}>
            <TouchableOpacity
                onLayout={(event) => {
                    setWidthButton(event.nativeEvent.layout.width);
                }}
                activeOpacity={0.8}
                onPress={() => {
                    Keyboard.dismiss();
                    setIsVisible(!isVisible);
                }}
            >
                {children}
            </TouchableOpacity>
            {isVisible && (
                <View
                    style={{
                        zIndex: 9999,
                        // position: 'absolute',
                        top: 20,
                        right: 0,
                        width: widthButton,
                        backgroundColor: 'white',
                        borderRadius: 8,
                        shadowColor: '#000',
                        shadowOffset: {
                            width: 0,
                            height: 2,
                        },
                        shadowOpacity: 0.25,
                        shadowRadius: 3.84,
                        elevation: 5,
                    }}
                >
                    <View
                        style={[
                            styles.shadow,
                            {
                                backgroundColor: 'white',
                                paddingHorizontal: 16,
                                paddingVertical: 8,
                                borderRadius: 8,
                                width: width ?? 200,
                                height: 200,
                            },
                            dropdownStyleProps,
                        ]}
                    >
                        <FlatList
                            data={items}
                            keyExtractor={(item) => item.key.toString()}
                            renderItem={({ item }) => renderDropdownItem(item)}
                        />
                    </View>
                </View>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    shadow: {
        shadowColor: 'rgba(0,0,0,0.35)',
        shadowOffset: {
            width: 0,
            height: 6,
        },
        shadowOpacity: 0.25,
        shadowRadius: 6,
        elevation: 8,
    },

})

export default AppDropdown