import { View, Text, ImageBackground, ScrollView, Image, TouchableNativeFeedback, Alert } from 'react-native'
import React, { useState } from 'react'
import { colors, fonts } from '../../utils'
import { MyInput, MyPicker } from '../../components'
import { showMessage } from 'react-native-flash-message';
import axios from 'axios';
import { apiURL, storeData } from '../../utils/localStorage';
import { useToast } from "react-native-toast-notifications";
export default function Login({ navigation }) {
    const [data, setData] = useState({
        username: '',
        password: '',
        tipe: 'reseller',
    });

    const toast = useToast();
    const login = async () => {
        try {

            if (data.username.length == 0) {
                toast.show('Username tidak boleh kosong !')
            } else if (data.password.length == 0) {
                toast.show('Password tidak boleh kosong !')
            } else {

                axios.post(apiURL + 'login', {
                    username: data.username,
                    tipe: data.tipe,
                    password: data.password
                }).then(res => {
                    console.log(res.data)
                    if (res.data.status == "success") {
                        storeData('user', res.data);
                        navigation.replace('MainApp')
                    } else {
                        toast.show(res.data.message)
                    }
                })
            }

            ;
        } catch (error) {
            console.error('Error:', error);
        }
    };


    return (
        <ImageBackground style={{
            flex: 1,
            width: '100%',
            height: '100%',
            backgroundColor: 'white'
        }} source={require('../../assets/bgsplash.png')}>
            <ScrollView>
                <View style={{
                    padding: 10,
                }}>


                    <View style={{
                        alignItems: "center",
                        justifyContent: "center",
                        marginTop: '2%',
                    }}>
                        <Image style={{ width: 220, height: 150, resizeMode: 'contain', alignItems: "center" }} source={require('../../assets/newlogo.png')} />
                    </View>
                    <View style={{
                        padding: 10
                    }}>
                        <Text style={{
                            fontFamily: fonts.primary[600],
                            color: 'white',
                            fontSize: 25,
                            textAlign: 'center'

                        }}>Login</Text>

                        <View style={{
                            padding: 5
                        }}>
                            <MyPicker onChangeText={x => setData({
                                ...data,
                                tipe: x
                            })} iconname="person-outline" label="Tipe"
                                data={[
                                    { label: 'Reseller', value: 'reseller' },
                                    { label: 'Pelanggan', value: 'pelanggan' },
                                ]}
                            />
                            <MyInput value={data.username}
                                iconname='at'
                                label="Username"
                                placeholder="Masukan Username"
                                colorlabel='white'
                                onChangeText={(x) => setData({ ...data, 'username': x })}
                            />

                            <MyInput
                                iconname='lock-closed-outline'
                                label="Password"
                                placeholder="Masukan Password"
                                colorlabel='white'
                                secureTextEntry={true}
                                value={data.password}
                                onChangeText={(x) => setData({ ...data, 'password': x })}
                            />

                            <View style={{
                                flexDirection: 'row',
                                justifyContent: "flex-end"
                            }}>
                                {/* <TouchableNativeFeedback>
                        <View style={{
                            marginTop:10,
                        }}>
                            <Text style={{
                                fontFamily:fonts.primary[600],
                                color:'white',
                                fontSize:12
                            }}>Lupa Kata Sandi</Text>
                        </View>
                    </TouchableNativeFeedback> */}
                            </View>


                            <View>
                                <TouchableNativeFeedback onPress={login}>
                                    <View style={{
                                        padding: 10,
                                        backgroundColor: colors.secondary,
                                        borderRadius: 10,
                                        marginTop: 20,
                                        borderColor: colors.white

                                    }}>
                                        <Text style={{
                                            fontFamily: fonts.primary[800],
                                            color: colors.primary,
                                            textAlign: "center"
                                        }}>Login</Text>

                                    </View>
                                </TouchableNativeFeedback>


                            </View>
                        </View>
                    </View>



                </View>
            </ScrollView>
        </ImageBackground>
    )
}