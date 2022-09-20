import * as React from 'react';
import PropTypes from 'prop-types';
import {
  FlatList,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { colors, gStyle } from '../../constants';

const ArtistHorizontal = ({ ListData, heading, IsCircle }) => {
  const navigation = useNavigation();

  return (
    <View style={styles.container}>
      {heading && <Text style={styles.heading}>{heading}</Text>}
      {IsCircle ? (
        <FlatList
          horizontal
          contentContainerStyle={styles.containerContent}
          data={ListData}
          keyExtractor={(item) => item.id}
          showsHorizontalScrollIndicator={false}
          getItemLayout={(ListData, index) => ({
            length: 70,
            offset: 70 * index,
            index
          })}        
          removeClippedSubviews
          windowSize={50}
          renderItem={({ item, index }) => (
            <View
              style={{
                marginTop: 16,
                marginLeft: index === 0 ? 24 : 0,
                alignItems: 'center'
              }}
            >
              <TouchableOpacity
                onPress={() =>
                  navigation.navigate('Artist', { alias: item.alias })
                }
              >
                <Image
                  source={{ uri: item.thumbnail }}
                  style={styles.circle_image}
                />
                <Text style={styles.title}>{item.name}</Text>
              </TouchableOpacity>
            </View>
          )}
        />
      ) : (
        <FlatList
          contentContainerStyle={styles.containerContent}
          data={ListData}
          horizontal
          getItemLayout={(ListData, index) => ({
            length: 70,
            offset: 70 * index,
            index
          })}        
          removeClippedSubviews
          windowSize={50}
          keyExtractor={(item) => item.encodeId}
          renderItem={({ item }) => (
            <TouchableOpacity
              activeOpacity={gStyle.activeOpacity}
              hitSlop={{ top: 10, left: 10, bottom: 10, right: 10 }}
              onPress={() =>
                navigation.navigate('Album', {
                  id: item.encodeId,
                  type: false,
                  title: item.title,
                  artist: item.artistsNames,
                  release_data: item.releaseDate,
                  image: item.thumbnailM
                })
              }
              style={styles.item}
            >
              <View style={styles.image}>
                {item.thumbnail && (
                  <Image
                    source={{ uri: item.thumbnail }}
                    style={styles.image}
                  />
                )}
              </View>
              <Text style={styles.title}>{item.artistsNames}</Text>
            </TouchableOpacity>
          )}
          showsHorizontalScrollIndicator={false}
        />
      )}
    </View>
  );
};

ArtistHorizontal.defaultProps = {
  heading: null,
  IsCircle: false
};

ArtistHorizontal.propTypes = {
  // required
  data: PropTypes.any,
  IsCircle: PropTypes.bool,
  // optional
  heading: PropTypes.string
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 32,
    width: '100%'
  },
  containerContent: {
    paddingLeft: 16
  },
  heading: {
    ...gStyle.textSpotifyBold18,
    color: colors.white,
    paddingBottom: 6,
    paddingLeft: 12
  },
  item: {
    marginRight: 34,
    width: 148
  },
  image: {
    backgroundColor: colors.greyLight,
    width: 170,
    height: 222,
    borderRadius: 12
  },
  title: {
    ...gStyle.textSpotifyBold12,
    color: colors.white,
    marginTop: 4,
    textAlign: 'center'
  },

  circle_image: {
    width: 120,
    height: 120,
    borderRadius: 70,
    marginRight: 15
  }
});

export default ArtistHorizontal;