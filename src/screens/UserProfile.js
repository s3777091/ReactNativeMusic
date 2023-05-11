import * as React from 'react';
import {
    Image,
    StyleSheet,
    Text,
    View,
    SectionList
  } from 'react-native';

import con from '../../data';
import AsyncStorage from '@react-native-async-storage/async-storage';

const user_detail = await AsyncStorage.getItem('userDetail');
const user_id = user_detail.idx;
const albumlike_url = con.Domain.concat(con.albumlike).concat(user_id);
const songlike_url = con.Domain.concat(con.songlike).concat(user_id);

const temp_songlike_url = 'http://localhost:3000/songlike?id=1';
const temp_album_url = 'http://localhost:3000/albumlike?id=1';


let temp_album_res = await fetch(albumlike_url);
let temp_album = await temp_album_res.json();

let temp_song_res = await fetch(songlike_url);
let temp_song = await temp_song_res.json();

var sections = [
    {
      title: "Albums Liked",
      data : temp_album.data
    },
    {
      title: "Songs Liked",
      data : temp_song.data
    }
  ];

const UserProfile = () =>  {

    
        return (
            <View style={styles.container}>
                <View style={styles.avatarContainer}>
                    <Image
                    source={{ uri:  user_detail.Avatar}}
                    style={styles.avatar}
                    />
                    {/* <Image
                    source={{ uri:  'https://images.gmanews.tv/webpics/2021/12/Screen_Shot_2021-12-29_at_2_2021_12_29_14_08_56.png'}}
                    style={styles.avatar}
                    /> */}
                    <Text style={[styles.name, styles.textWithShadow]}>{user_detail.name}</Text>
                    {/* <Text style={[styles.name, styles.textWithShadow]}>John Doe</Text> */}
                </View>
                <View style={styles.content}>
                <SectionList
                    sections={sections}
                    renderItem={({item}) => <Text style={styles.item}>{item.name}</Text>}
                    renderSectionHeader={({section}) => (
                      <Text style={styles.sectionHeader}>{section.title}</Text>
                    )}
                    keyExtractor={item => `basicListEntry-${item.encodeid}`}
                />

                </View>
            </View>
        );
} ;

const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#000',
      padding: 20,
    },
    coverImage: {
      height: 200,
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
    },
    avatarContainer: {
      alignItems: 'center',
      marginTop: 20,
    },
    avatar: {
      width: 120,
      height: 120,
      borderRadius: 60,
    },
    name: {
      fontSize: 20,
      fontWeight: 'bold',
      marginTop: 10,
      color:'white'
    },
    content: {
      marginTop: 20,
    },
    infoContainer: {
      marginTop: 20,
    },
    infoLabel: {
      fontWeight: 'bold',
      color: 'white'
    },
    infoValue: {
      marginTop: 5,
      color: 'white'
    },
    sectionHeader: {
      paddingTop: 2,
      paddingLeft: 10,
      paddingRight: 10,
      paddingBottom: 2,
      fontSize: 20,
      fontWeight: 'bold',
      backgroundColor: '#000',
      color: "white"
    },
    item: {
      padding: 10,
      fontSize: 18,
      height: 44,
      color: "white"
    }
  });

export default UserProfile;