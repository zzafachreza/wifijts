import React, { useEffect, useState } from 'react';
import {
    SafeAreaView,
    ImageBackground,
    StyleSheet,
    Text,
    View,
    FlatList,
    TouchableOpacity,
    Alert,
    PermissionsAndroid,
    Platform
} from 'react-native';
import { colors, fonts } from '../../utils';
import { useToast } from 'react-native-toast-notifications';
import { getData, MYAPP, storeData } from '../../utils/localStorage';
import BleManager from 'react-native-ble-manager';
import { BluetoothEscposPrinter, BluetoothManager } from 'react-native-bluetooth-escpos-printer';
import {
    USBPrinter,
    NetPrinter,
    BLEPrinter,
} from "react-native-thermal-receipt-printer";
import IntentLauncher, { IntentConstant } from 'react-native-intent-launcher';
import { request, PERMISSIONS } from 'react-native-permissions';
import DashedLine from 'react-native-dashed-line';
import { Icon } from 'react-native-elements';

export default function Printer({ navigation, route }) {


    const requestBluetoothPermission = async () => {
        try {
            let permission;
            if (Platform.OS === 'android') {
                if (Platform.Version >= 31) {
                    permission = PERMISSIONS.ANDROID.BLUETOOTH_CONNECT;
                } else {
                    permission = PERMISSIONS.ANDROID.BLUETOOTH;
                }
            }

            if (permission) {
                const result = await request(permission);
                if (result === RESULTS.GRANTED) {
                    console.log('Izin Bluetooth diberikan');
                } else {
                    Alert.alert('Izin Diperlukan', 'Aplikasi memerlukan akses Bluetooth untuk berfungsi dengan baik.');
                }
            }
        } catch (error) {
            console.error('Gagal meminta izin Bluetooth:', error);
        }
    };


    const [devices, setDevices] = useState([]);
    const toast = useToast();

    // Cek apakah Bluetooth aktif
    const checkBluetoothEnabled = async () => {
        BluetoothManager.isBluetoothEnabled()
            .then((enabled) => {
                if (!enabled) {
                    Alert.alert(MYAPP, 'Aktifkan Bluetooth terlebih dahulu!', [
                        { text: 'TUTUP' },
                        {
                            text: 'BUKA PENGATURAN',
                            onPress: () => {
                                IntentLauncher.startActivity({
                                    action: 'android.settings.BLUETOOTH_SETTINGS'
                                });
                            }
                        }
                    ]);
                } else {
                    BLEPrinter.init().then(() => {
                        BLEPrinter.getDeviceList().then(res => {
                            console.log(res);
                            setDevices(res)
                        });
                    });
                }
            })
            .catch(err => console.error('Gagal mengecek Bluetooth:', err));
    };

    const [printer, setPrinter] = useState({});
    useEffect(() => {
        getData('printer').then(pr => {
            if (pr) {
                setPrinter(pr);
            }
        })
        requestBluetoothPermission();
        checkBluetoothEnabled();
    }, []);


    return (
        <ImageBackground source={require('../../assets/bghome.png')} style={styles.background}>
            <View style={styles.container}>
                <Text style={styles.title}>Pengaturan Printer</Text>
                <Text style={{
                    color: colors.white,
                    fontFamily: fonts.secondary[600],
                    marginBottom: 10,
                }}>Pilih Printer Bluetooth</Text>

                <FlatList
                    data={devices}
                    keyExtractor={(item) => item.id}
                    renderItem={({ item }) => (
                        <TouchableOpacity onPress={() => {
                            let TMP = {
                                nama: item.device_name,
                                kode: item.inner_mac_address
                            }
                            setPrinter(TMP);
                            storeData('printer', TMP);
                            BLEPrinter.connectPrinter(item.inner_mac_address).then(res => {
                                console.log(res);
                                toast.show(`Device ${item.device_name} dipilih !`, {
                                    type: 'success'
                                })
                            })

                        }}>
                            <View style={styles.deviceItem}>
                                <View style={{
                                    flex: 1,
                                }}>
                                    <Text style={styles.deviceName}>{item.device_name || 'Unknown Device'}</Text>
                                    <Text style={styles.deviceId}>{item.inner_mac_address}</Text>
                                </View>
                                <View style={{
                                    justifyContent: 'center',
                                    alignItems: 'center'
                                }}>
                                    {printer.kode == item.inner_mac_address && <Icon size={28} type="ionicon" color={colors.success} name='checkmark-circle' />}
                                </View>
                            </View>

                        </TouchableOpacity>
                    )}
                    ListEmptyComponent={<Text style={styles.emptyMessage}>Tidak ada perangkat terhubung</Text>}
                />


            </View>
        </ImageBackground>
    );
}

const styles = StyleSheet.create({
    background: {
        flex: 1,
        backgroundColor: colors.primary,
        width: '100%',
        height: '100%',
    },
    container: {
        flex: 1,
        marginTop: 30,
        padding: 10,
    },
    title: {
        ...fonts.headline2,
        color: colors.white,

    },
    deviceItem: {
        borderRadius: 10,
        backgroundColor: colors.white,
        marginVertical: 4,
        padding: 10,
        flexDirection: 'row',
        alignItems: 'center'

    },
    deviceName: {
        fontFamily: fonts.secondary[800],
        fontSize: 14,
        color: colors.primary,
    },
    deviceId: {
        fontFamily: fonts.secondary[600],
        fontSize: 12,
        color: colors.primary,
    },
    emptyMessage: {
        color: colors.white,
        fontSize: 14,
        textAlign: 'center',
        marginTop: 20,
    },
    refreshButton: {
        marginTop: 20,
        padding: 10,
        backgroundColor: colors.secondary,
        borderRadius: 8,
        alignItems: 'center',
    },
    refreshText: {
        fontFamily: fonts.secondary[600],
        color: colors.white,
        fontSize: 14,
    },
});
