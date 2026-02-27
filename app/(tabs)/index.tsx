// import { router } from 'expo-router';
// import { Accelerometer } from 'expo-sensors';
// import { fft } from 'fft-js';
// import { useEffect, useRef, useState } from 'react';
// import { Button, StyleSheet, Text, View } from 'react-native';
// import * as ss from 'simple-statistics';

// export default function HomeScreen() {
//   const [data, setData] = useState({ x: 0, y: 0, z: 0 });
//   const [recording, setRecording] = useState(false);
//   const [records, setRecords] = useState<any[]>([]);
//   const [timer, setTimer] = useState(0);
//   const [stabilityScore, setStabilityScore] = useState<number | null>(null);
//   const [status, setStatus] = useState<string | null>(null);

//   // 🔒 Prevent duplicate submissions
//   const submittedRef = useRef(false);

//   // ---------- Feature Extraction ----------
//   const extractFeatures = (records: any[]) => {
//     if (records.length < 128) return null;

//     const xArray = records
//       .map(r => r.x)
//       .filter(v => typeof v === 'number' && !isNaN(v));

//     const yArray = records
//       .map(r => r.y)
//       .filter(v => typeof v === 'number' && !isNaN(v));

//     if (xArray.length < 128) return null;

//     const varianceX = ss.variance(xArray);
//     const peakToPeakY = Math.max(...yArray) - Math.min(...yArray);

//     const nearestPowerOf2 = (n: number) =>
//       Math.pow(2, Math.floor(Math.log2(n)));

//     const fftLength = nearestPowerOf2(xArray.length);
//     const fftSignal = xArray.slice(0, fftLength);

//     const phasors: [number, number][] = fft(fftSignal);
//     const magnitudes = phasors
//       .slice(1)
//       .map(p => Math.sqrt(p[0] ** 2 + p[1] ** 2));

//     const maxIndex = magnitudes.indexOf(Math.max(...magnitudes)) + 1;
//     const swayFrequency = (maxIndex * 20) / fftLength;

//     return { varianceX, peakToPeakY, swayFrequency };
//   };

//   const calculateStabilityScore = (features: any) => {
//     const normVariance = Math.min(features.varianceX / 0.02, 1);
//     const normPeak = Math.min(features.peakToPeakY / 0.5, 1);
//     const normFreq = Math.min(features.swayFrequency / 2, 1);

//     const score =
//       100 - (normVariance * 40 + normPeak * 40 + normFreq * 20);

//     return Math.max(0, Math.min(100, score));
//   };

//   // ---------- Accelerometer Listener ----------
//   useEffect(() => {
//     Accelerometer.setUpdateInterval(50);

//     const sub = Accelerometer.addListener(d => {
//       setData(d);
//       if (recording) {
//         setRecords(prev => [...prev, { t: Date.now(), ...d }]);
//       }
//     });

//     return () => sub.remove();
//   }, [recording]);

//   // ---------- Start Test ----------
//   const startRecording = () => {
//     submittedRef.current = false; // reset submission lock
//     setRecords([]);
//     setTimer(0);
//     setStabilityScore(null);
//     setStatus(null);
//     setRecording(true);

//     const interval = setInterval(() => {
//       setTimer(prev => {
//         if (prev >= 30) {
//           clearInterval(interval);
//           setRecording(false);
//         }
//         return prev + 1;
//       });
//     }, 1000);
//   };

//   // ---------- Submit Once ----------
//   useEffect(() => {
//     if (!recording && records.length >= 128 && !submittedRef.current) {
//       submittedRef.current = true; // 🔒 block duplicates

//       const features = extractFeatures(records);
//       if (!features) return;

//       const score = calculateStabilityScore(features);
//       setStabilityScore(score);

//       fetch('http://192.168.0.108:5000/api/tests/add', {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify({ ...features, stabilityScore: score }),
//       })
//         .then(res => res.json())
//         .then(data => {
//           setStatus(data.status);
//           router.push('/history'); // 🚀 auto-refresh history
//         })
//         .catch(err => console.error('API error:', err));
//     }
//   }, [recording]);

//   // ---------- UI ----------
//   return (
//     <View style={styles.container}>
//       <Text style={styles.title}>Balance & Stability Test</Text>

//       <View style={styles.sensorCard}>
//         <Text style={styles.cardTitle}>Accelerometer Data</Text>
//         <Text style={styles.cardText}>X: {data.x.toFixed(2)}</Text>
//         <Text style={styles.cardText}>Y: {data.y.toFixed(2)}</Text>
//         <Text style={styles.cardText}>Z: {data.z.toFixed(2)}</Text>
//       </View>

//       <View style={styles.timerCard}>
//         <Text style={styles.timerText}>Timer: {timer}s</Text>
//         <Button
//           title={recording ? 'Recording...' : 'Start 30s Test'}
//           onPress={startRecording}
//           disabled={recording}
//           color={recording ? '#bbb' : '#4CAF50'}
//         />
//       </View>

//       <View style={styles.recordsCard}>
//         <Text style={styles.cardText}>
//           Records Collected: {records.length}
//         </Text>
//       </View>

//       {stabilityScore !== null && (
//         <View
//           style={[
//             styles.resultCard,
//             status === 'Recovering'
//               ? styles.recovering
//               : status === 'Stagnant'
//                 ? styles.stagnant
//                 : styles.regressing,
//           ]}
//         >
//           <Text style={styles.scoreText}>
//             Stability Score: {stabilityScore.toFixed(1)}
//           </Text>
//           <Text style={styles.statusText}>{status}</Text>
//         </View>
//       )}
//     </View>
//   );
// }

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: '#f2f2f2',
//     alignItems: 'center',
//     paddingTop: 60,
//   },
//   title: {
//     fontSize: 24,
//     fontWeight: 'bold',
//     marginBottom: 20,
//     color: '#333',
//   },
//   sensorCard: {
//     width: '90%',
//     backgroundColor: '#fff',
//     borderRadius: 15,
//     padding: 20,
//     marginBottom: 15,
//     elevation: 5,
//   },
//   timerCard: {
//     width: '90%',
//     backgroundColor: '#fff',
//     borderRadius: 15,
//     padding: 20,
//     marginBottom: 15,
//     alignItems: 'center',
//     elevation: 4,
//   },
//   recordsCard: {
//     width: '90%',
//     backgroundColor: '#fff',
//     borderRadius: 15,
//     padding: 15,
//     marginBottom: 15,
//     elevation: 3,
//   },
//   cardTitle: { fontSize: 18, fontWeight: 'bold', marginBottom: 10 },
//   cardText: { fontSize: 16 },
//   timerText: { fontSize: 18, marginBottom: 10 },
//   resultCard: {
//     width: '90%',
//     borderRadius: 15,
//     padding: 25,
//     marginTop: 20,
//     alignItems: 'center',
//   },
//   recovering: { backgroundColor: '#e0f7e9' },
//   stagnant: { backgroundColor: '#fff8e1' },
//   regressing: { backgroundColor: '#fdecea' },
//   scoreText: { fontSize: 22, fontWeight: 'bold' },
//   statusText: { fontSize: 20, marginTop: 10, fontWeight: '600' },
// });









// import AsyncStorage from '@react-native-async-storage/async-storage';
// import { router } from 'expo-router';
// import { Accelerometer } from 'expo-sensors';
// import { fft } from 'fft-js';
// import { useEffect, useRef, useState } from 'react';
// import { Button, StyleSheet, Text, View } from 'react-native';
// import * as ss from 'simple-statistics';

// export default function HomeScreen() {
//   const [data, setData] = useState({ x: 0, y: 0, z: 0 });
//   const [recording, setRecording] = useState(false);
//   const [records, setRecords] = useState<any[]>([]);
//   const [timer, setTimer] = useState(0);
//   const [stabilityScore, setStabilityScore] = useState<number | null>(null);
//   const [status, setStatus] = useState<string | null>(null);
//   const [userId, setUserId] = useState<string | null>(null);

//   // 🔒 Prevent duplicate submissions
//   const submittedRef = useRef(false);

//   // ---------- Check Authentication ----------
//   useEffect(() => {
//     const checkLogin = async () => {
//       const token = await AsyncStorage.getItem('token');
//       if (!token) {
//         router.replace('/login'); // redirect to login if not logged in
//         return;
//       }

