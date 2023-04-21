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

const ArtistHorizontal = ({ ListData, heading }) => {
  const navigation = useNavigation();

  return (
    <View style={styles.container}>
      {heading && <Text style={styles.heading}>{heading}</Text>}

      <FlatList
        horizontal
        contentContainerStyle={styles.containerContent}
        data={ListData}
        keyExtractor={(item) => item.id}
        showsHorizontalScrollIndicator={false}
        getItemLayout={(_ListData, index) => ({
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
                source={{ uri: item.image }}
                style={styles.circle_image}
              />
              <Text style={styles.title}>{item.name}</Text>
            </TouchableOpacity>
          </View>
        )}
      />

    </View>
  );
};

ArtistHorizontal.defaultProps = {
  heading: null
};

ArtistHorizontal.propTypes = {
  // required
  data: PropTypes.any,
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
    width: 90,
    height: 90,
    borderRadius: 90,
    marginRight: 15
  }
});

export default React.memo(ArtistHorizontal);