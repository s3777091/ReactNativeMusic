import * as React from 'react';
import PropTypes from 'prop-types';
import {
  Animated,
  Image,
  StyleSheet,
  Text,
  View,
  ActivityIndicator,
  BlurView,
  Button,
  Dimensions
} from 'react-native';
import { Feather, AntDesign } from '@expo/vector-icons';
import { colors, device, gStyle } from '../constants';
// components
import LinearGradient from '../components/Design/LinearGradient';
import LineItemSong from '../components/Line/LineItemSong';


import ArtistDisplay from '../components/Display/ArtistDisplay';

import TouchIcon from '../components/Design/TouchIcon';


import con from '../../data';
// context
import Context from '../context';

const LinkAblum = con.Domain.concat(con.AlbumLink);
const linkMUSIC = con.Domain.concat(con.StreamLink);

const Album = ({ navigation, route }) => {
  const data_pass = route.params;

  const [colorOne, setColor] = React.useState();

  const [isLoading, setLoading] = React.useState(true);
  const [listMusic, setListMusic] = React.useState();
  const [Detail, setDetail] = React.useState();


  //Get Song
  const GetDataList = async () => {
    //False mean PlayList
    try {
      const response = await fetch(LinkAblum.concat(data_pass.id));
      await response.json().then((ra) => {
        setDetail(ra);
        setListMusic(ra.song);
      });

    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }

  };

  function color_genter() {
    return 'rgb(' + (Math.floor(Math.random() * 256)) + ',' + (Math.floor(Math.random() * 256)) + ',' + (Math.floor(Math.random() * 256)) + ')';
  }

  React.useEffect(() => {
    setColor(color_genter());

    GetDataList();
  }, []);

  // get main app state
  const { currentSongData, showMusicBar, updateState } =
    React.useContext(Context);

  const [song, setSong] = React.useState(currentSongData.title);
  const scrollY = React.useRef(new Animated.Value(0)).current;

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

    updateState('showMusicBar', !showMusicBar);
    updateState('currentSongData', songObject);

    navigation.navigate('ModalMusicPlayer');
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
  const shuffleRange = device.web ? [80, 120] : [80, 120];

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

          <TouchIcon
            icon={<Feather color={colors.white} name="more-horizontal" />}
          />
        </View>
      </View>

      <View style={styles.containerFixed}>
        <View style={styles.containerLinear}>
          <LinearGradient fill={colorOne} height={(Dimensions.get('window').height / 2) + 89} />
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
            {`Album by ${DataHeader.artist}`}
          </Text>
        </View>

        <View style={styles.containerDetail}>

          <TouchIcon style={styles.iconDetail}
            icon={<Feather name="download" color={colors.white} />}
          />
          <Button
            style={{ borderRadius: 50 }}
            title="phát ngẫu nhiên"
            color="#be32fe"
          />

          <TouchIcon style={styles.iconDetail}
            icon={<AntDesign color={colors.white} name="hearto" />}
          />
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
              ]}>
              <Button
                title="phát ngẫu nhiên"
                color="#be32fe"
              />
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
              <ArtistDisplay
                key={Detail.artists.id}
                ListData={Detail.artists}
                heading={'Nghệ sĩ tham gia'}
              />

              {DataList &&
                DataList.map((music) => (
                  <LineItemSong
                    active={song === music.title}
                    key={music.id}
                    onPress={onChangeSong}
                    Data={{
                      music_id: music.id,
                      album: DataHeader.title,
                      artistsNames: music.artist,
                      image: music.artwork,
                      length: music.duration,
                      title: music.title
                    }}
                  />
                ))}


              <View style={{ marginVertical: showMusicBar ? 180 : 140 }}></View>
            </View>
          )}


        </Animated.ScrollView>
      )}
    </>
  );

  return (
    <View style={gStyle.container}>
      {/* {showMusicBar === false && (
        <BlurView intensity={99} style={styles.blurview} tint="dark" />
      )} */}

      <DisplayItems DataHeader={data_pass} DataList={listMusic} />

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
    paddingTop: device.iPhoneNotch ? 114 : 70,
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
    height: 200,
    marginBottom: device.web ? 0 : 16,
    width: 200,
    borderRadius: 10
  },
  containerTitle: {
    marginTop: device.web ? 8 : 10,
    zIndex: device.web ? 20 : 10
  },
  title: {
    ...gStyle.textSpotifyBold20,
    color: colors.white,
    marginBottom: 8,
    paddingHorizontal: 24,
    textAlign: 'center'
  },

  iconDetail: {
    marginHorizontal: 35,
    justifyContent: 'center',
    marginVertical: 20
  },
  displayDetail: {
    marginHorizontal: 35,
    ...gStyle.textSpotify12,
    color: colors.greyInactive,
  },
  containerDetail: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
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
    paddingTop: 250
  },
  containerSticky: {
    marginTop: device.iPhoneNotch ? 238 : 200
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
    top: -163,
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

export default React.memo(Album);