import React, { useState, useEffect, useContext } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TextInput,
  Image,
  Dimensions,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  FlatList,
  NativeModules,
} from 'react-native';
import { LanguageContext, SettingContext, UserContext } from '../../../context';
import AsyncStorage from '@react-native-community/async-storage';
import Modal from 'react-native-modal';
import colors from '../../../src/colors';
import initialPlace from '../../../src/InitialPlace';

export const SetUpPico = ({ navigation, route }) => {
  const { getDeviceState } = useContext(SettingContext);
  const strings = useContext(LanguageContext);
  const userInfo = useContext(UserContext);
  const [placeList, setPlaceList] = useState([]);
  const locale = NativeModules.I18nManager.localeIdentifier;
  const defaultPlaceList = initialPlace[locale].split('/')
 
  const { id, name, firmware } = route.params;

  const [isLoading, setIsLoading] = useState(true);

  const [newDeviceName, setNewDeviceName] = useState(strings.wifisetting_4_input_name);
  const [newDevicePlace, setNewDevicePlace] = useState(strings.wifisetting_4_select_place_room);
  //const [firmwareVer, setNewDevicePlace] = useState(strings.wifisetting_4_select_place_room);
  const [devicePlaceAccess, setDevicePlaceAccess] = useState(false);

  const [showPlace, setShowPlace] = useState(false);
  const [showAddPlace, setShowAddPlace] = useState(false);
  const [registError, setRegistError] = useState(false);

  useEffect(() => {
    getPlace()
  }, []);

  const getPlace = () => {
    AsyncStorage.getItem('placeList').then((value) => {
      console.log({value});
      if (value == null) {
        setPlaceList([]);
      } else {
        let realList = []
        const indexOfFirstEn = value.indexOf(initialPlace["en_US"])
        const indexOfFirstJa = value.indexOf(initialPlace["ja_JP"])
        const indexOfFirstKo = value.indexOf(initialPlace["ko_KR"])

        if (indexOfFirstEn > -1) {
          realList = value.slice(initialPlace["en_US"].length)
          console.log({realList});
          if (realList.length === 0) {
            AsyncStorage.setItem('placeList', null);
            setPlaceList([])
          } else {
            realList = realList.slice(1)
            AsyncStorage.setItem('placeList', realList);
            setPlaceList(realList.split('/'))
          }
        } else if (indexOfFirstJa > -1) {
          realList = value.slice(initialPlace["ja_JP"].length)
          console.log({realList});
          if (realList.length === 0) {
            AsyncStorage.setItem('placeList', null);
            setPlaceList([])
          } else {
            realList = realList.slice(1)
            AsyncStorage.setItem('placeList', realList);
            setPlaceList(realList.split('/'))
          }
        } else if (indexOfFirstKo > -1) {
          realList = value.slice(initialPlace["ko_KR"].length)
          console.log({realList});
          if (realList.length === 0) {
            AsyncStorage.setItem('placeList', null);
            setPlaceList([])
          } else {
            realList = realList.slice(1)
            AsyncStorage.setItem('placeList', realList);
            setPlaceList(realList.split('/'))
          }
        } else {
          setPlaceList(value.split('/'));
        }
      }
    });
  }

  const pickPlace = (text) => {
    checkPlaceAccess(text);
    setShowPlace(false);
  };

  const checkPlaceAccess = (text) => {
    if (text === '') {
      setDevicePlaceAccess(false);
    } else {
      setDevicePlaceAccess(true);
      setNewDevicePlace(text);
    }
  };

  const goHome = () => {
    setRegistError(false);
    setTimeout(() => {
      navigation.navigate('RealTime');
    }, 1000);
  };

  const registDevice = () => {

//=======================================================================================

    fetch('https://us-central1-pico-home.cloudfunctions.net/GetLatestFirmware', {

      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        serialNum : id
      }),
    })
      .then((res)=> res.text())
      .then((res) => {
        console.log(res);
       const firm1 = res.substring(2,4);
       const firm2 = res.substring(4,6);
       const firm3 = res.substring(6,8);
        console.log(firm1+"."+firm2+"."+firm3);
      })
      .catch((error) => {
        console.error(error);
      });

