import * as React from 'react';
import PropTypes from 'prop-types';
import {
  Animated,
  Image,
  StyleSheet,
  Text,
  View,
  ActivityIndicator
} from 'react-native';
import LinearGradient from '../components/Design/LinearGradient';
import TouchIcon from '../components/Design/TouchIcon';

import { Feather } from '@expo/vector-icons';

import { colors, device, gStyle } from '../constants';

import ListHub from '../components/Line/ListHub';

import con from '../../data';
import { SafeAreaView } from 'react-native-safe-area-context';

const link = con.Domain.concat(con.GET_Hub);

const Hub = ({ navigation, route }) => {
  const idMusic = route.params;

  const [ColorOne, SetColorOne] = React.useState();
  const [HubDetailsList, setHubDetail] = React.useState();
  const [isLoading, setLoading] = React.useState(true);


  const getHubData = async () => {
    const isMounted = true;
    try {
      const response = await fetch(link.concat(idMusic.final_Id));
      const json = await response.json();

      const hubResults = await fetch(json.hub_detail);
      await hubResults.json().then((dataOut) => {
        if (isMounted) {
          setHubDetail(dataOut.data.sections[0].items);
        }
      });
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  React.useEffect(() => {
    getHubData();
    SetColorOne(color_genter());
  }, []);

  function color_genter() {
    return '#'.concat(Math.floor(Math.random() * 16777215).toString(16));
  }
  const scrollY = React.useRef(new Animated.Value(0)).current;
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

  return (
    <SafeAreaView style={gStyle.container}>

      <View style={styles.containerHeader}>
        <Animated.View
          style={[styles.headerLinear, { opacity: opacityHeading }]}
        >
          <LinearGradient fill={ColorOne} height={89} />
        </Animated.View>
        <View style={styles.header}>
          <TouchIcon
            icon={<Feather color={colors.white} name="chevron-left" />}
            onPress={() => navigation.goBack(null)}
          />
          <Animated.View style={{ opacity: opacityShuffle }}>
            <Text style={styles.headerTitle}>{idMusic.tabTitle}</Text>
          </Animated.View>
          <TouchIcon
            icon={<Feather color={colors.white} name="more-horizontal" />}
            onPress={() => null}
          />
        </View>
      </View>

      <Animated.ScrollView
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { y: scrollY } } }],
          { useNativeDriver: true }
        )}
        scrollEventThrottle={16}
        showsVerticalScrollIndicator={false}
        style={gStyle.container}
      >
        <View style={styles.containerRow}>
          <Image source={{ uri: idMusic.image }} style={styles.image} />
          <Text ellipsizeMode="tail" numberOfLines={1} style={styles.title}>
            Chủ đề: {idMusic.tabTitle} được đề xuất
          </Text>

          {isLoading ? (
            <ActivityIndicator />
          ) : (
            <>
              {HubDetailsList &&
                HubDetailsList.map((hu) => (
                  <View key={hu.encodeId} style={styles.containerColumn}>
                    <ListHub
                      bgColor={color_genter()}
                      onPress={() =>
                        navigation.navigate('Album', {
                          id: hu.encodeId,
                          type: false,
                          title: hu.title,
                          artist: hu.artistsNames,
                          release_data: hu.releaseDate,
                          image: hu.thumbnailM
                        })
                      }
                      ListData={hu}
                    />
                  </View>
                ))}
            </>
          )}
        </View>
      </Animated.ScrollView>
    </SafeAreaView>
  );
};

Hub.propTypes = {
  // required
  navigation: PropTypes.object.isRequired,
  route: PropTypes.object.isRequired
};

const styles = StyleSheet.create({
  containerRow: {
    flex: 1,
    marginTop: 20,
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginLeft: 24
  },
  containerColumn: {
    width: '50%'
  },
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

  image: {
    marginLeft: device.width / 4.5,
    height: 200,
    marginBottom: device.web ? 0 : 16,
    width: 200,
    borderRadius: 10,
    shadowColor: colors.brandPrimary,
    shadowOffset: { height: 8, width: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 6
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
    textAlign: 'center',
    marginTop: 20
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

export default Hub;
