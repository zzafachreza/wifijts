import { SafeAreaView, ImageBackground, StyleSheet, Text, View, FlatList, Image, TouchableOpacity } from 'react-native'
import React, { useEffect, useState } from 'react'
import { Color, colors, fonts } from '../../utils'
import { MyButton, MyGap, MyInput, MyPicker } from '../../components'
import { useToast } from 'react-native-toast-notifications';
import MyLoading from '../../components/MyLoading';
import { apiURL, getData } from '../../utils/localStorage';
import axios from 'axios';
import DashedLine from 'react-native-dashed-line';
import { Icon } from 'react-native-elements';

import { BluetoothEscposPrinter, BluetoothManager } from 'react-native-bluetooth-escpos-printer';
import {
    USBPrinter,
    NetPrinter,
    BLEPrinter,
} from "react-native-thermal-receipt-printer";

export default function Detail({ navigation, route }) {
    const user = route.params.user;
    const transaksi = route.params.transaksi;
    console.log(transaksi);
    const [printer, setPrinter] = useState({});

    useEffect(() => {

        getData('printer').then(pr => setPrinter(pr))
    }, []);

    const printVoucher = async (x) => {

        const items = x;

        console.log(items);
        let voucher = items.voucher;
        let jenis = items.jenis_voucher;
        let pelanggan = items.nama_pelanggan




        BLEPrinter.init()
            .then(() => {
                BLEPrinter.connectPrinter(printer.kode)
                    .then(() => {
                        console.log('Printer terhubung:', printer.kode);
                        let printContent = '';
                        printContent += `<CB>${voucher}</CB>\n\n`;
                        printContent += `<C>${pelanggan}</C>\n`;
                        printContent += `<C>Jenis Voucher : ${jenis}</C>\n`;

                        BLEPrinter.printText(printContent);
                    })
                    .catch(err => {
                        console.error('Gagal menghubungkan ke printer:', err);
                    });
            })
            .catch(err => {
                console.error('Gagal menginisialisasi printer:', err);
            });



    }

    return (
        <ImageBackground
            source={require('../../assets/bghome.png')}
            style={{
                flex: 1,
                backgroundColor: colors.primary,
                width: '100%',
                height: '100%',
            }}>
            <View style={{
                flex: 1,
                marginTop: 30,
                padding: 10,

            }}>
                <Text style={{
                    ...fonts.headline2,
                    color: colors.white,
                    marginBottom: 0,
                }}>Informasi Voucher</Text>
                <Text style={{
                    ...fonts.body3,
                    color: colors.white,
                    marginBottom: 20,
                }}>{transaksi.length} Voucher</Text>

                <FlatList data={transaksi} renderItem={({ item, index }) => {
                    return (

                        <View style={{

                            borderRadius: 10,
                            marginVertical: 4,
                            flexDirection: 'row'
                        }}>
                            <Image style={{
                                width: 35,
                                height: 120,
                            }} source={require('../../assets/vc.png')} />
                            <View style={{
                                flex: 1,
                                backgroundColor: colors.white
                            }}>
                                <View style={{

                                    flexDirection: 'row',
                                    alignItems: 'center',
                                    padding: 5,
                                }}>
                                    <Text style={{
                                        flex: 0.5,
                                        fontFamily: fonts.secondary[600],
                                        fontSize: 12,
                                    }}>Jenis Voucher</Text>
                                    <Text style={{
                                        flex: 1,
                                        fontFamily: fonts.secondary[800],
                                        fontSize: 12,
                                    }}>{item.jenis_voucher}</Text>
                                </View>
                                <View style={{
                                    padding: 5,
                                    flexDirection: 'row',
                                    alignItems: 'center'
                                }}>
                                    <Text style={{
                                        flex: 0.5,
                                        fontFamily: fonts.secondary[600],
                                        fontSize: 12,
                                    }}>Pelanggan</Text>
                                    <Text style={{
                                        flex: 1,
                                        fontFamily: fonts.secondary[800],
                                        fontSize: 12,
                                    }}>{item.nama_pelanggan}</Text>
                                </View>
                                <MyGap jarak={10} />
                                <DashedLine dashLength={10} dashThickness={1} dashColor={Color.blueGray[400]} dashGap={5} />
                                {/* <View style={{
                                    borderTopWidth: 1,
                                    borderTopColor: Color.blueGray[200],
                                    paddingTop: 5,
                                    marginTop: 5,
                                    flex: 1,
                                    fontFamily: fonts.secondary[600],
                                    fontSize: 12,
                                    textAlign: 'center'
                                }}></View> */}
                                <Text style={{
                                    padding: 5,
                                    fontFamily: fonts.secondary[800],
                                    fontSize: 25,
                                    textAlign: 'center'
                                }}>{item.voucher}</Text>
                                <TouchableOpacity onPress={() => printVoucher(item)} style={{
                                    position: 'absolute',
                                    right: 0,
                                    top: 0,
                                    padding: 4,
                                    borderRadius: 10,
                                    margin: 4,
                                    backgroundColor: colors.danger,
                                    width: 100,
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                    flexDirection: 'row'
                                }}>
                                    <Icon type='ionicon' name='print-outline' size={18} color={colors.white} />
                                    <Text style={{
                                        fontFamily: fonts.secondary[600],
                                        color: colors.white,
                                        fontSize: 12,
                                    }}>Cetak</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    )
                }} />

            </View>
        </ImageBackground>
    )
}

const styles = StyleSheet.create({})