//=================================================================



    setIsLoading(false);
    fetch('https://us-central1-pico-home.cloudfunctions.net/RegisterDevice', {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        userid: userInfo.userid, // userInfo.userid,
        apiKey: userInfo.apiKey, // userInfo.apiKey,
        serialNum: id,
        modelName: name,
        firmwareVersion: firmware,
        picoName: newDeviceName,
        description: newDevicePlace,
        lang: '',
      }),
    })
      .then((res) => res.json())
      .then((res) => {
        if (res.Msg === 'success') {
          //console.log('regist success');
          getDeviceState(userInfo.userid, userInfo.apiKey);
          setDevicePlaceAccess(false);

          getDeviceState(userInfo.userid, userInfo.apiKey);
          setTimeout(() => {
            navigation.navigate('RealTime');
          }, 3000);
        } else {
          console.log('Error Occur!');
          if (res.Msg === 'Already registered device.') {
            setRegistError(true);
          }
        }
      })
      .catch((error) => {
        console.error(error);
      });
  };

  const makePlaceList = ({ item }) => {
    return (
      <TouchableOpacity onPress={() => pickPlace(item)} style={{ alignItems: 'center', paddingTop: 8, paddingBottom: 8 }}>
        <Text>{item}</Text>
      </TouchableOpacity>
    );
  };

  const addPlaceList = async () => {
    let tempPlaceList = [...placeList];
    let s = '';

    if (!tempPlaceList.includes(newDevicePlace) && !defaultPlaceList.includes(newDevicePlace)) {
      tempPlaceList.push(newDevicePlace);

      for (let i = 0; i < tempPlaceList.length; i++) {
        if (i === tempPlaceList.length - 1) {
          s = s + tempPlaceList[i];
        } else {
          s = s + tempPlaceList[i] + '/';
        }
      }

      await AsyncStorage.setItem('placeList', s);
      getPlace()
    }
    setShowAddPlace(false);
  };

  return (
    <View style={styles.container}>
      {isLoading ? (
        <View>
          <View style={styles.box}>
            <Text style={styles.picoNameText}>{strings.wifisetting_4_label_name}</Text>
            <TextInput
              style={styles.picoNameTextInput}
              onChangeText={(text) => setNewDeviceName(text.trim())}
              placeholder={strings.wifisetting_4_input_name}></TextInput>
          </View>
          <View style={styles.placeContainer}>
            <Text style={styles.placeText}>{strings.wifisetting_4_label_place}</Text>
            <TouchableOpacity onPress={() => setShowPlace(true)}>
              <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                <TextInput
                  style={styles.placeTextInput}
                  onChangeText={(text) => checkPlaceAccess(text.trim())}
                  placeholder={strings.wifisetting_4_select_place_room}
                  value={devicePlaceAccess ? newDevicePlace : null}
                />
                <Image source={require('../../../../Assets/img/icMiniarrowBottom.png')} />
              </View>
            </TouchableOpacity>
            <Modal isVisible={showPlace} onBackdropPress={() => setShowPlace(false)}>
              <View style={styles.modalView}>
                <TouchableOpacity style={styles.modalCancel} onPress={() => setShowPlace(false)}>
                  <Image source={require('../../../../Assets/img/icCancel.png')} />
                </TouchableOpacity>
                <FlatList data={[...defaultPlaceList , ...placeList]} renderItem={(item) => makePlaceList(item)} />
                <TouchableOpacity
                  onPress={() => {
                    setShowPlace(false), setShowAddPlace(true);
                  }}
                  style={{ paddingTop: 8, paddingBottom: 8 }}>
                  <Text style={{ color: '#999' }}>{strings.wifisetting_4_select_place_add}</Text>
                </TouchableOpacity>
              </View>
            </Modal>
            <Modal isVisible={showAddPlace} onBackdropPress={() => setShowAddPlace(false)}>
              <View style={styles.modalView}>
                <TouchableOpacity style={styles.modalCancel} onPress={() => setShowAddPlace(false)}>
                  <Image source={require('../../../../Assets/img/icCancel.png')} />
                </TouchableOpacity>
                <Text style={styles.modalTitle}>{strings.wifisetting_4_popup_title}</Text>
                <View style={styles.modalBox}>
                  <Text style={{ color: colors.black }}>{strings.wifisetting_4_popup_label_place}</Text>
                  <TextInput style={styles.placeTextInput} onChangeText={(text) => checkPlaceAccess(text.trim())} />
                </View>
                <TouchableOpacity style={styles.placeList} onPress={() => addPlaceList()}>
                  <Text style={styles.buttonText}>{strings.wifisetting_4_popup_button_ok}</Text>
                </TouchableOpacity>
              </View>
            </Modal>
          </View>
          <View style={styles.picoHomeBig}>
            <Image source={require('../../../../Assets/img/imgPicohomeBig.png')} />
          </View>
          <TouchableOpacity style={styles.button} onPress={() => registDevice()}>
            <Text style={styles.buttonText}>{strings.wifisetting_4_button_start}</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <View style={styles.indicator}>
          <ActivityIndicator size="large" color={colors.azure} />
        </View>
      )}
      <Modal isVisible={registError}>
        <View style={styles.modalView}>
          <Text style={styles.modalTitle}>{strings.wifisetting_4_regist_error_title}</Text>
          <Text style={styles.modalSubText}>{strings.wifisetting_4_regist_error_text}</Text>
          <TouchableOpacity style={styles.placeList} onPress={() => goHome()}>
            <Text style={styles.buttonText}>{strings.wifisetting_4_regist_error_button_ok}</Text>
          </TouchableOpacity>
        </View>
      </Modal>
    </View>
  );
};

