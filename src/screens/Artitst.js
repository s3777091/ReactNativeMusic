import * as React from 'react';
import PropTypes from 'prop-types';
import {
  Animated,
  StyleSheet,
  Text,
  View,
  ActivityIndicator,
  ImageBackground,
  Dimensions
} from 'react-native';
import { Feather } from '@expo/vector-icons';
import { colors, device, gStyle } from '../constants';

// components
import LinearGradient from '../components/Design/LinearGradient';
import TouchIcon from '../components/Design/TouchIcon';
import MusicList from '../components/Line/MusicList';

import AlbumDisplay from '../components/Display/AlbumDisplay';


import ArtistDisplay from '../components/Display/ArtistDisplay';

import con from '../../data';

// context
import Context from '../context';

const link = con.Domain.concat(con.ArtistLink);
const linkMUSIC = con.Domain.concat(con.StreamLink);

const imageHeight = Math.round((device.width * 9) / 16);

const Artist = ({ navigation, route }) => {

  var ArtistView = [];


  const alias_code = route.params;

  const [isLoading, setLoading] = React.useState(true);

  const [Artist, setArtist] = React.useState();
  const [Section, setSection] = React.useState([]);



  const { currentSongData, updateState, showMusicBar } = React.useContext(Context);

  const [song, setSong] = React.useState(currentSongData.title);

  const getLink = async () => {
    const isMousted = true;
    try {
      const response = await fetch(link.concat(alias_code.alias));
      await response.json().then((ts) => {
        if (isMousted) {
          setArtist(ts);
          setSection(ts.sections);
        }
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

  const fetchSoundLink = async (id) => {
    const isMouted = true;
    //False Is song // True is PodCast
    try {
      const responseSong = await fetch(linkMUSIC.concat(id));
      const jsonSong = await responseSong.json();

      if (isMouted) {
        return jsonSong.mp3_128 || jsonSong.mp3_320 || jsonSong.mp3_lossless;
      }
    } catch (error) {
      showAlert();
    }

  };

  const onChangeSong = async (songData) => {
    // update local state
    setSong(songData.title);
    songObject = {
      music_id: songData.music_id,
      album: songData.album,
      artistsNames: songData.artistsNames,
      image: songData.image,
      length: songData.length,
      title: songData.title,
      songUrl: await fetchSoundLink(songData.music_id),
    }

    updateState('currentSongData', songObject);
    navigation.navigate('ModalMusicPlayer');
  };


  for (let i = 0; i < Section.length; i++) {


    if (Section[i]?.type == 'artist') {
      ArtistView.push(
        <ArtistDisplay
          ListData={Section[i]?.items}
          heading={Section[i].title}
        />
      )
    }

    if (Section[i]?.type == 'song') {
      ArtistView.push(
        <>
          {Section[i]?.song &&
            Section[i]?.song.map((s) => (
              <View key={s.encodeId} style={styles.containerColumn}>
                <MusicList
                  key={s.encodeId}
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

        </>
      )
    }

    if (Section[i]?.type == 'playlist') {
      ArtistView.push(
        <AlbumDisplay
          ListData={Section[i]?.items}
          heading={Section[i]?.title}
        />
      )
    }

  }

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
              <LinearGradient fill={colorOne} height={60} />
            </Animated.View>
            <View style={styles.header}>
              <TouchIcon
                icon={<Feather color={colors.white} name="chevron-left" />}
                onPress={() => navigation.goBack(null)}
              />
              <Animated.View style={{ opacity: opacityShuffle }}>
                <Text style={styles.headerTitle}>{Artist?.name}</Text>
              </Animated.View>
              <TouchIcon
                icon={<Feather color={colors.white} name="more-horizontal" />}
                onPress={() => { }}
              />
            </View>
          </View>

          <ImageBackground
            style={styles.containerFixed}
            source={{ uri: Artist?.cover }}
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
                {Artist?.name}
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
                {Artist?.totalFollow} người theo dõi hàng tháng
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
              </Animated.View>
            </View>
            <View style={styles.containerSongs}>
              {ArtistView}
            </View>

            <View style={{ marginVertical: showMusicBar ? 230 : 200 }}></View>

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

  containerColumn: {
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%'
  },
  albumInfo: {
    ...gStyle.textSpotify12,
    color: colors.greyInactive,
    marginBottom: 48
  },
  containerScroll: {
    paddingTop: Dimensions.get('window').height / 2
  },
  containerSticky: {
    marginTop: device.iPhoneNotch ? 89 : 25
  },
  containerShuffle: {
    alignItems: 'center',
    height: 20,
    shadowColor: colors.blackBg,
    shadowOffset: { height: -10, width: 0 },
    shadowOpacity: 0.2
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
    alignItems: 'center',
    backgroundColor: colors.blackBg,
    minHeight: 540,
    paddingTop: 22,
    paddingBottom: 30,
    borderRadius: 20
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

export default React.memo(Artist);
