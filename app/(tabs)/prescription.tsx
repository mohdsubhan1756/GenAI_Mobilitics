// import * as ImagePicker from 'expo-image-picker';
// import { useState } from 'react';
// import { Button, Image, StyleSheet, Text, View } from 'react-native';


// export default function PrescriptionScreen() {
//     const [image, setImage] = useState<string | null>(null);
//     const [result, setResult] = useState<any>(null);

//     const pickImage = async () => {
//         const res = await ImagePicker.launchCameraAsync({
//             base64: false,
//             quality: 0.7,
//         });

//         if (!res.canceled) {
//             setImage(res.assets[0].uri);
//             upload(res.assets[0]);
//         }
//     };

//     const upload = async (asset: any) => {
//         const formData = new FormData();
//         formData.append('image', {
//             uri: asset.uri,
//             name: 'prescription.jpg',
//             type: 'image/jpeg',
//         } as any);

//         const response = await fetch(
//             'http://192.168.0.108:5000/api/prescriptions/upload',
//             {
//                 method: 'POST',
//                 body: formData,
//             }
//         );

//         const data = await response.json();
//         setResult(data);
//     };

//     return (
//         <View style={styles.container}>
//             <Button title="Scan Prescription" onPress={pickImage} />

//             {image && <Image source={{ uri: image }} style={styles.image} />}

//             {result && (
//                 <View style={styles.card}>
//                     <Text>Diagnosis: {result.diagnosis}</Text>
//                     <Text>Body Part: {result.bodyPart}</Text>
//                     <Text>Severity: {result.severity}</Text>
//                 </View>
//             )}
//         </View>
//     );
// }

// const styles = StyleSheet.create({
//     container: { flex: 1, padding: 50 },
//     image: { width: '100%', height: 200, marginVertical: 10 },
//     card: {
//         backgroundColor: '#f5f5f5',
//         padding: 15,
//         borderRadius: 10,
//     },
// });


// import AsyncStorage from '@react-native-async-storage/async-storage';
// import * as ImagePicker from 'expo-image-picker';
// import { router } from 'expo-router';
// import { useState } from 'react';
// import {
//     ActivityIndicator,
//     Alert,
//     Button,
//     Image,
//     ScrollView,
//     StyleSheet,
//     Text,
//     View,
// } from 'react-native';
// import BASE_URL from '../../config/api.js';



// export default function PrescriptionScreen() {
//     const [image, setImage] = useState<string | null>(null);
//     const [result, setResult] = useState<any>(null);
//     const [loading, setLoading] = useState(false);


//     // =======================
//     // COMMON UPLOAD FUNCTION
//     // =======================
//     const upload = async (asset: any) => {
//         try {
//             setLoading(true);
//             setResult(null);

//             const token = await AsyncStorage.getItem('token');

//             const formData = new FormData();
//             formData.append('image', {
//                 uri: asset.uri,
//                 name: 'prescription.jpg',
//                 type: 'image/jpeg',
//             } as any);

//             const response = await fetch(
//                 // 'http://192.168.0.108:5000/api/prescriptions/upload',
//                 `${BASE_URL}/api/prescriptions/upload`,
//                 {
//                     method: 'POST',
//                     // headers: {
//                     //     Authorization: `Bearer ${token}`, // 🔐 REQUIRED
//                     // },
//                     body: formData,
//                 }
//             );


//             if (!response.ok) {
//                 throw new Error('Failed to upload prescription');
//             }

//             const data = await response.json();
//             setResult(data.data);

//             // 🚀 Navigate to Plan Result screen
//             router.push({
//   pathname: '/plan-result/[id]',
//   params: { id: data.data._id }, // correct
// });
        

//         } catch (err: any) {
//             console.error(err);
//             Alert.alert('Error', err.message || 'Something went wrong');
//         } finally {
//             setLoading(false);
//         }
//     };

