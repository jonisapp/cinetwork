import React from 'react';
import { View, Text, Animated, StyleSheet, Dimensions } from 'react-native';
import { PropTypes } from 'prop-types';

class DistributionDiagram extends React.Component {
  state = {
    renderDiagramMaximized: false,
    containerWidth: 0,
    animationHeight: new Animated.Value(this.props.height),
    animationWidth: new Animated.Value(0),
    animationBar: new Animated.Value(0),
    isFirstRender: true
  }

  componentDidUpdate() {
    if(this.state.containerWidth !== 0) {
      this._toggleMaximize(this.props.maximized);
    }
    Object.keys(this.ranges).forEach((range, i) => {
      this._animateBar(this.ranges[range].animatedValue, this.ranges[range].animatedOpacity, this.ranges[range].value, i);
    });
  }

  _animateBar(animationValue, animationOpacity, size, index) {
    animationOpacity.setValue(0);
    const delay = !this.state.isFirstRender ? 1000 : index * (500 / this.props.steps);
    const speed = 1;
    Animated.spring(animationOpacity, {
      toValue: 1,
      delay, speed, 
    }).start();
    Animated.spring(animationValue, {
      toValue: this.props.maximized ? this.heightFactor * size * 5 : this.heightFactor * size,
      delay, speed
    }).start();
  }

  _toggleMaximize(maximized) {
    Animated.spring(this.state.animationHeight, {
      toValue: (maximized ? 270 - 79 -20 : this.props.height)
    }).start();
    Animated.spring(this.state.animationWidth, {
      toValue: (maximized ? Dimensions.get('window').width / 2.5 - 30  : this.state.containerWidth),
      speed: 4
    }).start();
  } //tension: 100, speed: 100, stiffness: 25, useNativeDriver: true

  _setContainerWidthHandler(e) {
    if(this.state.containerWidth === 0) {
      this.setState({
        containerWidth: e.nativeEvent.layout.width,
      });
    }
  }

  _renderDiagram(ranges, height, activeColor, inactiveColor, maximized, stepValue) {
    this.ranges = ranges;
    return Object.keys(ranges).sort((a, b) => a.value > b.value ? 1 : -1).map((range, index) => {
      return (
        <View key={index} style={styles.bar}>
          {
            maximized && ranges[range].value > 0 &&
            <View style={{height: 14}}>
              {
                <Text style={{textAlign: 'center', color: 'white', fontSize: 8}}>{ ranges[range].value }</Text>
              }
            </View>
          }
          <Animated.View
            style={(() => {
              if(ranges[range].value > 0) {
                const animatedStyle = {
                  height: ranges[range].animatedValue,
                  opacity: ranges[range].animatedOpacity
                };
                return [{ backgroundColor: activeColor }, animatedStyle];
              }
              else {
                return [
                  {height: height / 10, backgroundColor: inactiveColor},
                  {opacity: ranges[range].animatedOpacity}
                ]
              }
            })()}>
          </Animated.View>
          {
            maximized && 
            <View style={{height: 14}}>
              {
                parseFloat(index * stepValue + stepValue) % (2 * stepValue) === 0 &&
                <Text style={{textAlign: 'right', color: 'white', fontSize: 12}}>{ parseFloat(index * stepValue + stepValue) }</Text>
              }
            </View>
          }
        </View>
      );
    })
  }

  render() {
    const { height, values, steps, stepValue, activeColor, inactiveColor, maximized } = this.props;
    let ranges = {};

    for(let i = 0; i < steps; ++i) {
      ranges[(i * stepValue).toString()] = { value: 0 };
    }

    values.forEach(rating => {
      for(let i = 0; i < steps; ++i) {
        if(rating > i * stepValue && rating <= i * stepValue + stepValue) {
          ranges[(i * stepValue).toString()].value = ranges[(i * stepValue).toString()].value + 1;
        }
      }
    });

    let maxRatingsCount = 0;

    Object.keys(ranges).sort((a, b) => a.value > b.value ? 1 : -1).forEach(range => {
      ranges[range].animatedValue = new Animated.Value(15);
      ranges[range].animatedOpacity = new Animated.Value(0);
      if(maxRatingsCount < ranges[range].value) {
        maxRatingsCount = ranges[range].value;
      }
    });

    this.heightFactor = height / maxRatingsCount;

    let containerAnimationStyle = {
      height: this.state.animationHeight,
      width: this.state.animationWidth
    };

    return (
      <React.Fragment>
        {
          this.state.containerWidth !== 0 ?
          <Animated.View
            style={[styles.container, containerAnimationStyle]}
          >
            {
              this._renderDiagram(ranges, height, activeColor, inactiveColor, maximized, stepValue)
            }
          </Animated.View>
          :
          <View style={styles.container} onLayout={this._setContainerWidthHandler.bind(this)}>
          {
            this._renderDiagram(ranges, height, 'rgba(0, 0, 0, 0)', 'rgba(0, 0, 0, 0)', maximized, stepValue)
          }
          </View>
        }
      </React.Fragment>
    );
  }
}

DistributionDiagram.propTypes = {
  values: PropTypes.arrayOf(PropTypes.number),
  height: PropTypes.number,
  steps: PropTypes.number,
  stepValue: PropTypes.number,
  activeColor: PropTypes.string,
  inactiveColor: PropTypes.string
};

DistributionDiagram.defaultProps = {
  values: [0.25, 4.5, 3.4, 3.6, 3.9, 4.2, 2.3, 3.3, 4.7, 3.3, 1.4, 2.7, 3.2, 3.9, 3.3, 2.7, 3.4], //demo dataset
  height: 20,
  steps: 10,
  stepValue: 0.5,
  activeColor: 'white',
  inactiveColor: 'rgba(255, 255, 255, 0.3)'
}

const styles = StyleSheet.create({
  container: {
    marginTop: 5,
    marginLeft: 10,
    flexDirection: 'row',
    alignItems: 'flex-end'
  },
  bar: {
    marginHorizontal: 1,
    flex: 1
  }
});

export default DistributionDiagram;