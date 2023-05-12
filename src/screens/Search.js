import * as React from 'react';
import {
  Animated,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  StatusBar,
  ActivityIndicator,
  FlatList,

  Image
} from 'react-native';
import { AntDesign } from '@expo/vector-icons';

import { colors, device, gStyle } from '../constants';

import { debounce } from 'lodash';

import MusicList from '../components/Line/MusicList';

import Context from '../context';


import { useNavigation } from '@react-navigation/native';

import { TextInput } from 'react-native-gesture-handler';

import con from '../../data';
import { Feather } from '@expo/vector-icons';

import { SafeAreaView } from 'react-native-safe-area-context';

const linkRadio = con.SuggestKey;


import {getHash256, getHmac512} from '../../config/encrypt';

const Search = () => {
  const navigation = useNavigation();



  const [TextSearch, setTextSearch] = React.useState('');

  const textInputRef = React.useRef(null);
  const [listSuggest, setListSuggest] = React.useState();

  const scrollY = React.useRef(new Animated.Value(0)).current;


  const NavigateToSearchResults = async () => {
    navigation.navigate('SearchResults', {
      textSearchValue: TextSearch
    });
  };


  const handleTextChange = async (text) => {
    setTextSearch(text);
    try {
      const responseData = await fetch(
        linkRadio.concat(text).concat('&language=vi')
      );

      await responseData.json().then((tas) => {
        setListSuggest(tas?.data);
      });
    } catch (error) {
      console.error(error);
    }
  };


  function getStream(id) {
    var milliseconds = new Date().getTime().toString();
    var code = milliseconds.substring(0, 10);
    var Hash = `ctime=${code}id=${id}version=1.9.24`;
    var sign = getHmac512("/api/v2/song/get/streaming" + getHash256(Hash), "acOrvUS15XRW2o9JksiK1KgQ6Vbds8ZW");
    return "https://zingmp3.vn/api/v2/song/get/streaming" + `?id=${id}&ctime=${code}&version=1.9.24&sig=${sign}&apiKey=X5BM3w8N7MKozC0B85o4KMlzLZKhV00y`;
}

  const onChangeSong = async (songData) => {
    setSong(songData.title);

    const songObject = {
      music_id: songData.music_id,
      album: songData.album,
      artistsNames: songData.artistsNames,
      image: songData.image,
      length: songData.length,
      title: songData.title,
      songUrl: getStream(songData.music_id),
    }

    updateState('currentSongData', songObject);
    navigation.navigate('ModalMusicPlayer');
  };

  const handleOnSubmitEditing = (event) => {
    event.preventDefault();
    NavigateToSearchResults();
    textInputRef.current.blur();
    setTextSearch('');
  };

  const { currentSongData, updateState, showMusicBar } =
    React.useContext(Context);

  const [song, setSong] = React.useState(currentSongData.title);



  // search start (24 horizontal padding )
  const searchStart = device.width - 48;
  const searchEnd = device.width - 88;

  const opacity = scrollY.interpolate({
    inputRange: [0, 48],
    outputRange: [searchStart, searchEnd],
    extrapolate: 'clamp'
  });


  return (
    <SafeAreaView style={styles.container}>
      <FlatList
        showsVerticalScrollIndicator={false}
        initialNumToRender={4}
        data={listSuggest?.items[0]?.keywords}
        ListHeaderComponent={() => (
          <>
            <View style={styles.containerSearchBar}>
              <Animated.View style={{ width: opacity }}>
                <TouchableOpacity
                  activeOpacity={1}
                  onPress={() => null}
                  style={styles.searchPlaceholder}
                >
                  <View style={gStyle.mR1}>
                    <AntDesign name="search1" color={colors.black20} size={22} />
                  </View>

                  <TextInput
                    ref={textInputRef}
                    style={styles.searchPlaceholderText}
                    fontStyle={colors.white}
                    value={TextSearch}
                    autoFocus={true}
                    onChangeText={handleTextChange}
                    placeholderTextColor={colors.black40}
                    placeholder="Tìm kiếm nội dung ưa thích"
                    onSubmitEditing={handleOnSubmitEditing}
                  />
                </TouchableOpacity>

                <Text
                  style={{
                    color: colors.white,
                    marginTop: 12,
                    fontSize: 18,
                    fontWeight: 'bold'
                  }}
                >
                  Từ khóa liên quan
                </Text>
              </Animated.View>
            </View>
          </>
        )}
        ListFooterComponent={() => (
          <View style={styles.containerSearchBar}>
            <Text
              style={{
                color: colors.white,
                fontSize: 18,
                fontWeight: 'bold'
              }}
            >
              Gợi ý kết quả
            </Text>
            <FlatList
              initialNumToRender={4}
              removeClippedSubviews
              windowSize={50}
              keyExtractor={(item) => item.id}
              data={listSuggest?.items[1]?.suggestions}
              renderItem={({ item }) => (
                <>
                  {item.type == '1' ? (
                    <MusicList
                      active={song === item?.title}
                      onPress={onChangeSong}
                      songData={{
                        music_id: item?.id,
                        album: item?.title,
                        artistsNames: item?.artists[0]?.name,
                        image: item?.thumb,
                        length: item?.duration,
                        title: item?.title
                      }}
                    />
                  ) : (
                    <View
                      style={{
                        marginVertical: 12,
                        paddingLeft: 15,
                        justifyContent: 'flex-start'
                      }}
                    >
                      <TouchableOpacity
                        style={{ flexDirection: 'row', alignItems: 'center' }}
                        onPress={() =>
                          navigation.navigate('Artist', {
                            alias: item?.aliasName
                          })
                        }
                      >
                        <Image
                          source={{ uri: item?.avatar }}
                          style={styles.circle_image}
                        />
                        <Text style={styles.Artis_title}>{item?.name}</Text>
                      </TouchableOpacity>
                    </View>
                  )}
                </>
              )}
            />

            <View style={{ marginVertical: showMusicBar ? 60 : 40 }}></View>
          </View>
        )}
        removeClippedSubviews
        windowSize={50}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={{
              justifyContent: 'flex-start',
              marginLeft: 12,
              marginVertical: 2
            }}
            onPress={() =>
              navigation.navigate('SearchResults', {
                textSearchValue: item?.keyword
              })
            }
          >
            <View style={{ flexDirection: 'row' }}>
              <Feather
                name="search"
                size={24}
                color="white"
                style={{ marginHorizontal: 12 }}
              />
              <Text style={{ color: colors.white, fontSize: 20 }}>
                {item?.keyword}
              </Text>
            </View>
          </TouchableOpacity>
        )}
      />


    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  containerSearchBar: {
    ...gStyle.pH3,
    backgroundColor: colors.black,
    paddingBottom: 16,
    paddingTop: device.iPhoneNotch ? 64 : 24
  },

  Artis_title: {
    ...gStyle.textSpotifyBold12,
    color: colors.white,
    marginTop: 4,
    textAlign: 'center'
  },
  container: {
    flex: 1,
    marginTop: StatusBar.currentHeight || 0
  },
  searchPlaceholder: {
    alignItems: 'center',
    backgroundColor: colors.white,
    borderRadius: 9,
    flexDirection: 'row',
    paddingLeft: 16,
    paddingVertical: 16
  },
  searchPlaceholderText: {
    ...gStyle.textSpotify16,
    color: colors.blackBg,
    width: 250
  },
  sectionHeading: {
    ...gStyle.textSpotifyBold18,
    color: colors.white,
    marginBottom: 24,
    marginLeft: 24,
    marginTop: 16
  },
  circle_image: {
    width: 70,
    height: 70,
    borderRadius: 70,
    marginRight: 15
  },
  containerRow: {
    flex: 1,
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginLeft: 24
  },
  containerColumn: {
    width: '50%'
  },
  iconRight: {
    alignItems: 'center',
    height: 28,
    justifyContent: 'center',
    position: 'absolute',
    right: 24,
    top: device.web ? 40 : 78,
    width: 28
  }
});

export default React.memo(Search);