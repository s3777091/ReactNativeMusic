import React, { useState } from 'react';
import {
  SafeAreaView,
  ScrollView,
  View,
  Text,
  Alert,
  TextInput,
  TouchableOpacity,
  StyleSheet
} from 'react-native';

import PropTypes from 'prop-types';

import { MaterialIcons, Ionicons } from '@expo/vector-icons';

import RegistrationSVG from '../assets/images/registration.svg';

import CustomButton from '../components/Design/CustomButton';
import { colors, func } from '../constants';

import con from '../../data';

const USERNAME_REGEX = /^[A-z][A-z0-9-_]{1,23}$/;
const USEREMAIL_REGEX = /^[a-zA-Z0-9+-\_.]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/;
const PWD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%]).{8,24}$/;
const REGISTER_URL = con.Domain.concat(con.Register);

const RegisterScreen = ({ navigation }) => {
  const [userName, setUserName] = useState('');
  const [userEmail, setUserEmail] = useState('');
  const [userPwd, setUserPwd] = useState('');

  const RegisterUser = async () => {
    try {
      const payload = JSON.stringify({
        name: userName,
        email: userEmail,
        pwd: userPwd
      });

      const responseRegister = await fetch(REGISTER_URL, {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json'
        },
        body: payload
      });

      if (responseRegister.status === 401) {
        showAlert(
          'Already have user',
          'User already existing in database pls create new one !!'
        );
      }

      if (responseRegister.status >= 200 && responseRegister.status <= 299) {
        showAlert('Success Create user', 'Thanks for create account');
      }
    } catch (error) {
      console.error(error);
    }
  };

  const showAlert = (title, des) =>
    Alert.alert(
      `${title}`,
      `${des}`,
      [
        {
          text: 'Go Back',
          onPress: () => navigation.goBack(null),
          style: 'cancel'
        }
      ],
      {
        cancelable: true,
        onDismiss: () =>
          Alert.alert(
            'This alert was dismissed by tapping outside of the alert dialog.'
          )
      }
    );

  return (
    <SafeAreaView style={{ flex: 1, justifyContent: 'center' }}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        style={{ paddingHorizontal: 25 }}
      >
        <View style={{ alignItems: 'center' }}>
          <RegistrationSVG
            height={300}
            width={300}
            viewBox="0 0 800 500"
            style={{ transform: [{ rotate: '-5deg' }] }}
          />
        </View>

        <Text
          style={{
            fontSize: 28,
            fontWeight: '500',
            color: colors.brandPrimary,
            marginBottom: 30
          }}
        >
          Register
        </Text>

        <View style={styles.container_input}>
          <Ionicons
            name="person-outline"
            size={20}
            color="#666"
            style={{ marginRight: 5 }}
          />
          <TextInput
            style={styles.input}
            onChangeText={(text) => setUserName(text)}
            fontStyle={colors.white}
            placeholderTextColor={colors.greyLight}
            autoFocus={true}
            placeholder={'Enter your name'}
          />
        </View>

        <View style={styles.container_input}>
          <MaterialIcons
            name="alternate-email"
            size={20}
            color="#666"
            style={{ marginRight: 5 }}
          />
          <TextInput
            style={styles.input}
            onChangeText={(text) => setUserEmail(text)}
            fontStyle={colors.white}
            placeholderTextColor={colors.greyLight}
            autoFocus={true}
            keyboardType="email-address"
            placeholder={'Enter your email'}
          />
        </View>

        <View style={styles.container_input}>
          <Ionicons
            name="ios-lock-closed-outline"
            size={20}
            color="#666"
            style={{ marginRight: 5 }}
          />
          <TextInput
            style={styles.input}
            onChangeText={(text) => setUserPwd(text)}
            fontStyle={colors.white}
            secureTextEntry={true}
            placeholderTextColor={colors.greyLight}
            autoFocus={true}
            keyboardType="password"
            placeholder={'Enter your password'}
          />
        </View>

        <CustomButton
          label={'Register'}
          onPress={() => {
            if (!userName) {
              func.showCheck('No user name', 'Please enter the user name');
            } else if (!USERNAME_REGEX.test(userName)) {
              func.showCheck(
                'Invalid user name',
                'User name must be at least 2 bytes'
              );
            } else if (!userEmail) {
              func.showCheck('No user email', 'Please enter the user email');
            } else if (!USEREMAIL_REGEX.test(userEmail)) {
              func.showCheck(
                'Invalid user email',
                'Please check the email format'
              );
            } else if (!userPwd) {
              func.showCheck('No password', 'Please enter the password');
            } else if (!PWD_REGEX.test(userPwd)) {
              func.showCheck(
                'Invalid password',
                'Password must be at least 8 letters and have !, @, #, $, %'
              );
            } else {
              RegisterUser();
            }
          }}
        />

        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'center',
            marginBottom: 30
          }}
        >
          <Text style={{ color: colors.white }}>Already registered?</Text>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Text style={{ color: colors.brandPrimary, fontWeight: '700' }}>
              {' '}
              Login
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

RegisterScreen.propTypes = {
  // required
  navigation: PropTypes.object.isRequired
};

const styles = StyleSheet.create({
  container_input: {
    flexDirection: 'row',
    borderBottomColor: colors.greyLight,
    borderBottomWidth: 1,
    paddingBottom: 8,
    marginBottom: 25
  },
  input: {
    flex: 1,
    paddingVertical: 0,
    color: colors.white
  }
});

export default React.memo(RegisterScreen);
