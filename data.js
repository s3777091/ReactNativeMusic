const Domain = "https://kimusic.live";
const Home = "/api/v2/get_home";
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


export default{
    Domain,
    Home,
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