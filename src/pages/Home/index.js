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
import { apiURL, getData } from '../../utils/localStorage';
import { colors, fonts, windowWidth } from '../../utils';
import axios from 'axios';
import { useToast } from 'react-native-toast-notifications';


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

  const __getUser = () => {
    getData('user').then((u) => {
      setUser(u);
    });
  };

  useEffect(() => {
    __getUser();
  }, []);

  const toast = useToast();
  const __getDashboarData = async () => {
    try {
      const response = await axios.get(apiURL + 'beliVoucher', {}, {
        headers: {
          'Authorization': `${user.token}`
        }
      });

      console.log('hasil', `${user.token}`);

      if (response.data.status === 'success') {
        // aksi jika berhasil
        console.log(response.data);
      } else {
        toast.show(response.data.message);
      }
    } catch (error) {
      console.error('Error:', error);
      toast.show('Terjadi kesalahan, silakan coba lagi.');
    }
  }

  useEffect(() => {
    // __getDashboarData();
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
              <Text style={{ fontFamily: fonts.secondary[800], fontSize: 20, color: colors.secondary }}>{user.tipe}</Text>
              <Text style={{ fontFamily: fonts.secondary[400], fontSize: 14, color: colors.white }}>Jaringan Teman Sejati</Text>

            </View>

            <View>
              <Image style={{
                height: 50,
                width: 50,
              }} source={require('../../assets/logo.png')} />
            </View>

          </View>
          {/* end headers */}

          {/* menu */}
          <View style={{
            padding: 10,

            marginTop: '20%'
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
