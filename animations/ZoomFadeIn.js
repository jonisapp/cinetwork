import React, { useState, useEffect } from 'react';
import { Animated, View } from 'react-native';

const ZoomFadeIn_animation = (props) => {
  const [opacity] = useState(new Animated.Value(0));

  const animatedTiming = Animated.timing(opacity, {
    toValue: 1,
    duration: 1000,
    delay: 50,
    useNativeDriver: true
  })

  useEffect(() => {
    animatedTiming.start();
  }, []);

  return (
    <Animated.View
      style={[
        {
          opacity
        }
      ]}
    >
      <View style={{padding: 10}}>
        { props.children }
      </View>
    </Animated.View>
  );
}

export default ZoomFadeIn_animation;