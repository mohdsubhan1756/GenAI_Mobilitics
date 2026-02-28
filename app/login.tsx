// import AsyncStorage from '@react-native-async-storage/async-storage';
// import { router } from 'expo-router';
// import { useState } from 'react';
// import { Alert, Button, ScrollView, Text, TextInput, StyleSheet } from 'react-native';
// import BASE_URL from '../config/api';

// export default function LoginScreen() {

//     const [form, setForm] = useState({
//         email: '',
//         password: ''
//     });

//     const handleChange = (key: keyof typeof form, value: string) => {
//         setForm({ ...form, [key]: value });
//     };

//     const handleLogin = async () => {
//         try {

//             const res = await fetch(`${BASE_URL}/api/auth/login`, {
//                 method: 'POST',
//                 headers: {
//                     'Content-Type': 'application/json'
//                 },
//                 body: JSON.stringify(form),
//             });

//             const data = await res.json();

//             if (!res.ok) {
//                 throw new Error(data?.error || 'Login failed');
//             }

//             await AsyncStorage.setItem('token', data.token);

//             router.replace('/');

//         } catch (err: any) {
//             Alert.alert('Error', err.message);
//         }
//     };

//     return (
//         <ScrollView contentContainerStyle={styles.container}>
//             <Text style={styles.title}>Login</Text>

//             <TextInput
//                 placeholder="Email"
//                 value={form.email}
//                 onChangeText={(text) => handleChange('email', text)}
//                 style={styles.input}
//                 autoCapitalize="none"
//             />

//             <TextInput
//                 placeholder="Password"
//                 value={form.password}
//                 onChangeText={(text) => handleChange('password', text)}
//                 style={styles.input}
//                 secureTextEntry
//             />

//             <Button title="Login" onPress={handleLogin} />

//             <Text
//                 style={styles.link}
//                 onPress={() => router.push('/register')}
//             >
//                 Don't have an account? Register
//             </Text>
//         </ScrollView>
//     );
// }

// const styles = StyleSheet.create({
//     container: {
//         flexGrow: 1,
//         justifyContent: 'center',
//         padding: 20,
//     },
//     title: {
//         fontSize: 28,
//         fontWeight: 'bold',
//         marginBottom: 20,
//         textAlign: 'center'
//     },
//     input: {
//         borderWidth: 1,
//         borderColor: '#ccc',
//         padding: 12,
//         marginBottom: 15,
//         borderRadius: 8,
//     },
//     link: {
//         marginTop: 15,
//         textAlign: 'center',
//         color: 'blue'
//     }
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

export default function LoginScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const handleLogin = async () => {
    try {
      const res = await fetch(`${BASE_URL}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Login failed');

      await AsyncStorage.setItem('token', data.token);
      router.replace('/');
    } catch (err: any) {
      Alert.alert('Login Error', err.message);
    }
  };

  return (
    <LinearGradient
      colors={['#2BB6A8', '#EAF6F5']}
      style={{ flex: 1 }}
    >
      <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.card}>
          <Text style={styles.heading}>Welcome Back</Text>
          <Text style={styles.subHeading}>
            Continue your wellness journey
          </Text>

          <View style={styles.inputWrapper}>
            <Text style={styles.label}>Email</Text>
            <TextInput
              value={email}
              onChangeText={setEmail}
              style={styles.input}
              placeholder="Enter your email"
              placeholderTextColor="#A0B4BA"
              keyboardType="email-address"
              autoCapitalize="none"
            />
          </View>

          <View style={styles.inputWrapper}>
            <Text style={styles.label}>Password</Text>
            <View style={styles.passwordContainer}>
              <TextInput
                value={password}
                onChangeText={setPassword}
                style={styles.passwordInput}
                secureTextEntry={!showPassword}
                placeholder="Enter your password"
                placeholderTextColor="#A0B4BA"
              />
              <Pressable
                onPress={() => setShowPassword(!showPassword)}
              >
                <Ionicons
                  name={showPassword ? 'eye-off-outline' : 'eye-outline'}
                  size={22}
                  color="#5C6F75"
                />
              </Pressable>
            </View>
          </View>

          <Pressable
            style={({ pressed }) => [
              styles.button,
              pressed && { opacity: 0.9, transform: [{ scale: 0.98 }] },
            ]}
            onPress={handleLogin}
          >
            <Text style={styles.buttonText}>Login</Text>
          </Pressable>

          <Text style={styles.footerText}>
            Don't have an account?{' '}
            <Text
              style={styles.footerLink}
              onPress={() => router.push('/register')}
            >
              Register
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

  input: {
    backgroundColor: '#F4FBFA',
    borderRadius: 18,
    paddingVertical: 15,
    paddingHorizontal: 18,
    fontSize: 15,
    borderWidth: 1,
    borderColor: '#DCEEEE',
  },

  passwordContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F4FBFA',
    borderRadius: 18,
    paddingHorizontal: 18,
    borderWidth: 1,
    borderColor: '#DCEEEE',
  },

  passwordInput: {
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