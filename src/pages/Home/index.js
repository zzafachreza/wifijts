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
import { getData } from '../../utils/localStorage';
import { colors, fonts, windowWidth } from '../../utils';

const images = [
  { id: 1, src: require('../../assets/korosel-1.png'), label: 'Gambar 1' },
  { id: 2, src: require('../../assets/koresel-2.png'), label: 'Gambar 2' },
  { id: 3, src: require('../../assets/koresel-3.png'), label: 'Gambar 3' },
];

const windowHeight = Dimensions.get('window').height;

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
        <View style={{ padding: 10, marginTop:50}}>
          {/* Sambutan & nama */}

          <View style={{
            padding:10,
           
            flexDirection:'row',
            justifyContent:'space-between',
            alignItems:"center"

          }}>

          <View>
            <Text style={{fontFamily:fonts.primary[600], fontSize:20, color:colors.white}}>Halo, <Text style={{fontFamily:fonts.primary[400]}}>Fadhlan Himawan</Text></Text>
            <Text style={{fontFamily:fonts.primary[400], fontSize:15, color:colors.white}}>Jaringan Teman Sejati</Text>
          </View>

          <View>
            <Image style={{
              height:50,
              width:50,
            }} source={require('../../assets/logo.png')}/>
          </View>

          </View>
          {/* end headers */}

          {/* menu */}
          <View style={{
            padding:10,

            marginTop:'20%'
          }}>

          <View style={{
            flexDirection:'row',
            justifyContent:'space-between',
            alignItems:'center' 
          }}>

          <View>
            <TouchableNativeFeedback>
              <View style={{
                padding:10,
                backgroundColor:colors.secondary,
                width:120,
                height:120,
                borderRadius:20,
                alignContent:"center",
                justifyContent:'center'
              }}>
                <Image style={{
                  width:70,
                  height:70,
                  alignSelf:"center"
                }} source={require('../../assets/icon_voucher.png')}/>
                <Text style={{
                  fontFamily:fonts.primary[600],
                  fontSize:12,
                  textAlign:"center"
                }}>Beli Voucher</Text>
              </View>
            </TouchableNativeFeedback>
          </View>

          <View>
            <TouchableNativeFeedback>
              <View style={{
                padding:10,
                backgroundColor:colors.secondary,
                width:120,
                height:120,
                borderRadius:20,
              }}>
                <Image style={{
                  width:70,
                  height:70,
                  alignSelf:"center"
                }} source={require('../../assets/pembelian.png')}/>
                <Text style={{
                  fontFamily:fonts.primary[600],
                  fontSize:12,
                  textAlign:"center"
                }}>Pembelian</Text>
              </View>
            </TouchableNativeFeedback>
          </View>

          </View>




          <View style={{
            flexDirection:'row',
            justifyContent:'space-between',
            alignItems:'center',
            marginTop:25
          }}>

          <View>
            <TouchableNativeFeedback>
              <View style={{
                padding:10,
                backgroundColor:colors.secondary,
                width:120,
                height:120,
                borderRadius:20,
              }}>

<Image style={{
                  width:70,
                  height:63,
                  alignSelf:"center"
                }} source={require('../../assets/suksesvoucher.png')}/>
                <Text style={{
                  fontFamily:fonts.primary[600],
                  fontSize:12,
                  textAlign:"center",
                  marginTop:10
                }}>Sukses Voucher</Text>
              </View>
            </TouchableNativeFeedback>
          </View>

          <View>
            <TouchableNativeFeedback>
              <View style={{
                padding:10,
                backgroundColor:colors.secondary,
                width:120,
                height:120,
                borderRadius:20,
              }}>
                
<Image style={{
                  width:70,
                  height:70,
                  alignSelf:"center"
                }} source={require('../../assets/riwayat_icon.png')}/>
                <Text style={{
                  fontFamily:fonts.primary[600],
                  fontSize:12,
                  textAlign:"center"
                }}>History</Text>
              </View>
            </TouchableNativeFeedback>
          </View>

          </View>
          </View>
        
        </View>
      </ScrollView>
    </ImageBackground>
  );
}
