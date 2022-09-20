import * as React from 'react';
import PropTypes from 'prop-types';
import {
  Animated,
  StyleSheet,
  Text,
  View,
  ActivityIndicator,
  ImageBackground
} from 'react-native';
import { Feather } from '@expo/vector-icons';
import { colors, device, gStyle } from '../constants';

// components
import LinearGradient from '../components/Design/LinearGradient';
import TouchIcon from '../components/Design/TouchIcon';
import MusicList from '../components/Line/MusicList';

import con from '../../data';

// context
import Context from '../context';

const link = con.Domain.concat(con.Artist_List);

const link_playList = con.Domain.concat(con.Play_List);

const imageHeight = Math.round((device.width * 9) / 16);

const Artist = ({ navigation, route }) => {
  const alias_code = route.params;

  const [isLoading, setLoading] = React.useState(true);

  const [headerData, setHeader] = React.useState();

  const [similerData, setSimiler] = React.useState();

  const { currentSongData, updateState } = React.useContext(Context);

  const [song, setSong] = React.useState(currentSongData.title);

  const getLink = async () => {
    const isMousted = true;
    try {
      const response = await fetch(link.concat(alias_code.alias));
      const json = await response.json();
      const responseHome = await fetch(json.artists);
      await responseHome.json().then((ts) => {
        if (isMousted) {
          setHeader(ts.data);
          GetPlayList(ts.data.playlistId);
        }
      });
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const GetPlayList = async (id) => {
    const isMounted = true;
    try {
      const responseSecondList = await fetch(link_playList.concat(id));
      const returnSimilar = await responseSecondList.json();

      const similerListData = await fetch(returnSimilar.play_list);

      await similerListData.json().then((ta) => {
        if (isMounted) setSimiler(ta.data.song.items);
      });
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const [colorOne, setColor] = React.useState();

  const scrollY = React.useRef(new Animated.Value(0)).current;

  const stickyArray = device.web ? [] : [0];
  const headingRange = device.web ? [140, 200] : [230, 280];
  const shuffleRange = device.web ? [40, 80] : [40, 80];

  const opacityHeading = scrollY.interpolate({
    inputRange: headingRange,
    outputRange: [0, 1],
    extrapolate: 'clamp'
  });

  const opacityShuffle = scrollY.interpolate({
    inputRange: shuffleRange,
    outputRange: [0, 1],
    extrapolate: 'clamp'
  });

  function color_genter() {
    return '#'.concat(Math.floor(Math.random() * 16777215).toString(16));
  }

  React.useEffect(() => {
    setColor(color_genter());
    getLink();
  }, []);

  const onChangeSong = async (songData) => {
    // update local state
    setSong(songData.title);
    updateState('currentSongData', songData);
    navigation.navigate('ModalMusicPlayer');
  };

  return (
    <View style={gStyle.container}>
      {isLoading ? (
        <ActivityIndicator />
      ) : (
        <>
          <View style={styles.containerHeader}>
            <Animated.View
              style={[styles.headerLinear, { opacity: opacityHeading }]}
            >
              <LinearGradient fill={colorOne} height={89} />
            </Animated.View>
            <View style={styles.header}>
              <TouchIcon
                icon={<Feather color={colors.white} name="chevron-left" />}
                onPress={() => navigation.goBack(null)}
              />
              <Animated.View style={{ opacity: opacityShuffle }}>
                <Text style={styles.headerTitle}>{headerData?.name}</Text>
              </Animated.View>

              <TouchIcon
                icon={<Feather color={colors.white} name="more-horizontal" />}
                onPress={() => {}}
              />
            </View>
          </View>

          <ImageBackground
            style={styles.containerFixed}
            source={{ uri: headerData?.cover }}
          >
            <View style={{ position: 'absolute', top: 320, left: 10 }}>
              <Text
                ellipsizeMode="tail"
                numberOfLines={1}
                style={{
                  color: colors.white,
                  fontSize: 40,
                  fontWeight: 'bold'
                }}
              >
                {headerData?.name}
              </Text>

              <Text
                ellipsizeMode="tail"
                numberOfLines={1}
                style={{
                  color: colors.white,
                  fontSize: 18,
                  fontWeight: 'bold'
                }}
              >
                {headerData?.totalFollow} người theo dõi hàng tháng
              </Text>
            </View>
          </ImageBackground>

          <Animated.ScrollView
            onScroll={Animated.event(
              [{ nativeEvent: { contentOffset: { y: scrollY } } }],
              { useNativeDriver: true }
            )}
            scrollEventThrottle={16}
            showsVerticalScrollIndicator={false}
            stickyHeaderIndices={stickyArray}
            style={styles.containerScroll}
          >
            <View style={styles.containerSticky}>
              <Animated.View
                style={[
                  styles.containerStickyLinear,
                  { opacity: opacityShuffle }
                ]}
              >
                <LinearGradient fill={colors.black20} height={50} />
              </Animated.View>
              <View style={styles.containerShuffle}>
                <Text
                  ellipsizeMode="tail"
                  numberOfLines={1}
                  style={styles.title}
                >
                  Các bài hát phổ biến
                </Text>
              </View>
            </View>

            <View style={styles.containerSongs}>
              {similerData &&
                similerData.map((s) => (
                  <View key={s.encodeId} style={styles.containerColumn}>
                    <MusicList
                      active={song === s.title}
                      onPress={onChangeSong}
                      songData={{
                        music_id: s.encodeId,
                        album: s.title,
                        artistsNames: s.artistsNames,
                        image: s.thumbnailM,
                        length: s.duration,
                        title: s.title
                      }}
                    />
                  </View>
                ))}

              <View style={gStyle.spacer16} />
            </View>
          </Animated.ScrollView>
        </>
      )}
    </View>
  );
};

Artist.propTypes = {
  // required
  navigation: PropTypes.object.isRequired,
  route: PropTypes.object.isRequired
};

const styles = StyleSheet.create({
  blurview: {
    ...StyleSheet.absoluteFill,
    zIndex: 101
  },
  containerHeader: {
    height: 400,
    position: 'absolute',
    top: 0,
    width: '100%',
    zIndex: 100
  },
  headerLinear: {
    height: 89,
    width: '100%'
  },
  header: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 24,
    paddingTop: device.iPhoneNotch ? 48 : 24,
    position: 'absolute',
    top: 0,
    width: '100%'
  },
  headerTitle: {
    ...gStyle.textSpotifyBold16,
    color: colors.white,
    marginTop: 2,
    paddingHorizontal: 8,
    textAlign: 'center',
    width: device.width - 100
  },
  containerFixed: {
    alignItems: 'center',
    paddingTop: device.iPhoneNotch ? 94 : 60,
    position: 'absolute',
    width: '100%',
    height: 400,
    alignItems: 'flex-start'
  },
  containerLinear: {
    position: 'absolute',
    top: 100,
    width: '100%',
    zIndex: device.web ? 5 : 0
  },
  containerImage: {
    shadowColor: colors.black,
    shadowOffset: { height: 8, width: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 6
  },
  image: {
    height: imageHeight,
    marginBottom: device.web ? 0 : 16,
    width: device.width - 70,
    borderRadius: 20
  },
  containerTitle: {
    marginTop: device.web ? 8 : 0,
    zIndex: device.web ? 20 : 0,
    position: 'absolute',
    top: 350
  },
  title: {
    ...gStyle.textSpotifyBold20,
    color: colors.white,
    marginBottom: 8,
    paddingHorizontal: 24,
    textAlign: 'center'
  },
  containerAlbum: {
    backgroundColor: 'pink',
    width: 200,
    height: 200,
    zIndex: device.web ? 20 : 0
  },
  albumInfo: {
    ...gStyle.textSpotify12,
    color: colors.greyInactive,
    marginBottom: 48
  },
  containerScroll: {
    paddingTop: 89
  },
  containerSticky: {
    marginTop: device.iPhoneNotch ? 350 : 70
  },
  containerShuffle: {
    justifyContent: 'flex-start',
    shadowColor: colors.blackBg,
    shadowOffset: { height: -10, width: 0 },
    shadowOpacity: 0.2,
    shadowRadius: 20
  },
  containerStickyLinear: {
    position: 'absolute',
    top: 0,
    width: '100%'
  },
  btn: {
    backgroundColor: colors.brandPrimary,
    borderRadius: 25,
    height: 50,
    width: 220
  },
  btnText: {
    ...gStyle.textSpotifyBold16,
    color: colors.white,
    letterSpacing: 1,
    textTransform: 'uppercase'
  },
  containerSongs: {
    backgroundColor: colors.blackBg,
    minHeight: 540
  },
  row: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 16,
    width: '100%'
  },
  downloadText: {
    ...gStyle.textSpotifyBold18,
    color: colors.white
  }
});

export default Artist;
