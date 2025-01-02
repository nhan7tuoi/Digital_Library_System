
import { ScreenName } from '@constants/ScreenName';
import Router from '@navigators/Router';
import notifee, { AndroidImportance, AndroidVisibility, EventType } from '@notifee/react-native';
import messaging from '@react-native-firebase/messaging';
import { NavigationContainer } from '@react-navigation/native';
import React, { useEffect, useRef } from 'react';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import Toast from 'react-native-toast-message';
import { Provider } from 'react-redux';
import './reanimatedConfig';
import { ToastConfig } from './src/configs/ToastConfig';
import store from './src/redux/store';




const App = () => {

  const requestUserPermission = async () => {
    const authorizationStatus = await messaging().requestPermission();
    if (authorizationStatus) {
      console.log('Permission status:', authorizationStatus);
      await notifee.createChannel({
        id: 'default',
        name: 'Default',
        importance: AndroidImportance.HIGH,
        visibility: AndroidVisibility.PUBLIC,
      });
    }
  };

  useEffect(() => {
    requestUserPermission();
  }, []);

  const navigationRef: any = useRef();

  const navigationToNotification = (notification_id: string) => {
    console.log("next");
    navigationRef.current.navigate(ScreenName.NotificationDetail, { notification_id });
  };

  const handleNavigation = async (data: any) => {
    if (data?.notification_id) {
      navigationToNotification(data.notification_id);
    }
  }

  useEffect(() => {
    notifee.getInitialNotification()
      .then(async (initialNotification: any) => {
        console.log("getInitialNotification", initialNotification);
        if (initialNotification) {
          const data = initialNotification.data;
          console.log("getInitialNotification", initialNotification);
          handleNavigation(data);
        }
      });

    const unsubscribeForeground = notifee.onForegroundEvent(async (event: any) => {
      console.log("onForegroundEvent", event);
      if (event.type === EventType.DELIVERED) {
        onDisplayNotification(event.detail);
      }
      if (event.type === EventType.PRESS) {
        const data = event.detail.data;
        handleNavigation(data);
      }
    });

    notifee.onBackgroundEvent(async (event: any) => {
      console.log("onBackgroundEvent", event);
      if (event.type === EventType.PRESS) {
        const data = event.detail.data;
        handleNavigation(data);
      }
    });

    const unsubscribeOnNotification = messaging().onNotificationOpenedApp(async (remoteMessage: any) => {
      const data = remoteMessage.data;
      handleNavigation(data);
    });

    const unsubscribeMessaging = messaging().onMessage(async (remoteMessage: any) => {
      if (remoteMessage) {
        console.log("onMessage");
        onDisplayNotification(remoteMessage);
      }
    });

    return () => {
      unsubscribeForeground();
      unsubscribeOnNotification();
      unsubscribeMessaging();
    }

  }, []);

  async function onDisplayNotification(remoteMessage: any) {
    await notifee.displayNotification({
      id: remoteMessage.data.notification_id,
      title: remoteMessage.notification.title,
      body: remoteMessage.notification.body,
      data: remoteMessage.data,
      android: {
        channelId: 'default',
        importance: AndroidImportance.HIGH,
        visibility: AndroidVisibility.PUBLIC,
      },
    });

    notifee.onForegroundEvent(async (event: any) => {
      if (event.type === EventType.PRESS) {
        const data = event.detail.notification.data;
        handleNavigation(data);
      }
    });
  }



  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <Provider store={store}>
        <NavigationContainer ref={navigationRef}>
          <Router />
        </NavigationContainer>
        <Toast config={ToastConfig} />
      </Provider>
    </GestureHandlerRootView>
  );
};

export default App;
