import React, { useEffect } from 'react';
import {
  StyleSheet,
  Text,
  View,
  ActivityIndicator,
  Image,
  Animated,
  ImageBackground,
  SafeAreaView,
} from 'react-native';
import { MyButton, MyGap } from '../../components';
import { MyDimensi, colors, fonts, windowHeight, windowWidth } from '../../utils';
import { MYAPP, getData } from '../../utils/localStorage';
import MyLoading from '../../components/MyLoading';

export default function Splash({ navigation }) {
  const img = new Animated.Value(0.5);
  const textScale = new Animated.Value(0.5);
  const textOpacity = new Animated.Value(0);

  useEffect(() => {
    Animated.parallel([
      Animated.timing(img, {
        toValue: 1,
        duration: 750,
        useNativeDriver: true,
      }),
      Animated.timing(textScale, {
        toValue: 1,
        duration: 750,
        useNativeDriver: true,
      }),
      Animated.timing(textOpacity, {
        toValue: 1,
        duration: 750,
        useNativeDriver: true,
      })
    ]).start();

    setTimeout(() => {
      getData('user').then(u => {
        if (!u) {
          navigation.replace("Login");
        } else {
          navigation.replace("MainApp");
        }
      })
    }, 1200);
  }, []);

  return (
    <SafeAreaView style={{
      flex: 1,
      backgroundColor: colors.white,
      justifyContent: 'center',
      position: 'relative'
    }}>

      <ImageBackground source={require('../../assets/bgsplash.png')} style={{
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: colors.primary,
      }}>

        <View style={{
          // backgroundColor: 'red',
          justifyContent: 'center',
          alignItems: 'center',
          height: 250,

        }}>
          <Animated.Image
            source={require('../../assets/newlogo.png')}
            resizeMode="contain"
            style={{
              transform: [{ scale: img }],
              width: windowWidth / 1.2,
              height: windowWidth / 1.5,

            }}
          />



          <MyLoading />
        </View>

      </ImageBackground>

    </SafeAreaView>
  );
}

const styles = StyleSheet.create({});
