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

const PodCastItems = ({ Active_colors, NavigationSong, podCast }) => (
  <>
    <View style={gStyle.container}>
      <TouchableOpacity
        style={{
          justifyContent: 'center',
          flexDirection: 'row',
          marginHorizontal: 35
        }}
        onPress={() => NavigationSong(podCast)}
      >
        <Image
          source={{ uri: podCast.image }}
          style={{
            width: IMAGE_SIZE,
            height: IMAGE_SIZE,
            borderRadius: 5
          }}
        />

        <View style={{ flexDirection: 'column' }}>
          {podCast.title.length > 30 ? (
            <Text style={[styles.title, { color: Active_colors }]}>
              {podCast.title}
            </Text>
          ) : (
            <Text style={[styles.title, { color: Active_colors }]}>
              {podCast.title}
            </Text>
          )}
        </View>
      </TouchableOpacity>
    </View>
  </>
);

const LineItemSong = ({ active, onPress, Data, type }) => {
  const activeColor = active ? colors.brandPrimary : colors.white;
  return (
    <View style={styles.container}>
      {type ? (
        <PodCastItems
          Active_colors={activeColor}
          NavigationSong={onPress}
          podCast={Data}
        />
      ) : (
        <SongItems
          Active_colors={activeColor}
          NavigationSong={onPress}
          song={Data}
        />
      )}
    </View>
  );
};

LineItemSong.defaultProps = {
  active: false,
  type: false
};

LineItemSong.propTypes = {
  active: PropTypes.bool,

  // required
  onPress: PropTypes.func,
  Data: PropTypes.any,
  type: PropTypes.bool
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

export default LineItemSong;
