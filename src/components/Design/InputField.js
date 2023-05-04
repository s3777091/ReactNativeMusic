import React from 'react';
import { View, Text, TouchableOpacity, TextInput } from 'react-native';
import { colors } from '../../constants';

export default function InputField({
  label,
  icon,
  inputType,
  keyboardType,
  fieldButtonLabel,
  fieldButtonFunction,
}) {
  return (
    <View
      style={{
        flexDirection: 'row',
        borderBottomColor: colors.greyLight,
        borderBottomWidth: 1,
        paddingBottom: 8,
        marginBottom: 25,
      }}>
      {icon}
      {inputType == 'password' ? (
        <TextInput
          fontStyle={colors.white}
          placeholderTextColor={colors.greyLight}
          autoFocus={true}
          // fontStyle={colors.white}
          placeholder={label}
          keyboardType={keyboardType}
          style={{ flex: 1, paddingVertical: 0 , color: colors.white}}
          secureTextEntry={true}
        />
      ) : (
        <TextInput
          fontStyle={colors.white}
          placeholderTextColor={colors.greyLight}
          autoFocus={true}
          // fontStyle={colors.white}
          placeholder={label}
          keyboardType={keyboardType}
          style={{ flex: 1, paddingVertical: 0, color: colors.white }}
        />
      )}
      <TouchableOpacity onPress={fieldButtonFunction}>
        <Text style={{ color: colors.greyLight, fontWeight: '700' }}>{fieldButtonLabel}</Text>
      </TouchableOpacity>
    </View>
  );
}