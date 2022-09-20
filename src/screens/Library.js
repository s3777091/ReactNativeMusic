import * as React from 'react';
import {
  Animated,
  StyleSheet,
  Text,
  StatusBar,
  View,
  ActivityIndicator
} from 'react-native';
import { colors, gStyle } from '../constants';

// components
import PlaylistItem from '../components/PlaylistItem';

import { useNavigation } from '@react-navigation/native';
import con from '../../data';
import { SafeAreaView } from 'react-native-safe-area-context';
const link = con.Domain.concat(con.ALBUM);
const Library = () => {
  const [dataAlbum, SetDataAlbums] = React.useState();
  const [isLoading, setLoading] = React.useState(true);

  const GetListAblum = async () => {
    const isMounted = true;
    try {
      const response = await fetch(link);
      const json = await response.json();
      const responseHome = await fetch(json.album);
      await responseHome.json().then((dataHome) => {
        if (isMounted) SetDataAlbums(dataHome.data);
      });
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  React.useEffect(() => {
    GetListAblum();
  }, []);

  const navigation = useNavigation();
  const scrollY = React.useRef(new Animated.Value(0)).current;

  return (
    <SafeAreaView style={{ flex: 1, marginTop: StatusBar.currentHeight || 0 }}>
      <Animated.ScrollView
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { y: scrollY } } }],
          { useNativeDriver: false }
        )}
        scrollEventThrottle={16}
        showsVerticalScrollIndicator={false}
        stickyHeaderIndices={[1]}
        style={gStyle.container}
      >
        <View style={gStyle.spacer2} />

        <View style={styles.containerHeader}>
          <View style={gStyle.spacer3} />
        </View>

        <Text style={styles.sectionHeading}>Tâm trạng và Hoạt Động: </Text>
        <View style={styles.containerRow}>
          {isLoading ? (
            <ActivityIndicator />
          ) : (
            <>
              {dataAlbum.topTopic &&
                dataAlbum.topTopic.map((genres) => (
                  <View key={genres.encodeId} style={styles.containerColumn}>
                    <PlaylistItem
                      onPress={() =>
                        navigation.navigate('Hub', {
                          final_Id: genres.encodeId,
                          image: genres.thumbnailR,
                          tabTitle: genres.title
                        })
                      }
                      ListData={genres}
                    />
                  </View>
                ))}
            </>
          )}
        </View>

        <Text style={styles.sectionHeading}>Quốc Gia</Text>
        <View style={styles.containerRow}>
          {isLoading ? (
            <ActivityIndicator />
          ) : (
            <>
              {dataAlbum.nations &&
                dataAlbum.nations.map((n) => (
                  <View key={n.encodeId} style={styles.containerColumn}>
                    <PlaylistItem
                      onPress={() =>
                        navigation.navigate('Hub', {
                          final_Id: n.encodeId,
                          image: n.thumbnailR,
                          tabTitle: n.title
                        })
                      }
                      ListData={n}
                    />
                  </View>
                ))}
            </>
          )}
        </View>

        <Text style={styles.sectionHeading}>Thể loại</Text>
        <View style={styles.containerRow}>
          {isLoading ? (
            <ActivityIndicator />
          ) : (
            <>
              {dataAlbum.genre &&
                dataAlbum.genre.map((genres) => (
                  <View key={genres.encodeId} style={styles.containerColumn}>
                    <PlaylistItem
                      onPress={() =>
                        navigation.navigate('Hub', {
                          final_Id: genres.encodeId,
                          image: genres.thumbnailR,
                          tabTitle: genres.title
                        })
                      }
                      ListData={genres}
                    />
                  </View>
                ))}
            </>
          )}
        </View>

        <Text style={styles.sectionHeading}>Chủ đề</Text>
        <View style={styles.containerRow}>
          {isLoading ? (
            <ActivityIndicator />
          ) : (
            <>
              {dataAlbum.topic &&
                dataAlbum.topic.map((genres) => (
                  <View key={genres.encodeId} style={styles.containerColumn}>
                    <PlaylistItem
                      onPress={() =>
                        navigation.navigate('Hub', {
                          final_Id: genres.encodeId,
                          image: genres.thumbnailR,
                          tabTitle: genres.title
                        })
                      }
                      ListData={genres}
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

const styles = StyleSheet.create({
  containerHeader: {
    position: 'absolute',
    top: 0,
    width: '100%',
    zIndex: 10
  },
  sectionHeading: {
    ...gStyle.textSpotifyBold18,
    color: colors.white,
    marginBottom: 24,
    marginLeft: 24,
    marginTop: 16
  },
  containerRow: {
    flex: 1,
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginLeft: 24
  },
  containerColumn: {
    width: '50%'
  }
});

export default Library;