//       // Optionally decode token to get userId
//       const payload = JSON.parse(atob(token.split('.')[1]));
//       setUserId(payload.userId);
//     };

//     checkLogin();
//   }, []);

//   // ---------- Feature Extraction ----------
//   const extractFeatures = (records: any[]) => {
//     if (records.length < 128) return null;

//     const xArray = records.map(r => r.x).filter(v => typeof v === 'number' && !isNaN(v));
//     const yArray = records.map(r => r.y).filter(v => typeof v === 'number' && !isNaN(v));

//     if (xArray.length < 128) return null;

//     const varianceX = ss.variance(xArray);
//     const peakToPeakY = Math.max(...yArray) - Math.min(...yArray);

//     const nearestPowerOf2 = (n: number) => Math.pow(2, Math.floor(Math.log2(n)));
//     const fftLength = nearestPowerOf2(xArray.length);
//     const fftSignal = xArray.slice(0, fftLength);

//     const phasors: [number, number][] = fft(fftSignal);
//     const magnitudes = phasors.slice(1).map(p => Math.sqrt(p[0] ** 2 + p[1] ** 2));

//     const maxIndex = magnitudes.indexOf(Math.max(...magnitudes)) + 1;
//     const swayFrequency = (maxIndex * 20) / fftLength;

//     return { varianceX, peakToPeakY, swayFrequency };
//   };

//   const calculateStabilityScore = (features: any) => {
//     const normVariance = Math.min(features.varianceX / 0.02, 1);
//     const normPeak = Math.min(features.peakToPeakY / 0.5, 1);
//     const normFreq = Math.min(features.swayFrequency / 2, 1);

//     const score = 100 - (normVariance * 40 + normPeak * 40 + normFreq * 20);
//     return Math.max(0, Math.min(100, score));
//   };

//   // ---------- Accelerometer Listener ----------
//   useEffect(() => {
//     Accelerometer.setUpdateInterval(50);
//     const sub = Accelerometer.addListener(d => {
//       setData(d);
//       if (recording) setRecords(prev => [...prev, { t: Date.now(), ...d }]);
//     });
//     return () => sub.remove();
//   }, [recording]);

//   // ---------- Start Test ----------
//   const startRecording = () => {
//     submittedRef.current = false;
//     setRecords([]);
//     setTimer(0);
//     setStabilityScore(null);
//     setStatus(null);
//     setRecording(true);

//     const interval = setInterval(() => {
//       setTimer(prev => {
//         if (prev >= 30) {
//           clearInterval(interval);
//           setRecording(false);
//         }
//         return prev + 1;
//       });
//     }, 1000);
//   };

//   // ---------- Submit Once ----------
//   useEffect(() => {
//     if (!recording && records.length >= 128 && !submittedRef.current && userId) {
//       submittedRef.current = true;

//       const features = extractFeatures(records);
//       if (!features) return;

//       const score = calculateStabilityScore(features);
//       setStabilityScore(score);

//       // Send userId along with the data
//       fetch('http://192.168.0.108:5000/api/tests/add', {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify({ ...features, stabilityScore: score, userId }),
//       })
//         .then(res => res.json())
//         .then(data => {
//           setStatus(data.status);
//           router.push('/history'); // auto-refresh history
//         })
//         .catch(err => console.error('API error:', err));
//     }
//   }, [recording, userId]);

//   // ---------- UI ----------
//   return (
//     <View style={styles.container}>
//       <Text style={styles.title}>Balance & Stability Test</Text>

//       <View style={styles.sensorCard}>
//         <Text style={styles.cardTitle}>Accelerometer Data</Text>
//         <Text style={styles.cardText}>X: {data.x.toFixed(2)}</Text>
//         <Text style={styles.cardText}>Y: {data.y.toFixed(2)}</Text>
//         <Text style={styles.cardText}>Z: {data.z.toFixed(2)}</Text>
//       </View>

//       <View style={styles.timerCard}>
//         <Text style={styles.timerText}>Timer: {timer}s</Text>
//         <Button
//           title={recording ? 'Recording...' : 'Start 30s Test'}
//           onPress={startRecording}
//           disabled={recording}
//           color={recording ? '#bbb' : '#4CAF50'}
//         />
//       </View>

//       <View style={styles.recordsCard}>
//         <Text style={styles.cardText}>Records Collected: {records.length}</Text>
//       </View>

//       {stabilityScore !== null && (
//         <View
//           style={[
//             styles.resultCard,
//             status === 'Recovering'
//               ? styles.recovering
//               : status === 'Stagnant'
//                 ? styles.stagnant
//                 : styles.regressing,
//           ]}
//         >
//           <Text style={styles.scoreText}>Stability Score: {stabilityScore.toFixed(1)}</Text>
//           <Text style={styles.statusText}>{status}</Text>
//         </View>
//       )}
//     </View>
//   );
// }

// const styles = StyleSheet.create({
//   container: { flex: 1, backgroundColor: '#f2f2f2', alignItems: 'center', paddingTop: 60 },
//   title: { fontSize: 24, fontWeight: 'bold', marginBottom: 20, color: '#333' },
//   sensorCard: { width: '90%', backgroundColor: '#fff', borderRadius: 15, padding: 20, marginBottom: 15, elevation: 5 },
//   timerCard: { width: '90%', backgroundColor: '#fff', borderRadius: 15, padding: 20, marginBottom: 15, alignItems: 'center', elevation: 4 },
//   recordsCard: { width: '90%', backgroundColor: '#fff', borderRadius: 15, padding: 15, marginBottom: 15, elevation: 3 },
//   cardTitle: { fontSize: 18, fontWeight: 'bold', marginBottom: 10 },
//   cardText: { fontSize: 16 },
//   timerText: { fontSize: 18, marginBottom: 10 },
//   resultCard: { width: '90%', borderRadius: 15, padding: 25, marginTop: 20, alignItems: 'center' },
//   recovering: { backgroundColor: '#e0f7e9' },
//   stagnant: { backgroundColor: '#fff8e1' },
//   regressing: { backgroundColor: '#fdecea' },
//   scoreText: { fontSize: 22, fontWeight: 'bold' },
//   statusText: { fontSize: 20, marginTop: 10, fontWeight: '600' },
// });











// import AsyncStorage from '@react-native-async-storage/async-storage';
// import { router } from 'expo-router';
// import { Accelerometer } from 'expo-sensors';
// import { fft } from 'fft-js';
// import { useEffect, useRef, useState } from 'react';
// import { Button, StyleSheet, Text, View } from 'react-native';
// import * as ss from 'simple-statistics';

// export default function HomeScreen() {
//   const [data, setData] = useState({ x: 0, y: 0, z: 0 });
//   const [recording, setRecording] = useState(false);
//   const [records, setRecords] = useState<any[]>([]);
//   const [timer, setTimer] = useState(0);

//   const [stabilityScore, setStabilityScore] = useState<number | null>(null);
//   const [status, setStatus] = useState<string | null>(null);

//   const [userId, setUserId] = useState<string | null>(null);

//   // 🔒 Prevent duplicate submissions
//   const submittedRef = useRef(false);

//   // ---------- AUTH CHECK ----------
//   useEffect(() => {
//     const checkLogin = async () => {
//       const token = await AsyncStorage.getItem('token');
//       if (!token) {
//         router.replace('/login');
//         return;
//       }

//       // ✅ JWT payload contains `id`
//       const payload = JSON.parse(atob(token.split('.')[1]));
//       setUserId(payload.id);
//     };

//     checkLogin();
//   }, []);

//   // ---------- FEATURE EXTRACTION ----------
//   const extractFeatures = (records: any[]) => {
//     if (records.length < 128) return null;

//     const xArray = records.map(r => r.x).filter(v => !isNaN(v));
//     const yArray = records.map(r => r.y).filter(v => !isNaN(v));

//     if (xArray.length < 128) return null;

//     const varianceX = ss.variance(xArray);
//     const peakToPeakY = Math.max(...yArray) - Math.min(...yArray);

//     const nearestPowerOf2 = (n: number) =>
//       Math.pow(2, Math.floor(Math.log2(n)));

//     const fftLength = nearestPowerOf2(xArray.length);
//     const fftSignal = xArray.slice(0, fftLength);

//     const phasors: [number, number][] = fft(fftSignal);
//     const magnitudes = phasors
//       .slice(1)
//       .map(p => Math.sqrt(p[0] ** 2 + p[1] ** 2));

