import React, { useState, useEffect } from 'react';
import { NativeModules } from 'react-native';
import { LanguageContext } from './context';
import { createStackNavigator } from '@react-navigation/stack';
import { OnboardingStackScreen } from './Onboarding/OnboardingStack';
import { MainStackScreen } from './Main/MainStack';
import { FirstLaunchContext } from './context';
import { Splash } from './Splash';
import AsyncStorage from '@react-native-community/async-storage';
import LocalizedStrings from 'react-native-localization';
import english from './src/Languages/en';
import japanese from './src/Languages/ja';
import korean from './src/Languages/kr';

/**
 * 사용자 언어 설정
 * Mobile Device에 설정된 language로 설정
 */
const locale = NativeModules.I18nManager.localeIdentifier;
const strings = new LocalizedStrings({
  en_US: english,
  ja_JP: japanese,
  ko_KR: korean,
});
strings.setLanguage(locale);

const RootStack = createStackNavigator();
export const RootStackScreen = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [firstLaunch, setFirstLaunch] = useState(true);

  useEffect(() => {
    AsyncStorage.getItem('alreadyLaunched').then((value) => {
      if (value === null) {
        AsyncStorage.setItem('alreadyLaunched', 'true');
      } else {
        setFirstLaunch(false);
      }
    });
  }, []);

  useEffect(() => {
    setTimeout(() => {
      setIsLoading(false);
    }, 1000);
  }, []);

  return (
    <FirstLaunchContext.Provider value={firstLaunch}>
      <LanguageContext.Provider value={strings}>
        {!isLoading ? (
          <RootStack.Navigator headerMode="none">
            {firstLaunch ? (
              <RootStack.Screen name="Onboarding" component={OnboardingStackScreen} options={{ animationEnabled: false }} />
            ) : (
              <RootStack.Screen name="Main" component={MainStackScreen} options={{ animationEnabled: false }} />
            )}
          </RootStack.Navigator>
        ) : (
          <Splash />
        )}
      </LanguageContext.Provider>
    </FirstLaunchContext.Provider>
  );
};
