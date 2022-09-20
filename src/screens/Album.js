import * as React from 'react';
import PropTypes from 'prop-types';
import {
  Animated,
  Image,
  StyleSheet,
  Text,
  View,
  ActivityIndicator,
  BlurView
} from 'react-native';
import { Feather } from '@expo/vector-icons';
import { colors, device, gStyle } from '../constants';
// components
import LinearGradient from '../components/Design/LinearGradient';
import LineItemSong from '../components/Line/LineItemSong';
import TouchIcon from '../components/Design/TouchIcon';

import con from '../../data';
// context
import Context from '../context';

const LinkAblum = con.Domain.concat(con.Play_List);
const LinkEpisode = con.Domain.concat(con.PodCastEpisode);

const Album = ({ navigation, route }) => {
  const data_pass = route.params;

  const [colorOne, setColor] = React.useState();

  const [isLoading, setLoading] = React.useState(true);
  const [listMusic, setListMusic] = React.useState();

  const GetDataList = async () => {
    if (!data_pass.type) {
      try {
        const response = await fetch(LinkAblum.concat(data_pass.id));
        const json = await response.json();
        const responseHome = await fetch(json.play_list);
        const dataHome = await responseHome.json();
        setListMusic(dataHome.data.song.items);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    } else {
      try {
        const response = await fetch(LinkEpisode.concat(data_pass.id));
        const json = await response.json();
        const responsePodCast = await fetch(json.pod);
        const tab = await responsePodCast.json();
        setListMusic(tab.data.items);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    }
  };

  function color_genter() {
    return '#'.concat(Math.floor(Math.random() * 16777215).toString(16));
  }

  React.useEffect(() => {
    setColor(color_genter());
    GetDataList();
  }, []);

  // get main app state
  const { currentSongData, updateState } =
    React.useContext(Context);

  const [song, setSong] = React.useState(currentSongData.title);
  const scrollY = React.useRef(new Animated.Value(0)).current;



  const onChangeSong = async (songData) => {
    // update local state
    setSong(songData.title);
    updateState('currentSongData', songData);
    navigation.navigate('ModalMusicPlayer', {check: currentSongData.music_id});
  };

  // ui state
  const album = data_pass || null;

  // album data not set?
  if (album === null) {
    return (
      <View style={[gStyle.container, gStyle.flexCenter]}>
        <Text style={{ color: colors.white }}>{`Chờ tí đang tải`}</Text>
      </View>
    );
  }

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

  const DisplayItems = ({ DataHeader, DataList }) => (
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
            <Text style={styles.headerTitle}>{DataHeader.title}</Text>
          </Animated.View>
          {/* <TouchIcon
            icon={<Feather color={colors.white} name="more-horizontal" />}
            onPress={() => {
              // update main state
              updateState('showMusicBar', !showMusicBar);
              navigation.navigate('ModalMoreOptions', {
                album
              });
            }}
          /> */}
        </View>
      </View>

      <View style={styles.containerFixed}>
        <View style={styles.containerLinear}>
          <LinearGradient fill={colorOne} />
        </View>
        <View style={styles.containerImage}>
          <Image source={{ uri: DataHeader.image }} style={styles.image} />
        </View>
        <View style={styles.containerTitle}>
          <Text ellipsizeMode="tail" numberOfLines={1} style={styles.title}>
            {DataHeader.title}
          </Text>
        </View>
        <View style={styles.containerAlbum}>
          <Text style={styles.albumInfo}>
            {`Album by ${DataHeader.artist} · ${DataHeader.release_data}`}
          </Text>
        </View>
      </View>

      {isLoading ? (
        <ActivityIndicator />
      ) : (
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
          </View>

          {listMusic == null ? (
            <View style={styles.containerSongs}>
              <Text style={{ color: colors.white }}>
                Album hoặc podcast này chưa được phát hành
              </Text>
            </View>
          ) : (
            <View style={styles.containerSongs}>
              {DataList &&
                DataList.map((music) => (
                  <LineItemSong
                    active={song === music.title}
                    key={music.encodeId}
                    onPress={onChangeSong}
                    type={data_pass.type}
                    Data={{
                      music_id: music.encodeId,
                      album: music.title,
                      artistsNames: music.artistsNames,
                      image: music.thumbnailM,
                      length: music.duration,
                      title: music.title,
                      type: data_pass.type
                    }}
                  />
                ))}
            </View>
          )}

          <View style={gStyle.spacer16} />
        </Animated.ScrollView>
      )}
    </>
  );

  return (
    <View style={gStyle.container}>
      {/* {showMusicBar === false && (
        <BlurView intensity={99} style={styles.blurview} tint="dark" />
      )} */}

      {!data_pass.music_type ? (
        <DisplayItems DataHeader={data_pass} DataList={listMusic} />
      ) : (
        <DisplayItems DataHeader={data_pass} DataList={listMusic} />
      )}
    </View>
  );
};

Album.propTypes = {
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
    height: 89,
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
    marginRight: 20,
    paddingHorizontal: 8,
    textAlign: 'center',
    width: device.width - 100
  },
  containerFixed: {
    alignItems: 'center',
    paddingTop: device.iPhoneNotch ? 94 : 60,
    position: 'absolute',
    width: '100%'
  },
  containerLinear: {
    position: 'absolute',
    top: 0,
    width: '100%',
    zIndex: device.web ? 5 : 0
  },
  containerImage: {
    shadowColor: colors.black,
    shadowOffset: { height: 8, width: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 6,
    zIndex: device.web ? 20 : 0
  },
  image: {
    height: 148,
    marginBottom: device.web ? 0 : 16,
    width: 148,
    borderRadius: 2
  },
  containerTitle: {
    marginTop: device.web ? 8 : 0,
    zIndex: device.web ? 20 : 0
  },
  title: {
    ...gStyle.textSpotifyBold20,
    color: colors.white,
    marginBottom: 8,
    paddingHorizontal: 24,
    textAlign: 'center'
  },
  containerAlbum: {
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
    marginTop: device.iPhoneNotch ? 238 : 194
  },
  containerShuffle: {
    alignItems: 'center',
    height: 50,
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
    alignItems: 'center',
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

export default Album;