import React, { useState, useEffect, useContext } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TextInput,
  Image,
  Dimensions,
  FlatList,
  ActivityIndicator,
  TouchableOpacity,
  Keyboard,
  TouchableWithoutFeedback,
  NativeModules,
} from 'react-native';
import { DeviceContext, LanguageContext, PicoContext, SettingContext, UserContext } from '../../../context';
import AsyncStorage from '@react-native-community/async-storage';
import Modal from 'react-native-modal';
import colors from '../../../src/colors';
import initialPlace from '../../../src/InitialPlace';

export const EditDeviceSetting = () => {
  const { getDeviceState } = useContext(SettingContext);
  const strings = useContext(LanguageContext);
  const userInfo = useContext(UserContext);
  const device = useContext(DeviceContext);
  const [placeList, setPlaceList] = useState([]);
  const locale = NativeModules.I18nManager.localeIdentifier;
  const defaultPlaceList = initialPlace[locale].split('/')
  const id = useContext(PicoContext);

  const oriDeviceName = device[id].PicoName;
  const oriDevicePlace = device[id].Description;

  const [isLoading, setIsLoading] = useState(true);

  const [newDeviceName, setNewDeviceName] = useState(oriDeviceName);
  const [newDevicePlace, setNewDevicePlace] = useState(oriDevicePlace);
  const [deviceNameAccess, setDeviceNameAccess] = useState(false);
  const [devicePlaceAccess, setDevicePlaceAccess] = useState(false);

  const [showPlace, setShowPlace] = useState(false);
  const [showAddPlace, setShowAddPlace] = useState(false);
  const [canUpdate, setCanUpdate] = useState(false);

  useEffect(() => {
    getPlace()
  }, [canUpdate]);

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

  const togglePicker = () => {
    setShowPlace(false);
  };

  const checkNameAccess = (text) => {
    if (text === '') {
      setDeviceNameAccess(false);
      setNewDeviceName(oriDeviceName);
    } else {
      setDeviceNameAccess(true);
      setNewDeviceName(text);
    }
  };

  const checkPlaceAccess = (text) => {
    if (text === '') {
      setDevicePlaceAccess(false);
      // setNewDevicePlace(oriDevicePlace);
    } else {
      setDevicePlaceAccess(true);
      setNewDevicePlace(text);
    }
  };

  const pickPlace = (text) => {
    checkPlaceAccess(text);
    setShowPlace(false);
  };

  const modifyDeviceInfo = () => {
    setIsLoading(false);
    fetch('https://us-central1-pico-home.cloudfunctions.net/UpdateDeviceInfo', {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        userid: userInfo.userid,
        apiKey: userInfo.apiKey,
        deviceId: device[id].DeviceId,
        picoName: newDeviceName,
        description: newDevicePlace,
        firmwareVersion: device[id].FirmwareVersion,
      }),
    })
      .then((res) => res.json())
      .then((res) => {
        if (res.Msg === 'success') {
          //======console.log('Update Success!');
          getDeviceState(userInfo.userid, userInfo.apiKey);
          setDeviceNameAccess(false);
          setDevicePlaceAccess(false);
          setTimeout(() => {
            setIsLoading(true);
          }, 1000);
        } else {
          //=====console.log('Error Occur!');
        }
      })
      .catch((error) => {
        //====console.error(error);
      });
      setCanUpdate(false);
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

  const checkCanUpdate = () => {
    if (deviceNameAccess || devicePlaceAccess) {
      return true;
    }
    return false;
  };

  useEffect(() => {
    setCanUpdate(checkCanUpdate());
  }, [deviceNameAccess, devicePlaceAccess]);

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
      {isLoading ? (
        <View style={styles.container}>
          <View style={styles.picoNameContainer}>
            <Text style={styles.picoNameText}>{strings.wifisetting_4_label_name}</Text>
            <TextInput
              style={styles.picoNameTextInput}
              onChangeText={(text) => checkNameAccess(text)}
              placeholder={oriDeviceName}
            />
          </View>
          <View style={styles.placeContainer}>
            <Text style={styles.placeText}>{strings.wifisetting_4_label_place}</Text>
            <TouchableOpacity onPress={() => setShowPlace((prev) => !prev)}>
              <View style={styles.placeTextBox}>
                <TextInput
                  style={styles.placeTextInput}
                  onChangeText={(text) => checkPlaceAccess(text)}
                  placeholder={oriDevicePlace}
                  value={devicePlaceAccess ? newDevicePlace : null}
                />
                <View style={styles.icVisibilityHidden}>
                  <Image source={require('../../../../Assets/img/icMiniarrowBottom.png')} />
                </View>
              </View>
            </TouchableOpacity>
            <Modal isVisible={showPlace} onBackdropPress={() => togglePicker()}>
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
          <View style={styles.editButtonView}>
            {canUpdate ? (
              <TouchableOpacity
                style={[styles.editButtonStyle, { backgroundColor: colors.azure }]}
                onPress={() => modifyDeviceInfo()}>
                <Text style={styles.editButtonText}>{strings.profile_button_save}</Text>
              </TouchableOpacity>
            ) : (
              <View style={styles.editButtonStyle}>
                <Text style={styles.editButtonText}>{strings.profile_button_save}</Text>
              </View>
            )}
          </View>
        </View>
      ) : (
        <View style={styles.indicator}>
          <ActivityIndicator size="large" color={colors.azure} />
        </View>
      )}
    </TouchableWithoutFeedback>
  );
};

