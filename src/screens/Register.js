import React, { useState, useContext } from 'react';
import { StatusBar } from 'expo-status-bar';

// formik
import { Formik } from 'formik';

import { View, TouchableOpacity, ActivityIndicator } from 'react-native';

//colors
const { darkLight, brand, primary } = Colors;

// icon
import { Octicons, Ionicons } from '@expo/vector-icons';

// keyboard avoiding view
import KeyboardAvoidingWrapper from './../components/KeyboardAvoidingWrapper';

// api client
import axios from 'axios';

// Async storage
import AsyncStorage from '@react-native-async-storage/async-storage';

// credentials context
import { CredentialsContext } from './../components/CredentialsContext';

const Register = ({ navigation }) => {
    // const [hidePassword, setHidePassword] = useState(true);
    // const [show, setShow] = useState(false);
    // const [date, setDate] = useState(new Date(2000, 0, 1));
    // const [message, setMessage] = useState();
    // const [messageType, setMessageType] = useState();

    const [id, setUser] = useState("");
    const [validName, setValidName] = useState(false);

    const [pwd, setPwd] = useState("");
    const [validPwd, setValidPwd] = useState(false);

    // Actual value to be sent
    const [dob, setDob] = useState();

    // credentials context
    const {storedCredentials, setStoredCredentials} = useContext(CredentialsContext);

    // Form handling
    const handleRegister = (credentials, setSubmitting) => {
    handleMessage(null);
    const url = '/register';
    axios
        .post(url, credentials)
        .then((response) => {
            const result = response.data;
            const { status, message, data } = result;

            if (status !== 'SUCCESS') {
                handleMessage(message, status);
            } else {
                persistLogin({ ...data } ,message, status);
            }
            setSubmitting(false);
        })
        .catch((error) => {
            setSubmitting(false);
            handleMessage('An error occurred. Check your network and try again');
            console.log(error.toJSON());
        });
    };

    const handleMessage = (message, type = '') => {
        setMessage(message);
        setMessageType(type);
    };

    // Persisting login after register
    const persistLogin = (credentials, message, status) => {
    AsyncStorage.setItem('kiMusicCredentials', JSON.stringify(credentials))
        .then(() => {
            handleMessage(message, status);
            setStoredCredentials(credentials);
        })
        .catch((error) => {
            handleMessage('Persisting login failed');
            console.log(error)
        });
    };

    return (
    <KeyboardAvoidingWrapper>
        <StyledContainer>
        <StatusBar style="dark" />
        <InnerContainer>
            <PageTitle>KiMusic</PageTitle>
            <SubTitle>Account Register</SubTitle>

            <Formik
            initialValues={{ id: '', password: '', confirmPassword: '' }}
            onSubmit={(values, { setSubmitting }) => {
                values = { ...values, dateOfBirth: dob };
                if (
                    values.id == '' ||
                    values.pwd == '' ||
                    values.confirmPassword == ''
                ) {
                    handleMessage('Please fill in all fields');
                    setSubmitting(false);
                } else if (values.password !== values.confirmPassword) {
                    handleMessage('Passwords do not match!');
                    setSubmitting(false);
                } else {
                    handleRegister(values, setSubmitting);
                }
            }}
            >
            {({ handleChange, handleBlur, handleSubmit, values, isSubmitting }) => (
                <StyledFormArea>
                <MyTextInput
                    label="ID"
                    placeholder=""
                    placeholderTextColor={darkLight}
                    onChangeText={handleChange('id')}
                    onBlur={handleBlur('id')}
                    value={values.id}
                    icon="person"
                />
                <MyTextInput
                    label="Password"
                    placeholder="* * * * * * * *"
                    placeholderTextColor={darkLight}
                    onChangeText={handleChange('password')}
                    onBlur={handleBlur('password')}
                    value={values.password}
                    secureTextEntry={hidePassword}
                    icon="lock"
                    isPassword={true}
                    hidePassword={hidePassword}
                    setHidePassword={setHidePassword}
                />
                <MyTextInput
                    label="Confirm Password"
                    placeholder="* * * * * * * *"
                    placeholderTextColor={darkLight}
                    onChangeText={handleChange('confirmPassword')}
                    onBlur={handleBlur('confirmPassword')}
                    value={values.confirmPassword}
                    secureTextEntry={hidePassword}
                    icon="lock"
                    isPassword={true}
                    hidePassword={hidePassword}
                    setHidePassword={setHidePassword}
                />
                <MsgBox type={messageType}>{message}</MsgBox>

                {!isSubmitting && (
                    <StyledButton onPress={handleSubmit}>
                    <ButtonText>Register</ButtonText>
                    </StyledButton>
                )}
                {isSubmitting && (
                    <StyledButton disabled={true}>
                    <ActivityIndicator size="large" color={primary} />
                    </StyledButton>
                )}

                <Line />
                <ExtraView>
                    <ExtraText>Already have an account? </ExtraText>
                    <TextLink onPress={() => navigation.navigate('Login')}>
                    <TextLinkContent>Login</TextLinkContent>
                    </TextLink>
                </ExtraView>
                </StyledFormArea>
            )}
            </Formik>
        </InnerContainer>
        </StyledContainer>
    </KeyboardAvoidingWrapper>
    );
};

const MyTextInput = ({ label, icon, isPassword, hidePassword, setHidePassword, ...props }) => {
  return (
    <View>
      <LeftIcon>
        <Octicons name={icon} size={30} color={brand} />
      </LeftIcon>
      <StyledInputLabel>{label}</StyledInputLabel>

      {isPassword && (
        <RightIcon
          onPress={() => {
            setHidePassword(!hidePassword);
          }}
        >
          <Ionicons name={hidePassword ? 'md-eye-off' : 'md-eye'} size={30} color={darkLight} />
        </RightIcon>
      )}
    </View>
  );
};

export default Register;