const { width, height } = Dimensions.get('window');

const styles = StyleSheet.create({
  container: {
    height: height,
    alignItems: 'center',
    backgroundColor: colors.white,
  },
  box: {
    flexDirection: 'column',
    width: width * 0.85,
    height: height * 0.0845,
    marginTop: 24,
    justifyContent: 'center',
    borderBottomWidth: 1,
    borderBottomColor: colors.veryLightPink,
  },
  picoNameText: {
    fontFamily: 'NotoSans-Regular',
    fontSize: 11,
    color: colors.brownGrey,
  },
  picoNameTextInput: {
    fontFamily: 'NotoSans-Regular',
    fontSize: 14,
    color: colors.greyishBrown,
  },
  placeContainer: {
    flexDirection: 'column',
    width: width * 0.85,
    marginTop: height * 0.0423,
    justifyContent: 'center',
    borderBottomWidth: 1,
    borderBottomColor: colors.veryLightPink,
  },
  placeText: {
    fontFamily: 'NotoSans-Regular',
    fontSize: 11,
    color: colors.brownGrey,
  },
  placeTextViewStyle: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  placeTextInput: { width: 220, fontFamily: 'NotoSans-Regular', color: colors.greyishBrown },
  placeList: {
    width: width * 0.75,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 30,
    borderRadius: 24,
    backgroundColor: colors.azure,
    shadowColor: 'rgba(0, 172, 255, 0.2)',
    shadowOffset: {
      width: 0,
      height: 10,
    },
    shadowRadius: 16,
    shadowOpacity: 1,
    elevation: 1,
  },
  modalView: {
    borderRadius: 15,
    paddingVertical: 24,
    backgroundColor: '#efefef',
    alignItems: 'center',
  },
  modalCancel: { position: 'absolute', right: 12, top: 12 },
  modalTitle: { fontFamily: 'NotoSans-Bold', fontSize: 18, marginBottom: 20 },
  modalSubText: {
    fontSize: 14,
    fontFamily: 'NotoSans-Regular',
    color: colors.brownGrey,
  },
  modalBox: {
    flexDirection: 'column',
    width: width * 0.75,
    justifyContent: 'center',
    borderBottomWidth: 1,
    borderBottomColor: colors.greyishBrown,
  },
  picoHomeBig: { marginTop: height * 0.1, alignItems: 'center' },
  button: {
    position: 'absolute',
    top: height * 0.74,
    width: width * 0.85,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 24,
    backgroundColor: colors.azure,
    shadowColor: 'rgba(0, 172, 255, 0.2)',
    shadowOffset: {
      width: 0,
      height: 10,
    },
    shadowRadius: 16,
    shadowOpacity: 1,
    elevation: 1,
  },
  buttonText: {
    textAlign: 'center',
    fontFamily: 'NotoSans-Bold',
    fontSize: 12,
    color: colors.white,
  },
  boxInput: {
    fontFamily: 'NotoSans-Regular',
    fontSize: 14,
    color: colors.greyishBrown,
  },
  indicator: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
