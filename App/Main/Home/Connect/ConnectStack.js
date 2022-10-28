import React, { useContext } from 'react';
import { Image } from 'react-native';
import { BackToFromContext, LanguageContext } from '../../../context';
import { createStackNavigator,HeaderBackButton} from '@react-navigation/stack';
import { Connect } from './Connect';
import { FindWiFi } from './FindWiFi';
import { SetUpPico } from './SetUpPico';
import { ConnectWiFi } from './ConnectWiFi';
import { Scan } from '../../../Auth/Scan';
import FindPicoToScan from './FindPicoToScan';
import FindPicoToWiFi from './FindPicoToWiFi';


import colors from '../../../src/colors';

const ConnectStack = createStackNavigator();
export const ConnectStackScreen = () => {
  const strings = useContext(LanguageContext);
  return (
    <BackToFromContext.Provider value="Connect">
      <ConnectStack.Navigator>
        <ConnectStack.Screen
          name="Connect"
          component={Connect}
          options={{
            title: strings.connecting_title,
            headerTransparent: true,
            headerTitleAlign: 'center',
            headerTitleStyle: { fontFamily: 'NotoSans-Bold' },
            headerBackImage: () => <Image source={require('../../../../Assets/img/icArrowLeft.png')} />,
          }}
        />
        <ConnectStack.Screen
          name="FindWiFi"
          component={FindWiFi}
          options={{
            title: strings.wifisetting_2_title,
            headerStyle: {
              borderBottomWidth: 0,
              backgroundColor: colors.white,
              shadowOpacity: 0,
              elevation: 0,
            },
            headerTitleAlign: 'center',
            headerTitleStyle: {
              fontFamily: 'NotoSans-Bold',
            },
            headerBackImage: () => <Image source={require('../../../../Assets/img/icArrowLeft.png')} />,
          }}
        />
        <ConnectStack.Screen
          name="FindPicoToScan"
          component={FindPicoToScan}
          options={{
            title: strings.wifisetting_1_title,
            headerStyle: {
              borderBottomWidth: 0,
              backgroundColor: colors.white,
              shadowOpacity: 0,
              elevation: 0,
            },
            headerTitleAlign: 'center',
            headerTitleStyle: {
              fontFamily: 'NotoSans-Bold',
            },
            headerBackImage: () => <Image source={require('../../../../Assets/img/icArrowLeft.png')} />,
          }}
        />
        <ConnectStack.Screen
          name="FindPicoToWiFi"
          component={FindPicoToWiFi}
          options={{
            title: strings.wifisetting_1_title,
            headerStyle: {
              borderBottomWidth: 0,
              backgroundColor: colors.white,
              shadowOpacity: 0,
              elevation: 0,
            },
            headerTitleAlign: 'center',
            headerTitleStyle: {
              fontFamily: 'NotoSans-Bold',
            },
            headerBackImage: () => <Image source={require('../../../../Assets/img/icArrowLeft.png')} />,
          }}
        />
   <ConnectStack.Screen
          name="Scan"
          component={Scan}
          options={({navigation, route}) => ({
            title: 'Scan',
            headerTransparent: 'true',
            headerTitleAlign: 'center',
            headerTitleStyle: {
            fontFamily: 'NotoSans-Bold',
            fontWeight: 'bold',
          },

            headerLeft: (props) => (
              <HeaderBackButton
                {...props}
                onPress={() => navigation.navigate('Connect')}
              />
            ),
       })}

        />
        <ConnectStack.Screen
          name="ConnectWiFi"
          component={ConnectWiFi}
          options={{
            title: strings.wifisetting_3_title,
            headerStyle: {
              borderBottomWidth: 0,
              backgroundColor: colors.white,
              shadowOpacity: 0,
              elevation: 0,
            },
            headerTitleAlign: 'center',
            headerTitleStyle: {
              fontFamily: 'NotoSans-Bold',
            },
            headerBackImage: () => <Image source={require('../../../../Assets/img/icArrowLeft.png')} />,
          }}
        />
        <ConnectStack.Screen
          name="SetUpPico"
          component={SetUpPico}
          options={{
            title: strings.wifisetting_4_title,
            headerStyle: {
              borderBottomWidth: 0,
              backgroundColor: colors.white,
              shadowOpacity: 0,
              elevation: 0,
            },
            headerTitleAlign: 'center',
            headerTitleStyle: {
              fontFamily: 'NotoSans-Bold',
            },
            headerBackImage: () => <Image source={require('../../../../Assets/img/icArrowLeft.png')} />,
          }}
        />
      </ConnectStack.Navigator>
    </BackToFromContext.Provider>
  );
};
