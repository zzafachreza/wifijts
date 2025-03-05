import React, { useEffect, useState } from 'react';
import {
    SafeAreaView,
    ImageBackground,
    StyleSheet,
    Text,
    View,
    FlatList,
    TouchableOpacity
} from 'react-native';
import { Color, colors, fonts } from '../../utils';
import { useToast } from 'react-native-toast-notifications';
import { apiURL, getData } from '../../utils/localStorage';
import axios from 'axios';
import DashedLine from 'react-native-dashed-line';
import { Icon } from 'react-native-elements';
import moment from 'moment';
import MyLoading from '../../components/MyLoading';
import { BluetoothEscposPrinter, BluetoothManager } from 'react-native-bluetooth-escpos-printer';
import {
    USBPrinter,
    NetPrinter,
    BLEPrinter,
} from "react-native-thermal-receipt-printer";

export default function Riwayat({ navigation, route }) {
    const user = route.params;
    const [loading, setLoading] = useState(false);
    const [data, setData] = useState([]);
    const [page, setPage] = useState({
        current_page: 1,
        per_page: 20,
        total_records: 0,
        total_pages: 0
    });

    const toast = useToast();
    const [printer, setPrinter] = useState({});


    const printVoucher = async (x) => {

        const items = x;
        const keterangan = items.keterangan || ''; // Pastikan ada nilai default
        const DATA = keterangan.split(" ");

        // Pastikan DATA memiliki elemen yang cukup sebelum mengakses indeksnya
        const voucher = DATA.length > 2 ? DATA[2] : 'N/A';
        const customer = DATA.length > 2 ? DATA[4] : 'N/A';
        const tanggal = DATA.length > 2
            ? `${moment(DATA[0]).format('DD MMMM YYYY')} ${DATA[1]} WIB`
            : 'Tanggal tidak tersedia';

        console.log(items);




        BLEPrinter.init()
            .then(() => {
                BLEPrinter.connectPrinter(printer.kode)
                    .then(() => {
                        console.log('Printer terhubung:', printer.kode);
                        let printContent = '';
                        printContent += `<CB>${voucher}</CB>\n`;
                        printContent += `<C>${tanggal}</C>\n`;
                        printContent += `<C>Pelanggan : ${customer}</C>\n`;

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

    const __GetHistory = async (params_page = 1) => {
        // if (loading || params_page > page.total_pages) return; // Hindari request ganda dan jika sudah di halaman terakhir

        setLoading(true);
        try {
            const response = await axios.get(`${apiURL}history/page/${params_page}`, {
                headers: { 'Authorization': `${user.token}` }
            });

            if (response.data.status === 'success') {
                console.log(response.data.pagination)
                setData(prevData => [...prevData, ...response.data.data]); // Menambahkan data baru
                setPage(response.data.pagination);
            } else {
                toast.show(response.data.message);
            }
        } catch (error) {
            console.error('Error:', error);
            toast.show('Terjadi kesalahan, silakan coba lagi.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        __GetHistory();
        getData('printer').then(pr => setPrinter(pr))
    }, []);

    const renderItem = ({ item }) => {
        let keterangan = item.keterangan || ''; // Beri nilai default jika undefined/null
        let DATA = keterangan.split(" ");

        return (
            <View style={styles.cardContainer}>
                <View style={styles.card}>
                    <View style={styles.cardContent}>
                        <Text style={styles.label}>Tanggal</Text>
                        <Text style={styles.value}>
                            {DATA.length > 1 ? moment(DATA[0]).format('DD MMMM YYYY') + " " + DATA[1] + " WIB" : '-'}
                        </Text>
                    </View>
                    <View style={styles.cardContent}>
                        <Text style={styles.label}>Pelanggan</Text>
                        <Text style={styles.value}>{DATA.length > 4 ? DATA[4] : '-'}</Text>
                    </View>
                    <DashedLine dashLength={10} dashThickness={1} dashColor={Color.blueGray[400]} dashGap={5} />
                    <Text style={styles.amount}>{DATA.length > 2 ? DATA[2] : '-'}</Text>
                    <TouchableOpacity onPress={() => printVoucher(item)} style={styles.printButton}>
                        <Icon type='ionicon' name='print-outline' size={18} color={colors.white} />
                        <Text style={styles.printText}>Cetak</Text>
                    </TouchableOpacity>
                </View>
            </View>
        );
    };


    return (
        <ImageBackground source={require('../../assets/bghome.png')} style={styles.background}>
            <View style={styles.container}>
                <Text style={styles.title}>History</Text>
                <FlatList
                    data={data}
                    renderItem={renderItem}
                    keyExtractor={(item, index) => index.toString()}
                    onEndReached={() => __GetHistory(parseInt(page.current_page) + 1)}
                    onEndReachedThreshold={0.1} // Agar pemanggilan API tidak terlalu cepat
                />
                {loading && <View style={{
                    padding: 10,
                }}>
                    <MyLoading /></View>}
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
        marginBottom: 0,
    },
    cardContainer: {
        borderRadius: 10,
        marginVertical: 4,
        flexDirection: 'row',
    },
    card: {
        flex: 1,
        backgroundColor: colors.white,
        padding: 5,
    },
    cardContent: {
        padding: 5,
    },
    label: {
        fontFamily: fonts.secondary[600],
        fontSize: 12,
    },
    value: {
        fontFamily: fonts.secondary[800],
        fontSize: 12,
    },
    amount: {
        padding: 5,
        fontFamily: fonts.secondary[800],
        fontSize: 25,
        textAlign: 'center',
    },
    printButton: {
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
        flexDirection: 'row',
    },
    printText: {
        fontFamily: fonts.secondary[600],
        color: colors.white,
        fontSize: 12,
    },
});
