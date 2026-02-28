// import AsyncStorage from '@react-native-async-storage/async-storage';
// import { router } from 'expo-router';
// import { useState } from 'react';
// import { Alert, Button, ScrollView, StyleSheet, Text, TextInput } from 'react-native';
// import BASE_URL from '../config/api';

// export default function RegisterScreen() {
//     const [form, setForm] = useState({ name: '', email: '', phone: '', address: '', dob: '', password: '' });

//     const handleChange = (key: string, value: string) => setForm({ ...form, [key]: value });

//     const handleRegister = async () => {
//         try {
//             // const res = await fetch('http://192.168.0.108:5000/api/auth/register', {
//             const res = await fetch(`${BASE_URL}/api/auth/register`, {
//                 method: 'POST',
//                 headers: { 'Content-Type': 'application/json' },
//                 body: JSON.stringify(form),
//             });

//             const data = await res.json();
//             if (!res.ok) throw new Error(data.error || 'Registration failed');

//             await AsyncStorage.setItem('token', data.token);
//             router.replace('/'); // go to home
//         } catch (err: any) {
//             Alert.alert('Error', err.message);
//         }
//     };

//     return (
//         <ScrollView contentContainerStyle={styles.container}>
//             <Text style={styles.title}>Register</Text>

//             {Object.keys(form).map((key) => (
//                 <TextInput
//                     key={key}
//                     placeholder={key.charAt(0).toUpperCase() + key.slice(1)}
//                     value={(form as any)[key]}
//                     onChangeText={(text) => handleChange(key, text)}
//                     style={styles.input}
//                     secureTextEntry={key === 'password'}
//                 />
//             ))}

//             <Button title="Register" onPress={handleRegister} />
//             <Text style={styles.link} onPress={() => router.push('/login')}>Already have an account? Login</Text>
//         </ScrollView>
//     );
// }


// const styles = StyleSheet.create({
//     container: { padding: 20 },
//     title: { fontSize: 24, fontWeight: 'bold', marginBottom: 20, textAlign: 'center' },
//     input: { borderWidth: 1, borderColor: '#ccc', padding: 10, marginBottom: 15, borderRadius: 8 },
//     link: { color: '#007AFF', textAlign: 'center', marginTop: 10 },
// });



import AsyncStorage from '@react-native-async-storage/async-storage';
import { router } from 'expo-router';
import { useState } from 'react';
import {
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
  Pressable,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import BASE_URL from '../config/api';

export default function RegisterScreen() {
  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    dob: '',
    password: '',
  });

  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (key: string, value: string) =>
    setForm({ ...form, [key]: value });

  const handleRegister = async () => {
    try {
      const res = await fetch(`${BASE_URL}/api/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Registration failed');

      await AsyncStorage.setItem('token', data.token);
      router.replace('/');
    } catch (err: any) {
      Alert.alert('Error', err.message);
    }
  };

  return (
    <LinearGradient
      colors={['#2BB6A8', '#EAF6F5']}
      style={{ flex: 1 }}
    >
      <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.card}>
          <Text style={styles.heading}>Create Account</Text>
          <Text style={styles.subHeading}>
            Start your wellness journey today
          </Text>

          {Object.keys(form).map((key) => {
            const isPassword = key === 'password';

            return (
              <View key={key} style={styles.inputWrapper}>
                <Text style={styles.label}>
                  {key.charAt(0).toUpperCase() + key.slice(1)}
                </Text>

                <View style={styles.inputContainer}>
                  <TextInput
                    value={(form as any)[key]}
                    onChangeText={(text) => handleChange(key, text)}
                    style={styles.input}
                    secureTextEntry={isPassword && !showPassword}
                    placeholder={`Enter ${key}`}
                    placeholderTextColor="#A0B4BA"
                  />

                  {isPassword && (
                    <Pressable
                      onPress={() => setShowPassword(!showPassword)}
                    >
                      <Ionicons
                        name={showPassword ? 'eye-off-outline' : 'eye-outline'}
                        size={22}
                        color="#5C6F75"
                      />
                    </Pressable>
                  )}
                </View>
              </View>
            );
          })}

          <Pressable
            style={({ pressed }) => [
              styles.button,
              pressed && { opacity: 0.85, transform: [{ scale: 0.98 }] },
            ]}
            onPress={handleRegister}
          >
            <Text style={styles.buttonText}>Create Account</Text>
          </Pressable>

          <Text style={styles.footerText}>
            Already have an account?{' '}
            <Text
              style={styles.footerLink}
              onPress={() => router.push('/login')}
            >
              Login
            </Text>
          </Text>
        </View>
      </ScrollView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    justifyContent: 'center',
    padding: 24,
  },

  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 30,
    padding: 30,
    shadowColor: '#000',
    shadowOpacity: 0.15,
    shadowRadius: 25,
    elevation: 12,
  },

  heading: {
    fontSize: 30,
    fontWeight: '900',
    color: '#1A2C34',
  },

  subHeading: {
    fontSize: 14,
    color: '#5C6F75',
    marginBottom: 28,
    marginTop: 4,
  },

  inputWrapper: {
    marginBottom: 18,
  },

  label: {
    fontSize: 13,
    color: '#5C6F75',
    marginBottom: 6,
    fontWeight: '600',
  },

  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F4FBFA',
    borderRadius: 18,
    paddingHorizontal: 18,
    borderWidth: 1,
    borderColor: '#DCEEEE',
  },

  input: {
    flex: 1,
    paddingVertical: 15,
    fontSize: 15,
    color: '#1A2C34',
  },

  button: {
    marginTop: 20,
    backgroundColor: '#2BB6A8',
    paddingVertical: 18,
    borderRadius: 20,
    alignItems: 'center',
    shadowColor: '#2BB6A8',
    shadowOpacity: 0.4,
    shadowRadius: 15,
    elevation: 10,
  },

  buttonText: {
    color: '#FFFFFF',
    fontSize: 17,
    fontWeight: '800',
  },

  footerText: {
    textAlign: 'center',
    marginTop: 22,
    fontSize: 14,
    color: '#5C6F75',
  },

  footerLink: {
    color: '#2BB6A8',
    fontWeight: '800',
  },
});