//     const maxIndex = magnitudes.indexOf(Math.max(...magnitudes)) + 1;
//     const swayFrequency = (maxIndex * 20) / fftLength;

//     return { varianceX, peakToPeakY, swayFrequency };
//   };

//   const calculateStabilityScore = (features: any) => {
//     const normVariance = Math.min(features.varianceX / 0.02, 1);
//     const normPeak = Math.min(features.peakToPeakY / 0.5, 1);
//     const normFreq = Math.min(features.swayFrequency / 2, 1);

//     return Math.max(
//       0,
//       Math.min(100, 100 - (normVariance * 40 + normPeak * 40 + normFreq * 20))
//     );
//   };

//   // ---------- ACCELEROMETER ----------
//   useEffect(() => {
//     Accelerometer.setUpdateInterval(50);

//     const sub = Accelerometer.addListener(d => {
//       setData(d);
//       if (recording) {
//         setRecords(prev => [...prev, { t: Date.now(), ...d }]);
//       }
//     });

//     return () => sub.remove();
//   }, [recording]);

//   // ---------- START TEST ----------
//   const startRecording = () => {
//     submittedRef.current = false;
//     setRecords([]);
//     setTimer(0);
//     setStabilityScore(null);
//     setStatus(null);
//     setRecording(true);

//     const interval = setInterval(() => {
//       setTimer(prev => {
//         if (prev >= 30) {
//           clearInterval(interval);
//           setRecording(false);
//         }
//         return prev + 1;
//       });
//     }, 1000);
//   };

//   // ---------- SUBMIT RESULT ----------
//   useEffect(() => {
//     if (!recording && records.length >= 128 && !submittedRef.current && userId) {
//       submittedRef.current = true;

//       const features = extractFeatures(records);
//       if (!features) return;

//       const score = calculateStabilityScore(features);
//       setStabilityScore(score);

//       fetch('http://192.168.0.108:5000/api/tests/add', {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify({
//           ...features,
//           stabilityScore: score,
//           userId,
//         }),
//       })
//         .then(res => res.json())
//         .then(data => {
//           setStatus(data.status);
//           router.push('/history');
//         })
//         .catch(() => setStatus('Evaluation Failed'));
//     }
//   }, [recording, userId]);

//   // ---------- UI ----------
//   return (
//     <View style={styles.container}>
//       <Text style={styles.title}>Balance & Stability Test</Text>

//       <View style={styles.sensorCard}>
//         <Text style={styles.cardTitle}>Accelerometer</Text>
//         <Text>X: {data.x.toFixed(2)}</Text>
//         <Text>Y: {data.y.toFixed(2)}</Text>
//         <Text>Z: {data.z.toFixed(2)}</Text>
//       </View>

//       <View style={styles.timerCard}>
//         <Text style={styles.timerText}>Timer: {timer}s</Text>
//         <Button
//           title={recording ? 'Recording...' : 'Start 30s Test'}
//           onPress={startRecording}
//           disabled={recording}
//         />
//       </View>

//       <View style={styles.recordsCard}>
//         <Text>Records Collected: {records.length}</Text>
//       </View>

//       {stabilityScore !== null && (
//         <View
//           style={[
//             styles.resultCard,
//             status === 'Recovering'
//               ? styles.recovering
//               : status === 'Stagnant'
//                 ? styles.stagnant
//                 : styles.regressing,
//           ]}
//         >
//           <Text style={styles.scoreText}>
//             Stability Score: {stabilityScore.toFixed(1)}
//           </Text>
//           <Text style={styles.statusText}>
//             Status: {status ?? 'Evaluating...'}
//           </Text>
//         </View>
//       )}
//     </View>
//   );
// }

// // ---------- STYLES ----------
// const styles = StyleSheet.create({
//   container: { flex: 1, alignItems: 'center', paddingTop: 60, backgroundColor: '#f2f2f2' },
//   title: { fontSize: 24, fontWeight: 'bold', marginBottom: 20 },

//   sensorCard: { width: '90%', backgroundColor: '#fff', padding: 20, borderRadius: 15, marginBottom: 15 },
//   timerCard: { width: '90%', backgroundColor: '#fff', padding: 20, borderRadius: 15, alignItems: 'center', marginBottom: 15 },
//   recordsCard: { width: '90%', backgroundColor: '#fff', padding: 15, borderRadius: 15 },

//   resultCard: { width: '90%', padding: 25, borderRadius: 15, marginTop: 20, alignItems: 'center' },

//   recovering: { backgroundColor: '#e0f7e9' },
//   stagnant: { backgroundColor: '#fff8e1' },
//   regressing: { backgroundColor: '#fdecea' },

//   scoreText: { fontSize: 22, fontWeight: 'bold' },
//   statusText: { fontSize: 18, marginTop: 8 },
//   cardTitle: { fontSize: 18, fontWeight: 'bold' },
//   timerText: { fontSize: 18, marginBottom: 10 },
// });









// import AsyncStorage from '@react-native-async-storage/async-storage';
// import { router } from 'expo-router';
// import { Accelerometer, AccelerometerMeasurement } from 'expo-sensors';
// import { fft } from 'fft-js';
// import { useEffect, useRef, useState } from 'react';
// import {
//   Button,
//   Dimensions,
//   ScrollView,
//   StyleSheet,
//   Text,
//   View,
// } from 'react-native';
// import { LineChart } from 'react-native-chart-kit';
// import * as ss from 'simple-statistics';
// import BASE_URL from '../../config/api';

// /* ===================== TYPES ===================== */

// type SensorRecord = {
//   x: number;
//   y: number;
//   z: number;
//   t: number;
// };

// type Features = {
//   varianceX: number;
//   peakToPeakY: number;
//   swayFrequency: number;
// };

// type TestResponse = {
//   status: string;
// };

// // type Prescription = {
// //   diagnosis: string;
// //   bodyPart: string;
// //   severity: string;
// //   medicines: string[];
// //   dietPlan: string[];
// //   exercisePlan: {
// //     week: number;
// //     intensity: string;
// //     exercises: string[];
// //   }[];
// // };

// type Prescription = {
//   _id: string;
//   diagnosis: string;
//   bodyPart: string;
//   severity: string;
//   medicines: string[];
//   dietPlan: string[];
//   exercisePlan: {
//     week: number;
//     intensity: string;
//     exercises: string[];
//   }[];
// };


// /* ===================== CONSTANTS ===================== */

// const SCREEN_WIDTH = Dimensions.get('window').width;

// /* ===================== COMPONENT ===================== */

// export default function HomeScreen() {
//   const [data, setData] = useState<AccelerometerMeasurement>({
//     x: 0,
//     y: 0,
//     z: 0,
//     timestamp: 0,
//   });

//   const [recording, setRecording] = useState<boolean>(false);
//   const [records, setRecords] = useState<SensorRecord[]>([]);
//   const [timer, setTimer] = useState<number>(0);

//   const [stabilityScore, setStabilityScore] = useState<number | null>(null);
//   const [status, setStatus] = useState<string | null>(null);

//   const [userId, setUserId] = useState<string | null>(null);
//   const [scoreHistory, setScoreHistory] = useState<number[]>([]);
//   const [latestPrescription, setLatestPrescription] =
//     useState<Prescription | null>(null);

//   const submittedRef = useRef<boolean>(false);

//   /* ===================== AUTH ===================== */

//   useEffect(() => {
//     const checkLogin = async (): Promise<void> => {
//       const token = await AsyncStorage.getItem('token');
//       if (!token) {
//         router.replace('/login');
//         return;
//       }

//       const payload = JSON.parse(atob(token.split('.')[1])) as { id: string };
//       setUserId(payload.id);
//     };

//     checkLogin();
//   }, []);

//   /* ===================== FETCH PRESCRIPTION ===================== */

//   useEffect(() => {
//     if (!userId) return;

//     const fetchPrescription = async (): Promise<void> => {
//       try {
//         const token = await AsyncStorage.getItem('token');

//         const res = await fetch(
//           `${BASE_URL}/api/prescriptions/my`,
//           {
//             headers: {
//               Authorization: `Bearer ${token}`,
//             },
//           }
//         );

//         const data = (await res.json()) as Prescription[];
//         if (data.length > 0) setLatestPrescription(data[0]);
//       } catch (err) {
//         console.error(err);
//       }
//     };

//     fetchPrescription();
//   }, [userId]);

