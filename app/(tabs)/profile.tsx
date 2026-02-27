// import AsyncStorage from '@react-native-async-storage/async-storage';
// import { router } from 'expo-router';
// import { useEffect, useState } from 'react';
// import {
//     View,
//     Text,
//     StyleSheet,
//     TextInput,
//     TouchableOpacity,
//     ScrollView,
//     Alert
// } from 'react-native';
// import { KeyboardAvoidingView, Platform } from 'react-native';

// import BASE_URL from '../../config/api.js';

// export default function ProfileScreen() {

//     const [user, setUser] = useState<any>(null);
//     const [editing, setEditing] = useState(false);

//     const [name, setName] = useState('');
//     const [phone, setPhone] = useState('');
//     const [address, setAddress] = useState('');
//     const [dob, setDob] = useState('');

//     const [oldPassword, setOldPassword] = useState('');
//     const [newPassword, setNewPassword] = useState('');

//     const [userId, setUserId] = useState('');

//     useEffect(() => {

//         fetchProfile();

//     }, []);


//     const fetchProfile = async () => {
//   try {
//     const token = await AsyncStorage.getItem('token');
//     if (!token) return router.replace('/login');

//     const payload = JSON.parse(atob(token.split('.')[1]));
//     setUserId(payload.id);

//     const res = await fetch(`${BASE_URL}/api/user/profile`, {
//       method: 'POST',
//       headers: { 'Content-Type': 'application/json' },
//       body: JSON.stringify({ userId: payload.id }),
//     });

//     if (!res.ok) throw new Error("Failed to fetch profile");

//     const data = await res.json();
//     setUser(data);
//     setName(data.name);
//     setPhone(data.phone);
//     setAddress(data.address);
//     setDob(data.dob ? new Date(data.dob).toISOString().substring(0, 10) : '');
//   } catch (err) {
//     console.error(err);
//     await AsyncStorage.removeItem('token');
//     router.replace('/login');
//   }
// };


//     /* =====================
//     UPDATE PROFILE
//     ===================== */

//     const updateProfile = async () => {

//         const res = await fetch(`${BASE_URL}/api/user/update`, {

//             method: 'PUT',

//             headers: { 'Content-Type': 'application/json' },

//             body: JSON.stringify({

//                 userId,
//                 name,
//                 phone,
//                 address,
//                 dob

//             })

//         });

//         const data = await res.json();

//         setUser(data);

//         setEditing(false);

//         Alert.alert("Profile updated");

//     };


//     /* =====================
//     CHANGE PASSWORD
//     ===================== */

//     const changePassword = async () => {

//         const res = await fetch(`${BASE_URL}/api/user/change-password`, {

//             method: 'PUT',

//             headers: { 'Content-Type': 'application/json' },

//             body: JSON.stringify({

//                 userId,
//                 oldPassword,
//                 newPassword

//             })

//         });

//         const data = await res.json();

//         Alert.alert(data.message);

//     };


//     /* =====================
//     DELETE ACCOUNT
//     ===================== */

//     const deleteAccount = async () => {

//         Alert.alert(

//             "Delete Account",

//             "Are you sure?",

//             [

//                 { text: "Cancel" },

//                 {

//                     text: "Delete",

//                     onPress: async () => {

//                         await fetch(`${BASE_URL}/api/user/delete`, {

//                             method: 'DELETE',

//                             headers: { 'Content-Type': 'application/json' },

//                             body: JSON.stringify({ userId })

//                         });

//                         await AsyncStorage.removeItem('token');

//                         router.replace('/login');

//                     }

//                 }

//             ]

//         );

//     };


//     if (!user) {
//         return <Text>Loading...</Text>
//     }

//     return (

//         <ScrollView style={styles.container}>

//             <Text style={styles.title}>My Profile</Text>


//             <View style={styles.card}>

//                 <Text style={styles.label}>Name</Text>

//                 <TextInput
//                     style={styles.input}
//                     value={name}
//                     editable={editing}
//                     onChangeText={setName}
//                 />


//                 <Text style={styles.label}>Email</Text>

//                 <TextInput
//                     style={styles.input}
//                     value={user.email}
//                     editable={false}
//                 />


//                 <Text style={styles.label}>Phone</Text>

//                 <TextInput
//                     style={styles.input}
//                     value={phone}
//                     editable={editing}
//                     onChangeText={setPhone}
//                 />


//                 <Text style={styles.label}>Address</Text>

