import * as React from 'react';
import {
  Animated,
  StyleSheet,
  Text,
  View,
  ActivityIndicator,
  Image
} from 'react-native';
import { colors, device, gStyle } from '../constants';

import ModalHeader from '../components/Design/ModalHeader';
import { Feather } from '@expo/vector-icons';

import MusicList from '../components/Line/MusicList';
import ArtistDisplay from '../components/Display/ArtistDisplay';

import con from '../../data';
const link = con.Domain.concat(con.Search);

import Context from '../context';
import AlbumDisplay from '../components/Display/AlbumDisplay';
const SearchResults = ({ navigation, route }) => {
  const { currentSongData, updateState } =
    React.useContext(Context);

  const [song, setSong] = React.useState(currentSongData.title);

  const onChangeSong = async (songData) => {
    // update local state
    setSong(songData.title);
    updateState('currentSongData', songData);
    navigation.navigate('ModalMusicPlayer');
  };
  const [Results, setSearchResults] = React.useState();
  const [isLoading, setLoading] = React.useState(true);

  const [notFound, SetNotFoud] = React.useState(false);
  const textValue = route.params.textSearchValue;

  //Clean Code
  React.useEffect(() => {
    return (
      Results,
      isLoading,
      notFound
        ? () => {
            setSearchResults('');
            setLoading(true);
            SetNotFoud(false);
          }
        : undefined
    );
  }, [Results, isLoading, notFound]);

  const getSearchData = async () => {
    try {
      const response = await fetch(link.concat(textValue));
      const json = await response.json();

      const searchResult = await fetch(json.search);
      await searchResult.json().then((dataSearch) => {
        if (
          dataSearch.data.counter.song == 0 &&
          dataSearch.data.counter.artist == 0 &&
          dataSearch.data.counter.playlist == 0
        ) {
          SetNotFoud(true);
          setSearchResults('null');
        } else {
          setSearchResults(dataSearch.data);
        }
      });
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  React.useEffect(() => {
    getSearchData();
  }, []);

  const scrollY = React.useRef(new Animated.Value(0)).current;

  return (
    <View style={gStyle.container}>
      <ModalHeader
        left={<Feather color={colors.greyLight} name="chevron-down" />}
        leftPress={() => navigation.goBack(null)}
        text={`Kết qủa tìm kiếm của ${textValue}`}
      />

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
          style={gStyle.container}
        >
          {!notFound ? (
            <View style={{ marginTop: 20 }}>
              <AlbumDisplay
                ListData={Results.playlists}
                heading="Play List Theo Kết quả"
                IsPodCast={false}
              />

              <Text style={styles.heading}>Bài hát theo kết quả</Text>

              {Results.songs &&
                Results.songs.map((s) => (
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

              <ArtistDisplay
                ListData={Results.artists}
                heading="Nghệ Sĩ Theo kết quả"
                IsCircle={true}
              />
            </View>
          ) : (
            <View
              style={{
                justifyContent: 'center',
                alignItems: 'center',
                marginTop: 200
              }}
            >
              <Text
                style={{
                  color: colors.white,
                  fontSize: 34,
                  fontWeight: 'bold',
                  margin: 7
                }}
              >
                Không có kết quả
              </Text>

              <Text
                style={{
                  color: colors.white,
                  fontSize: 16,
                  fontWeight: 'bold',
                  marginVertical: 20
                }}
              >
                Cho kết quả: {textValue}
              </Text>

              <Image
                source={require('../assets/images/confused.png')}
                style={{
                  width: 140,
                  height: 140
                }}
              />
            </View>
          )}
        </Animated.ScrollView>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  iPhoneNotch: {
    backgroundColor: colors.black70,
    height: 44,
    position: 'absolute',
    top: 0,
    width: '100%',
    zIndex: 20
  },
  containerSong: {
    flex: 6
  },
  heading: {
    ...gStyle.textSpotifyBold18,
    color: colors.white,
    paddingBottom: 6,
    paddingLeft: 12
  },
  containerHeader: {
    alignItems: 'flex-end',
    flexDirection: 'row',
    justifyContent: 'flex-end',
    paddingHorizontal: 16,
    paddingTop: device.iPhoneNotch ? 60 : 36,
    position: 'absolute',
    top: 0,
    width: '100%',
    zIndex: 10
  }
});

export default SearchResults;