//   /* ===================== FEATURE EXTRACTION ===================== */

//   const extractFeatures = (records: SensorRecord[]): Features | null => {
//     if (records.length < 128) return null;

//     const xArray: number[] = records.map((r: SensorRecord) => r.x);
//     const yArray: number[] = records.map((r: SensorRecord) => r.y);

//     const varianceX = ss.variance(xArray);
//     const peakToPeakY = Math.max(...yArray) - Math.min(...yArray);

//     const fftLength = Math.pow(
//       2,
//       Math.floor(Math.log2(xArray.length))
//     );

//     const signal = xArray.slice(0, fftLength);

//     const phasors: [number, number][] = fft(signal) as [number, number][];

//     const magnitudes: number[] = phasors
//       .slice(1)
//       .map((p: [number, number]) => Math.hypot(p[0], p[1]));

//     const maxIndex = magnitudes.indexOf(Math.max(...magnitudes)) + 1;
//     const swayFrequency = (maxIndex * 20) / fftLength;

//     return { varianceX, peakToPeakY, swayFrequency };
//   };

//   const calculateStabilityScore = (f: Features): number => {
//     const normVariance = Math.min(f.varianceX / 0.02, 1);
//     const normPeak = Math.min(f.peakToPeakY / 0.5, 1);
//     const normFreq = Math.min(f.swayFrequency / 2, 1);

//     return Math.max(
//       0,
//       Math.min(100, 100 - (normVariance * 40 + normPeak * 40 + normFreq * 20))
//     );
//   };

//   /* ===================== ACCELEROMETER ===================== */

//   useEffect(() => {
//     Accelerometer.setUpdateInterval(50);

//     const sub = Accelerometer.addListener(
//       (d: AccelerometerMeasurement) => {
//         setData(d);
//         if (recording) {
//           setRecords(prev => [
//             ...prev,
//             { x: d.x, y: d.y, z: d.z, t: Date.now() },
//           ]);
//         }
//       }
//     );

//     return () => sub.remove();
//   }, [recording]);

//   /* ===================== START TEST ===================== */

//   const startRecording = (): void => {
//     submittedRef.current = false;
//     setRecords([]);
//     setTimer(0);
//     setStabilityScore(null);
//     setStatus(null);
//     setRecording(true);

//     const interval = setInterval(() => {
//       setTimer(prev => {
//         if (prev >= 30) {
//           clearInterval(interval);
//           setRecording(false);
//         }
//         return prev + 1;
//       });
//     }, 1000);
//   };

//   /* ===================== SUBMIT ===================== */

//   useEffect(() => {
//     if (!recording && records.length >= 128 && !submittedRef.current && userId) {
//       submittedRef.current = true;

//       const features = extractFeatures(records);
//       if (!features) return;

//       const score = calculateStabilityScore(features);
//       setStabilityScore(score);
//       setScoreHistory(prev => [...prev.slice(-9), score]);

//       // fetch('http://192.168.0.108:5000/api/tests/add', {
//       fetch(`${BASE_URL}/api/tests/add`, {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify({
//           ...features,
//           stabilityScore: score,
//           userId,
//         }),
//       })
//         .then(res => res.json() as Promise<TestResponse>)
//         .then((data: TestResponse) => setStatus(data.status))
//         .catch(() => setStatus('Evaluation Failed'));
//     }
//   }, [recording, records, userId]);

//   /* ===================== UI ===================== */

//   return (
//     <ScrollView style={styles.container}>
//       <Text style={styles.title}>Balance & Stability Dashboard</Text>

//       <View style={styles.card}>
//         <Text style={styles.cardTitle}>Live Accelerometer</Text>
//         <Text>X: {data.x.toFixed(2)}</Text>
//         <Text>Y: {data.y.toFixed(2)}</Text>
//         <Text>Z: {data.z.toFixed(2)}</Text>
//       </View>

//       <View style={styles.card}>
//         <Text style={styles.cardTitle}>30s Test</Text>
//         <Text style={styles.timer}>Timer: {timer}s</Text>
//         <Button
//           title={recording ? 'Recording…' : 'Start Test'}
//           onPress={startRecording}
//           disabled={recording}
//         />
//       </View>

//       {scoreHistory.length > 1 && (
//         <View style={styles.card}>
//           <Text style={styles.cardTitle}>Stability Trend</Text>
//           <LineChart
//             data={{
//               labels: scoreHistory.map((_, i) => `${i + 1}`),
//               datasets: [{ data: scoreHistory }],
//             }}
//             width={SCREEN_WIDTH - 40}
//             height={220}
//             chartConfig={{
//               backgroundGradientFrom: '#fff',
//               backgroundGradientTo: '#fff',
//               decimalPlaces: 1,
//               color: o => `rgba(34,197,94,${o})`,
//             }}
//             bezier
//           />
//         </View>
//       )}

//       {/* {latestPrescription && (
//         <View style={styles.card}>
//           <Text style={styles.cardTitle}>Latest Prescription</Text>

//           <Text style={styles.field}>
//             <Text style={styles.label}>Diagnosis: </Text>
//             {latestPrescription.diagnosis}
//           </Text>

//           <Text style={styles.field}>
//             <Text style={styles.label}>Body Part: </Text>
//             {latestPrescription.bodyPart}
//           </Text>

//           <Text style={styles.field}>
//             <Text style={styles.label}>Severity: </Text>
//             {latestPrescription.severity}
//           </Text>

//           <Text style={styles.sectionTitle}>Medicines</Text>
//           {latestPrescription.medicines.length > 0 ? (
//             latestPrescription.medicines.map((med: string, index: number) => (
//               <Text key={index} style={styles.listItem}>
//                 • {med}
//               </Text>
//             ))
//           ) : (
//             <Text style={styles.empty}>No medicines prescribed</Text>
//           )}

//           <Text style={styles.sectionTitle}>Diet Plan</Text>
//           {latestPrescription.dietPlan.length > 0 ? (
//             latestPrescription.dietPlan.map((diet: string, index: number) => (
//               <Text key={index} style={styles.listItem}>
//                 • {diet}
//               </Text>
//             ))
//           ) : (
//             <Text style={styles.empty}>No diet plan provided</Text>
//           )}

//           <Text style={styles.sectionTitle}>Exercise Plan</Text>
//           {latestPrescription.exercisePlan.length > 0 ? (
//             latestPrescription.exercisePlan.map(
//               (
//                 plan: {
//                   week: number;
//                   intensity: string;
//                   exercises: string[];
//                 },
//                 index: number
//               ) => (
//                 <View key={index} style={styles.exerciseBlock}>
//                   <Text style={styles.exerciseHeader}>
//                     Week {plan.week} • {plan.intensity}
//                   </Text>
//                   {plan.exercises.map((ex: string, i: number) => (
//                     <Text key={i} style={styles.listItem}>
//                       – {ex}
//                     </Text>
//                   ))}
//                 </View>
//               )
//             )
//           ) : (
//             <Text style={styles.empty}>No exercises prescribed</Text>
//           )}
//         </View>
//       )} */}

//       {latestPrescription && (
//         <View style={styles.card}>
//           <Text style={styles.cardTitle}>Latest Prescription</Text>

//           <Text>
//             {latestPrescription.diagnosis} ({latestPrescription.severity})
//           </Text>

//           <Button
//             title="View Full Plan"
//             onPress={() =>
//               // router.push(`/plan-result/${latestPrescription._id}`)
//               router.push({
//                 pathname: '/plan-result/[id]',
//                 params: { id: latestPrescription._id },
//               })
//       }
//     />
//         </View>
//       )}
//       {stabilityScore !== null && (
//         <View
//           style={[
//             styles.resultCard,
//             status === 'Recovering'
//               ? styles.recovering
//               : status === 'Stagnant'
//                 ? styles.stagnant
//                 : styles.regressing,
//           ]}
//         >
//           <Text style={styles.scoreText}>
//             Stability Score: {stabilityScore.toFixed(1)}
//           </Text>
//           <Text style={styles.statusText}>
//             Status: {status ?? 'Evaluating...'}
//           </Text>
//         </View>
//       )}

//     </ScrollView >
//   );
// }

// /* ===================== STYLES ===================== */

