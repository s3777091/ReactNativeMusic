import * as React from 'react';
import PropTypes from 'prop-types';
import { StyleSheet, Text, TouchableOpacity, View, Image } from 'react-native';
import { colors, gStyle } from '../constants';


function colorGenter() {
  return 'rgb(' + (Math.floor(Math.random() * 256)) + ',' + (Math.floor(Math.random() * 256)) + ',' + (Math.floor(Math.random() * 256)) + ')';
}

const PlaylistItem = ({  onPress, ListData }) => (
  <TouchableOpacity
    activeOpacity={gStyle.activeOpacity}
    onPress={onPress}
    style={[styles.playlistItem, { backgroundColor:  colorGenter() }]}
  >
    <View style={styles.containerSpotify}>
    <Text numberOfLines={2} style={styles.playlistTitle}>{ListData.title}</Text>

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
    borderRadius: 5,
  },
  playlistTitle: {
    width: 97,
    ...gStyle.textSpotifyBold22,
    color: colors.white
  }
});

export default React.memo(PlaylistItem);