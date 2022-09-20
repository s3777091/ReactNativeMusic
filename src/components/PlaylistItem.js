import * as React from 'react';
import PropTypes from 'prop-types';
import { StyleSheet, Text, TouchableOpacity, View, Image } from 'react-native';
import { colors, gStyle } from '../constants';

function colorGenter() {
  return '#'.concat(Math.floor(Math.random() * 16777215).toString(16));
}

import AutoScroll from "@homielab/react-native-auto-scroll";

const PlaylistItem = ({  onPress, ListData }) => (
  <TouchableOpacity
    activeOpacity={gStyle.activeOpacity}
    onPress={onPress}
    style={[styles.playlistItem, { backgroundColor:  colorGenter() }]}
  >
    <View style={styles.containerSpotify}>
      {ListData.title.length > 7 ? (
        <AutoScroll style={{width: 90}} endPadding={50}>
        <Text style={styles.playlistTitle}>
          {ListData.title}
        </Text>
        </AutoScroll>
      ) : (
        <Text style={styles.playlistTitle}>{ListData.title}</Text>
      )}

      <View style={{transform: [{ rotate: '20deg'}]}}>
        <Image source={{ uri: ListData.thumbnail }} style={styles.image} />
      </View>
    </View>
  </TouchableOpacity>
);

PlaylistItem.propTypes = {
  onPress: PropTypes.func.isRequired,
  ListData: PropTypes.any
};

const styles = StyleSheet.create({
  playlistItem: {
    borderRadius: 6,
    flex: 1,
    height: 100,
    marginBottom: 24,
    marginRight: 24,
    paddingLeft: 12,
    paddingTop: 12
  },

  containerSpotify: {
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
  image: {
    width: 60,
    height: 60,
    borderRadius: 2,
  },
  playlistTitle: {
    ...gStyle.textSpotifyBold22,
    color: colors.white
  }
});

export default PlaylistItem;
