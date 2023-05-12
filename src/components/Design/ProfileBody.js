import React, {useState} from 'react';
import {View, Text, Image, TouchableOpacity} from 'react-native';

import { Feather } from '@expo/vector-icons';


import { colors, gStyle } from '../../constants';
export const ProfileBody = ({
  name,
  accountName,
  profileImage,
  post,
  followers,
  following,
  navigation
}) => {
  return (
    <View>
      {accountName ? (
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
            }}>
            <Text
              style={{
                fontSize: 18,
                color: colors.greyLight,
                fontWeight: 'bold',
              }}>
              {accountName}
            </Text>

          </View>
          <View style={{flexDirection: 'row', alignItems: 'center'}}>
            <Feather
              name="chevron-left"
              style={{
                fontSize: 25,
                color: colors.greyLight,
                paddingHorizontal: 15,
              }}
              onPress={() => navigation.goBack(null)}
            />
          </View>
        </View>
      ) : null}
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-around',
          paddingVertical: 20,
        }}>
        <View
          style={{
            alignItems: 'center',
          }}>
          <Image
            source={{ uri: profileImage }}
            style={{
              resizeMode: 'cover',
              width: 80,
              height: 80,
              borderRadius: 100,
            }}
          />
          <Text
            style={{
              paddingVertical: 5,
                color:colors.brandPrimary,
              fontWeight: 'bold',
            }}>
            {name}
          </Text>
        </View>
        <View style={{alignItems: 'center'}}>
          <Text style={{fontWeight: 'bold',color:colors.brandPrimary,fontSize: 18}}>{post}</Text>
          <Text style={{color:colors.brandPrimary}}>Song</Text>
        </View>
        <View style={{alignItems: 'center'}}>
          <Text style={{fontWeight: 'bold', color:colors.brandPrimary, fontSize: 18}}>{followers}</Text>
          <Text style={{color:colors.brandPrimary}}>Album</Text>
        </View>
        <View style={{alignItems: 'center'}}>
          <Text style={{fontWeight: 'bold', color:colors.brandPrimary , fontSize: 18}}>{following}</Text>
          <Text style={{color:colors.brandPrimary}}>Friend</Text>
        </View>
      </View>
    </View>
  );
};