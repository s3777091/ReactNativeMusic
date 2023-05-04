import * as React from 'react';
import PropTypes from 'prop-types';
import { StyleSheet, Text, TouchableOpacity, View, Image } from 'react-native';
import { Feather, Ionicons, AntDesign } from '@expo/vector-icons';
import { colors, gStyle } from '../../constants';

const IMAGE_SIZE = 70;

const SongItems = ({ Active_colors, NavigationSong, song }) => (
  <>
    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
      <Image
        source={{ uri: song.image }}
        style={{
          width: IMAGE_SIZE,
          height: IMAGE_SIZE,
          borderRadius: 5
        }}
      />

      <TouchableOpacity
        activeOpacity={gStyle.activeOpacity}
        onPress={() => NavigationSong(song)}
        style={gStyle.flex5}
      >
        <Text style={[styles.title, { color: Active_colors }]}>
          {song.title}
        </Text>
        <View style={gStyle.flexRow}>
          <Text style={styles.artist}>{song.artistsNames}</Text>
        </View>
      </TouchableOpacity>

      <View style={styles.containerRight}>
        <Feather color={colors.greyLight} name="more-horizontal" size={20} />
      </View>
    </View>
  </>
);

const LineItemSong = ({ active, onPress, Data }) => {
  const activeColor = active ? colors.brandPrimary : colors.white;
  return (
    <View style={styles.container}>
      <SongItems
        Active_colors={activeColor}
        NavigationSong={onPress}
        song={Data}
      />
    </View>
  );
};

LineItemSong.defaultProps = {
  active: false
};

LineItemSong.propTypes = {
  active: PropTypes.bool,

  // required
  onPress: PropTypes.func,
  Data: PropTypes.any
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 16,
    width: '100%'
  },
  containerTitle: {
    flexDirection: 'row',
    alignItems: 'baseline',
    justifyContent: 'space-between',
    margin: 5
  },
  title: {
    ...gStyle.textSpotify16,
    color: colors.white,
    marginLeft: 14
  },
  artist: {
    ...gStyle.textSpotify12,
    color: colors.greyInactive,
    marginLeft: 14
  },
  containerRight: {
    alignItems: 'flex-end',
    flex: 1
  },
  titlePodCast: {
    margin: 2,
    fontSize: 18,
    fontWeight: '500',
    color: colors.white
  }
});

export default React.memo(LineItemSong);
