import React, { useState, useEffect, useContext } from 'react';
import { View, Image, TouchableOpacity, ActivityIndicator, StyleSheet } from 'react-native';
import { createStackNavigator } from '@react-navigation/stack';
import { PicoContext, DeviceContext, TempChartContext, HumChartContext, LanguageContext } from '../../../context';
import { StateTabScreen } from './StateTabScreen';
import { DeviceSetting } from './DeviceSetting';
import { EditDeviceSetting } from './EditDeviceSetting';
import { ExternalLinkage } from './ExternalLinkage';
import { FirmwareUpdate } from './FirmwareUpdate';
import colors from '../../../src/colors';

const DeviceStack = createStackNavigator();
export const DeviceStackScreen = ({ navigation, route }) => {
  const strings = useContext(LanguageContext);
  const device = useContext(DeviceContext);
  const { id } = route.params;
  const { mod } = route.params;
  const { temp } = route.params;
  const { humd } = route.params;

  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setTimeout(() => {
      setIsLoading(false);
    }, 1000);
  }, []);

  return (
    <PicoContext.Provider value={id}>
      <TempChartContext.Provider value={temp}>
        <HumChartContext.Provider value={humd}>
          {!isLoading && device[id] != null ? (
            <DeviceStack.Navigator>
              {mod === 'state' ? (
                <DeviceStack.Screen
                  name="StateTabScreen"
                  component={StateTabScreen}
                  options={{
                    title: device[id].PicoName,
                    headerStyle: {
                      shadowColor: 'transparent',
                      elevation: 0,
                    },
                    headerTitleAlign: 'center',
                    headerTitleStyle: {
                      fontWeight: 'bold',
                    },
                    headerBackImage: () => <Image source={require('../../../../Assets/img/icArrowLeft.png')} />,
                    headerRight: () => (
                      <TouchableOpacity style={{ margin: 16 }} onPress={() => navigation.navigate('DeviceSetting')}>
                        <Image source={require('../../../../Assets/img/icSettings.png')} />
                      </TouchableOpacity>
                    ),
                  }}
                />
              ) : null}
              <DeviceStack.Screen
                name="DeviceSetting"
                component={DeviceSetting}
                options={{
                  title: strings.devicesetting_title,
                  headerStyle: {
                    shadowColor: 'transparent',
                    elevation: 0,
                  },
                  headerTitleAlign: 'center',
                  headerTitleStyle: {
                    fontWeight: 'bold',
                  },
                  headerBackImage: () => <Image source={require('../../../../Assets/img/icArrowLeft.png')} />,
                }}
              />
              <DeviceStack.Screen
                name="ExternalLinkage"
                component={ExternalLinkage}
                options={{
                  title: strings.voiceservice_title,
                  headerTransparent: true,
                  headerStyle: {
                    shadowColor: 'transparent',
                    elevation: 0,
                  },
                  headerTitleAlign: 'center',
                  headerTitleStyle: {
                    fontWeight: 'bold',
                  },
                  headerBackImage: () => <Image source={require('../../../../Assets/img/icArrowLeft.png')} />,
                }}
              />
              <DeviceStack.Screen
                name="EditDeviceSetting"
                component={EditDeviceSetting}
                options={{
                  title: strings.devicesetting_list_editpicohome,
                  headerStyle: {
                    shadowColor: 'transparent',
                    elevation: 0,
                  },
                  headerTitleAlign: 'center',
                  headerTitleStyle: {
                    fontWeight: 'bold',
                  },
                  headerBackImage: () => <Image source={require('../../../../Assets/img/icArrowLeft.png')} />,
                }}
              />
              <DeviceStack.Screen
                name="FirmwareUpdate"
                component={FirmwareUpdate}
                options={{
                  title: 'Firmware Update',
                  headerStyle: {
                    shadowColor: 'transparent',
                    elevation: 0,
                  },
                  headerTitleAlign: 'center',
                  headerTitleStyle: {
                    fontWeight: 'bold',
                  },
                  headerBackImage: () => <Image source={require('../../../../Assets/img/icArrowLeft.png')} />,
                }}
              />
            </DeviceStack.Navigator>
          ) : (
            <View style={styles.indicator}>
              <ActivityIndicator size="large" color={colors.azure} />
            </View>
          )}
        </HumChartContext.Provider>
      </TempChartContext.Provider>
    </PicoContext.Provider>
  );
};

const styles = StyleSheet.create({
  indicator: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
