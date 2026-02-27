import AsyncStorage from '@react-native-async-storage/async-storage';
import { router } from 'expo-router';
import { useState } from 'react';
import { Alert, Button, ScrollView, Text, TextInput, StyleSheet } from 'react-native';
import BASE_URL from '../config/api';

export default function LoginScreen() {

    const [form, setForm] = useState({
        email: '',
        password: ''
    });

    const handleChange = (key: keyof typeof form, value: string) => {
        setForm({ ...form, [key]: value });
    };

    const handleLogin = async () => {
        try {

            const res = await fetch(`${BASE_URL}/api/auth/login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(form),
            });

            const data = await res.json();

            if (!res.ok) {
                throw new Error(data?.error || 'Login failed');
            }

            await AsyncStorage.setItem('token', data.token);

            router.replace('/');

        } catch (err: any) {
            Alert.alert('Error', err.message);
        }
    };

    return (
        <ScrollView contentContainerStyle={styles.container}>
            <Text style={styles.title}>Login</Text>

            <TextInput
                placeholder="Email"
                value={form.email}
                onChangeText={(text) => handleChange('email', text)}
                style={styles.input}
                autoCapitalize="none"
            />

            <TextInput
                placeholder="Password"
                value={form.password}
                onChangeText={(text) => handleChange('password', text)}
                style={styles.input}
                secureTextEntry
            />

            <Button title="Login" onPress={handleLogin} />

            <Text
                style={styles.link}
                onPress={() => router.push('/register')}
            >
                Don't have an account? Register
            </Text>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flexGrow: 1,
        justifyContent: 'center',
        padding: 20,
    },
    title: {
        fontSize: 28,
        fontWeight: 'bold',
        marginBottom: 20,
        textAlign: 'center'
    },
    input: {
        borderWidth: 1,
        borderColor: '#ccc',
        padding: 12,
        marginBottom: 15,
        borderRadius: 8,
    },
    link: {
        marginTop: 15,
        textAlign: 'center',
        color: 'blue'
    }
});