import * as React from 'react';
import PropTypes from 'prop-types';
import {
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { colors, gStyle } from '../../constants';



import { FlashList } from "@shopify/flash-list";
import Context from '../../context';
//Data ? Heading ? tagline ? IsBigThumbnail ? IsPodCast
const AlbumNewsDays = ({
  ListData,
  heading,
  tagline,
  IsPodCast
}) => {
  const navigation = useNavigation();

  const { updateState } = React.useContext(Context);

  return (
    <View style={styles.container}>
      {heading && <Text style={styles.heading}>{heading}</Text>}
      {tagline && <Text style={styles.tagline}>{tagline}</Text>}

      <FlashList
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
        estimatedItemSize={200}
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
                    image: item.thumbnailM
                  });
                }}
                style={styles.itemDisplay}
              >
                <View
                  style={styles.imageDisplay}
                >
                  {item.thumbnail && (
                    <Image
                      source={{ uri: item.thumbnail }}
                      style={styles.imageDisplay}
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
                style={styles.radio}
              >
                <View
                  style={styles.radioImage}
                >
                  {item.thumbnail && (
                    <Image
                      source={{ uri: item.thumbnail }}
                      style={styles.radioImage}
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
  tagline: null
};

AlbumNewsDays.propTypes = {
  // required
  ListData: PropTypes.any,
  IsPodCast: PropTypes.bool,
  // optional
  heading: PropTypes.string,
  tagline: PropTypes.string
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 17,
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
  itemDisplay: {
    marginRight: 16,
    width: 155
  },
  imageDisplay: {
    backgroundColor: colors.greyLight,
    height: 155,
    width: 155,
    borderRadius: 15
  },
  title: {
    ...gStyle.textSpotifyBold12,
    color: colors.white,
    marginTop: 4,
    textAlign: 'left'
  },

  radio: {
    marginRight: 16,
    width: 155,
  },

  radioImage: {
    backgroundColor: colors.greyLight,
    height: 155,
    width: 155,
    borderRadius: 100
  }
});

export default React.memo(AlbumNewsDays);
