import { ScreenName } from '@constants/ScreenName';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import ForgetScreen from '@screens/Auth/ForgetScreen';
import LoginWithAccount from '@screens/Auth/LoginWithAccount';
import RegisterScreen from '@screens/Auth/RegisterScreen';
import VerifyCodeScreen from '@screens/Auth/VerifyCodeScreen';
import { LoginScreen, UserFormScreen } from '@screens/index';
import React from 'react';
const Stack = createNativeStackNavigator();

const AuthStack = () => {
    return (
        <Stack.Navigator initialRouteName={ScreenName.LoginScreen} screenOptions={{ headerShown: false }}>
            <Stack.Screen name={ScreenName.LoginScreen} component={LoginScreen} />
            <Stack.Screen name={ScreenName.UserFormScreen} component={UserFormScreen} />
            <Stack.Screen name={ScreenName.LoginWithAccount} component={LoginWithAccount} />
            <Stack.Screen name={ScreenName.RegisterScreen} component={RegisterScreen} />
            <Stack.Screen name={ScreenName.ForgetScreen} component={ForgetScreen} />
            <Stack.Screen name={ScreenName.VerifyCodeScreen} component={VerifyCodeScreen} />
        </Stack.Navigator>
    )
}

export default AuthStack