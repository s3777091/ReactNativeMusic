import * as React from 'react';
import PropTypes from 'prop-types';
import { StyleSheet, Text, TouchableOpacity, View, Image } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { colors, device, gStyle } from '../constants';

const BarMusicPlayer = ({ song }) => {
  const navigation = useNavigation();
  return (
    <TouchableOpacity
      activeOpacity={1}
      onPress={() => navigation.navigate('ModalMusicPlayer')}
      style={styles.container}
    >
      {song && (
        <View style={{ flexDirection: 'row', margin: 10 }}>
          <View style={{ padding: 2 }}>
            <Image
              style={{ height: 50, width: 70, borderRadius: 5}}
              source={{ uri: song.image }}
            />
          </View>
          <View style={styles.containerSong}>
            {song.title.length > 30 ? (
              <>
                <Text style={styles.title}>{`${song.title
                  .substring(0, 30)
                  .concat('...')} · `}</Text>
                <View style={[gStyle.flexRowCenter, gStyle.mTHalf]}>
                  <Text style={styles.artist}>{song.artistsNames}</Text>
                </View>
              </>
            ) : (
              <>
                <Text style={styles.title}>{song.title}</Text>
                <View style={[gStyle.flexRowCenter, gStyle.mTHalf]}>
                  <Text style={styles.artist}>{song.artistsNames}</Text>
                </View>
              </>
            )}
          </View>
        </View>
      )}
    </TouchableOpacity>
  );
};

BarMusicPlayer.defaultProps = {
  song: null
};

BarMusicPlayer.propTypes = {
  // optional
  song: PropTypes.shape({
    artist: PropTypes.string,
    title: PropTypes.string
  })
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 60,
    alignSelf: 'center',
    backgroundColor: '#230020',
    borderBottomWidth: StyleSheet.hairlineWidth,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    left: 10,
    right: 10,
    borderTopLeftRadius: 15,
    borderTopRightRadius: 15
  },
  containerIcon: {
    ...gStyle.flexCenter,
    width: 50,
  },
  containerSong: {
    ...gStyle.flexRowCenter,
    overflow: 'hidden',
    width: device.width - 100,
    flexDirection: 'column',
  },
  title: {
    ...gStyle.textSpotify12,
    color: colors.white
  },
  artist: {
    ...gStyle.textSpotify12,
    color: colors.greyLight
  },
  device: {
    ...gStyle.textSpotify10,
    color: colors.brandPrimary,
    marginLeft: 4,
    textTransform: 'uppercase'
  }
});

export default React.memo(BarMusicPlayer);