// const styles = StyleSheet.create({
//   container: { backgroundColor: '#f4f6f8' },
//   title: {
//     fontSize: 26,
//     fontWeight: 'bold',
//     textAlign: 'center',
//     marginVertical: 20,
//   },
//   card: {
//     backgroundColor: '#fff',
//     margin: 15,
//     padding: 20,
//     borderRadius: 16,
//     elevation: 3,
//   },
//   cardTitle: { fontSize: 18, fontWeight: 'bold', marginBottom: 10 },
//   timer: { fontSize: 18, marginBottom: 10 },
//   field: {
//     fontSize: 15,
//     marginBottom: 4,
//   },
//   label: {
//     fontWeight: 'bold',
//   },
//   sectionTitle: {
//     marginTop: 14,
//     marginBottom: 6,
//     fontSize: 16,
//     fontWeight: 'bold',
//   },
//   listItem: {
//     fontSize: 14,
//     marginLeft: 8,
//     marginBottom: 2,
//   },
//   exerciseBlock: {
//     marginTop: 6,
//     marginLeft: 4,
//   },
//   exerciseHeader: {
//     fontWeight: 'bold',
//     fontSize: 14,
//   },
//   empty: {
//     fontStyle: 'italic',
//     color: '#666',
//     marginLeft: 8,
//   },
//   // container: { flex: 1, alignItems: 'center', paddingTop: 60, backgroundColor: '#f2f2f2' },
//   // title: { fontSize: 24, fontWeight: 'bold', marginBottom: 20 },

//   sensorCard: { width: '90%', backgroundColor: '#fff', padding: 20, borderRadius: 15, marginBottom: 15 },
//   timerCard: { width: '90%', backgroundColor: '#fff', padding: 20, borderRadius: 15, alignItems: 'center', marginBottom: 15 },
//   recordsCard: { width: '90%', backgroundColor: '#fff', padding: 15, borderRadius: 15 },

//   resultCard: { width: '90%', padding: 25, borderRadius: 15, marginTop: 20, alignItems: 'center' },

//   recovering: { backgroundColor: '#e0f7e9' },
//   stagnant: { backgroundColor: '#fff8e1' },
//   regressing: { backgroundColor: '#fdecea' },

//   scoreText: { fontSize: 22, fontWeight: 'bold' },
//   statusText: { fontSize: 18, marginTop: 8 },
//   // cardTitle: { fontSize: 18, fontWeight: 'bold' },
//   timerText: { fontSize: 18, marginBottom: 10 },

// });

// // ---------- STYLES ----------
// const styles = StyleSheet.create({
//   container: { flex: 1, alignItems: 'center', paddingTop: 60, backgroundColor: '#f2f2f2' },
//   title: { fontSize: 24, fontWeight: 'bold', marginBottom: 20 },

//   sensorCard: { width: '90%', backgroundColor: '#fff', padding: 20, borderRadius: 15, marginBottom: 15 },
//   timerCard: { width: '90%', backgroundColor: '#fff', padding: 20, borderRadius: 15, alignItems: 'center', marginBottom: 15 },
//   recordsCard: { width: '90%', backgroundColor: '#fff', padding: 15, borderRadius: 15 },

//   resultCard: { width: '90%', padding: 25, borderRadius: 15, marginTop: 20, alignItems: 'center' },

//   recovering: { backgroundColor: '#e0f7e9' },
//   stagnant: { backgroundColor: '#fff8e1' },
//   regressing: { backgroundColor: '#fdecea' },

//   scoreText: { fontSize: 22, fontWeight: 'bold' },
//   statusText: { fontSize: 18, marginTop: 8 },
//   cardTitle: { fontSize: 18, fontWeight: 'bold' },
//   timerText: { fontSize: 18, marginBottom: 10 },
// });









// import AsyncStorage from '@react-native-async-storage/async-storage';
// import { router } from 'expo-router';
// import { Accelerometer, Gyroscope, AccelerometerMeasurement, GyroscopeMeasurement } from 'expo-sensors';
// import * as ss from 'simple-statistics';
// import { useEffect, useRef, useState } from 'react';
// import { Button, Dimensions, ScrollView, StyleSheet, Text, View } from 'react-native';
// import BASE_URL from '../../config/api';

// /* ===================== TYPES ===================== */

// type SensorRecord = { x: number; y: number; z: number; t: number };
// type HARFeatures = Record<string, number>;

// type TestResponse = { status: string };

// type Prescription = {
//   _id: string;
//   diagnosis: string;
//   bodyPart: string;
//   severity: string;
//   medicines: string[];
//   dietPlan: string[];
//   exercisePlan: { week: number; intensity: string; exercises: string[] }[];
// };

// /* ===================== CONSTANTS ===================== */

// const SCREEN_WIDTH = Dimensions.get('window').width;
// const WINDOW_SIZE = 128; // HAR standard window
// const UPDATE_INTERVAL = 50; // ms

// /* ===================== COMPONENT ===================== */

// export default function HomeScreen() {
//   const [accelData, setAccelData] = useState<AccelerometerMeasurement>({ x: 0, y: 0, z: 0, timestamp: 0 });
//   const [gyroData, setGyroData] = useState<GyroscopeMeasurement>({ x: 0, y: 0, z: 0, timestamp: 0 });

//   const [recording, setRecording] = useState(false);
//   const [accelWindow, setAccelWindow] = useState<SensorRecord[]>([]);
//   const [gyroWindow, setGyroWindow] = useState<SensorRecord[]>([]);
//   const [timer, setTimer] = useState(0);

//   const [stabilityScore, setStabilityScore] = useState<number | null>(null);
//   const [status, setStatus] = useState<string | null>(null);
//   const [scoreHistory, setScoreHistory] = useState<number[]>([]);

//   const [userId, setUserId] = useState<string | null>(null);
//   const [latestPrescription, setLatestPrescription] = useState<Prescription | null>(null);

//   const submittedRef = useRef(false);

//   /* ===================== AUTH ===================== */

//   useEffect(() => {
//     const checkLogin = async () => {
//       const token = await AsyncStorage.getItem('token');
//       if (!token) {
//         router.replace('/login');
//         return;
//       }
//       const payload = JSON.parse(atob(token.split('.')[1])) as { id: string };
//       setUserId(payload.id);
//     };
//     checkLogin();
//   }, []);

//   /* ===================== FETCH PRESCRIPTION ===================== */

//   useEffect(() => {
//     if (!userId) return;

//     const fetchPrescription = async () => {
//       try {
//         const token = await AsyncStorage.getItem('token');
//         const res = await fetch(`${BASE_URL}/api/prescriptions/my`, { headers: { Authorization: `Bearer ${token}` } });
//         const data = (await res.json()) as Prescription[];
//         if (data.length > 0) setLatestPrescription(data[0]);
//       } catch (err) {
//         console.error(err);
//       }
//     };

//     fetchPrescription();
//   }, [userId]);

//   /* ===================== SENSOR LISTENERS ===================== */

//   useEffect(() => {
//     Accelerometer.setUpdateInterval(UPDATE_INTERVAL);
//     Gyroscope.setUpdateInterval(UPDATE_INTERVAL);

//     const accelSub = Accelerometer.addListener(d => {
//       setAccelData(d);
//       if (recording)
//         setAccelWindow(prev => [...prev, { x: d.x, y: d.y, z: d.z, t: Date.now() }].slice(-WINDOW_SIZE));
//     });

//     const gyroSub = Gyroscope.addListener(d => {
//       setGyroData(d);
//       if (recording)
//         setGyroWindow(prev => [...prev, { x: d.x, y: d.y, z: d.z, t: Date.now() }].slice(-WINDOW_SIZE));
//     });

//     return () => {
//       accelSub.remove();
//       gyroSub.remove();
//     };
//   }, [recording]);

//   /* ===================== HAR FEATURE EXTRACTION ===================== */

//   const extractHARFeatures = (accel: SensorRecord[], gyro: SensorRecord[]): HARFeatures | null => {
//     if (accel.length < WINDOW_SIZE || gyro.length < WINDOW_SIZE) return null;
//     const features: HARFeatures = {};
//     const axes = ['x', 'y', 'z'] as const;

//     const calcSMA = (arr: SensorRecord[]) =>
//       arr.reduce((sum, r) => sum + Math.abs(r.x) + Math.abs(r.y) + Math.abs(r.z), 0) / arr.length;

//     axes.forEach(axis => {
//       const a = accel.map(r => r[axis]);
//       const g = gyro.map(r => r[axis]);