//                 <TextInput
//                     style={styles.input}
//                     value={address}
//                     editable={editing}
//                     onChangeText={setAddress}
//                 />


//                 <Text style={styles.label}>Date of Birth</Text>

//                 <TextInput
//                     style={styles.input}
//                     value={dob}
//                     editable={editing}
//                     onChangeText={setDob}
//                 />

//             </View>


//             {editing ? (

//                 <TouchableOpacity style={styles.saveBtn} onPress={updateProfile}>
//                     <Text style={styles.btnText}>Save Changes</Text>
//                 </TouchableOpacity>

//             ) : (

//                 <TouchableOpacity style={styles.editBtn} onPress={() => setEditing(true)}>
//                     <Text style={styles.btnText}>Edit Profile</Text>
//                 </TouchableOpacity>

//             )}



//             <View style={styles.card}>

//                 <Text style={styles.section}>Change Password</Text>

//                 <TextInput
//                     placeholder="Old Password"
//                     secureTextEntry
//                     style={styles.input}
//                     onChangeText={setOldPassword}
//                 />

//                 <TextInput
//                     placeholder="New Password"
//                     secureTextEntry
//                     style={styles.input}
//                     onChangeText={setNewPassword}
//                 />

//                 <TouchableOpacity style={styles.passwordBtn} onPress={changePassword}>
//                     <Text style={styles.btnText}>Update Password</Text>
//                 </TouchableOpacity>

//             </View>



//             <TouchableOpacity style={styles.deleteBtn} onPress={deleteAccount}>
//                 <Text style={styles.btnText}>Delete Account</Text>
//             </TouchableOpacity>


//         </ScrollView>

//     )

// }



// const styles = StyleSheet.create({

//     container: {
//         flex: 1,
//         backgroundColor: "#f4f6f8",
//         padding: 20
//     },

//     title: {
//         fontSize: 26,
//         fontWeight: "bold",
//         marginBottom: 20
//     },

//     card: {
//         backgroundColor: "#fff",
//         padding: 20,
//         borderRadius: 15,
//         marginBottom: 20,
//         elevation: 3
//     },

//     label: {
//         fontSize: 14,
//         color: "#555",
//         marginTop: 10
//     },

//     input: {
//         backgroundColor: "#f1f3f5",
//         padding: 12,
//         borderRadius: 10,
//         marginTop: 5
//     },

//     section: {
//         fontSize: 18,
//         fontWeight: "bold",
//         marginBottom: 10
//     },

//     editBtn: {
//         backgroundColor: "#1E90FF",
//         padding: 15,
//         borderRadius: 10,
//         alignItems: "center",
//         marginBottom: 20
//     },

//     saveBtn: {
//         backgroundColor: "#28a745",
//         padding: 15,
//         borderRadius: 10,
//         alignItems: "center",
//         marginBottom: 20
//     },

//     passwordBtn: {
//         backgroundColor: "#ff9800",
//         padding: 15,
//         borderRadius: 10,
//         alignItems: "center",
//         marginTop: 10
//     },

//     deleteBtn: {
//         backgroundColor: "#e53935",
//         padding: 15,
//         borderRadius: 10,
//         alignItems: "center"
//     },

//     btnText: {
//         color: "#fff",
//         fontWeight: "bold"
//     }

// });










import AsyncStorage from '@react-native-async-storage/async-storage';
import { router } from 'expo-router';
import { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Alert,
  Platform,
} from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';

import BASE_URL from '../../config/api.js';

