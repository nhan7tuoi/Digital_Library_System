import React from 'react';
import { FlatList, StyleProp, TouchableOpacity, View, ViewStyle } from 'react-native';
import AntDesign from 'react-native-vector-icons/AntDesign';

interface Props {
    rating: number;
    setRating?: (rating: number) => void;
    onRating?: boolean;
    styleList?: StyleProp<ViewStyle>;
    styleItem?: StyleProp<ViewStyle>;
    sizeStart?: number;
}

const Rate = (props: Props) => {
    const { rating, setRating, onRating, styleItem, styleList, sizeStart } = props;

    const handlePress = (index: number) => {
        setRating && setRating(index + 1);
    };

    return (
        <View>
            <FlatList
                data={[...Array(5)]}
                style={styleList}
                renderItem={({ item, index }) => (
                    <TouchableOpacity
                        style={styleItem}
                        onPress={() => {
                            if (onRating) {
                                handlePress(index);
                            }
                        }}>
                        <AntDesign
                            name={index < rating ? 'star' : 'staro'}
                            size={sizeStart ? sizeStart : 14}
                            color='#FFD700'
                        />
                    </TouchableOpacity>
                )}
                keyExtractor={(item, index) => index.toString()}
                horizontal
            />
        </View>
    );
};

export default Rate;