//     // =======================
//     // CAMERA
//     // =======================
//     const openCamera = async () => {
//         const permission = await ImagePicker.requestCameraPermissionsAsync();
//         if (!permission.granted) {
//             Alert.alert('Permission required', 'Camera access is needed');
//             return;
//         }

//         const res = await ImagePicker.launchCameraAsync({
//             quality: 0.7,
//             allowsEditing: true,
//         });

//         if (!res.canceled) {
//             setImage(res.assets[0].uri);
//             upload(res.assets[0]); // 🔥 API CALL HERE
//         }
//     };

//     // =======================
//     // GALLERY
//     // =======================
//     const openGallery = async () => {
//         const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
//         if (!permission.granted) {
//             Alert.alert('Permission required', 'Gallery access is needed');
//             return;
//         }

//         const res = await ImagePicker.launchImageLibraryAsync({
//             mediaTypes: ['images'],
//             quality: 0.7,
//             allowsEditing: true,
//         });


//         if (!res.canceled) {
//             setImage(res.assets[0].uri);
//             upload(res.assets[0]); // 🔥 API CALL HERE
//         }
//     };

//     return (
//         <ScrollView contentContainerStyle={styles.container}>
//             <Text style={styles.title}>📄 Prescription Analysis</Text>

//             <View style={styles.buttonGroup}>
//                 <Button title="📷 Take Photo" onPress={openCamera} />
//                 <View style={{ height: 10 }} />
//                 <Button title="🖼️ Choose from Gallery" onPress={openGallery} />
//             </View>

//             {image && (
//                 <Image source={{ uri: image }} style={styles.image} />
//             )}

//             {loading && (
//                 <ActivityIndicator size="large" color="#007AFF" />
//             )}

//             {/* {result && (
//                 <View style={styles.card}>
//                     <Text style={styles.cardTitle}>🧠 Analysis Result</Text>

//                     <Text style={styles.item}>
//                         <Text style={styles.label}>Diagnosis:</Text> {result.diagnosis}
//                     </Text>

//                     <Text style={styles.item}>
//                         <Text style={styles.label}>Body Part:</Text> {result.bodyPart}
//                     </Text>

//                     <Text style={styles.item}>
//                         <Text style={styles.label}>Severity:</Text> {result.severity}
//                     </Text>
//                 </View>
//             )} */}

//             {result && (
//   <View style={styles.card}>
//     <Text style={styles.cardTitle}>🧠 Analysis Result</Text>

//     <Text style={styles.item}>
//       <Text style={styles.label}>Diagnosis:</Text> {result.diagnosis}
//     </Text>

//     <Text style={styles.item}>
//       <Text style={styles.label}>Body Part:</Text> {result.bodyPart}
//     </Text>

//     <Text style={styles.item}>
//       <Text style={styles.label}>Severity:</Text> {result.severity}
//     </Text>
//   </View>
// )}
//         </ScrollView>
//     );
// }

// const styles = StyleSheet.create({
//     container: {
//         padding: 20,
//         paddingBottom: 40,
//         backgroundColor: '#fff',
//         flexGrow: 1,
//     },
//     title: {
//         fontSize: 24,
//         fontWeight: '700',
//         marginBottom: 20,
//         textAlign: 'center',
//     },
//     buttonGroup: {
//         marginBottom: 20,
//     },
//     image: {
//         width: '100%',
//         height: 220,
//         borderRadius: 12,
//         marginVertical: 15,
//     },
//     card: {
//         backgroundColor: '#F2F6FF',
//         padding: 16,
//         borderRadius: 14,
//         marginTop: 10,
//     },
//     cardTitle: {
//         fontSize: 18,
//         fontWeight: '700',
//         marginBottom: 10,
//     },
//     item: {
//         fontSize: 16,
//         marginBottom: 6,
//     },
//     label: {
//         fontWeight: '600',
//     },
// });



