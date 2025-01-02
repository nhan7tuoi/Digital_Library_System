module.exports = {
    presets: ['module:@react-native/babel-preset'],
    plugins: [
        'nativewind/babel',
        'react-native-reanimated/plugin',
        [
            'module-resolver',
            {
                root: ['./src'],
                alias: {
                    '@components': './src/components',
                    '@screens': './src/screens',
                    '@utils': './src/utils',
                    '@constants': './src/constants',
                    '@navigators': './src/navigators',
                    '@assets': './src/assets',
                    '@redux': './src/redux',
                },
            },
        ],
    ],
};
