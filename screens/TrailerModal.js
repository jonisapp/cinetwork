import React, { useEffect } from 'react';
import { View, StyleSheet } from 'react-native';
import { WebView } from 'react-native-webview';
import { ScreenOrientation } from 'expo';

export default TrailerScreen = ({ navigation }) => {
  const trailerYoutubeId = navigation.getParam('trailerYoutubeId');

  const applyLandscapeScreenOrientation = async () => {
    await ScreenOrientation.lockAsync(ScreenOrientation.Orientation.LANDSCAPE);
  }

  const applyPortraitScreenOrientation = (orientation) => {
    return ScreenOrientation.lockAsync(ScreenOrientation.Orientation.PORTRAIT);
  }

  useEffect(() => {
    applyLandscapeScreenOrientation();
    return async () => await applyPortraitScreenOrientation();
  }, [applyPortraitScreenOrientation, applyLandscapeScreenOrientation]);

  return (
    <View style={styles.screen}>
      <WebView
        style={{flex:1}}
        javaScriptEnabled={true}
        source={{uri: `https://www.youtube.com/embed/${trailerYoutubeId}?&modestbranding=1&rel=0&playsinline=1&autoplay=1&fs=0&showinfo=0&controls=2`}}
        allowsInlineMediaPlayback={true}
        mediaPlaybackRequiresUserAction={false}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    width: '100%'
  }
});