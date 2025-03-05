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
      padding: 0,
      backgroundColor: colors.white,
      justifyContent: 'center',
      position: 'relative'
    }}>

      <ImageBackground source={require('../../assets/bgsplash.png')} style={{
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: colors.primary,
        width: '100%',
        height: '100%'
      }}>

        <Animated.Image
          source={require('../../assets/logo.png')}
          resizeMode="contain"
          style={{
            transform: [{ scale: img }],
            width: windowWidth / 1.5,
            height: windowWidth / 1.5,
            marginTop: '30%'
          }}
        />

        <View style={{
          marginTop: '10%',
          alignItems: "center"
        }}>
          <Animated.Text style={{
            opacity: textOpacity,
            transform: [{ scale: textScale }],
            textAlign: 'center',
            color: colors.white,
            fontFamily: fonts.primary[600],
            fontSize: 20,
          }}>
            Jaringan Teman Sejati
          </Animated.Text>
        </View>

        <ActivityIndicator style={{ marginTop: 50 }} color={colors.primary} size="small" />

      </ImageBackground>

    </SafeAreaView>
  );
}

const styles = StyleSheet.create({});
