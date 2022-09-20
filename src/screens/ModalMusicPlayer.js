import * as React from 'react';
import PropTypes from 'prop-types';
import { Ionicons } from '@expo/vector-icons';
import {
  Image,
  StyleSheet,
  Text,
  View,
  ActivityIndicator,
  Animated,
  TouchableOpacity,
  Alert,
  FlatList
} from 'react-native';

import { Feather, FontAwesome, MaterialIcons } from '@expo/vector-icons';
import Slider from '@react-native-community/slider';
import { colors, device, func, gStyle } from '../constants';

import { Audio } from 'expo-av';
// components
import ModalHeader from '../components/Design/ModalHeader';
import TouchIcon from '../components/Design/TouchIcon';

// context
import Context from '../context';
import cons from '../../data';
import { SafeAreaView } from 'react-native-safe-area-context';

const linkMUSIC = cons.Domain.concat(cons.PLAY_MP3);

const linkPodCast = cons.Domain.concat(cons.PodCastListen);

const LinkLyRick = cons.Domain.concat(cons.MP3_LYRIC);

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

  const [getLink, setLink] = React.useState(String);

  const [Playing, setPlaying] = React.useState(false);

  const [Loading, SetLoading] = React.useState(true);

  const [UserSeeking, SetUserSeeking] = React.useState(false);

  const [dataLyric, setDataLyric] = React.useState();

  const [duration, setDuration] = React.useState(Number);
  const [position, setPosition] = React.useState(Number);

  const [audioProgess, setAudioProgess] = React.useState(Number);
  const sound = React.useRef(new Audio.Sound());

  const initialState = {Playing: false};

  async function PlayAudio(_state = initialState, action) {
    switch (action.type) {
      case 'Play': {
        setPlaying(true);
        const result = await sound.current.getStatusAsync();
        if (result.isLoaded) {
          if (result.isPlaying === false) {
            sound.current.playAsync();
          }
        }
      }
      case 'Pause': {
        const result = await sound.current.getStatusAsync();
        if (result.isLoaded) {
          if (result.isPlaying === true) {
            setPlaying(false);
            sound.current.pauseAsync();
          }
        }
      }
      default:
        throw new Error();
    }
  }


  const [state, dispatch] = React.useReducer(PlayAudio, initialState);

  async function slider_change(value) {
    if(UserSeeking){
      const seektime = value * duration
      setPosition(seektime);
      sound.current.setPositionAsync(seektime);
      SetUserSeeking(false);
    }
  }

  const get_lyric = async (id) => {
    const isMouted = true;
    try {
      const res = await fetch(LinkLyRick.concat(id));
      const json = await res.json();

      const resLink = await fetch(json.lyricLink);
      const tabs = await resLink.json();

      if (isMouted) {
        setDataLyric(tabs?.data?.sentences);
      }
    } catch (error) {
    } finally {
      SetLoading(false);
    }
  };

  React.useEffect(() => {
    return sound
      ? () => {
          sound.current.unloadAsync();
        }
      : undefined;
  }, [sound]);

  const showAlert = () =>
    Alert.alert(
      'Lỗi Vip',
      'Hiện tại chưa có chức năng vip cho bài hát hoặc podcast này',
      [
        {
          text: 'Thoát tới home',
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

  const fetchSoundLink = async (type, id) => {
    const isMouted = true;
    //False Is song // True is PodCast
    if (!type) {
      try {
        const responseSong = await fetch(linkMUSIC.concat(id));
        const jsonSong = await responseSong.json();
        if (isMouted) {
          setLink(jsonSong.music);
          get_lyric(id);
        }
      } catch (error) {
        showAlert();
      } finally {
        SetLoading(false);
      }
    } else {
      try {
        const responsePodCast = await fetch(linkPodCast.concat(id));
        const jsonPodCast = await responsePodCast.json();

        const reponsePodCast = await fetch(jsonPodCast.listen);
        const dataPodCast = await reponsePodCast.json();
        const touchJson = JSON.stringify(dataPodCast.data);
        if (isMouted) {
          setLink(
            touchJson
              .substring(touchJson.indexOf(`"128":`), touchJson.indexOf(`"}`))
              .replace(`"128":"`, '')
          );
        }
      } catch (error) {
        showAlert();
      } finally {
        SetLoading(false);
      }
    }
  };
  const ReplayAudio = async () => {
    setRepeat(true);
  };

  
  function millisToMinutesAndSeconds(millis) {
    const minutes = Math.floor(millis / 60000);
    const seconds = ((millis % 60000) / 1000).toFixed(0);
    return minutes + ':' + seconds;
  }

  const LoadSong = async () => {
    const checkLoading = await sound.current.getStatusAsync();
    if (checkLoading.isLoaded === false) {
      try {
        const music = await sound.current.loadAsync(
          {
            uri: getLink
          },
          {
            shouldPlay: true,
            progressUpdateIntervalMillis: 1000,
            allowsRecordingIOS: false,
            interruptionModeIOS: Audio.INTERRUPTION_MODE_IOS_DO_NOT_MIX,
            playsInSilentModeIOS: true,
            shouldDuckAndroid: true,
            interruptionModeAndroid: Audio.INTERRUPTION_MODE_ANDROID_DO_NOT_MIX,
            playThroughEarpieceAndroid: false,
            staysActiveInBackground: true
          }
        );
        sound.current.setOnPlaybackStatusUpdate((e) => {
          if (e.isLoaded) {
            setDuration(e.durationMillis);
            setPosition(e.positionMillis);
            const currentProgress =
              Math.max(0, e.positionMillis) / e.durationMillis;
            setAudioProgess(currentProgress);
            
          }
          if(e.didJustFinish){
            if(Repeat){
              sound.current.replayAsync();
            } else{
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
      } catch (error) {
        SetLoading(true);
      }
    } else {
      SetLoading(true);
    }
  };

  React.useEffect(() => {
    fetchSoundLink(currentSongData.type, currentSongData.music_id);
    LoadSong();
  }, [getLink]);

  const scrollY = React.useRef(new Animated.Value(0)).current;

  const opacityIn = scrollY.interpolate({
    inputRange: [0, 128],
    outputRange: [0, 1],
    extrapolate: 'clamp'
  });

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
              <Text ellipsizeMode="tail" numberOfLines={1} style={styles.song}>
                {currentSongData.title}
              </Text>
              <Text style={styles.artist}>{currentSongData.artist}</Text>
            </View>
            <View style={styles.containerFavorite}>
              <TouchIcon
                icon={<FontAwesome color={favoriteColor} name={favoriteIcon} />}
                onPress={() => setFavorited(!favorited)}
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
              onSlidingComplete={(value) => {
                slider_change(value);
                SetUserSeeking(false);
              }}
              thumbTintColor={colors.greyLight}

              onValueChange={async () => {
                SetUserSeeking(true);
              }}
            />
            <View style={styles.containerTime}>
              <Text style={styles.time}>
                {millisToMinutesAndSeconds(position)}
              </Text>
              <Text style={styles.time}>{`-${timeLeft}`}</Text>
            </View>
          </View>

          <View style={styles.containerControls}>
            <TouchIcon
              icon={<Feather color={colors.greyLight} name="shuffle" />}
              onPress={() => null}
            />
            <View style={gStyle.flexRowCenterAlign}>
              {Loading ? (
                //
                <ActivityIndicator size={'large'} color={'red'} />
              ) : (
                <>
                  {!Playing ? (
                    <TouchableOpacity onPress={() => dispatch({type: 'Play'})}>
                      <Ionicons name="ios-pause" size={55} color="#444" />
                    </TouchableOpacity>
                  ) : (
                    <TouchableOpacity onPress={() => dispatch({type: 'Pause'})}>
                      <Ionicons name="ios-play-circle" size={55} color="#444" />
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
        <SafeAreaView style={styles.containerLyric}>
          {dataLyric == null ? (
            <></>
          ) : (
            <>
              <Text
                style={{
                  color: colors.white,
                  fontSize: 24,
                  fontWeight: 'bold'
                }}
              >
                Lời Nhạc
              </Text>
              {dataLyric &&
                dataLyric.map((large) => (
                  <FlatList
                    key={large.words[large.words.length - 1].endTime}
                    contentContainerStyle={{ margin: 5 }}
                    horizontal
                    removeClippedSubviews
                    windowSize={50}
                    keyExtractor={(item, index) => index.toString()}
                    data={large.words}
                    renderItem={({ item }) => (
                      <>
                        {large.words[0].startTime < position &&
                        position <
                          large.words[large.words.length - 1].endTime ? (
                          <Text
                            style={{
                              color: colors.brandPrimary,
                              padding: 1.5,
                              fontWeight: 'bold',
                              fontSize: 18
                            }}
                          >
                            {item.data}
                          </Text>
                        ) : (
                          <Text
                            style={{
                              color: '#F8EBFF',
                              padding: 1.5,
                              fontWeight: 'bold',
                              fontSize: 18
                            }}
                          >
                            {item.data}
                          </Text>
                        )}
                      </>
                    )}
                    showsHorizontalScrollIndicator={false}
                  />
                ))}
            </>
          )}
        </SafeAreaView>
      </Animated.ScrollView>
    </React.Fragment>
  );
};

ModalMusicPlayer.propTypes = {
  // required
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

export default ModalMusicPlayer;
