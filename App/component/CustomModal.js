import React, { useContext, useState } from 'react';
import { StyleSheet, View, Text, Image, Dimensions, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { BackToFromContext, LanguageContext } from '../context';
import Modal from 'react-native-modal';
import colors from '../src/colors';

export default function CustomModal(props) {
  const navigation = useNavigation();
  const strings = useContext(LanguageContext);
  const from = useContext(BackToFromContext);

  const [isVisible, setVisible] = useState(true);

  const goNext = () => {
    if (props.close === 'Yes') {
      setVisible(false);
    } else {
      setVisible(false);
      navigation.navigate(from);
    }
  };

  return (
    <Modal isVisible={isVisible} onBackdropPress={() => (props.close === 'Yes' ? setVisible(false) : navigation.navigate(from))}>
      <View style={styles.modalContainer}>
        <View style={styles.modalCancel}>
          <TouchableOpacity onPress={() => goNext()}>
            <Image source={require('../../Assets/img/icCancel.png')} />
          </TouchableOpacity>
        </View>
        <View style={styles.modalHeaderTextView}>
          <Text style={styles.modalHeaderText}>{props.modalHeaderText}</Text>
        </View>
       {/* <View style={styles.modalSubTextView}>
          <Text style={styles.modalSubText}>{props.modalSubText}</Text>
        </View>
         <View style={styles.modalSubTextView2}>
          <Text style={styles.modalSubText2}>{props.modalSubText2}</Text>
        </View>
        <View style={styles.modalSubTextView3}>
          <Text style={styles.modalSubText3}>{props.modalSubText3}</Text>
        </View>
        <View style={styles.modalSubTextView4}>
          <Text style={styles.modalSubText4}>{props.modalSubText4}</Text>
        </View>
        <View style={styles.modalSubTextView5}>
          <Text style={styles.modalSubText5}>{props.modalSubText5}</Text>
        </View>
        <View style={styles.modalSubTextView6}>
          <Text style={styles.modalSubText6}>{props.modalSubText6}</Text>
        </View> */}

        <View style={styles.modalSubTextView_update}>
          <Text style={styles.modalSubText_update}>{props.modalSubText_update}</Text>
        </View>
         <View style={styles.modalSubTextView1_update}>
          <Text style={styles.modalSubText1_update}>{props.modalSubText1_update}</Text>
        </View>
        <View style={styles.modalSubTextView2_update}>
          <Text style={styles.modalSubText2_update}>{props.modalSubText2_update}</Text>
        </View>
        <View style={styles.modalSubTextView3_update}>
          <Text style={styles.modalSubText3_update}>{props.modalSubText3_update}</Text>
        </View>


        <TouchableOpacity onPress={() => goNext()}>
          <View style={[styles.modalButton, { width: width * 0.8 }]}>
            <Text style={styles.modalButtonText}>{strings.popup_button_ok}</Text>
          </View>
        </TouchableOpacity>
      </View>
    </Modal>
  );
}

const { width, height } = Dimensions.get('window');

const styles = StyleSheet.create({
  modalContainer: {
    width: width * 0.9,
    paddingTop: 32,
    paddingBottom: 24,
    paddingHorizontal: 24,
    alignItems: 'center',
    borderRadius: 10,
    backgroundColor: colors.white,
  },
  modalCancel: { position: 'absolute', top: 12, right: 12 },
  modalHeaderTextView: {
    width: width * 0.9,
    alignItems: 'center',
  },
  modalHeaderText: { fontSize: 22, fontFamily: 'NotoSans-Bold' },
  modalSubTextView: {
    width: width * 0.8,
    marginTop: height * 0.03,
  },

  modalSubTextView2: {
    width: width * 0.8,
    marginTop: height * 0.0001,
  },

  modalSubTextView3: {
    width: width * 0.8,
    marginTop: height * 0.03,
  },

  modalSubTextView4: {
    width: width * 0.8,
    marginTop: height * 0.0001,
  },

  modalSubTextView5: {
    width: width * 0.8,
    marginTop: height * 0.03,
  },

  modalSubTextView6: {
    width: width * 0.8,
    marginTop: height * 0.0001,
  },

  modalSubTextView_update: {
    width: width * 0.8,
    marginTop: height * 0.03,
  },

  modalSubTextView1_update: {
    width: width * 0.8,
    marginTop: height * 0.0001,
  },

  modalSubTextView2_update: {
    width: width * 0.8,
    marginTop: height * 0.0001,
  },

  modalSubTextView3_update: {
    width: width * 0.8,
    marginTop: height * 0.0001,
  },


  modalSubText: { textAlign: 'left', fontFamily: 'NotoSans-Regular', fontSize: 14.5, color: colors.brownGrey },
  modalSubText2: { textAlign: 'left', fontFamily: 'NotoSans-Regular', fontSize: 12.5, color: colors.brownGrey },
  modalSubText3: { textAlign: 'left', fontFamily: 'NotoSans-Regular', fontSize: 14.5, color: colors.brownGrey },
  modalSubText4: { textAlign: 'left', fontFamily: 'NotoSans-Regular', fontSize: 12.5, color: colors.brownGrey },
  modalSubText5: { textAlign: 'left', fontFamily: 'NotoSans-Regular', fontSize: 14.5, color: colors.brownGrey },
  modalSubText6: { textAlign: 'left', fontFamily: 'NotoSans-Regular', fontSize: 12.5, color: colors.brownGrey },

  modalSubText_update: { textAlign: 'center', fontFamily: 'NotoSans-Regular', fontSize: 13, color: colors.brownGrey },
  modalSubText1_update: { textAlign: 'left', fontFamily: 'NotoSans-Regular', fontSize: 12, color: colors.brownGrey },
  modalSubText2_update: { textAlign: 'left', fontFamily: 'NotoSans-Regular', fontSize: 12, color: colors.brownGrey },
  modalSubText3_update: { textAlign: 'left', fontFamily: 'NotoSans-Regular', fontSize: 12, color: colors.brownGrey },

  modalButton: {
    width: width * 0.3875,
    height: height * 0.0704,
    marginTop: height * 0.07,
    marginHorizontal: 4,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 30,
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
  modalButtonText: {
    fontSize: 20,
    fontFamily: 'NotoSans-Bold',
    color: colors.white,
  },
});
