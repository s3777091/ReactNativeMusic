import { Image } from 'react-native';
import { Asset } from 'expo-asset';
import * as Font from 'expo-font';

import preloadFonts from './preloadFonts';
// cache fonts
// /////////////////////////////////////////////////////////////////////////////
const cacheFonts = (fonts) => fonts.map((font) => Font.loadAsync(font));

// cache images
// /////////////////////////////////////////////////////////////////////////////
const cacheImages = (images) =>
  Object.values(images).map((image) => {
    if (typeof image === 'string') {
      return Image.prefetch(image);
    }

    return Asset.fromModule(image).downloadAsync();
  });

// preload async
// /////////////////////////////////////////////////////////////////////////////
const loadAssetsAsync = async () => {
  // preload assets
  const fontAssets = cacheFonts(preloadFonts);

  // promise load all
  return Promise.all([...fontAssets]);
};

// format seconds
// /////////////////////////////////////////////////////////////////////////////
const formatTime = (sec) => {
  const padTime = (num, size) => `000${num}`.slice(size * -1);
  const time = parseFloat(sec).toFixed(3);
  const minutes = Math.floor(time / 60) % 60;
  const seconds = Math.floor(time - minutes * 60);

  return `${padTime(minutes, 1)}:${padTime(seconds, 2)}`;
};


const millisToMinutesAndSeconds = (millis) => {
  const minutes = Math.floor(millis / 60000);
  const seconds = ((millis % 60000) / 1000).toFixed(0);
  return minutes + ':' + seconds;
}


export default {
  cacheFonts,
  cacheImages,
  loadAssetsAsync,
  formatTime,
  millisToMinutesAndSeconds
};
