import { SafeAreaView, ImageBackground, StyleSheet, Text, View, TouchableOpacity } from 'react-native'
import React, { useEffect, useState } from 'react'
import { colors, fonts } from '../../utils'
import { MyButton, MyGap, MyInput, MyPicker } from '../../components'
import { useToast } from 'react-native-toast-notifications';
import MyLoading from '../../components/MyLoading';
import { apiURL } from '../../utils/localStorage';
import axios from 'axios';
import { Icon } from 'react-native-elements';

export default function Beli({ navigation, route }) {
    const user = route.params;
    const [loading, setLoading] = useState(false);
    const [kirim, setKirim] = useState(
        {
            jenis: "1///2000",
            nama: "",
            jumlah: '',
            bonus: 0
        }
    )

    const [jumlah, setJumlah] = useState([]);

    useEffect(() => {
        let TMP = [];
        Array.from({ length: 10 }, (_, i) => {
            TMP.push({
                label: `${i + 1}`,
                value: i + 1,
            })
        });
        setJumlah(TMP);
    }, []);

    const toast = useToast();

    const sendServer = async () => {

        setLoading(true);
        if (kirim.nama.length == 0) {
            toast.show('Nama / No. HP Pelanggan masih kosong !')
        } else if (kirim.jumlah.length == 0) {
            toast.show('Masukan jumlah minimal 1')
        } else {

            try {
                const response = await axios.post(apiURL + 'pembelian', kirim, {
                    headers: {
                        'Authorization': `${user.token}`
                    }
                });

                console.log(response.data);
                setLoading(false);
                if (response.data.status === 'success') {
                    console.log(response.data);
                    toast.show(`Pembelian ${kirim.jumlah} Voucher Berhasil`, {
                        type: 'success'
                    });
                    navigation.navigate('Detail', {
                        user: user,
                        transaksi: response.data.transaksi
                    })
                } else {
                    toast.show(response.data.message);
                }
            } catch (error) {
                console.error('Error:', error);
                toast.show('Terjadi kesalahan, silakan coba lagi.');
            }


        }
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
                marginTop: 30,
                padding: 10,

            }}>
                <Text style={{
                    ...fonts.headline2,
                    color: colors.white,
                    marginBottom: 20,
                }}>Pembelian Voucher</Text>
                <MyPicker value={kirim.jenis} onChangeText={x => setKirim({
                    ...kirim,
                    jenis: x
                })} label="Jenis Voucher" iconname="card-outline" data={[
                    {
                        label: '1 Hari - Rp 2.000',
                        value: '1///2000'
                    },
                    {
                        label: '5 Hari - Rp 10.000',
                        value: '2///10000'
                    }

                ]} />
                <MyGap jarak={10} />
                <MyInput value={kirim.nama} onChangeText={x => setKirim({ ...kirim, nama: x })} colorlabel='white' placeholder="Nama / No. HP Pelanggan" iconname='person-outline' label="HP / Nama" />
                <MyGap jarak={10} />
                <MyPicker onChangeText={x => setKirim({
                    ...kirim,
                    jumlah: x
                })} value={kirim.jumlah} label="Jumlah" iconname="copy-outline" data={jumlah} />
                <MyGap jarak={20} />
                {user.tipe == 'reseller' &&
                    <View>
                        <TouchableOpacity onPress={() => {
                            setKirim({
                                ...kirim,
                                bonus: !kirim.bonus
                            });
                        }} style={{
                            flexDirection: 'row',
                            alignItems: 'center',
                        }}>
                            <Icon type='ionicon' name={kirim.bonus > 0 ? 'checkbox' : 'square-outline'} color={colors.white} />
                            <Text style={{
                                fontFamily: fonts.primary[600],
                                color: colors.white,


                                marginLeft: 10,
                            }}>Beli Pakai Saldo Bonus</Text>

                        </TouchableOpacity>
                    </View>
                }
                <MyGap jarak={20} />
                {!loading && <MyButton onPress={sendServer} warna={colors.secondary} title="Beli Voucher" colorText='black' iconColor='black' Icons="create-outline" />}
                {loading && <View><MyGap jarak={20} /><MyLoading /></View>}
            </View>
        </ImageBackground>
    )
}

const styles = StyleSheet.create({})