const { width, height } = Dimensions.get('window');

const styles = StyleSheet.create({
  container: {
    height: height,
    backgroundColor: colors.white,
    alignItems: 'center',
  },
  picoNameContainer: {
    flexDirection: 'column',
    width: width * 0.85,
    marginTop: height * 0.0423,
    justifyContent: 'center',
    borderBottomWidth: 1,
    borderBottomColor: colors.veryLightPink,
  },
  picoNameText: {
    fontFamily: 'NotoSans-Regular',
    fontSize: 12,
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
  fldViewStyle: {
    flexDirection: 'column',
    width: width * 0.85,
    height: height * 0.0845,
    marginTop: height * 0.0422,
    borderBottomWidth: 1,
    borderBottomColor: colors.veryLightPink,
  },
  placeText: {
    fontFamily: 'NotoSans-Regular',
    fontSize: 12,
    color: colors.brownGrey,
  },
  placeTextBox: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  placeTextInput: {
    fontFamily: 'NotoSans-Regular',
    fontSize: 14,
    color: colors.greyishBrown,
  },
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
  buttonText: {
    textAlign: 'center',
    fontFamily: 'NotoSans-Bold',
    fontSize: 12,
    color: colors.white,
  },
  modalView: {
    borderRadius: 15,
    paddingVertical: 24,
    backgroundColor: '#efefef',
    alignItems: 'center',
  },
  modalCancel: { position: 'absolute', right: 12, top: 12 },
  modalTitle: { fontFamily: 'NotoSans-Bold', fontSize: 18, marginBottom: 20 },
  modalBox: {
    flexDirection: 'column',
    width: width * 0.75,
    justifyContent: 'center',
    borderBottomWidth: 1,
    borderBottomColor: colors.greyishBrown,
  },
  icVisibilityHidden: {
    position: 'absolute',
    right: 0,
    alignItems: 'center',
    justifyContent: 'center',
  },
  editButtonView: { marginTop: height * 0.49 },
  editButtonStyle: {
    width: width * 0.85,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 24,
    backgroundColor: colors.veryLightPink,
    shadowColor: 'rgba(0, 172, 255, 0.2)',
    shadowOffset: {
      width: 0,
      height: 10,
    },
    shadowRadius: 16,
    shadowOpacity: 1,
    elevation: 1,
  },
  editButtonText: {
    fontFamily: 'NotoSans-Bold',
    fontSize: 12,
    color: colors.white,
  },
  indicator: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.white,
  },
});
