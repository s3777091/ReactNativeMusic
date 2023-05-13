const Domain = "https://kishop.store";
// const Domain = "http://192.168.0.149:3000"

const Home = "/page?page=";
const VideoLink = "/video?id=";
const AlbumLink = "/album?id=";
const StreamLink = "/mp3?id=";
const LyrickLink = "/lyrick?id=";
const ArtistLink = "/artist?alias=";
const HubLink = "/hub";

const HubDetal = '/hub/detail?id=';

const Login = '/users/login';
const Register = '/users/register';

const allLike = '/users/like?id=';


const AlbumLike = '/users/albumlike';
const SongLike = '/users/songlike';

const userProfile = '/users/count?id='
const SearchLink = "/search?key=";
const lang = "&language=vi";
const SuggestKey = `https://ac.zingmp3.vn/v1/web/suggestion-keywords?num=10&query=`

const artistData = [
    {
        "id": 1,
        "name": "Binz",
        "alias": "Binz",
        "thumbnail": "https://photo-resize-zmp3.zmdcdn.me/w240_r1x1_webp/avatars/e/a/4/c/ea4ca7a50bf66cc91b650a8399554f0d.jpg"
    },
    {
        "id": 2,
        "name": "Hoàng Thùy Linh",
        "alias": "Hoang-Thuy-Linh",
        "thumbnail": "https://photo-resize-zmp3.zmdcdn.me/w240_r1x1_webp/avatars/1/7/4/1/1741879554929eba1c94675a71a6baea.jpg"
    },
    {
        "id": 3,
        "name": "SOOBIN",
        "alias": "SOOBIN",
        "thumbnail": "https://photo-resize-zmp3.zmdcdn.me/w240_r1x1_webp/avatars/3/d/8/6/3d86de0d52fe728dc36351463c4bb543.jpg"
    },
    {
        "id": 4,
        "name": "BLACKPINK",
        "alias": "BLACKPINK",
        "thumbnail": "https://photo-resize-zmp3.zmdcdn.me/w240_r1x1_jpeg/avatars/7/1/0/3/71031e4984f431fe18cf18cc19af2e9d.jpg"
    },
    {
        "id": 5,
        "name": "HIEUTHUHAI",
        "alias": "HIEUTHUHAI",
        "thumbnail": "https://photo-resize-zmp3.zmdcdn.me/w240_r1x1_jpeg/avatars/b/f/9/6/bf969389e9de70560cede36559c8ca4a.jpg"
    },
    {
        "id": 8,
        "name": "The Weeknd",
        "alias": "The-Weeknd",
        "thumbnail": "https://photo-resize-zmp3.zmdcdn.me/w240_r1x1_jpeg/avatars/9/4/6/d/946d6011cd47896e15c2cb2a75b60e07.jpg"
    },
    {
        "id": 6,
        "name": "Ariana Grande",
        "alias": "Ariana-Grande",
        "thumbnail": "https://photo-resize-zmp3.zmdcdn.me/w240_r1x1_jpeg/avatars/7/e/0/4/7e04e3a66d79ca0a0e45118c33711030.jpg"
    },
    {
        "id": 7,
        "name": "Hương Ly",
        "alias": "Nguyen-Huong-Ly",
        "thumbnail": "https://photo-resize-zmp3.zmdcdn.me/w240_r1x1_jpeg/avatars/e/f/8/4/ef84f25bebe0bb917735de836a3e417f.jpg"
    }
]


export default {
    Domain,
    Home,
    VideoLink,
    AlbumLink,
    StreamLink,
    HubLink,
    HubDetal,
    ArtistLink,
    SearchLink,
    LyrickLink,
    artistData,
    AlbumLike,
    Register,
    allLike,
    Login,
    userProfile,
    SongLike,
    SuggestKey,
    lang
}