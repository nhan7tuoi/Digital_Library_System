import { Dimensions, Platform } from 'react-native';

export const isiOS = Platform.OS === 'ios';

export const isAndroid = Platform.OS === 'android';

export const  WIDTH = Dimensions.get('window').width;
export const HEIGHT = Dimensions.get('window').height;

export const listColorNote = [
    '#FFEBEE', // Light Red
    '#FCE4EC', // Light Pink
    '#E1F5FE', // Light Blue
    '#E8F5E9', // Light Green
    '#FFF3E0', // Light Orange
    '#FFFDE7', // Light Yellow
    '#F3E5F5', // Light Purple
    '#F1F8E9', // Light Lime
    '#D7CCC8', // Light Brown
    '#E0F7FA', // Light Cyan
    '#F9FBE7', // Light Lime Yellow
    '#FBE9E7', // Light Peach
    '#F0F4C3', // Light Olive
    '#FFCDD2', // Light Coral
    '#E6EE9C', // Light Olive Green
    '#B2EBF2', // Light Aqua
    '#DCEDC8', // Light Greenish Yellow
    '#D1C4E9', // Light Lavender
    '#FFECB3', // Light Gold
];