// import AsyncStorage from '@react-native-async-storage/async-storage';
// import * as ImagePicker from 'expo-image-picker';
// import { router } from 'expo-router';
// import { useState } from 'react';
// import {
//   ActivityIndicator,
//   Alert,
//   Button,
//   Image,
//   ScrollView,
//   StyleSheet,
//   Text,
//   View,
// } from 'react-native';
// import BASE_URL from '../../config/api';

// export default function PrescriptionScreen() {
//   const [image, setImage] = useState<string | null>(null);
//   const [result, setResult] = useState<any>(null);
//   const [loading, setLoading] = useState(false);

//   // ===================== UPLOAD FUNCTION =====================
//   // const upload = async (asset: any) => {
//   //   try {
//   //     setLoading(true);
//   //     setResult(null);

//   //     const token = await AsyncStorage.getItem('token');

//   //     const formData = new FormData();
//   //     formData.append('image', {
//   //       uri: asset.uri,
//   //       name: 'prescription.jpg',
//   //       type: 'image/jpeg',
//   //     } as any);

//   //     const response = await fetch(`${BASE_URL}/api/prescriptions/upload`, {
//   //       method: 'POST',
//   //       headers: {
//   //         Authorization: `Bearer ${token}`,
//   //       },
//   //       body: formData,
//   //     });

//   //     if (!response.ok) throw new Error('Failed to upload prescription');

//   //     const data = await response.json();
//   //     setResult(data);

//   //     // Navigate to Plan Result
//   //     router.push({
//   //       pathname: '/plan-result/[id]',
//   //       params: { id: data.data._id }, // <-- dynamic id param
//   //     });
//   //   } catch (err: any) {
//   //     console.error(err);
//   //     Alert.alert('Error', err.message || 'Something went wrong');
//   //   } finally {
//   //     setLoading(false);
//   //   }
//   // };

//   const upload = async (asset: any) => {
//   try {
//     setLoading(true);
//     setResult(null);

//     const token = await AsyncStorage.getItem('token');
//     if (!token) {
//       router.replace('/login');
//       return;
//     }

//     // Parse the userId from token payload
//     const payload = JSON.parse(atob(token.split('.')[1])) as { id: string };
//     const userId = payload.id;

//     const formData = new FormData();
//     formData.append('image', {
//       uri: asset.uri,
//       name: 'prescription.jpg',
//       type: 'image/jpeg',
//     } as any);

//     // Append userId
//     formData.append('userId', userId);

//     const response = await fetch(`${BASE_URL}/api/prescriptions/upload`, {
//       method: 'POST',
//       headers: {
//         Authorization: `Bearer ${token}`,
//         // Don't set Content-Type manually; let fetch handle multipart/form-data
//       },
//       body: formData,
//     });

//     if (!response.ok) throw new Error('Failed to upload prescription');

//     const data = await response.json();
//     setResult(data);

//     // Navigate to Plan Result
//     router.push({
//       pathname: '/plan-result/[id]',
//       params: { id: data.data._id },
//     });
//   } catch (err: any) {
//     console.error(err);
//     Alert.alert('Error', err.message || 'Something went wrong');
//   } finally {
//     setLoading(false);
//   }
// };

//   // ===================== CAMERA =====================
//   const openCamera = async () => {
//     const permission = await ImagePicker.requestCameraPermissionsAsync();
//     if (!permission.granted) {
//       Alert.alert('Permission required', 'Camera access is needed');
//       return;
//     }

//     const res = await ImagePicker.launchCameraAsync({
//       quality: 0.7,
//       allowsEditing: true,
//     });

//     if (!res.canceled) {
//       setImage(res.assets[0].uri);
//       upload(res.assets[0]);
//     }
//   };

//   // ===================== GALLERY =====================
//   const openGallery = async () => {
//     const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
//     if (!permission.granted) {
//       Alert.alert('Permission required', 'Gallery access is needed');
//       return;
//     }

