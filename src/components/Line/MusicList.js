import * as React from 'react';
import PropTypes from 'prop-types';
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { colors, device, gStyle } from '../../constants';


import AutoScroll from "@homielab/react-native-auto-scroll";


const IMAGE_SIZE = 70;
const MusicList = ({ songData, onPress }) => {
  return (
    <View style={styles.container}>
      <View style={{ flexDirection: 'row', marginRight: 12, paddingLeft: 12}}>
        <Image
          source={{ uri: songData.image }}
          style={{
            width: IMAGE_SIZE,
            height: IMAGE_SIZE,
            borderRadius: 10,
          }}
        />
        <TouchableOpacity
          onPress={() => onPress(songData)}
          style={{ marginLeft: 12, justifyContent: 'center', width: device.width}}
        >
          <Text
            style={{
              margin: 2,
              fontSize: 22,
              fontWeight: '700',
              color: colors.white
            }}
          >
            {songData.title.length > 20 ? (
              <Text numberOfLines={2} style={{ fontSize: 15, opacity: 0.7, color: colors.white }}>
                {songData.title}
              </Text>
            ) : (
              <Text style={{ fontSize: 15, opacity: 0.7, color: colors.white }}>
                {songData.title}
              </Text>
            )}
          </Text>

          {songData.artistsNames.length > 35 ? (
            <AutoScroll>
            <Text style={{ fontSize: 15, opacity: 0.7, color: colors.white }}>
              {songData.artistsNames}
            </Text>
            </AutoScroll>
          ) : (
            <Text style={{ fontSize: 15, opacity: 0.7, color: colors.white }}>
              {songData.artistsNames}
            </Text>
          )}
        </TouchableOpacity>
      </View>
    </View>
  );
};

MusicList.propTypes = {
  songData: PropTypes.any,
  onPress: PropTypes.func.isRequired
};

const styles = StyleSheet.create({
  container: {
    margin: 9,
    width: '100%'
  },
  containerContent: {
    paddingLeft: 16
  },
  item: {
    marginRight: 16,
    width: 148
  },
  image: {
    backgroundColor: colors.greyLight,
    height: 70,
    width: 70,
    borderRadius: 70
  },
  title: {
    ...gStyle.textSpotifyBold12,
    color: colors.white,
    marginTop: 4,
    textAlign: 'center'
  },
  heading: {
    ...gStyle.textSpotifyBold18,
    color: colors.white,
    paddingBottom: 6,
    paddingLeft: 12
  }
});

export default React.memo(MusicList);