import AsyncStorage from '@react-native-async-storage/async-storage';
import { router } from 'expo-router';
import { useState } from 'react';
import { Alert, Button, ScrollView, StyleSheet, Text, TextInput } from 'react-native';
import BASE_URL from '../config/api';

export default function RegisterScreen() {
    const [form, setForm] = useState({ name: '', email: '', phone: '', address: '', dob: '', password: '' });

    const handleChange = (key: string, value: string) => setForm({ ...form, [key]: value });

    const handleRegister = async () => {
        try {
            // const res = await fetch('http://192.168.0.108:5000/api/auth/register', {
            const res = await fetch(`${BASE_URL}/api/auth/register`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(form),
            });

            const data = await res.json();
            if (!res.ok) throw new Error(data.error || 'Registration failed');

            await AsyncStorage.setItem('token', data.token);
            router.replace('/'); // go to home
        } catch (err: any) {
            Alert.alert('Error', err.message);
        }
    };

    return (
        <ScrollView contentContainerStyle={styles.container}>
            <Text style={styles.title}>Register</Text>

            {Object.keys(form).map((key) => (
                <TextInput
                    key={key}
                    placeholder={key.charAt(0).toUpperCase() + key.slice(1)}
                    value={(form as any)[key]}
                    onChangeText={(text) => handleChange(key, text)}
                    style={styles.input}
                    secureTextEntry={key === 'password'}
                />
            ))}

            <Button title="Register" onPress={handleRegister} />
            <Text style={styles.link} onPress={() => router.push('/login')}>Already have an account? Login</Text>
        </ScrollView>
    );
}


const styles = StyleSheet.create({
    container: { padding: 20 },
    title: { fontSize: 24, fontWeight: 'bold', marginBottom: 20, textAlign: 'center' },
    input: { borderWidth: 1, borderColor: '#ccc', padding: 10, marginBottom: 15, borderRadius: 8 },
    link: { color: '#007AFF', textAlign: 'center', marginTop: 10 },
});