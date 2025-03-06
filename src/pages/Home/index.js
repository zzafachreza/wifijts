import React, { useEffect, useState, useRef } from 'react';
import {
  StyleSheet,
  Text,
  View,
  Image,
  Animated,
  ImageBackground,
  ScrollView,
  Dimensions,
  TouchableNativeFeedback,
} from 'react-native';
import { apiURL, getData, storeData } from '../../utils/localStorage';
import { colors, fonts, windowWidth } from '../../utils';
import axios from 'axios';
import { useToast } from 'react-native-toast-notifications';
import { Icon } from 'react-native-elements';
import 'intl';
import 'intl/locale-data/jsonp/id-ID';

const windowHeight = Dimensions.get('window').height;

const MyMenu = ({ onPress, img, label, desc }) => {
  return (
    <TouchableNativeFeedback onPress={onPress}>
      <View style={{
        marginVertical: 8,
        padding: 10,
        backgroundColor: colors.secondary,
        width: '100%',
        height: 100,
        borderRadius: 20,
        flexDirection: 'row',
        alignItems: 'center'
      }}>
        <Image style={{
          width: 60,
          height: 60,
          alignSelf: "center",
          resizeMode: 'contain'
        }} source={img} />
        <View style={{
          paddingLeft: 15,
          flex: 1,
        }}>
          <Text style={{
            fontFamily: fonts.secondary[800],
            fontSize: 16,
            color: colors.black,
          }}>{label}</Text>
          <Text style={{
            fontFamily: fonts.secondary[600],
            fontSize: 12,
            color: colors.black,
          }}>{desc}</Text>
        </View>
      </View>
    </TouchableNativeFeedback>
  )
}

export default function Home({ navigation, route }) {
  const [user, setUser] = useState({});
  const scrollX = useRef(new Animated.Value(0)).current; // Untuk animasi scroll
  const scrollViewRef = useRef(null); // Untuk mengontrol scroll view
  const [currentIndex, setCurrentIndex] = useState(0);
  const [mydashboard, setMyDashboard] = useState({
    saldo_utama: 0,
    saldo_bonus: 0,
    transaksi: []
  })

  const __getUser = () => {
    getData('user').then((u) => {
      setUser(u);
      __getDashboarData(u.token)
    });
  };



  const toast = useToast();
  const __getDashboarData = async (x) => {
    console.log(x)
    axios.request({
      method: 'get',
      maxBodyLength: Infinity,
      url: apiURL + '/dashboard',
      headers: {
        'Authorization': x
      },
      data: ''
    })
      .then((response) => {
        // console.log(response.data);
        setMyDashboard(response.data)

      })
      .catch((error) => {
        console.log(error);
      });
  }

  useEffect(() => {
    __getUser();
  }, [])

  return (
    <ImageBackground
      source={require('../../assets/bghome.png')}
      style={{
        flex: 1,
        backgroundColor: colors.primary,
        width: '100%',
        height: '100%',
      }}
    >
      <ScrollView>
        <View style={{ padding: 10, marginTop: 50 }}>
          {/* Sambutan & nama */}

          <View style={{
            padding: 10,

            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: "center"

          }}>

            <View>
              <Text style={{ fontFamily: fonts.secondary[600], fontSize: 16, color: colors.white }}>Halo, <Text style={{ fontFamily: fonts.secondary[800] }}>{user.nama}</Text></Text>
              <Text style={{ fontFamily: fonts.secondary[800], fontSize: 20, color: colors.secondary }}>{user.tipe !== 'reseller' ? 'Pelanggan' : 'Reseller'}</Text>
              <Text style={{ fontFamily: fonts.secondary[400], fontSize: 14, color: colors.white }}>Jaringan Teman Sejati</Text>

            </View>

            <View>
              <Image style={{
                height: 40,
                width: 80,
              }} source={require('../../assets/newlogo.png')} />
            </View>


          </View>
          {/* end headers */}
          <View style={{
            paddingVertical: 10,
            marginHorizontal: 10,
            flexDirection: 'row',
            justifyContent: 'space-between',
          }}>
            <View style={{
              flex: 1,
              marginHorizontal: 4,
              borderRadius: 10,
              backgroundColor: colors.white,
              width: windowWidth / 2.5,
              padding: 5,
              justifyContent: 'center',
              alignItems: 'center'
            }}>
              <View style={{
                flexDirection: 'row',
                alignItems: 'center',
                marginBottom: 5,
              }}>
                <Icon type='ionicon' name='wallet' size={15} color={colors.primary} />
                <Text style={{
                  left: 4,
                  fontFamily: fonts.secondary[600],
                  fontSize: 12,
                }}>Saldo</Text>
              </View>
              <Text style={{
                fontFamily: fonts.secondary[800],
                fontSize: 14,
              }}>Rp {new Intl.NumberFormat().format(mydashboard.saldo_utama)}</Text>
            </View>
            {user.tipe == 'reseller' &&
              <View style={{
                marginHorizontal: 4,
                borderRadius: 10,
                backgroundColor: colors.white,
                flex: 1,
                padding: 5,
                justifyContent: 'center',
                alignItems: 'center'
              }}>
                <View style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  marginBottom: 5,
                }}>
                  <Icon type='ionicon' name='gift' size={15} color={colors.danger} />
                  <Text style={{
                    left: 4,
                    fontFamily: fonts.secondary[600],
                    fontSize: 12,
                  }}>Bonus</Text>
                </View>
                <Text style={{
                  fontFamily: fonts.secondary[800],
                  fontSize: 14,
                }}>Rp {new Intl.NumberFormat().format(mydashboard.saldo_bonus)}</Text>
              </View>
            }
          </View>
          {/* menu */}
          <View style={{
            paddingHorizontal: 10,

            marginTop: '2%'
          }}>

            <MyMenu onPress={() => navigation.navigate('Beli', user)} desc="Pembelian Voucher Pelanggan" label="Beli Voucher" img={require('../../assets/icon_voucher.png')} />
            <MyMenu onPress={() => navigation.navigate('Riwayat', user)} desc="Riwayat Transaksi Voucher" label="History" img={require('../../assets/riwayat_icon.png')} />
            <MyMenu onPress={() => navigation.navigate('Printer', user)} desc="Pengaturan Printer" label="Printer" img={require('../../assets/printer.png')} />

          </View>

        </View>
      </ScrollView >
    </ImageBackground >
  );
}
