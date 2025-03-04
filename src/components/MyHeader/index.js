import React, { useRef, useEffect, useState } from 'react';
import { StyleSheet, Text, View, Image, TouchableOpacity, Modal, ImageBackground } from 'react-native';
import { MyDimensi, colors, fonts, windowWidth, Color } from '../../utils';
import { useNavigation } from '@react-navigation/native';
import { Icon } from 'react-native-elements';
import { getData } from '../../utils/localStorage';
import MyMenu from '../MyMenu';
export default function MyHeader({ onPress, color = colors.primary, title, icon = false, iconname = 'search' }) {
  const navigation = useNavigation();
  return (


    <View  style={{
      marginTop: 0,
      marginHorizontal: 0,
      flexDirection: 'row',
      alignItems: 'flex-end',
      paddingVertical: 20,
      backgroundColor: colors.secondary,
      padding: 20,
      justifyContent: 'center',


    }}>

      <TouchableOpacity onPress={() => navigation.goBack()} style={{


        justifyContent: 'center',
        alignItems: 'center',
        padding: 10,
      }}>
        <Icon type='ionicon' name='arrow-back-outline' size={20} color={color} />
      </TouchableOpacity>


      <Text style={{
        ...fonts.headline2,
        flex: 1,
        textAlign: 'center',
        marginLeft: -20,

        color: color
      }}>{title}</Text>

      {icon &&
        <TouchableOpacity onPress={onPress} style={{

        }}>
          <Icon name={iconname} size={20} color={color} />
        </TouchableOpacity>
      }
    </View>

  );
}

const styles = StyleSheet.create({});
