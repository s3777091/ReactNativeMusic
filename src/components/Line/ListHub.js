import * as React from 'react';
import PropTypes from 'prop-types';
import { StyleSheet, Text, TouchableOpacity, View, Image } from 'react-native';
import { colors, gStyle } from '../../constants';

const ListHub = ({ bgColor, onPress, ListData }) => (
  <TouchableOpacity
    activeOpacity={gStyle.activeOpacity}
    onPress={onPress}
    style={[styles.ListHub, { backgroundColor: bgColor }]}
  >
    <View style={styles.containerSpotify}>
      <View style={styles.image}>
        {ListData.thumbnail && (
          <Image source={{ uri: ListData.thumbnail }} style={styles.image} />
        )}
      </View>

      <Text numberOfLines={1} style={styles.playlistTitle}>{ListData.title}</Text>
    </View>
  </TouchableOpacity>
);

ListHub.propTypes = {
  bgColor: PropTypes.string.isRequired,
  onPress: PropTypes.func.isRequired,
  ListData: PropTypes.any
};

const styles = StyleSheet.create({
  ListHub: {
    borderRadius: 6,
    flex: 1,
    height: 100,
    marginVertical: 30,
    marginBottom: 100,
    marginRight: 30,
    paddingLeft: 12,
    paddingTop: 12
  },

  image: {
    width: 148,
    height: 148,
    borderRadius: 2
  },
  playlistTitle: {
    ...gStyle.textSpotifyBold22,
    color: colors.white,
    fontStyle: 'italic'
  }
});

export default React.memo(ListHub);
