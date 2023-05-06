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
<<<<<<< Updated upstream
import { FontAwesome } from '@expo/vector-icons';
=======
import { AntDesign } from '@expo/vector-icons';
>>>>>>> Stashed changes
import { colors, device, gStyle } from '../constants';

import MusicList from '../components/Line/MusicList';

import Context from '../context';

// icons
import SvgSearch from '../icons/Svg.Search';

import { useNavigation } from '@react-navigation/native';

import { TextInput } from 'react-native-gesture-handler';

import con from '../../data';
import { Feather } from '@expo/vector-icons';

import { SafeAreaView } from 'react-native-safe-area-context';

const linkRadio = con.SuggestKey;

const Search = () => {
  const navigation = useNavigation();

  const [TextSearch, setTextSearch] = React.useState();

  const [listSuggest, setListSuggest] = React.useState();

  const scrollY = React.useRef(new Animated.Value(0)).current;

  const NavigateToSearchResults = async () => {
    navigation.navigate('SearchResults', {
      textSearchValue: TextSearch
    });
  };

  const GetListSearchSuggest = async (text) => {
    setTextSearch(text);
    const isMounted = true;
    try {
      const responseData = await fetch(
        linkRadio.concat(text).concat('&language=vi')
      );

      await responseData.json().then((tas) => {
        if (isMounted) setListSuggest(tas?.data);
      });
    } catch (error) {
      console.error(error);
    }
  };

  const { currentSongData, updateState } =
    React.useContext(Context);

  const [song, setSong] = React.useState(currentSongData.title);

  const onChangeSong = async (songData) => {
    // update local state
    setSong(songData.title);
    updateState('currentSongData', songData);
    navigation.navigate('ModalMusicPlayer');
  };

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
<<<<<<< Updated upstream
                    <SvgSearch />
=======
                    <AntDesign name="search1" color={colors.black20} size={22}/>
>>>>>>> Stashed changes
                  </View>
                  <TextInput
                    style={styles.searchPlaceholderText}
                    fontStyle={colors.white}
                    value={TextSearch}
                    onChangeText={(text) => GetListSearchSuggest(text)}
                    placeholderTextColor={colors.black40}
<<<<<<< Updated upstream
                    placeholder="Tìm kiếm nội dung ưa thích 🍕"
=======
                    placeholder="Tìm kiếm nội dung ưa thích"
>>>>>>> Stashed changes
                    autoFocus={true}
                    onSubmitEditing={NavigateToSearchResults}
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
                        album: item.title,
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
    color: colors.blackBg
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