export default function ProfileScreen() {
  const [user, setUser] = useState<any>(null);
  const [editing, setEditing] = useState(false);

  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [dob, setDob] = useState('');

  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');

  const [userId, setUserId] = useState('');

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const token = await AsyncStorage.getItem('token');
      if (!token) return router.replace('/login');

      const payload = JSON.parse(atob(token.split('.')[1]));
      setUserId(payload.id);

      const res = await fetch(`${BASE_URL}/api/user/profile`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: payload.id }),
      });

      if (!res.ok) throw new Error('Failed to fetch profile');

      const data = await res.json();
      setUser(data);
      setName(data.name);
      setPhone(data.phone);
      setAddress(data.address);
      setDob(data.dob ? new Date(data.dob).toISOString().substring(0, 10) : '');
    } catch (err) {
      console.error(err);
      await AsyncStorage.removeItem('token');
      router.replace('/login');
    }
  };

  const updateProfile = async () => {
    const res = await fetch(`${BASE_URL}/api/user/update`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId, name, phone, address, dob }),
    });

    const data = await res.json();
    setUser(data);
    setEditing(false);
    Alert.alert('Profile updated');
  };

  const changePassword = async () => {
    const res = await fetch(`${BASE_URL}/api/user/change-password`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId, oldPassword, newPassword }),
    });

    const data = await res.json();
    Alert.alert(data.message);
  };

  const deleteAccount = async () => {
    Alert.alert('Delete Account', 'Are you sure?', [
      { text: 'Cancel' },
      {
        text: 'Delete',
        onPress: async () => {
          await fetch(`${BASE_URL}/api/user/delete`, {
            method: 'DELETE',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ userId }),
          });

          await AsyncStorage.removeItem('token');
          router.replace('/login');
        },
      },
    ]);
  };

  if (!user) return <Text style={styles.loading}>Loading...</Text>;

  return (
    <KeyboardAwareScrollView
      style={styles.container}
      contentContainerStyle={{ paddingBottom: 50 }}
      enableOnAndroid={true}
      extraScrollHeight={Platform.OS === 'ios' ? 20 : 100}
      keyboardShouldPersistTaps="handled"
    >
      <Text style={styles.title}>My Profile</Text>

      <View style={styles.card}>
        <Text style={styles.label}>Name</Text>
        <TextInput style={styles.input} value={name} editable={editing} onChangeText={setName} />

        <Text style={styles.label}>Email</Text>
        <TextInput style={styles.input} value={user.email} editable={false} />

        <Text style={styles.label}>Phone</Text>
        <TextInput style={styles.input} value={phone} editable={editing} onChangeText={setPhone} />

        <Text style={styles.label}>Address</Text>
        <TextInput style={styles.input} value={address} editable={editing} onChangeText={setAddress} />

        <Text style={styles.label}>Date of Birth</Text>
        <TextInput style={styles.input} value={dob} editable={editing} onChangeText={setDob} />
      </View>

      {editing ? (
        <TouchableOpacity style={styles.saveBtn} onPress={updateProfile}>
          <Text style={styles.btnText}>Save Changes</Text>
        </TouchableOpacity>
      ) : (
        <TouchableOpacity style={styles.editBtn} onPress={() => setEditing(true)}>
          <Text style={styles.btnText}>Edit Profile</Text>
        </TouchableOpacity>
      )}

      <View style={styles.card}>
        <Text style={styles.section}>Change Password</Text>

        <TextInput
          placeholder="Old Password"
          secureTextEntry
          style={styles.input}
          onChangeText={setOldPassword}
        />
        <TextInput
          placeholder="New Password"
          secureTextEntry
          style={styles.input}
          onChangeText={setNewPassword}
        />

        <TouchableOpacity style={styles.passwordBtn} onPress={changePassword}>
          <Text style={styles.btnText}>Update Password</Text>
        </TouchableOpacity>
      </View>

      <TouchableOpacity style={styles.deleteBtn} onPress={deleteAccount}>
        <Text style={styles.btnText}>Delete Account</Text>
      </TouchableOpacity>
    </KeyboardAwareScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f4f6f8', padding: 20 },
  title: { fontSize: 26, fontWeight: 'bold', marginBottom: 20 },
  card: { backgroundColor: '#fff', padding: 20, borderRadius: 15, marginBottom: 20, elevation: 3 },
  label: { fontSize: 14, color: '#555', marginTop: 10 },
  input: { backgroundColor: '#f1f3f5', padding: 12, borderRadius: 10, marginTop: 5 },
  section: { fontSize: 18, fontWeight: 'bold', marginBottom: 10 },
  editBtn: { backgroundColor: '#1E90FF', padding: 15, borderRadius: 10, alignItems: 'center', marginBottom: 20 },
  saveBtn: { backgroundColor: '#28a745', padding: 15, borderRadius: 10, alignItems: 'center', marginBottom: 20 },
  passwordBtn: { backgroundColor: '#ff9800', padding: 15, borderRadius: 10, alignItems: 'center', marginTop: 10 },
  deleteBtn: { backgroundColor: '#e53935', padding: 15, borderRadius: 10, alignItems: 'center' },
  btnText: { color: '#fff', fontWeight: 'bold' },
  loading: { flex: 1, textAlign: 'center', marginTop: 50, fontSize: 18 },
});