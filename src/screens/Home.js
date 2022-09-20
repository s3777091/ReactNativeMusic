import * as React from 'react';
import {
  Animated,
  StyleSheet,
  View,
  ActivityIndicator,
  Text,
  RefreshControl
} from 'react-native';
import { colors, device, gStyle } from '../constants';
import con from '../../data';
import ArtistDisplay from '../components/Display/ArtistDisplay';

import AlbumDisplay from '../components/Display/AlbumDisplay';
import MusicList from '../components/Line/MusicList';
import { SafeAreaView } from 'react-native-safe-area-context';

const link1 = con.Domain.concat(con.Home).concat('?page=1');
const link2 = con.Domain.concat(con.Home).concat('?page=2');
const link3 = con.Domain.concat(con.Home).concat('?page=3');
const link5 = con.Domain.concat(con.Home).concat('?page=5');

const linkRadio = con.Domain.concat(con.Radio);
const linkMusicNews = con.Domain.concat(con.Home_Chart);

const wait = (timeout) => {
  return new Promise((resolve) => setTimeout(resolve, timeout));
};

import Context from '../context';
const Home = () => {
  //Hello
  const [Greeting, SetGreeting] = React.useState();

  //Get All Data

  const [link3Data, setLink3Data] = React.useState();
  const [ArtistData, setArtistData] = React.useState();
  const [TopicData, setTopicData] = React.useState();

  const [NewsTodayData, setNewsTodayData] = React.useState();

  const [RadioData, SetRadioData] = React.useState();

  //Music
  const [MusicNews, setMusicNews] = React.useState();
  //Checking load
  const [isLoading, setLoading] = React.useState(true);

  const [refreshing, setRefreshing] = React.useState(false);

  const { currentSongData, updateState } = React.useContext(Context);

  const [song, setSong] = React.useState(currentSongData.title);

  const getRadio = async () => {
    const isMounted = true;
    try {
      const response = await fetch(linkRadio);
      const json = await response.json();
      const rpRadio = await fetch(json.RadioData);
      await rpRadio.json().then((ra) => {
        if (isMounted) {
          SetRadioData(ra.data);
        }
      });
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const getListNewsTodayData = async () => {
    const isMounted = true;
    try {
      const response = await fetch(link2);
      const json = await response.json();
      const responseHome = await fetch(json.HomeData);

      await responseHome.json().then((dataHome) => {
        if (isMounted) setNewsTodayData(dataHome.data);
      });
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  //2 AND 3
  const getLink3 = async () => {
    const isMounted = true;
    try {
      const response = await fetch(link3);
      const json = await response.json();

      const responseMusic = await fetch(json.HomeData);
      await responseMusic.json().then((dataHome) => {
        if (isMounted) {
          setLink3Data(dataHome.data);
        }
      });
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  // 3 4
  const getTopicMusic = async () => {
    const isMounted = true;
    try {
      const response = await fetch(link1);
      const json = await response.json();
      const responseHome = await fetch(json.HomeData);
      await responseHome.json().then((dataHome) => {
        if (isMounted) {
          setTopicData(dataHome.data);
        }
      });
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const getArtistList = async () => {
    const isMounted = true;
    try {
      const response = await fetch(link5);
      const json = await response.json();
      const responseHome = await fetch(json.HomeData);

      await responseHome.json().then((dataHome) => {
        if (isMounted) setArtistData(dataHome.data);
      });
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const GetMusicNewsRelease = async () => {
    const isMounted = true;
    try {
      const response = await fetch(linkMusicNews);
      const json = await response.json();

      const responseMusic = await fetch(json.home);
      await responseMusic.json().then((dataHome) => {
        if (isMounted) {
          setMusicNews(dataHome?.data?.newRelease);
        }
      });
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const greeting = async () => {
    const hour = new Date().getHours();
    if (hour < 12) {
      SetGreeting('Chào buổi sáng');
    } else if (hour < 18) {
      SetGreeting('Chào buổi Chiều');
    } else {
      SetGreeting('Chào buổi Tối');
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
    getRadio();
    getListNewsTodayData();
    getArtistList();
    getTopicMusic();
    getLink3();
  };

  React.useEffect(() => {
    greeting();
    loadData();
  }, []);

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
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        <SafeAreaView style={gStyle.container} />
        <View style={styles.contairner_HomeHeader}>
          <Text ellipsizeMode="tail" numberOfLines={1} style={styles.title}>
            {Greeting}
          </Text>

          {/* <Image
            style={styles.image_user}
            source={require('../assets/images/confused.png')}
          /> */}
        </View>

        {isLoading ? (
          <ActivityIndicator size="large" color="#00ff00" />
        ) : (
          <>
            <AlbumDisplay
              ListData={NewsTodayData?.items[0]?.items}
              IsBigThumbnail={true}
              heading={NewsTodayData?.items[0]?.title}
              tagline="Lắng nghe các bài hát hôm nay"
            />

            <AlbumDisplay
              ListData={RadioData?.items[2]?.items}
              heading={RadioData?.items[2]?.title}
              IsPodCast={true}
            />

            <AlbumDisplay
              ListData={ArtistData?.items[0]?.items}
              heading={ArtistData?.items[0]?.title}
            />

            <AlbumDisplay
              ListData={TopicData?.items[4]?.items}
              heading={TopicData?.items[4]?.title}
            />

            <ArtistDisplay
              ListData={ArtistData?.items[3]?.items}
              heading={'Nghệ sĩ nổi bật'}
            />

            <AlbumDisplay
              ListData={TopicData?.items[3]?.items}
              heading={TopicData?.items[3]?.title}
            />
            <AlbumDisplay
              ListData={RadioData?.items[5]?.items}
              heading={RadioData?.items[5]?.title}
              IsPodCast={true}
            />
            <ArtistDisplay
              ListData={link3Data?.items[0]?.items}
              heading="nghệ sĩ"
              IsCircle={true}
            />

            <AlbumDisplay
              ListData={ArtistData?.items[1]?.items}
              heading={ArtistData?.items[1]?.title}
              IsPodCast={true}
              IsBigThumbnail={true}
            />

            <AlbumDisplay
              ListData={link3Data?.items[1]?.items}
              heading="Top 100"
              tagline="Top 100 Nhạc Trẻ là danh sách 100 ca khúc hot nhất hiện tại của thể loại Nhạc Trẻ"
            />
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
  }
});

export default Home;
