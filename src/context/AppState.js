import React from 'react';
import PropTypes, { any, string } from 'prop-types';


// context
import Context from './index';

class AppState extends React.Component {
  constructor() {
    super();

    this.state = {
      onreset: false,
      TabLinkMusic: string,
      currentSongData: {
        music_id: 'ZZDI9B7U',
        album: 'Vì Mẹ Anh Bắt Chia Tay (Single)',
        artistsNames: 'Miu Lê, Karik, Châu Đăng Khoa',
        image:
          'https://photo-resize-zmp3.zmdcdn.me/w240_r1x1_jpeg/cover/1/b/8/9/1b8958017b04a663eb8c093905dd4d85.jpg',
        length: 262,
        title: 'Vì Mẹ Anh Bắt Chia Tay',
        songUrl: ''
      },
      specialPodCastData: any,
      isLoading: true,
      showMusicBar: false
    };


    this.updateState = this.updateState.bind(this);
  }

  // componentDidMount() {
  // }

  updateState(key, value) {
    this.setState({
      [key]: value
    });
  }

  render() {
    const { children } = this.props;

    // app state
    const {
      currentSongData,
      isLoading,
      showMusicBar,
    } = this.state;
    return (
      <Context.Provider
        value={{
          currentSongData,
          isLoading,
          showMusicBar,
          updateState: this.updateState
        }}
      >
        {children}
      </Context.Provider>
    );
  }
}

AppState.propTypes = {
  // required
  children: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.node),
    PropTypes.node
  ]).isRequired
};

export default AppState;
