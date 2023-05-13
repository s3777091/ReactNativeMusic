import React from 'react';
import {
  SafeAreaView,
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Alert
} from 'react-native';

import PropTypes from 'prop-types';
import { MaterialIcons, Ionicons } from '@expo/vector-icons';

import AsyncStorage from '@react-native-async-storage/async-storage';

import LoginSVG from '../assets/images/login.svg'
import GoogleSVG from '../assets/images/google.svg'
import FacebookSVG from '../assets/images/facebook.svg'
import TwitterSVG from '../assets/images/twitter.svg'

import CustomButton from '../components/Design/CustomButton';

import { colors, func } from '../constants';
import con from '../../data';

const LOGIN_URL = con.Domain.concat(con.Login);


const LoginScreen = ({ navigation }) => {

  const [userEmail, setUserEmail] = React.useState("");
  const [userPwd, setUserPwd] = React.useState("");

  const LoginUser = async () => {
    try {
      
      const payload = JSON.stringify({
        email: userEmail,
        pwd: userPwd
      });

      const responseLogin = await fetch(LOGIN_URL, {
        method: "POST",
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
        body: payload,
      })

      if(responseLogin.status === 407){
        func.showCheck('Wrong password', 'pls check your password again');
      } else if (responseLogin.status === 401) {
        func.showCheck('Null user found', 'Your account not existing pls create new one !!')
      }

      if (responseLogin.status >= 200 && responseLogin.status <= 299) {
        await responseLogin.json().then(async (ts) => {
          try {
            await AsyncStorage.setItem('userDetail', JSON.stringify(ts));
          } catch (error) {
            console.log(error);
          } finally {
            showAlert('Login success', `welcomback ${userEmail}`);
          }
        });
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
      <View style={{ paddingHorizontal: 25 }}>
        <View style={{ alignItems: 'center' }}>

          <LoginSVG
            height={300}
            width={300}
            viewBox = "0 0 800 500"
            style={{ transform: [{ rotate: '-5deg' }] }}
          />

        </View>

        <Text
          style={{
            fontSize: 28,
            fontWeight: '500',
            color: colors.brandPrimary,
            marginBottom: 30,
          }}>
          Login
        </Text>


        <View
          style={styles.container_input}>
          <MaterialIcons
            name="alternate-email"
            size={20}
            color="#666"
            style={{ marginRight: 5 }}
          />
          <TextInput
            style={styles.input}
            onChangeText={text => setUserEmail(text)}
            fontStyle={colors.white}
            placeholderTextColor={colors.greyLight}
            autoFocus={true}
            keyboardType="email-address"
            // fontStyle={colors.white}
            placeholder={"Enter your email"}
          />
        </View>

        <View
          style={styles.container_input}>
          <Ionicons
            name="ios-lock-closed-outline"
            size={20}
            color="#666"
            style={{ marginRight: 5 }}
          />
          <TextInput
            style={styles.input}
            onChangeText={text => setUserPwd(text)}
            fontStyle={colors.white}
            secureTextEntry={true}
            placeholderTextColor={colors.greyLight}
            autoFocus={true}
            keyboardType="password"
            placeholder={"Enter your password"}
          />
        </View>

        <CustomButton label={"Login"} onPress={() => {
          if (userEmail.length === 0 || userPwd.length === 0) {
            func.showCheck('Null value', 'need input value when register')
          } else {
            LoginUser();
          }
        }} />

        <Text style={{ textAlign: 'center', color: '#666', marginBottom: 30 }}>
          Or, login with ...
        </Text>

        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            marginBottom: 30,
          }}>
          <TouchableOpacity
            onPress={() => { }}
            style={{
              borderColor: '#ddd',
              borderWidth: 2,
              borderRadius: 10,
              paddingHorizontal: 30,
              paddingVertical: 10,
            }}>
            <GoogleSVG height={24} width={24} />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => { }}
            style={{
              borderColor: '#ddd',
              borderWidth: 2,
              borderRadius: 10,
              paddingHorizontal: 30,
              paddingVertical: 10,
            }}>
            <FacebookSVG height={24} width={24} />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => { }}
            style={{
              borderColor: '#ddd',
              borderWidth: 2,
              borderRadius: 10,
              paddingHorizontal: 30,
              paddingVertical: 10,
            }}>
            <TwitterSVG height={24} width={24} />
          </TouchableOpacity>
        </View>


        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'center',
            marginBottom: 30,
          }}>
          <Text style={{ color: colors.white }}>New to the app?</Text>
          <TouchableOpacity onPress={() => navigation.navigate('Register')}>
            <Text style={{ color: colors.brandPrimary, fontWeight: '700' }}> Register</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
};


LoginScreen.propTypes = {
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


export default React.memo(LoginScreen);