//     const res = await ImagePicker.launchImageLibraryAsync({
//       mediaTypes: ['images'],
//       quality: 0.7,
//       allowsEditing: true,
//     });

//     if (!res.canceled) {
//       setImage(res.assets[0].uri);
//       upload(res.assets[0]);
//     }
//   };

//   return (
//     <ScrollView contentContainerStyle={styles.container}>
//       <Text style={styles.title}>📄 Prescription Analysis</Text>

//       <View style={styles.buttonGroup}>
//         <Button title="📷 Take Photo" onPress={openCamera} />
//         <View style={{ height: 10 }} />
//         <Button title="🖼️ Choose from Gallery" onPress={openGallery} />
//       </View>

//       {image && <Image source={{ uri: image }} style={styles.image} />}
//       {loading && <ActivityIndicator size="large" color="#007AFF" />}

//       {result && (
//         <View style={styles.card}>
//           <Text style={styles.cardTitle}>🧠 Analysis Result</Text>
//           <Text style={styles.item}>
//             <Text style={styles.label}>Diagnosis:</Text> {result.data.diagnosis}
//           </Text>
//           <Text style={styles.item}>
//             <Text style={styles.label}>Body Part:</Text> {result.data.bodyPart}
//           </Text>
//           <Text style={styles.item}>
//             <Text style={styles.label}>Severity:</Text> {result.data.severity}
//           </Text>
//         </View>
//       )}
//     </ScrollView>
//   );
// }

// const styles = StyleSheet.create({
//   container: {
//     padding: 20,
//     paddingBottom: 40,
//     backgroundColor: '#fff',
//     flexGrow: 1,
//   },
//   title: { fontSize: 24, fontWeight: '700', marginBottom: 20, textAlign: 'center' },
//   buttonGroup: { marginBottom: 20 },
//   image: { width: '100%', height: 220, borderRadius: 12, marginVertical: 15 },
//   card: { backgroundColor: '#F2F6FF', padding: 16, borderRadius: 14, marginTop: 10 },
//   cardTitle: { fontSize: 18, fontWeight: '700', marginBottom: 10 },
//   item: { fontSize: 16, marginBottom: 6 },
//   label: { fontWeight: '600' },
// });