//       // Accelerometer features
//       features[`tBodyAcc-mean-${axis}`] = ss.mean(a);
//       features[`tBodyAcc-std-${axis}`] = ss.standardDeviation(a);
//       features[`tBodyAcc-mad-${axis}`] = ss.mad(a);
//       features[`tBodyAcc-min-${axis}`] = Math.min(...a);
//       features[`tBodyAcc-max-${axis}`] = Math.max(...a);
//       features[`tBodyAcc-sma`] = calcSMA(accel);
//       features[`tBodyAcc-iqr-${axis}`] = ss.quantileSorted([...a].sort((x, y) => x - y), 0.75) -
//                                            ss.quantileSorted([...a].sort((x, y) => x - y), 0.25);
//       features[`tBodyAcc-energy-${axis}`] = a.reduce((sum, v) => sum + v * v, 0) / a.length;

//       // Gyroscope features
//       features[`tBodyGyro-mean-${axis}`] = ss.mean(g);
//       features[`tBodyGyro-std-${axis}`] = ss.standardDeviation(g);
//       features[`tBodyGyro-mad-${axis}`] = ss.mad(g);
//       features[`tBodyGyro-min-${axis}`] = Math.min(...g);
//       features[`tBodyGyro-max-${axis}`] = Math.max(...g);
//       features[`tBodyGyro-sma`] = calcSMA(gyro);
//       features[`tBodyGyro-iqr-${axis}`] = ss.quantileSorted([...g].sort((x, y) => x - y), 0.75) -
//                                           ss.quantileSorted([...g].sort((x, y) => x - y), 0.25);
//       features[`tBodyGyro-energy-${axis}`] = g.reduce((sum, v) => sum + v * v, 0) / g.length;
//     });

//     // Correlations (safe fallback if NaN)
//     const safeCorr = (x: number[], y: number[]) => {
//       const corr = ss.sampleCorrelation(x, y);
//       return Number.isFinite(corr) ? corr : 0;
//     };

//     features['tBodyAcc-correlation-X,Y'] = safeCorr(accel.map(r => r.x), accel.map(r => r.y));
//     features['tBodyAcc-correlation-X,Z'] = safeCorr(accel.map(r => r.x), accel.map(r => r.z));
//     features['tBodyAcc-correlation-Y,Z'] = safeCorr(accel.map(r => r.y), accel.map(r => r.z));

//     features['tBodyGyro-correlation-X,Y'] = safeCorr(gyro.map(r => r.x), gyro.map(r => r.y));
//     features['tBodyGyro-correlation-X,Z'] = safeCorr(gyro.map(r => r.x), gyro.map(r => r.z));
//     features['tBodyGyro-correlation-Y,Z'] = safeCorr(gyro.map(r => r.y), gyro.map(r => r.z));

//     return features;
//   };

//   /* ===================== STABILITY SCORE (SAFE) ===================== */

//   const calculateStabilityScore = (features: HARFeatures): number => {
//     try {
//       // Example: use tBodyAcc-std as a proxy (higher std → lower stability)
//       const axes = ['x', 'y', 'z'];
//       let avgStd = 0;
//       axes.forEach(axis => {
//         avgStd += features[`tBodyAcc-std-${axis}`] ?? 0;
//       });
//       avgStd /= axes.length;
//       const score = Math.max(0, Math.min(100, 100 - avgStd * 200)); // scale 0–100
//       return score;
//     } catch {
//       return 0;
//     }
//   };

//   /* ===================== RECORDING CONTROL ===================== */

//   const startRecording = () => {
//     submittedRef.current = false;
//     setAccelWindow([]);
//     setGyroWindow([]);
//     setTimer(0);
//     setStabilityScore(null);
//     setStatus(null);
//     setRecording(true);

//     const interval = setInterval(() => {
//       setTimer(prev => {
//         if (prev >= 30) {
//           clearInterval(interval);
//           setRecording(false);
//         }
//         return prev + 1;
//       });
//     }, 1000);
//   };

//   /* ===================== SUBMIT FEATURES ===================== */

//   useEffect(() => {
//     if (!recording && accelWindow.length === WINDOW_SIZE && !submittedRef.current && userId) {
//       submittedRef.current = true;

//       const features = extractHARFeatures(accelWindow, gyroWindow);
//       if (!features) return;

//       const score = calculateStabilityScore(features);
//       setStabilityScore(score);
//       setScoreHistory(prev => [...prev.slice(-9), score]);

//       fetch(`${BASE_URL}/api/tests/add`, {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify({ userId, ...features, stabilityScore: score }),
//       })
//         .then(res => res.json())
//         .then((data: TestResponse) => setStatus(data.status))
//         .catch(() => setStatus('Evaluation Failed'));
//     }
//   }, [recording, accelWindow, gyroWindow, userId]);

//   /* ===================== UI ===================== */

//   return (
//     <ScrollView style={styles.container}>
//       <Text style={styles.title}>Balance & Stability Dashboard</Text>

//       <View style={styles.card}>
//         <Text style={styles.cardTitle}>Live Accelerometer</Text>
//         <Text>X: {accelData.x.toFixed(2)}</Text>
//         <Text>Y: {accelData.y.toFixed(2)}</Text>
//         <Text>Z: {accelData.z.toFixed(2)}</Text>
//       </View>

//       <View style={styles.card}>
//         <Text style={styles.cardTitle}>Live Gyroscope</Text>
//         <Text>X: {gyroData.x.toFixed(2)}</Text>
//         <Text>Y: {gyroData.y.toFixed(2)}</Text>
//         <Text>Z: {gyroData.z.toFixed(2)}</Text>
//       </View>

//       <View style={styles.card}>
//         <Text style={styles.cardTitle}>30s Test</Text>
//         <Text style={styles.timer}>Timer: {timer}s</Text>
//         <Button title={recording ? 'Recording…' : 'Start Test'} onPress={startRecording} disabled={recording} />
//       </View>

//       {stabilityScore !== null && (
//         <View style={styles.resultCard}>
//           <Text style={styles.scoreText}>Stability Score: {stabilityScore.toFixed(1)}</Text>
//           <Text style={styles.statusText}>Status: {status ?? 'Evaluating...'}</Text>
//         </View>
//       )}
//     </ScrollView>
//   );
// }

// /* ===================== STYLES ===================== */

// const styles = StyleSheet.create({
//   container: { backgroundColor: '#f4f6f8' },
//   title: { fontSize: 26, fontWeight: 'bold', textAlign: 'center', marginVertical: 20 },
//   card: { backgroundColor: '#fff', margin: 15, padding: 20, borderRadius: 16, elevation: 3 },
//   cardTitle: { fontSize: 18, fontWeight: 'bold', marginBottom: 10 },
//   timer: { fontSize: 18, marginBottom: 10 },
//   resultCard: {
//     width: '90%',
//     padding: 25,
//     borderRadius: 15,
//     marginTop: 20,
//     alignItems: 'center',
//     backgroundColor: '#e0f7e9',
//   },
//   scoreText: { fontSize: 22, fontWeight: 'bold' },
//   statusText: { fontSize: 18, marginTop: 8 },
// });



import AsyncStorage from '@react-native-async-storage/async-storage';
import { router } from 'expo-router';
import { Accelerometer, Gyroscope, AccelerometerMeasurement, GyroscopeMeasurement } from 'expo-sensors';
import * as ss from 'simple-statistics';
import { useEffect, useRef, useState } from 'react';
import { Button, Dimensions, ScrollView, StyleSheet, Text, View } from 'react-native';
import { LineChart } from 'react-native-chart-kit';
import BASE_URL from '../../config/api';

/* ===================== TYPES ===================== */
type SensorRecord = { x: number; y: number; z: number; t: number };
type HARFeatures = Record<string, number>;

type TestResponse = { status: string };

type Prescription = {
  _id: string;
  diagnosis: string;
  bodyPart: string;
  severity: string;
  medicines: string[];
  dietPlan: string[];
  exercisePlan: { week: number; intensity: string; exercises: string[] }[];
};

/* ===================== CONSTANTS ===================== */
const SCREEN_WIDTH = Dimensions.get('window').width;
const WINDOW_SIZE = 128;
const UPDATE_INTERVAL = 50;

