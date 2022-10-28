import React, { useState, useMemo, useContext } from 'react';
import { Image } from 'react-native';
import { createStackNavigator, HeaderBackButton} from '@react-navigation/stack';
import { SignUpContext, NewUserPWContext, NewUserIdContext, LanguageContext, BackToFromContext} from '../context';
import { SignIn } from './SignIn';
import { ChangePassword } from './ChangePw';
import { CreateAccount } from './CreateAccount';
import { SignUp1 } from './SignUp1';
import { SignUp2 } from './SignUp2';
import { Scan_SignIn } from './Scan_SignIn';
import { WebViewScreen } from '../Main/Home/WebView';
import FindPicoToScan_SignIn from './FindPicoToScan_SignIn';
import FindPicoToScan_SignIn_Pre from './FindPicoToScan_SignIn_Pre';
import colors from '../src/colors';

const AuthStack = createStackNavigator();
export const AuthStackScreen = ({ navigation }) => {
  const strings = useContext(LanguageContext);
  const [id, setId] = useState('');
  const [pw, setPw] = useState('');

const signUpContext = useMemo(() => {
    return {
      setIdPw: (id, pw) => {
        setId(id);
        setPw(pw);
      },
      signUp: async (id, pw) => {
        try {
          let response = await fetch('https://us-central1-pico-home.cloudfunctions.net/SignUp', {
            method: 'POST',
            headers: {
              Accept: 'application/json',
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              id: id,
              password: pw,
            }),
          });
          let post = await response.json();
          if (post.Msg === 'success') {
            navigation.navigate('CreateAccount');
            return { emailExist: false }
          } else if (post.Msg === 'User id is aleady existed.'){
            return { emailExist: true }
          }
        } catch (err) {
          console.error("SignUp", err);
        }
      },
    };
  });

  return (
    <SignUpContext.Provider value={signUpContext}>
      <NewUserIdContext.Provider value={id}>
        <NewUserPWContext.Provider value={pw}>
         <BackToFromContext.Provider value="SignIn">
          <AuthStack.Navigator>
            <AuthStack.Screen name="SignIn" component={SignIn} options={{ headerShown: false }} />
            <AuthStack.Screen
              name="ChangePassword"
              component={ChangePassword}
              options={{
                title: strings.changepw_title,
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
                headerBackImage: () => <Image source={require('../../Assets/img/icArrowLeft.png')} />,
              }}
            />
            <AuthStack.Screen
              name="SignUp1"
              component={SignUp1}
              options={{
                title: strings.signup_title,
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
                headerBackImage: () => <Image source={require('../../Assets/img/icArrowLeft.png')} />,
              }}
            />
            <AuthStack.Screen
              name="CreateAccount"
              component={CreateAccount}
              options={{
                title: strings.confirmemail_title,
                headerTransparent: 'true',
                headerTitleAlign: 'center',
                headerTitleStyle: {
                  fontFamily: 'NotoSans-Bold',
                },
                headerBackImage: () => <Image source={require('../../Assets/img/icArrowLeft.png')} />,
              }}
            />
            <AuthStack.Screen
              name="SignUp2"
              component={SignUp2}
              options={{
                title: 'Sign Up',
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
                headerBackImage: () => <Image source={require('../../Assets/img/icArrowLeft.png')} />,
              }}
            />

            <AuthStack.Screen
              name="FindPicoToScan_SignIn_Pre"
              component={FindPicoToScan_SignIn_Pre}
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
                headerBackImage: () => <Image source={require('../../Assets/img/icArrowLeft.png')} />,
              }}
            />

            <AuthStack.Screen
              name="FindPicoToScan_SignIn"
              component={FindPicoToScan_SignIn}
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
                headerBackImage: () => <Image source={require('../../Assets/img/icArrowLeft.png')} />,
              }}
            />
            <AuthStack.Screen
              name="Scan_SignIn"
              component={Scan_SignIn}
              options={{
                title: strings.scan_title,
                headerTransparent: 'true',
                headerTitleAlign: 'center',
                headerTitleStyle: {
                  fontFamily: 'NotoSans-Bold',
                  fontWeight: 'bold',
                },
                 headerLeft: (props) => (
              <HeaderBackButton
                {...props}
                onPress={() => navigation.navigate('SignIn')}
              />
            ),
              }}
            />
            <AuthStack.Screen
              name="WebView"
              component={WebViewScreen}
              options={{
                headerShown: false,
              }}
            />
          </AuthStack.Navigator>
        </BackToFromContext.Provider>
        </NewUserPWContext.Provider>
      </NewUserIdContext.Provider>
    </SignUpContext.Provider>
  );
};