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

import Context from '../../context';
//Data ? Heading ? tagline ? IsBigThumbnail ? IsPodCast
const AlbumNewsDays = ({
  ListData,
  heading,
  tagline,
  IsBigThumbnail,
  IsPodCast
}) => {
  const navigation = useNavigation();

  const { updateState } = React.useContext(Context);

  return (
    <View style={styles.container}>
      {heading && <Text style={styles.heading}>{heading}</Text>}
      {tagline && <Text style={styles.tagline}>{tagline}</Text>}

      <FlatList
        initialNumToRender={4}
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
          <>
            {!IsPodCast ? (
              <TouchableOpacity
                activeOpacity={gStyle.activeOpacity}
                hitSlop={{ top: 10, left: 10, bottom: 10, right: 10 }}
                onPress={() => {
                  navigation.navigate('Album', {
                    id: item.encodeId,
                    type: false,
                    title: item.title,
                    artist: item.artistsNames,
                    release_data: item.releaseDate,
                    image: item.thumbnailM
                  });
                }}
                style={IsBigThumbnail ? styles.Big_item : styles.Small_item}
              >
                <View
                  style={IsBigThumbnail ? styles.Big_image : styles.Small_image}
                >
                  {item.thumbnail && (
                    <Image
                      source={{ uri: item.thumbnail }}
                      style={
                        IsBigThumbnail ? styles.Big_image : styles.Small_image
                      }
                    />
                  )}
                </View>
                <Text style={styles.title}>{item.title}</Text>
              </TouchableOpacity>
            ) : (
              <TouchableOpacity
                activeOpacity={gStyle.activeOpacity}
                hitSlop={{ top: 10, left: 10, bottom: 10, right: 10 }}
                onPress={() => {
                  navigation.navigate('Album', {
                    id: item.encodeId,
                    type: true,
                    title: item.title,
                    artist: item.artists[0].name,
                    release_data: '',
                    image: item.thumbnail
                  });
                }}
                style={IsBigThumbnail ? styles.Big_item : styles.Small_item}
              >
                <View
                  style={IsBigThumbnail ? styles.Big_image : styles.Small_image}
                >
                  {item.thumbnail && (
                    <Image
                      source={{ uri: item.thumbnail }}
                      style={
                        IsBigThumbnail ? styles.Big_image : styles.Small_image
                      }
                    />
                  )}
                </View>
                <Text style={styles.title}>{item.title}</Text>
              </TouchableOpacity>
            )}
          </>
        )}
        showsHorizontalScrollIndicator={false}
      />
    </View>
  );
};

AlbumNewsDays.defaultProps = {
  heading: null,
  tagline: null,
  IsBigThumbnail: false
};

AlbumNewsDays.propTypes = {
  // required
  ListData: PropTypes.any,
  IsPodCast: PropTypes.bool,
  IsBigThumbnail: PropTypes.bool,
  // optional
  heading: PropTypes.string,
  tagline: PropTypes.string
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
  tagline: {
    ...gStyle.textSpotify12,
    color: colors.greyInactive,
    paddingBottom: 6,
    paddingLeft: 12
  },
  Small_item: {
    marginRight: 16,
    width: 148
  },
  Big_item: {
    marginRight: 30,
    width: 200
  },
  Big_image: {
    backgroundColor: colors.greyLight,
    height: 220,
    width: 210,
    borderRadius: 20
  },

  Small_image: {
    backgroundColor: colors.greyLight,
    height: 148,
    width: 148
  },
  title: {
    ...gStyle.textSpotifyBold12,
    color: colors.white,
    marginTop: 4,
    textAlign: 'center'
  }
});

export default AlbumNewsDays;
