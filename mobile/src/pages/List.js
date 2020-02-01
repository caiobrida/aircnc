import React, { useState, useEffect } from 'react';
import socketio from 'socket.io-client';
import { TouchableOpacity, Alert, Text, SafeAreaView, ScrollView, StyleSheet, AsyncStorage, Image } from 'react-native';

import SpotList from '../components/SpotList';

import logo from '../assets/logo.png';


export default function List({ navigation }) {
    const [techs, setTechs] = useState([]);

    useEffect(() => {
        AsyncStorage.getItem('user').then(user_id => {
            const socket = socketio('http://192.168.0.103:3333', {
                query: { user_id }
            });

            socket.on('booking_response', booking => {
                Alert.alert(`Sua reserva em ${booking.spot.company} em ${booking.date} foi ${booking.approved ? 'APROVADA' : 'REJEITADA'}`)
            });
        })
    }, [])

    useEffect(() => {
            AsyncStorage.getItem('techs').then(storagedTechs => {
            const techsArray = storagedTechs.split(',').map(tech => tech.trim());

            setTechs(techsArray);
        })
    }, []);

    async function handleLogout() {
        await AsyncStorage.removeItem('user');
        await AsyncStorage.removeItem('techs');

        navigation.navigate('Login');
    }
    
    return (
        <SafeAreaView style={styles.container}>
            <Image style={styles.logo} source={logo} />
            <ScrollView>
                {techs.map(tech => <SpotList key={tech} tech={tech} />)}
                <TouchableOpacity onPress={handleLogout} style={styles.buttonLogout}>
                    <Text style={styles.buttonText}>Log-out</Text>
                </TouchableOpacity>
            </ScrollView>          
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1
    },

    logo: {
        height: 32,
        resizeMode: 'contain',
        alignSelf: 'center',
        marginTop: 45
    },

    buttonLogout: {
        height: 42,
        backgroundColor: '#ccc',
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 2,
        marginTop: 60,
        
    },

    buttonText: {
        color: '#fff',
        fontWeight: 'bold',
        fontSize: 16
    }
})