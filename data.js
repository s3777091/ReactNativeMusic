const Domain = "http://192.168.50.127:3000";


const Home = "/page?page=";

const NewConcept = "/new?type=";
const VideoLink = "/video?id=";
const AlbumLink = "/album?id=";

const Home_Chart = "/api/v2/get_home_chart";
const ALBUM = "/api/v2/get_album";

//Music
const Play_List = "/api/v2/get_play_list?code=";
const Artist_List = "/api/v2/get_artists?code=";


const PLAY_MP3 = "/api/v2/get_listen?code=";

const MP3_LYRIC = "/api/v2/get_lyric?code=";

const Search = "/api/v2/get_search?code="
const GET_Hub = "/api/v2/get_hub_detail?code=";
//Radio PodCast
const Radio = "/api/v2/get_radio";
const PodCastDetail = "/api/v2/pod_cast?code=";

const PodCastEpisode = "/api/v2/pod_cast_episode?code=";
const PodCastListen = "/api/v2/listen_pod_cast?code=";

const lang = "&language=vi";
const SuggestKey = `https://ac.zingmp3.vn/v1/web/suggestion-keywords?num=10&query=`

const artistData = [
    {
        "id": 1,
        "name": "Binz",
        "alias": "Binz",
        "image": "https://photo-resize-zmp3.zmdcdn.me/w240_r1x1_webp/avatars/e/a/4/c/ea4ca7a50bf66cc91b650a8399554f0d.jpg"
    },
    {
        "id": 2,
        "name": "Hoàng Thùy Linh",
        "alias": "Hoang-Thuy-Linh",
        "image": "https://photo-resize-zmp3.zmdcdn.me/w240_r1x1_webp/avatars/1/7/4/1/1741879554929eba1c94675a71a6baea.jpg"
    },
    {
        "id": 3,
        "name": "SOOBIN",
        "alias": "SOOBIN",
        "image": "https://photo-resize-zmp3.zmdcdn.me/w240_r1x1_webp/avatars/3/d/8/6/3d86de0d52fe728dc36351463c4bb543.jpg"
    },
    {
        "id": 4,
        "name": "BLACKPINK",
        "alias": "BLACKPINK",
        "image": "https://photo-resize-zmp3.zmdcdn.me/w240_r1x1_jpeg/avatars/7/1/0/3/71031e4984f431fe18cf18cc19af2e9d.jpg"
    },
    {
        "id": 5,
        "name": "HIEUTHUHAI",
        "alias": "HIEUTHUHAI",
        "image": "https://photo-resize-zmp3.zmdcdn.me/w240_r1x1_jpeg/avatars/b/f/9/6/bf969389e9de70560cede36559c8ca4a.jpg"
    },
    {
        "id": 8,
        "name": "The Weeknd",
        "alias": "The-Weeknd",
        "image": "https://photo-resize-zmp3.zmdcdn.me/w240_r1x1_jpeg/avatars/9/4/6/d/946d6011cd47896e15c2cb2a75b60e07.jpg"
    },
    {
        "id": 6,
        "name": "Ariana Grande",
        "alias": "Ariana-Grande",
        "image": "https://photo-resize-zmp3.zmdcdn.me/w240_r1x1_jpeg/avatars/7/e/0/4/7e04e3a66d79ca0a0e45118c33711030.jpg"
    },
    {
        "id": 7,
        "name": "Hương Ly",
        "alias": "Nguyen-Huong-Ly",
        "image": "https://photo-resize-zmp3.zmdcdn.me/w240_r1x1_jpeg/avatars/e/f/8/4/ef84f25bebe0bb917735de836a3e417f.jpg"
    }
]



export default {
    Domain,
    Home,
    NewConcept,
    VideoLink,
    AlbumLink,

    artistData,
    Home_Chart,
    Play_List,
    Artist_List,
    PLAY_MP3,
    Search,
    ALBUM,
    GET_Hub,
    Radio,
    PodCastDetail,
    PodCastEpisode,
    PodCastListen,
    MP3_LYRIC,
    SuggestKey,
    lang
}