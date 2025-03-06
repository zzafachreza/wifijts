import React, { useEffect, useState } from 'react';
import {
    StyleSheet,
    Text,
    View,
    SafeAreaView,
    Image,
    Linking,
    Alert,
    ActivityIndicator,
} from 'react-native';
import { windowWidth, fonts, MyDimensi } from '../../utils/fonts';
import { apiURL, getData, MYAPP, storeData, urlAPI, urlApp, urlAvatar } from '../../utils/localStorage';
import { Color, colors } from '../../utils/colors';
import { MyButton, MyGap, MyHeader } from '../../components';
import { Icon } from 'react-native-elements';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { useIsFocused } from '@react-navigation/native';
import axios from 'axios';
import LinearGradient from 'react-native-linear-gradient';
import moment from 'moment';
import { ScrollView } from 'react-native';
import { Collator } from 'intl';
import { useToast } from 'react-native-toast-notifications';

export default function ({ navigation, route }) {
    const [user, setUser] = useState({});
    const [com, setCom] = useState({});
    const isFocused = useIsFocused();
    const [wa, setWA] = useState('');
    const [open, setOpen] = useState(false);



    useEffect(() => {


        if (isFocused) {
            getData('user').then(res => {
                console.log(res)
                setOpen(true);
                setUser(res);

            });
        }




    }, [isFocused]);


    const toast = useToast();

    const btnKeluar = () => {
        Alert.alert(MYAPP, 'Apakah kamu yakin akan keluar ?', [
            {
                text: 'Batal',
                style: "cancel"
            },
            {
                text: 'Keluar',
                onPress: async () => {
                    try {
                        const response = await axios.post(apiURL.replace("apiapk", "api") + 'logout', {}, {
                            headers: {
                                'Authorization': `Bearer ${user.token}`
                            }
                        });

                        console.log(response.data);

                        if (response.data.status === 'success') {
                            storeData('user', null);
                            navigation.reset({
                                index: 0,
                                routes: [{ name: 'Splash' }],
                            });
                        } else {
                            toast.show(response.data.message);
                        }
                    } catch (error) {
                        console.error('Error:', error);
                        toast.show('Terjadi kesalahan, silakan coba lagi.');
                    }
                }
            }
        ])
    };

    const MyList = ({ label, value }) => {
        return (
            <View style={{
                marginTop: 4,
                borderBottomWidth: 1,
                borderBottomColor: Color.blueGray[400],
            }}>
                <Text
                    style={{
                        fontFamily: fonts.secondary[600],
                        color: colors.white,
                        marginLeft: 10

                    }}>
                    {label}
                </Text>


                <View
                    style={{
                        // padding: 10,
                        paddingHorizontal: 10,
                        // backgroundColor: Color.blueGray[50],
                        borderRadius: 10,
                        height: 45
                    }}>

                    <Text
                        style={{
                            ...fonts.headline4,
                            color: colors.white,
                        }}>
                        {value}
                    </Text>
                </View>
            </View>

        )
    }
    return (
        <SafeAreaView style={{
            flex: 1,
            backgroundColor: colors.primary
        }}>


            <MyHeader title="Akun Saya" onPress={() => navigation.goBack()} />
            {!open && <View style={{
                flex: 1,
                justifyContent: 'center',
                alignItems: 'center'
            }}>
                <ActivityIndicator size="large" color={colors.primary} />
            </View>}
            <ScrollView showsVerticalScrollIndicator={false}>
                {open &&

                    <View style={{
                        margin: 5,
                        flex: 1,
                    }}>
                        <View style={{
                            justifyContent: 'center',
                            alignItems: 'center'
                        }}>

                        </View>
                        <View style={{ padding: 10, }}>

                            <MyList label="Nama" value={user.nama} />
                            <MyList label="Tipe" value={user.tipe !== 'reseller' ? 'Pelanggan' : 'Reseller'} />




                        </View>
                        {/* data detail */}
                    </View>

                }
                <View style={{
                    padding: 20,
                }}>

                    <MyButton onPress={btnKeluar} Icons='log-out-outline' warna={colors.secondary} title="Log Out" iconColor={colors.black} colorText={colors.black} />
                </View>
            </ScrollView>
        </SafeAreaView >
    );
}

const styles = StyleSheet.create({});