/* ===================== COMPONENT ===================== */
export default function HomeScreen() {
  const [accelData, setAccelData] = useState<AccelerometerMeasurement>({ x: 0, y: 0, z: 0, timestamp: 0 });
  const [gyroData, setGyroData] = useState<GyroscopeMeasurement>({ x: 0, y: 0, z: 0, timestamp: 0 });

  const [recording, setRecording] = useState(false);
  const [accelWindow, setAccelWindow] = useState<SensorRecord[]>([]);
  const [gyroWindow, setGyroWindow] = useState<SensorRecord[]>([]);
  const [timer, setTimer] = useState(0);

  const [stabilityScore, setStabilityScore] = useState<number | null>(null);
  const [status, setStatus] = useState<string | null>(null);
  const [scoreHistory, setScoreHistory] = useState<number[]>([]);

  const [userId, setUserId] = useState<string | null>(null);
  const [latestPrescription, setLatestPrescription] = useState<Prescription | null>(null);

  const submittedRef = useRef(false);

  /* ===================== AUTH ===================== */
  useEffect(() => {
    const checkLogin = async () => {
      const token = await AsyncStorage.getItem('token');
      if (!token) {
        router.replace('/login');
        return;
      }
      const payload = JSON.parse(atob(token.split('.')[1])) as { id: string };
      setUserId(payload.id);
    };
    checkLogin();
  }, []);

  /* ===================== FETCH PRESCRIPTION ===================== */
  useEffect(() => {
    if (!userId) return;
    const fetchPrescription = async () => {
      try {
        const token = await AsyncStorage.getItem('token');
        const res = await fetch(`${BASE_URL}/api/prescriptions/my`, { headers: { Authorization: `Bearer ${token}` } });
        const data = (await res.json()) as Prescription[];
        if (data.length > 0) setLatestPrescription(data[0]);
      } catch (err) {
        console.error(err);
      }
    };
    fetchPrescription();
  }, [userId]);

  /* ===================== SENSOR LISTENERS ===================== */
  useEffect(() => {
    Accelerometer.setUpdateInterval(UPDATE_INTERVAL);
    Gyroscope.setUpdateInterval(UPDATE_INTERVAL);

    const accelSub = Accelerometer.addListener(d => {
      setAccelData(d);
      if (recording) setAccelWindow(prev => [...prev, { x: d.x, y: d.y, z: d.z, t: Date.now() }].slice(-WINDOW_SIZE));
    });

    const gyroSub = Gyroscope.addListener(d => {
      setGyroData(d);
      if (recording) setGyroWindow(prev => [...prev, { x: d.x, y: d.y, z: d.z, t: Date.now() }].slice(-WINDOW_SIZE));
    });

    return () => {
      accelSub.remove();
      gyroSub.remove();
    };
  }, [recording]);

  /* ===================== HAR FEATURE EXTRACTION ===================== */
  const extractHARFeatures = (accel: SensorRecord[], gyro: SensorRecord[]): HARFeatures | null => {
    if (accel.length < WINDOW_SIZE || gyro.length < WINDOW_SIZE) return null;
    const features: HARFeatures = {};
    const axes = ['x', 'y', 'z'] as const;

    const calcSMA = (arr: SensorRecord[]) => arr.reduce((sum, r) => sum + Math.abs(r.x) + Math.abs(r.y) + Math.abs(r.z), 0) / arr.length;

    axes.forEach(axis => {
      const a = accel.map(r => r[axis]);
      const g = gyro.map(r => r[axis]);

      features[`tBodyAcc-mean-${axis}`] = ss.mean(a);
      features[`tBodyAcc-std-${axis}`] = ss.standardDeviation(a);
      features[`tBodyAcc-mad-${axis}`] = ss.mad(a);
      features[`tBodyAcc-min-${axis}`] = Math.min(...a);
      features[`tBodyAcc-max-${axis}`] = Math.max(...a);
      features[`tBodyAcc-sma`] = calcSMA(accel);
      features[`tBodyAcc-iqr-${axis}`] = ss.quantileSorted([...a].sort((x, y) => x - y), 0.75) - ss.quantileSorted([...a].sort((x, y) => x - y), 0.25);
      features[`tBodyAcc-energy-${axis}`] = a.reduce((sum, v) => sum + v * v, 0) / a.length;

      features[`tBodyGyro-mean-${axis}`] = ss.mean(g);
      features[`tBodyGyro-std-${axis}`] = ss.standardDeviation(g);
      features[`tBodyGyro-mad-${axis}`] = ss.mad(g);
      features[`tBodyGyro-min-${axis}`] = Math.min(...g);
      features[`tBodyGyro-max-${axis}`] = Math.max(...g);
      features[`tBodyGyro-sma`] = calcSMA(gyro);
      features[`tBodyGyro-iqr-${axis}`] = ss.quantileSorted([...g].sort((x, y) => x - y), 0.75) - ss.quantileSorted([...g].sort((x, y) => x - y), 0.25);
      features[`tBodyGyro-energy-${axis}`] = g.reduce((sum, v) => sum + v * v, 0) / g.length;
    });

    const safeCorr = (x: number[], y: number[]) => { const corr = ss.sampleCorrelation(x, y); return Number.isFinite(corr) ? corr : 0; };

    features['tBodyAcc-correlation-X,Y'] = safeCorr(accel.map(r => r.x), accel.map(r => r.y));
    features['tBodyAcc-correlation-X,Z'] = safeCorr(accel.map(r => r.x), accel.map(r => r.z));
    features['tBodyAcc-correlation-Y,Z'] = safeCorr(accel.map(r => r.y), accel.map(r => r.z));

    features['tBodyGyro-correlation-X,Y'] = safeCorr(gyro.map(r => r.x), gyro.map(r => r.y));
    features['tBodyGyro-correlation-X,Z'] = safeCorr(gyro.map(r => r.x), gyro.map(r => r.z));
    features['tBodyGyro-correlation-Y,Z'] = safeCorr(gyro.map(r => r.y), gyro.map(r => r.z));

    return features;
  };

  /* ===================== STABILITY SCORE ===================== */
  const calculateStabilityScore = (features: HARFeatures): number => {
    try {
      const axes = ['x', 'y', 'z'];
      let avgStd = 0;
      axes.forEach(axis => { avgStd += features[`tBodyAcc-std-${axis}`] ?? 0; });
      avgStd /= axes.length;
      return Math.max(0, Math.min(100, 100 - avgStd * 200));
    } catch { return 0; }
  };

  /* ===================== RECORDING CONTROL ===================== */
  const startRecording = () => {
    submittedRef.current = false;
    setAccelWindow([]);
    setGyroWindow([]);
    setTimer(0);
    setStabilityScore(null);
    setStatus(null);
    setRecording(true);

    const interval = setInterval(() => {
      setTimer(prev => {
        if (prev >= 30) {
          clearInterval(interval);
          setRecording(false);
        }
        return prev + 1;
      });
    }, 1000);
  };

  /* ===================== SUBMIT FEATURES ===================== */
  useEffect(() => {
    if (!recording && accelWindow.length === WINDOW_SIZE && !submittedRef.current && userId) {
      submittedRef.current = true;

      const features = extractHARFeatures(accelWindow, gyroWindow);
      if (!features) return;

      const score = calculateStabilityScore(features);
      setStabilityScore(score);
      setScoreHistory(prev => [...prev.slice(-9), score]);

      fetch(`${BASE_URL}/api/tests/add`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, ...features, stabilityScore: score }),
      })
        .then(res => res.json())
        .then((data: TestResponse) => setStatus(data.status))
        .catch(() => setStatus('Evaluation Failed'));
    }
  }, [recording, accelWindow, gyroWindow, userId]);

  /* ===================== UI + VISUALIZATION ===================== */
  const createChartData = (arr: number[], label: string) => ({
    labels: arr.map((_, i) => (i + 1).toString()),
    datasets: [{ data: arr }],
    legend: [label],
  });

  return (
    // <ScrollView style={styles.container}>
    //   <Text style={styles.title}>Balance & Stability Dashboard</Text>

    //   {/* Live sensor values */}
    //   <View style={styles.card}>
    //     <Text style={styles.cardTitle}>Live Accelerometer</Text>
    //     <Text>X: {accelData.x.toFixed(2)} | Y: {accelData.y.toFixed(2)} | Z: {accelData.z.toFixed(2)}</Text>
    //   </View>

    //   <View style={styles.card}>
    //     <Text style={styles.cardTitle}>Live Gyroscope</Text>
    //     <Text>X: {gyroData.x.toFixed(2)} | Y: {gyroData.y.toFixed(2)} | Z: {gyroData.z.toFixed(2)}</Text>
    //   </View>

    //   <View style={styles.card}>
    //     <Text style={styles.cardTitle}>30s Test</Text>
    //     <Text style={styles.timer}>Timer: {timer}s</Text>
    //     <Button title={recording ? 'Recording…' : 'Start Test'} onPress={startRecording} disabled={recording} />
    //   </View>

    //   {/* Stability score */}
    //   {stabilityScore !== null && (
    //     <View style={styles.resultCard}>
    //       <Text style={styles.scoreText}>Stability Score: {stabilityScore.toFixed(1)}</Text>
    //       <Text style={styles.statusText}>Status: {status ?? 'Evaluating...'}</Text>
    //     </View>
    //   )}

    //   {/* Accelerometer charts */}
    //   {accelWindow.length > 0 && (
    //     <View style={styles.chartCard}>
    //       <Text style={styles.cardTitle}>Accelerometer (X/Y/Z)</Text>
    //       <LineChart
    //         data={createChartData(accelWindow.map(r => r.x), 'X')}
    //         width={SCREEN_WIDTH - 40}
    //         height={150}
    //         chartConfig={chartConfig}
    //         bezier
    //       />
    //       <LineChart
    //         data={createChartData(accelWindow.map(r => r.y), 'Y')}
    //         width={SCREEN_WIDTH - 40}
    //         height={150}
    //         chartConfig={chartConfig}
    //         bezier
    //       />
    //       <LineChart
    //         data={createChartData(accelWindow.map(r => r.z), 'Z')}
    //         width={SCREEN_WIDTH - 40}
    //         height={150}
    //         chartConfig={chartConfig}
    //         bezier
    //       />
    //     </View>
    //   )}

    //   {/* Gyroscope charts */}
    //   {gyroWindow.length > 0 && (
    //     <View style={styles.chartCard}>
    //       <Text style={styles.cardTitle}>Gyroscope (X/Y/Z)</Text>
    //       <LineChart
    //         data={createChartData(gyroWindow.map(r => r.x), 'X')}
    //         width={SCREEN_WIDTH - 40}
    //         height={150}
    //         chartConfig={chartConfig}
    //         bezier
    //       />
    //       <LineChart
    //         data={createChartData(gyroWindow.map(r => r.y), 'Y')}
    //         width={SCREEN_WIDTH - 40}
    //         height={150}
    //         chartConfig={chartConfig}
    //         bezier
    //       />
    //       <LineChart
    //         data={createChartData(gyroWindow.map(r => r.z), 'Z')}
    //         width={SCREEN_WIDTH - 40}
    //         height={150}
    //         chartConfig={chartConfig}
    //         bezier
    //       />
    //     </View>
    //   )}

    //   {/* Stability score history chart */}
    //   {scoreHistory.length > 0 && (
    //     <View style={styles.chartCard}>
    //       <Text style={styles.cardTitle}>Stability Score History</Text>
    //       <LineChart
    //         data={createChartData(scoreHistory, 'Stability')}
    //         width={SCREEN_WIDTH - 40}
    //         height={150}
    //         chartConfig={chartConfig}
    //         bezier
    //       />
    //     </View>
    //   )}
    // </ScrollView>

    <ScrollView style={styles.container} contentContainerStyle={{ paddingBottom: 50 }}>
  {/* ===================== STABILITY SCORE ===================== */}
  {stabilityScore !== null && (
    <View style={styles.resultCard}>
      <Text style={styles.scoreText}>Stability Score: {stabilityScore.toFixed(1)}</Text>
      <Text style={styles.statusText}>Status: {status ?? 'Evaluating...'}</Text>
    </View>
  )}

  {/* Live sensor values */}
  <View style={styles.card}>
    <Text style={styles.cardTitle}>Live Accelerometer</Text>
    <Text>X: {accelData.x.toFixed(2)} | Y: {accelData.y.toFixed(2)} | Z: {accelData.z.toFixed(2)}</Text>
  </View>

  <View style={styles.card}>
    <Text style={styles.cardTitle}>Live Gyroscope</Text>
    <Text>X: {gyroData.x.toFixed(2)} | Y: {gyroData.y.toFixed(2)} | Z: {gyroData.z.toFixed(2)}</Text>
  </View>

  <View style={styles.card}>
    <Text style={styles.cardTitle}>30s Test</Text>
    <Text style={styles.timer}>Timer: {timer}s</Text>
    <Button title={recording ? 'Recording…' : 'Start Test'} onPress={startRecording} disabled={recording} />
  </View>

  {/* ===================== CHARTS ===================== */}
  {accelWindow.length > 0 && (
    <View style={styles.chartCard}>
      <Text style={styles.cardTitle}>Accelerometer (X/Y/Z)</Text>
      <LineChart
        data={createChartData(accelWindow.map(r => r.x), 'X')}
        width={SCREEN_WIDTH - 40}
        height={150}
        chartConfig={chartConfig}
        bezier
      />
      <LineChart
        data={createChartData(accelWindow.map(r => r.y), 'Y')}
        width={SCREEN_WIDTH - 40}
        height={150}
        chartConfig={chartConfig}
        bezier
      />
      <LineChart
        data={createChartData(accelWindow.map(r => r.z), 'Z')}
        width={SCREEN_WIDTH - 40}
        height={150}
        chartConfig={chartConfig}
        bezier
      />
    </View>
  )}

  {gyroWindow.length > 0 && (
    <View style={styles.chartCard}>
      <Text style={styles.cardTitle}>Gyroscope (X/Y/Z)</Text>
      <LineChart
        data={createChartData(gyroWindow.map(r => r.x), 'X')}
        width={SCREEN_WIDTH - 40}
        height={150}
        chartConfig={chartConfig}
        bezier
      />
      <LineChart
        data={createChartData(gyroWindow.map(r => r.y), 'Y')}
        width={SCREEN_WIDTH - 40}
        height={150}
        chartConfig={chartConfig}
        bezier
      />
      <LineChart
        data={createChartData(gyroWindow.map(r => r.z), 'Z')}
        width={SCREEN_WIDTH - 40}
        height={150}
        chartConfig={chartConfig}
        bezier
      />
    </View>
  )}

  {scoreHistory.length > 0 && (
    <View style={styles.chartCard}>
      <Text style={styles.cardTitle}>Stability Score History</Text>
      <LineChart
        data={createChartData(scoreHistory, 'Stability')}
        width={SCREEN_WIDTH - 40}
        height={150}
        chartConfig={chartConfig}
        bezier
      />
    </View>
  )}

  {stabilityScore !== null && (
        <View style={styles.resultCard}>
          <Text style={styles.scoreText}>Stability Score: {stabilityScore.toFixed(1)}</Text>
          <Text style={styles.statusText}>Status: {status ?? 'Evaluating...'}</Text>
        </View>
  )}
</ScrollView>
  );
}

