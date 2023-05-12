import * as React from 'react';
import PropTypes, { any } from 'prop-types';
import { Ionicons } from '@expo/vector-icons';
import {
  Image,
  StyleSheet,
  Text,
  View,
  ActivityIndicator,
  Animated,
  TouchableOpacity,
  Alert
} from 'react-native';

import { Feather, FontAwesome, MaterialIcons } from '@expo/vector-icons';
import Slider from '@react-native-community/slider';
import { colors, device, func, gStyle } from '../constants';

import { Audio } from 'expo-av';
// components
import ModalHeader from '../components/Design/ModalHeader';
import TouchIcon from '../components/Design/TouchIcon';
import AutoScroll from "@homielab/react-native-auto-scroll";


import AsyncStorage from '@react-native-async-storage/async-storage';


import axios from 'axios';



import Context from '../context';

import con from '../../data';

const LinkSongLike = con.Domain.concat(con.SongLike);

const ModalMusicPlayer = (props) => {
  // get main app state
  const { currentSongData } = React.useContext(Context);

  // local state
  const [favorited, setFavorited] = React.useState(false);
  const { navigation, route } = props;

  // ui state
  const favoriteColor = favorited ? colors.brandPrimary : colors.white;
  const favoriteIcon = favorited ? 'heart' : 'heart-o';


  const timeLeft = func.formatTime(currentSongData.length);

  const [Repeat, setRepeat] = React.useState(false);


  const [Playing, setPlaying] = React.useState(false);

  const [Loading, SetLoading] = React.useState(true);

  const [duration, setDuration] = React.useState(Number);
  const [position, setPosition] = React.useState(Number);

  const [audioProgess, setAudioProgess] = React.useState(Number);


  const sound = React.useRef(new Audio.Sound());

  async function getData(url) {
    try {
      const response = await axios.get(url);
      const music = await axios({
        method: 'get',
        url: url,
        headers: {
          Accept: "application/json",
          cookie: `${response.headers['set-cookie'] && response.headers['set-cookie'][0]};zpsid=p8dR.209077836.25.6FdDtNpr8RymirUpSFKXlmc6KurCp168IyqIYGrLobcT5JBDVOtOJX_r8Ry;zmp3_sid=YV6SGkH8OtwNz9j3vqbwT97iWpUs8pXyXThFAxyyQLofn_KVeHHMTu6fqWUmOMqpnTBhJ_SGVGt6rzrgvWWd9UV7lc_G0piopFhCPVPIUGt5wkbxQMG`
        }
      });
      
      if (music && music.data) {
        return music.data.data["128"];
      } 
    }catch(error){
        showAlert("Current Vip not support in online App", "try with local app");
    }
  }

  const showAlert = (title, des) =>
  Alert.alert(
    `${title}`,
    `${des}`,
    [
      {
        text: 'Go Back',
        onPress: () => navigation.goBack(null),
        style: 'cancel'
      }
    ],
    {
      cancelable: true,
      onDismiss: () =>
        Alert.alert(
          'This alert was dismissed by tapping outside of the alert dialog.'
        )
    }
  );

  async function slider_change(value) {
    const seektime = value * duration
    setPosition(seektime);
    await sound.current.setPositionAsync(seektime);
  }

  async function Play() {
    setPlaying(true);
    const result = await sound.current.getStatusAsync();
    if (result.isPlaying === false) {
      await sound.current.playAsync();
    }
  }

  async function Pause() {
    setPlaying(false);
    const result = await sound.current.getStatusAsync();
    if (result.isPlaying === true) {
      await sound.current.pauseAsync();
    }
  }


  React.useEffect(() => {

    Audio.setAudioModeAsync({
      playThroughEarpieceAndroid: false,
      allowsRecordingIOS: false,
      playsInSilentModeIOS: true,
      staysActiveInBackground: true,
      shouldDuckAndroid: true
    })

    try {
      LoadSong();
    } catch (error) {
      console.log(error);
    }

    return sound
      ? () => {
        sound.current.unloadAsync();
      }
      : undefined;


  }, [sound]);

  const ReplayAudio = async () => {
    if (Repeat) {
      setRepeat(false);
    } else {
      setRepeat(true);
    }
  };

  const LoadSong = async () => {
    const checkLoading = await sound.current.getStatusAsync();
    if (checkLoading.isLoaded === false) {
      const music = await sound.current.loadAsync({ uri: await getData(currentSongData.songUrl) }, {
        shouldPlay: true,
        progressUpdateIntervalMillis: 1000,
      });

      setPlaying(true);
      sound.current.setOnPlaybackStatusUpdate((e) => {
        if (e.isLoaded) {
          setDuration(e.durationMillis);
          setPosition(e.positionMillis);
          const currentProgress =
            Math.max(0, e.positionMillis) / e.durationMillis;
          setAudioProgess(currentProgress);
        }
        if (e.didJustFinish) {
          if (Repeat) {
            sound.current.replayAsync();
          } else {
            sound.current.stopAsync();
          }
        }
      });
      //Hook
      if (!music.isLoaded) {
        SetLoading(true);
      } else {
        SetLoading(false);
      }

    } else {
      SetLoading(true);
    }
  };

  const scrollY = React.useRef(new Animated.Value(0)).current;

  const opacityIn = scrollY.interpolate({
    inputRange: [0, 128],
    outputRange: [0, 1],
    extrapolate: 'clamp'
  });


  const LikeSong = async () => {
    try {
      const s = await AsyncStorage.getItem('userDetail');
      if (s !== null) {
        const data = JSON.parse(s);
        const payload = JSON.stringify({
          encodeid: currentSongData.music_id,
          image: currentSongData.image,
          songurl: currentSongData.songUrl,
          name: currentSongData.title,
          artist: currentSongData.artistsNames,
          user_idx: data.id,
        });

        console.log(payload);

        const resLike = await fetch(LinkSongLike, {
          method: "POST",
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
          },
          body: payload,
        })

        if (resLike.status >= 200 && resLike.status <= 299) {
          showCheck('Success like Song', `Adding song to profile`);
          setFavorited(!favorited)
        } else {
          showCheck('Already like this song', `You maybe like this song before`);
        }


      } else {
        showCheck('Current user is empty', `You need login to like LinkSongLike`);
      }

    } catch (error) {
      console.error(error);
    }
  };

  const showCheck = (title, des) =>
  Alert.alert(
    `${title}`,
    `${des}`,
    [
      {
        text: 'close',
        style: 'cancel'
      }
    ],
    {
      cancelable: true,
      onDismiss: () =>
        Alert.alert(
          'This alert was dismissed by tapping outside of the alert dialog.'
        )
    }
  );

  return (
    <React.Fragment>
      {device.iPhoneNotch && (
        <Animated.View style={[styles.iPhoneNotch, { opacity: opacityIn }]} />
      )}

      <Animated.ScrollView
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { y: scrollY } } }],
          { useNativeDriver: true }
        )}
        scrollEventThrottle={16}
        showsVerticalScrollIndicator={false}
        style={gStyle.container}
      >
        <ModalHeader
          left={<Feather color={colors.greyLight} name="chevron-down" />}
          leftPress={() => navigation.goBack(null)}
          text={currentSongData.album}
        />

        <View style={gStyle.p3}>
          <Image source={{ uri: currentSongData.image }} style={styles.image} />

          <View style={[gStyle.flexRowSpace, styles.containerDetails]}>
            <View style={styles.containerSong}>
              {currentSongData.title.length > 15 ? (
                <AutoScroll style={{ width: 270 }} endPadding={10}>
                  <Text ellipsizeMode="tail" numberOfLines={1} style={styles.song}>
                    {currentSongData.title}
                  </Text>
                </AutoScroll>
              ) : (
                <Text ellipsizeMode="tail" numberOfLines={1} style={styles.song}>
                  {currentSongData.title}
                </Text>
              )}

              <Text style={styles.artist}>{currentSongData.artist}</Text>
            </View>
            <View style={styles.containerFavorite}>
              <TouchIcon
                icon={<FontAwesome color={favoriteColor} name={favoriteIcon} />}
                onPress={() => LikeSong()}
              />
            </View>
          </View>

          <View style={styles.containerVolume}>
            <Slider
              minimumTrackTintColor={colors.greyLight}
              maximumTrackTintColor={colors.grey3}
              minimumValue={0}
              maximumValue={1}
              value={audioProgess}
              onSlidingComplete={async (value) => {
                slider_change(value);
              }}
              thumbTintColor={colors.greyLight}
            />
            <View style={styles.containerTime}>
              <Text style={styles.time}>
                {func.millisToMinutesAndSeconds(position)}
              </Text>
              <Text style={styles.time}>{`-${timeLeft}`}</Text>
            </View>
          </View>

          <View style={styles.containerControls}>
            <TouchIcon
              icon={<Feather color={colors.greyLight} name="shuffle" />}
            />
            <View style={gStyle.flexRowCenterAlign}>
              {Loading ? (
                <ActivityIndicator size={'large'} color={'red'} />
              ) : (
                <>
                  {!Playing ? (
                    <TouchableOpacity onPress={() => Play()}>
                      <Ionicons name="play" size={55} color="#444" />
                    </TouchableOpacity>
                  ) : (
                    <TouchableOpacity onPress={() => Pause()}>
                      <Ionicons name="pause" size={55} color="#444" />
                    </TouchableOpacity>
                  )}
                </>
              )}
            </View>

            {!Repeat ? (
              <TouchableOpacity onPress={ReplayAudio}>
                <MaterialIcons
                  name="repeat"
                  size={30}
                  color={colors.greyLight}
                />
              </TouchableOpacity>
            ) : (
              <TouchableOpacity onPress={ReplayAudio}>
                <MaterialIcons
                  name="repeat-one"
                  size={30}
                  color={colors.greyLight}
                />
              </TouchableOpacity>
            )}
          </View>
        </View>

      </Animated.ScrollView>
    </React.Fragment>
  );
};

ModalMusicPlayer.propTypes = {
  navigation: PropTypes.object.isRequired
};

const styles = StyleSheet.create({
  image: {
    height: device.width - 48,
    marginVertical: device.iPhoneNotch ? 36 : 8,
    width: device.width - 48
  },
  containerDetails: {
    marginBottom: 16
  },
  containerSong: {
    flex: 6
  },
  containerLyric: {
    margin: 22
  },

  song: {
    ...gStyle.textSpotifyBold24,
    color: colors.white
  },
  artist: {
    ...gStyle.textSpotify18,
    color: colors.greyInactive
  },
  containerFavorite: {
    alignItems: 'flex-end',
    flex: 1,
    justifyContent: 'center'
  },
  containerTime: {
    ...gStyle.flexRowSpace
  },
  time: {
    ...gStyle.textSpotify10,
    color: colors.greyInactive
  },
  containerControls: {
    ...gStyle.flexRowSpace,
    marginTop: device.iPhoneNotch ? 24 : 8
  },
  containerBottom: {
    ...gStyle.flexRowSpace,
    marginTop: device.iPhoneNotch ? 32 : 8
  }
});

export default React.memo(ModalMusicPlayer);