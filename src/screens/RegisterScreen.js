import React, { useRef, useState, useEffect } from "react";
// import {useState} from 'react';
import {
    SafeAreaView,
    ScrollView,
    View,
    Text,
    TextInput,
    TouchableOpacity,
} from 'react-native';
import PropTypes from 'prop-types';
import axios from 'axios';

import { MaterialIcons, Ionicons } from '@expo/vector-icons';
import RegistrationSVG from '../assets/images/registration.svg'
import CustomButton from '../components/Design/CustomButton';
import InputField from '../components/Design/InputField';
import { colors } from '../constants';
import { onChange } from "react-native-reanimated";

const USERNAME_REGEX = /^[A-z][A-z0-9-_]{1,23}$/;
const USEREMAIL_REGEX = /^[a-zA-Z0-9+-\_.]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/;
const PWD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%]).{8,24}$/;
const REGISTER_URL = "http://192.168.0.13:3000/register";

const RegisterScreen = ({navigation}) => {
    const userNameRef = useRef();
    const userEmailRef = useRef();   
    const userPwdRef = useRef();
    const userMatchPwdRef = useRef();
    const errRef = useRef();

    const [userName, setUserName] = useState("");
    const [validUserName, setValidUserName] = useState(false);
    const [userNameFocus, setUserNameFocus] = useState(false);

    const [userEmail, setUserEmail] = useState("");
    const [validUserEmail, setValidUserEmail] = useState(false);

    const [userPwd, setUserPwd] = useState("");
    const [validUserPwd, setValidUserPwd] = useState(false);

    const [userPwdConfirm, setPwdConfirm] = useState("");
    const [validPwdConfirm, setValidPwdConfirm] = useState(false);

    const [errMsg, setErrMsg] = useState("");
    const [isRegistraionSuccess, setIsRegistraionSuccess] = useState(false);

    const nameChangeHandler = (userName) => {
        if(userName.trim().length === 0) {
            setValidUserName(false);
        } else {
            setValidUserName(true);
        }
        setUserName(userName);
    };

    const emailChangeHandler = (userEmail) => {
        if(userEmail.trim().length === 0) {
            setValidUserEmail(false);
        } else {
            setValidUserEmail(true);
        }
        setUserName(userEmail);
    };

    const pwdChangeHandler = (userPwd) => {
        if(userPwd.trim().length === 0) {
            setValidUserPwd(false);
        } else {
            setValidUserPwd(true);
        }
        setUserName(userPwd);
    };

    const confirmPwdChangeHandler = (userPwdConfirm) => {
        if(userPwdConfirm.trim().length === 0) {
            setValidPwdConfirm(false);
        } else {
            setValidPwdConfirm(true);
        }
        setUserName(userPwdConfirm);
    };

    // useEffect(() => {
    //     userNameRef.current.focus();
    // }, []);

    useEffect(() => {
        setValidUserName(USERNAME_REGEX.test(userName));
    }, [userName]);

    useEffect(() => {
        setValidUserEmail(USEREMAIL_REGEX.test(userEmail));
    }, [userEmail]);

    useEffect(() => {
        setValidUserPwd(PWD_REGEX.test(userPwd));
        setPwdConfirm(userPwd === userPwdConfirm);
    }, [userPwd, userPwdConfirm]);

    useEffect(() => {
        setErrMsg("");
    }, [userName, userPwd, userPwdConfirm]);


    const handleSubmitButton = async (e) => {
        e.preventDefault();

        // if(!userName) {
        //     alert('Please enter your name!');
        //     return;
        // } else if(!validUserName) {
        //     alert('Name should be more than 2 bytes!');
        //     return;
        // }

        // if(!userEmail) {
        //     alert('Please enter your email!');
        //     return;
        // } else if(!validUserEmail) {
        //     alert('Wrong type of email!');
        //     return;
        // }

        // if(!userPwd) {
        //     alert('Please enter the password!');
        //     return;
        // } else if(!validUserPwd) {
        //     alert('Wrong type of password!');
        //     return;
        // }

        // if(userPwd != userPwdConfirm) {
        //     alert('Your password does not match!');
        //     return;
        // }

        try {
            console.log("username:" + userName);
            console.log("useremail:" + userEmail);
            await axios.post(
                REGISTER_URL,
                JSON.stringify({ userName, userEmail, userPwd }),
                {
                    headers: { "Content-Type": "application/json" }
                }
            );
            setIsRegistraionSuccess(true);
            setUserName("");
            setUserEmail("");
            setUserPwd("");
            }

        catch(err) {
            if(!err?.response) {
                setErrMsg("No Server Response");
            } else if(err.response?.status === 409) {
                setErrMsg("Username Taken");
            } else {
                setErrMsg("Registration Failed");
            }
            // errRef.current.focus();
        }
    };

    if(isRegistraionSuccess) {
        return(
            <SafeAreaView style={{flex: 1, justifyContent: 'center'}}>
                <ScrollView>
                    <View
                    style={{
                        height: hp(7),
                        justifyContent: 'center',
                        alignItems: 'center',
                    }}>
                        <Text style={{color: 'white', fontSize: wp('4%')}}>
                            Successfully Registered!
                        </Text>
                    </View>
                    <View style={{height: hp(20), justifyContent: 'center'}}>
                        <View style={styles.btnArea}>
                        <TouchableOpacity
                            style={styles.btn}
                            activeOpacity={0.5}
                            onPress={() => navigation.navigate('Login')}>
                            <Text style={{color: 'white', fontSize: wp('4%')}}>
                            Login
                            </Text>
                        </TouchableOpacity>
                        </View>
                    </View>
                </ScrollView>
            </SafeAreaView>
        );
    }

    return (
        <SafeAreaView style={{flex: 1, justifyContent: 'center'}}>
            <ScrollView
                showsVerticalScrollIndicator={false}
                style={{paddingHorizontal: 25}}>
                <View style={{alignItems: 'center'}}>
                <RegistrationSVG
                    height={300}
                    width={300}
                    viewBox="0 0 700 500"
                    style={{transform: [{rotate: '-5deg'}]}}
                />
                </View>

                <Text
                style={{
                    fontSize: 28,
                    fontWeight: '500',
                    color: colors.brandPrimary,
                    marginBottom: 30,
                }}>
                Register
                </Text>

                {/* <View
                    style={{
                        flexDirection: 'row',
                        borderBottomColor: colors.greyLight,
                        borderBottomWidth: 1,
                        paddingBottom: 8,
                        marginBottom: 25,
                    }}>
                <Ionicons
                        name="person-outline"
                        size={20}
                        color="#666"
                        style={{marginRight: 5}}
                        />
                <TextInput
                    fontStyle={colors.white}
                    placeholderTextColor={colors.greyLight}
                    autoFocus={true}
                    placeholder="Name"
                    style={{ 
                    flex: 1, 
                    paddingVertical: 0, 
                    color: colors.white }}
                    value = {userName}
                    onChangeText={(userName) => nameChangeHandler(userName)}
                    ref={userNameRef}
                    returnKeyType="next"
                    onSubmitEditing={() =>
                        userNameRef.current && userNameRef.current.focus()
                    }
                    />
                </View>

                <View
                    style={{
                        flexDirection: 'row',
                        borderBottomColor: colors.greyLight,
                        borderBottomWidth: 1,
                        paddingBottom: 8,
                        marginBottom: 25,
                    }}>
                <MaterialIcons
                    name="alternate-email"
                    size={20}
                    color="#666"
                    style={{marginRight: 5}}
                    />
                <TextInput
                    fontStyle={colors.white}
                    placeholderTextColor={colors.greyLight}
                    autoFocus={true}
                    placeholder="Email"
                    style={{ flex: 1, paddingVertical: 0, color: colors.white }}
                    value = {userEmail}
                    onChange={onChange}
                    onChangeText={(userEmail) => emailChangeHandler(userEmail)}
                    ref={userEmailRef}
                    onSubmitEditing={() =>
                        userEmailRef.current && userEmailRef.current.focus()
                    }
                    />
                </View>

                <View
                    style={{
                        flexDirection: 'row',
                        borderBottomColor: colors.greyLight,
                        borderBottomWidth: 1,
                        paddingBottom: 8,
                        marginBottom: 25,
                    }}>
                <Ionicons
                    name="ios-lock-closed-outline"
                    size={20}
                    color="#666"
                    style={{marginRight: 5}}
                    />
                <TextInput
                    fontStyle={colors.white}
                    placeholderTextColor={colors.greyLight}
                    autoFocus={true}
                    // fontStyle={colors.white}
                    placeholder="Password"
                    style={{ flex: 1, paddingVertical: 0, color: colors.white }}
                    value={userPwd}
                    onChangeText={(userPwd) => pwdChangeHandler(userPwd)}
                    ref={userPwdRef}
                    onSubmitEditing={() =>
                        userPwdRef.current && userPwdRef.current.focus()
                    }
                    secureTextEntry={true}
                    />
                </View>

                <View
                    style={{
                        flexDirection: 'row',
                        borderBottomColor: colors.greyLight,
                        borderBottomWidth: 1,
                        paddingBottom: 8,
                        marginBottom: 25,
                    }}>
                <Ionicons
                    name="ios-lock-closed-outline"
                    size={20}
                    color="#666"
                    style={{marginRight: 5}}
                    />
                <TextInput
                    fontStyle={colors.white}
                    placeholderTextColor={colors.greyLight}
                    autoFocus={true}
                    // fontStyle={colors.white}
                    placeholder="Confirm Password"
                    style={{ flex: 1, paddingVertical: 0, color: colors.white }}
                    value = {userPwdConfirm}
                    onChangeText={(userPwdConfirm) => setPwdConfirm(userPwdConfirm)}
                    ref={userMatchPwdRef}
                    onSubmitEditing={() =>
                        userMatchPwdRef.current && userMatchPwdRef.current.focus()
                    }
                    secureTextEntry={true}
                    />
                </View> */}

                <InputField
                label={'Name'}
                icon={
                    <Ionicons
                    name="person-outline"
                    size={20}
                    color="#666"
                    style={{marginRight: 5}}
                    />
                }
                value={userName}
                onChangeText={(userName) => nameChangeHandler(userName)}
                // onFocus={() => setUserNameFocus(true)}
                // onBlur={() => setUserNameFocus(false)}
                // onChangeText={setUserName}
                returnKeyType="next"
                // onSubmitEditing={() =>
                //     userNameRef.current && userNameRef.current.focus()
                // }
                />

                <InputField
                label={'Email'}
                icon={
                    <MaterialIcons
                    name="alternate-email"
                    size={20}
                    color="#666"
                    style={{marginRight: 5}}
                    />
                }
                keyboardType="email-address"
                value = {userEmail}
                // onChangeText={(userEmail) => emailChangeHandler(userEmail)}
                // // ref={userEmailRef}
                // returnKeyType="next"
                // onSubmitEditing={() =>
                //     userEmailRef.current && userEmailRef.current.focus()
                // }
                />

                <InputField
                label={'Password'}
                icon={
                    <Ionicons
                    name="ios-lock-closed-outline"
                    size={20}
                    color="#666"
                    style={{marginRight: 5}}
                    />
                }
                inputType="password"
                // onChangeText={(userPwd) => pwdChangeHandler(userPwd)}
                // ref={userPwdRef}
                // returnKeyType="next"
                // onSubmitEditing={() =>
                //     userPwdRef.current && userPwdRef.current.focus()
                // }
                />

                <InputField
                label={'Confirm Password'}
                icon={
                    <Ionicons
                    name="ios-lock-closed-outline"
                    size={20}
                    color="#666"
                    style={{marginRight: 5}}
                    />
                }
                inputType="password"
                // onChangeText={(userPwdConfirm) => confirmPwdChangeHandler(userPwdConfirm)}
                // // ref={userMatchPwdRef}
                // onSubmitEditing={() =>
                //     userMatchPwdRef.current && userMatchPwdRef.current.focus()
                // }
                />

                <CustomButton label={'Register'} onPress={handleSubmitButton} />

                <View
                style={{
                    flexDirection: 'row',
                    justifyContent: 'center',
                    marginBottom: 30,
                }}>
                <Text style={{color: colors.white}}>Already registered?</Text>
                <TouchableOpacity onPress={() => navigation.goBack()}>
                    <Text style={{color: colors.brandPrimary, fontWeight: '700'}}> Login</Text>
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


export default RegisterScreen;