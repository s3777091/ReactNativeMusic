import * as React from 'react';
import {
  Animated,
  StyleSheet,
  View,
  ActivityIndicator,
  Text,
  RefreshControl,
  TouchableOpacity,
  Image
} from 'react-native';
import { colors, device, gStyle } from '../constants';
import con from '../../data';
import ArtistDisplay from '../components/Display/ArtistDisplay';

import AlbumDisplay from '../components/Display/AlbumDisplay';
import Banner from '../components/Display/Banner';

import { SafeAreaView } from 'react-native-safe-area-context';

const pageCount = con.Domain.concat(con.Home);


import AsyncStorage from '@react-native-async-storage/async-storage';
import { Feather } from '@expo/vector-icons';
import TouchIcon from '../components/Design/TouchIcon';

import { useNavigation } from '@react-navigation/native';

const wait = (timeout) => {
  return new Promise((resolve) => setTimeout(resolve, timeout));
};

import Context from '../context';

const Home = () => {

  var AlbumViews = [];
  const navigation = useNavigation();

  const [Greeting, SetGreeting] = React.useState();

  const [isUser, setLoadingUser] = React.useState(true);
  const [userDetail, SetUser] = React.useState();

  //Checking load
  const [isLoading, setLoading] = React.useState(true);

  const [refreshing, setRefreshing] = React.useState(false);

  const [DataPage, setDataPage] = React.useState([]);

  const { showMusicBar } = React.useContext(Context);


  const getData = async () => {
    const isMounted = true;
    try {
      var temp = [];
      for (let i = 1; i < 5; i++) {
        const response = await fetch(pageCount.concat(i));
        await response.json().then((ra) => {
          temp.push(ra?.playListHome);
        });
      }
      if (isMounted) {
        setDataPage(temp);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };



  const greeting = async () => {
    const hour = new Date().getHours();
    if (hour < 12) {
      SetGreeting(`Chào buổi sáng`);
    } else if (hour < 18) {
      SetGreeting(`Chào buổi Chiều`);
    } else {
      SetGreeting(`Chào buổi Tối`);
    }

  };


  const onRefresh = React.useCallback(() => {
    loadData();
    setRefreshing(true);
    wait(500).then(() => {
      setRefreshing(false);
      setLoading(false);
    });
  }, []);

  const loadData = async () => {
    getData();
  };

  React.useEffect(() => {
    greeting();
    loadData();
  }, []);


  React.useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      async function prepare() {
        try {
          const s = await AsyncStorage.getItem('userDetail');
          if (s !== null) {
            const data = JSON.parse(s);
            SetUser(data);
            setLoadingUser(false);
          } else {
            setLoadingUser(true);
          }
        } catch (e) {
          console.warn(e);
        }
      }
      prepare();

    });
    return unsubscribe;
  }, [navigation]);

  const scrollY = React.useRef(new Animated.Value(0)).current;

  const opacityIn = scrollY.interpolate({
    inputRange: [0, 128],
    outputRange: [0, 1],
    extrapolate: 'clamp'
  });


  for (let i = 0; i < DataPage.length; i++) {
    for (let h = 0; h < DataPage[i].length; h++) {

      if (DataPage[i][h]?.type == 'banner') {
        AlbumViews.push(
          <>
            <ArtistDisplay
              key={con.artistData.id}
              ListData={con.artistData}
              heading={'Nghệ sĩ nổi bật'}
            />

            <Banner
              key={DataPage[i][h]?.encodeId}
              ListData={DataPage[i][h]?.playlist}
            />

          </>
        )
      }

      if (DataPage[i][h]?.type == 'playlist') {
        AlbumViews.push(
          <AlbumDisplay
            ListData={DataPage[i][h]?.playlist}
            heading={DataPage[i][h]?.tilte}
            tagline={DataPage[i][h]?.playlist[0].sortDescription || ""}
          />
        )
      }

    }
  }

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
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        <SafeAreaView style={gStyle.container} />
        <View style={styles.contairner_HomeHeader}>
          <Text ellipsizeMode="tail" numberOfLines={1} style={styles.title}>
            {Greeting}
          </Text>

          {isUser ? (
            <TouchIcon
              onPress={() => navigation.navigate("Login")}
              icon={<Feather color={colors.white} name="user" />}
            />
          ) : (
            <>
              <TouchableOpacity
                activeOpacity={gStyle.activeOpacity}
                hitSlop={{ top: 10, left: 10, bottom: 10, right: 10 }}
                onPress={() => navigation.navigate("UserScreen", {
                  id: userDetail.id,
                  name: userDetail.name,
                  email: userDetail.Email,
                  image: userDetail.Avatar
                })}
                style={styles.avatar_container}
              >
                <Image source={{ uri: isUser ? userDetail.Avatar : "https://i.ibb.co/TRYkPj7/OIP.jpg" }} style={styles.avatar_styles} />
              </TouchableOpacity>
            </>
          )}

        </View>


        {isLoading ? (
          <ActivityIndicator size="large" color="#00ff00" />
        ) : (
          <>
            {AlbumViews}

            <View style={{ marginVertical: showMusicBar ? 70 : 45 }}></View>
          </>
        )}
      </Animated.ScrollView>
    </React.Fragment>
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
  },
  title: {
    ...gStyle.textSpotifyBold20,
    color: colors.white,
    marginHorizontal: 16
  },
  contairner_HomeHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginHorizontal: 9,
    paddingTop: 12,
    marginBottom: 20
  },
  containerSupport: {
    width: device.width,
    height: 120,
    backgroundColor: '#444',
    flexDirection: 'row',
    borderRadius: 20,
    alignItems: 'center',
    marginVertical: 15
  },
  image_user: {
    width: 30,
    height: 30,
    marginRight: 20,
    borderRadius: 30
  },
  image_Music: {
    borderTopLeftRadius: 20,
    borderBottomLeftRadius: 20,
    width: 120,
    height: 120
  },
  containerColumn: {
    width: '50%',
    marginTop: 2
  },
  artist: {
    ...gStyle.textSpotify12,
    color: colors.greyLight,
    marginLeft: 16,
    marginVertical: 2
  },
  avatar_container: {
    borderRadius: 50,
    width: 30,
    height: 30,
    overflow: 'hidden'
  },
  avatar_styles: {
    width: '100%',
    height: '100%',
  },
});

export default React.memo(Home);