/* ===================== CHART CONFIG ===================== */
const chartConfig = {
  backgroundGradientFrom: '#fff',
  backgroundGradientTo: '#fff',
  decimalPlaces: 2,
  color: (opacity = 1) => `rgba(0, 128, 255, ${opacity})`,
  labelColor: (opacity = 1) => `rgba(0,0,0,${opacity})`,
  style: { borderRadius: 16 },
  propsForDots: { r: '2', strokeWidth: '1', stroke: '#1E90FF' },
};

/* ===================== STYLES ===================== */
const styles = StyleSheet.create({
  container: { backgroundColor: '#f4f6f8' },
  title: { fontSize: 26, fontWeight: 'bold', textAlign: 'center', marginVertical: 20 },
  card: { backgroundColor: '#fff', margin: 15, padding: 20, borderRadius: 16, elevation: 3 },
  chartCard: { backgroundColor: '#fff', margin: 15, padding: 10, borderRadius: 16, elevation: 3 },
  cardTitle: { fontSize: 18, fontWeight: 'bold', marginBottom: 10 },
  timer: { fontSize: 18, marginBottom: 10 },
  resultCard: {
    width: '90%',
    padding: 25,
    borderRadius: 15,
    marginTop: 20,
    alignItems: 'center',
    backgroundColor: '#e0f7e9',
  },
  scoreText: { fontSize: 22, fontWeight: 'bold' },
  statusText: { fontSize: 18, marginTop: 8 },
});