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

const Banner = ({
    ListData,
    heading
}) => {

    const navigation = useNavigation();

    return (
        <View style={styles.container}>
            {heading && <Text style={styles.heading}>{heading}</Text>}
            <FlashList
                initialNumToRender={4}
                contentContainerStyle={styles.containerContent}
                data={ListData}
                horizontal
                getItemLayout={(_ListData, index) => ({
                    length: 70,
                    offset: 70 * index,
                    index
                })}
                estimatedItemSize={200}
                windowSize={50}
                removeClippedSubviews
                keyExtractor={(item) => item.encodeId}
                renderItem={({ item }) => (
                    <TouchableOpacity
                        activeOpacity={gStyle.activeOpacity}
                        hitSlop={{ top: 10, left: 10, bottom: 10, right: 10 }}
                        onPress={() => {
                            navigation.navigate('Album', {
                                id: item.encodeId,
                                image: item.banner
                            });
                        }}
                        style={styles.Big_item}
                    >
                        <View
                            style={styles.Big_image}
                        >
                            {item.banner && (
                                <Image
                                    source={{ uri: item.banner }}
                                    style={styles.Big_image}
                                />
                            )}
                        </View>
                    </TouchableOpacity>
                )}
                showsHorizontalScrollIndicator={false}
            />
        </View>
    );
};

Banner.defaultProps = {
    heading: null,
};

Banner.propTypes = {
    ListData: PropTypes.any,
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
        paddingLeft: 15
    },
    Big_item: {
        marginRight: 15,
        width: 280
    },
    Big_image: {
        backgroundColor: colors.greyLight,
        height: 160,
        width: 280,
        borderRadius: 20
    }
});

export default React.memo(Banner);
