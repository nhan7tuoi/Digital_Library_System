import { ScreenName } from '@constants/ScreenName';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { AccountDetail, AudioBook, BookDetail, ChangePassword, ChapterAudio, ListenText, Notification, NotificationDetail, RatingScreen, ReadText, SearchScreen, SummaryBook, UpdateInfoUser } from '@screens/index';
import React from 'react';
import TabRouter from './TabRouter';


const Stack = createNativeStackNavigator();


const MainRouter = () => {
  return (
    <Stack.Navigator initialRouteName={ScreenName.TabRouter} screenOptions={{ headerShown: false }}>
      <Stack.Screen name={ScreenName.TabRouter} component={TabRouter} />
      <Stack.Screen name={ScreenName.BookDetail} component={BookDetail} />
      <Stack.Screen name={ScreenName.ReadText} component={ReadText} />
      <Stack.Screen name={ScreenName.RatingScreen} component={RatingScreen} />
      <Stack.Screen name={ScreenName.SearchScreen} component={SearchScreen} />
      <Stack.Screen name={ScreenName.AudioBook} component={AudioBook} />
      <Stack.Screen name={ScreenName.ChapterAudio} component={ChapterAudio} />
      <Stack.Screen name={ScreenName.ListenText} component={ListenText} />
      <Stack.Screen name={ScreenName.SummaryBook} component={SummaryBook} />
      <Stack.Screen name={ScreenName.AccountDetail} component={AccountDetail} />
      <Stack.Screen name={ScreenName.Notification} component={Notification} />
      <Stack.Screen name={ScreenName.NotificationDetail} component={NotificationDetail} />
      <Stack.Screen name={ScreenName.UpdateInfoUser} component={UpdateInfoUser} />
      <Stack.Screen name={ScreenName.ChangePassword} component={ChangePassword} />
    </Stack.Navigator>
  )
}

export default MainRouter;