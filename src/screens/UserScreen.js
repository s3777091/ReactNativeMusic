import * as React from 'react';
import {
    Image,
    StyleSheet,
    Text,
    View,
    SectionList,
    SafeAreaView,
    FlatList,
    Animated,
    RefreshControl,
    ActivityIndicator,
    TouchableOpacity
} from 'react-native';

import PropTypes from 'prop-types';
import { colors, device, gStyle } from '../constants';
import con from '../../data';

import Context from '../context';


import { ProfileBody, ProfileButtons } from '../components/Design/ProfileBody';
import { FlashList } from '@shopify/flash-list';

const LikeLink = con.Domain.concat(con.allLike);

const userCheck = con.Domain.concat(con.userProfile);


const wait = (timeout) => {
    return new Promise((resolve) => setTimeout(resolve, timeout));
};

const UserScreen = ({ navigation, route }) => {
    const dataUser = route.params;

    const { currentSongData, showMusicBar, updateState } =
        React.useContext(Context);


    //Checking load
    const [isLoading, setLoading] = React.useState(true);

    const [refreshing, setRefreshing] = React.useState(false);


    const [check, setCheck] = React.useState();
    const [ListData, setListSongLike] = React.useState();

    
    const getCheck = async () => {
        const isMounted = true;
        try {
            const response = await fetch(userCheck.concat(dataUser.id));
            await response.json().then((ra) => {
                if (isMounted) setCheck(ra);
            });
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };



    const getData = async () => {
        const isMounted = true;
        try {
            const response = await fetch(LikeLink.concat(dataUser.id));
            await response.json().then((ra) => {
                if (isMounted) setListSongLike(ra.data);
            });
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const onRefresh = React.useCallback(() => {
        getData();
        setRefreshing(true);
        wait(500).then(() => {
            setRefreshing(false);
            setLoading(false);
        });
    }, []);


    React.useEffect(() => {
        getData();
        getCheck();
    }, []);

    const onChangeSong = async (songData) => {
        if (songData.Link === 'Album') {
            navigation.navigate('Album', {
                id: songData.encodeid,
                title: songData.name,
                artist: songData.artist,
                image: songData.image
            });
        } else {
            const songObject = {
                music_id: songData.encodeId,
                album: "User Like",
                artistsNames: songData.artistsNames,
                image: songData.image,
                length: songData.length,
                title: songData.name,
                songUrl: songData.Link
            }

            updateState('showMusicBar', !showMusicBar);
            updateState('currentSongData', songObject);

            navigation.navigate('ModalMusicPlayer');

        }

    };

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

                {isLoading ? (
                    <ActivityIndicator size="large" color="#00ff00" />
                ) : (
                    <>
                        <View style={{ width: '100%', height: '100%' }}>
                            <View style={{ width: '100%', padding: 10 }}>
                                <ProfileBody
                                    name={dataUser.name}
                                    accountName={dataUser.name}
                                    profileImage={dataUser.image}
                                    followers={check?.album}
                                    following="12"
                                    post={check?.song}
                                    navigation={navigation}
                                />
                            </View>
                            <View>
                                <Text
                                    style={{
                                        padding: 10,
                                        letterSpacing: 1,
                                        fontSize: 14,
                                        color: colors.greyLight

                                    }}>
                                    Like Song and Album
                                </Text>
                                <FlashList
                                    initialNumToRender={4}
                                    numColumns={3}
                                    contentContainerStyle={styles.containerContent}
                                    data={ListData}
                                    removeClippedSubviews
                                    estimatedItemSize={200}
                                    keyExtractor={(item) => item.encodeid}
                                    renderItem={({ item }) => (
                                        <TouchableOpacity
                                            activeOpacity={gStyle.activeOpacity}
                                            hitSlop={{ top: 10, left: 10, bottom: 10, right: 10 }}
                                            onPress={() => onChangeSong(item)}
                                            style={styles.itemDisplay}
                                        >
                                            <View
                                                style={styles.imageDisplay}
                                            >
                                                {item.image && (
                                                    <Image
                                                        source={{ uri: item.image }}
                                                        style={styles.imageDisplay}
                                                    />
                                                )}
                                            </View>
                                            <Text style={styles.title}>{item.name}</Text>
                                        </TouchableOpacity>
                                    )}
                                />
                            </View>
                        </View>

                    </>)}

            </Animated.ScrollView>
        </React.Fragment>

    );
};



UserScreen.propTypes = {
    // required
    navigation: PropTypes.object.isRequired
};
const styles = StyleSheet.create({
    containerContent: {
        alignItems: 'center'
    },
    container: {
        flex: 1,
        padding: 20,
    },
    coverImage: {
        height: 200,
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
    },
    avatarContainer: {
        alignItems: 'center',
        marginTop: 20,
    },
    avatar: {
        width: 120,
        height: 120,
        borderRadius: 60,
    },
    name: {
        fontSize: 20,
        fontWeight: 'bold',
        marginTop: 10,
        color: 'white'
    },
    content: {
        marginTop: 20,
    },
    itemDisplay: {
        margin: 10,
        width: 110
    },
    infoContainer: {
        marginTop: 20,
    },
    infoLabel: {
        fontWeight: 'bold',
        color: 'white'
    },
    infoValue: {
        marginTop: 5,
        color: 'white'
    },
    sectionHeader: {
        paddingTop: 2,
        paddingLeft: 10,
        paddingRight: 10,
        paddingBottom: 2,
        fontSize: 20,
        fontWeight: 'bold',
        color: "white"
    },
    item: {
        padding: 10,
        fontSize: 18,
        height: 44,
        color: "white"
    },
    imageDisplay: {
        height: 110,
        width: 110,
        borderRadius: 7
    },
    title: {
        ...gStyle.textSpotifyBold12,
        color: colors.white,
        marginTop: 4,
        textAlign: 'left'
    },

});

export default React.memo(UserScreen);