import AsyncStorage from '@react-native-async-storage/async-storage';
import * as ImagePicker from 'expo-image-picker';
import { router } from 'expo-router';
import { useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  View,
  Pressable,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import BASE_URL from '../../config/api';

export default function PrescriptionScreen() {
  const [image, setImage] = useState<string | null>(null);
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  // ===================== UPLOAD (UNCHANGED LOGIC) =====================
  const upload = async (asset: any) => {
    try {
      setLoading(true);
      setResult(null);

      const token = await AsyncStorage.getItem('token');
      if (!token) {
        router.replace('/login');
        return;
      }

      const payload = JSON.parse(atob(token.split('.')[1])) as { id: string };
      const userId = payload.id;

      const formData = new FormData();
      formData.append('image', {
        uri: asset.uri,
        name: 'prescription.jpg',
        type: 'image/jpeg',
      } as any);

      formData.append('userId', userId);

      const response = await fetch(`${BASE_URL}/api/prescriptions/upload`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      if (!response.ok) throw new Error('Failed to upload prescription');

      const data = await response.json();
      setResult(data);

      router.push({
        pathname: '/plan-result/[id]',
        params: { id: data.data._id },
      });
    } catch (err: any) {
      Alert.alert('Error', err.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  // ===================== CAMERA =====================
  const openCamera = async () => {
    const permission = await ImagePicker.requestCameraPermissionsAsync();
    if (!permission.granted) {
      Alert.alert('Permission required', 'Camera access is needed');
      return;
    }

    const res = await ImagePicker.launchCameraAsync({
      quality: 0.7,
      allowsEditing: true,
    });

    if (!res.canceled) {
      setImage(res.assets[0].uri);
      upload(res.assets[0]);
    }
  };

  // ===================== GALLERY =====================
  const openGallery = async () => {
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permission.granted) {
      Alert.alert('Permission required', 'Gallery access is needed');
      return;
    }

    const res = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      quality: 0.7,
      allowsEditing: true,
    });

    if (!res.canceled) {
      setImage(res.assets[0].uri);
      upload(res.assets[0]);
    }
  };

  return (
    <LinearGradient
      colors={['#1e3a8a', '#2563eb', '#38bdf8']}
      style={styles.gradient}
    >
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.title}>Prescription Analysis</Text>
        <Text style={styles.subtitle}>
          Scan or upload a prescription for AI evaluation
        </Text>

        <View style={styles.card}>
          <Pressable style={styles.primaryButton} onPress={openCamera}>
            <Ionicons name="camera-outline" size={22} color="#fff" />
            <Text style={styles.primaryText}>Take Photo</Text>
          </Pressable>

          <Pressable style={styles.secondaryButton} onPress={openGallery}>
            <Ionicons name="image-outline" size={22} color="#2563eb" />
            <Text style={styles.secondaryText}>Choose from Gallery</Text>
          </Pressable>
        </View>

        {image && (
          <View style={styles.previewCard}>
            <Image source={{ uri: image }} style={styles.image} />
          </View>
        )}

        {loading && (
          <View style={styles.loadingCard}>
            <ActivityIndicator size="large" color="#2563eb" />
            <Text style={styles.loadingText}>Analyzing Prescription...</Text>
          </View>
        )}

        {result && (
          <View style={styles.resultCard}>
            <Text style={styles.resultTitle}>AI Diagnosis</Text>

            <Text style={styles.item}>
              <Text style={styles.label}>Diagnosis: </Text>
              {result.data.diagnosis}
            </Text>

            <Text style={styles.item}>
              <Text style={styles.label}>Body Part: </Text>
              {result.data.bodyPart}
            </Text>

            <Text style={styles.item}>
              <Text style={styles.label}>Severity: </Text>
              {result.data.severity}
            </Text>
          </View>
        )}
      </ScrollView>
    </LinearGradient>
  );
}

/* ===================== STYLES ===================== */

const styles = StyleSheet.create({
  gradient: { flex: 1 },

  container: {
    flexGrow: 1,
    paddingHorizontal: 25,
    paddingTop: 80,
    paddingBottom: 40,
  },

  title: {
    fontSize: 28,
    fontWeight: '800',
    color: '#fff',
    textAlign: 'center',
  },

  subtitle: {
    textAlign: 'center',
    color: '#e0f2fe',
    marginTop: 6,
    marginBottom: 35,
  },

  card: {
    backgroundColor: '#fff',
    padding: 25,
    borderRadius: 24,
    elevation: 10,
  },

  primaryButton: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#2563eb',
    paddingVertical: 18,
    borderRadius: 16,
    marginBottom: 15,
    gap: 10,
  },

  secondaryButton: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#2563eb',
    paddingVertical: 18,
    borderRadius: 16,
    gap: 10,
  },

  primaryText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
  },

  secondaryText: {
    color: '#2563eb',
    fontSize: 16,
    fontWeight: '700',
  },

  previewCard: {
    marginTop: 25,
    borderRadius: 20,
    overflow: 'hidden',
    elevation: 8,
  },

  image: {
    width: '100%',
    height: 240,
  },

  loadingCard: {
    marginTop: 25,
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 16,
    alignItems: 'center',
  },

  loadingText: {
    marginTop: 10,
    color: '#2563eb',
    fontWeight: '600',
  },

  resultCard: {
    marginTop: 25,
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 20,
    elevation: 8,
  },

  resultTitle: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 12,
    color: '#2563eb',
  },

  item: {
    fontSize: 15,
    marginBottom: 6,
  },

  label: {
    fontWeight: '700',
  },
});