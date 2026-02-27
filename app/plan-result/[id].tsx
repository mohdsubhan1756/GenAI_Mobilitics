// import { router, useLocalSearchParams } from 'expo-router';
// import { Button, ScrollView, StyleSheet, Text, View } from 'react-native';

// export default function PlanResultScreen() {
//     // const { result } = useLocalSearchParams();
//     // // const data = result ? JSON.parse(result as string) : null;
//     // const parsed = result ? JSON.parse(result as string) : null;
//     // const data = parsed?.data;

//     // if (!data) {
//     //     return (
//     //         <View style={styles.center}>
//     //             <Text>No data available</Text>
//     //         </View>
//     //     );
//     // }


//     const { result } = useLocalSearchParams();

//     const parsed = result ? JSON.parse(result as string) : null;
//     const data = parsed?.data;

//     if (!data) {
//         return (
//             <View style={styles.center}>
//                 <Text>No data available</Text>
//             </View>
//         );
//     }

//     return (
//         <ScrollView contentContainerStyle={styles.container}>
//             <Text style={styles.title}>🧾 Personalized Plan</Text>

//             {/* Diagnosis Card */}
//             <View style={styles.card}>
//                 <Text style={styles.cardTitle}>🧠 Diagnosis</Text>
//                 <Text>Condition: {data.diagnosis}</Text>
//                 <Text>Body Part: {data.bodyPart}</Text>
//                 <Text>Severity: {data.severity}</Text>
//             </View>

//             {/* Diet Plan */}
//             <View style={styles.card}>
//                 <Text style={styles.cardTitle}>🥗 Diet Plan</Text>
//                 {data.dietPlan?.map((item: string, i: number) => (
//                     <Text key={i}>• {item}</Text>
//                 ))}
//             </View>

//             {/* Exercise Plan */}
//             {/* <View style={styles.card}>
//                 <Text style={styles.cardTitle}>🏋️ Exercise Plan</Text>
//                 {data.exercisePlan?.map((ex: any, i: number) => (
//                     <View key={i} style={styles.exercise}>
//                         <Text style={styles.exerciseTitle}>{ex.name}</Text>
//                         <Text>Reps: {ex.reps}</Text>
//                         <Text>Duration: {ex.duration}</Text>
//                     </View>
//                 ))}
//             </View> */}

//             {data.exercisePlan?.map((week: any, i: number) => (
//     <View key={i} style={{ marginBottom: 10 }}>
//         <Text style={{ fontWeight: 'bold' }}>
//             Week {week.week} ({week.intensity})
//         </Text>

//         {week.exercises?.map((ex: any, j: number) => (
//             <View key={j} style={{ marginLeft: 10 }}>
//                 <Text>• {ex.name}</Text>
//                 <Text>Reps: {ex.reps}</Text>
//                 <Text>Duration: {ex.duration}</Text>
//             </View>
//         ))}
//     </View>
// ))}


//             <Button title="⬅ Back to Home" onPress={() => router.back()} />
//         </ScrollView>
//     );
// }

// const styles = StyleSheet.create({
//     container: {
//         padding: 20,
//         backgroundColor: '#fff',
//     },
//     center: {
//         flex: 1,
//         justifyContent: 'center',
//         alignItems: 'center',
//     },
//     title: {
//         fontSize: 24,
//         fontWeight: '700',
//         marginBottom: 20,
//         textAlign: 'center',
//     },
//     card: {
//         backgroundColor: '#F2F6FF',
//         padding: 16,
//         borderRadius: 14,
//         marginBottom: 16,
//     },
//     cardTitle: {
//         fontSize: 18,
//         fontWeight: '700',
//         marginBottom: 10,
//     },
//     exercise: {
//         marginBottom: 10,
//     },
//     exerciseTitle: {
//         fontWeight: '600',
//     },
// });




// import { useLocalSearchParams } from 'expo-router';
// import { useEffect, useState } from 'react';
// import { ScrollView, Text, View, StyleSheet, ActivityIndicator } from 'react-native';
// import AsyncStorage from '@react-native-async-storage/async-storage';
// import BASE_URL from '../../config/api';

// type Prescription = {
//   _id: string;
//   diagnosis?: string;
//   bodyPart?: string;
//   severity?: string;
//   medicines?: string[];
//   dietPlan?: string[];
//   exercisePlan?: {
//     week: number;
//     intensity: string;
//     exercises?: string[];
//   }[];
// };

// export default function PlanResultScreen() {
//   const { id } = useLocalSearchParams();
//   const [data, setData] = useState<Prescription | null>(null);
//   const [loading, setLoading] = useState(true);

// //   useEffect(() => {
// //     const fetchPrescription = async () => {
// //       try {
// //         const token = await AsyncStorage.getItem('token');

// //         const res = await fetch(
// //           `${BASE_URL}/api/prescriptions/${id}`,
// //           {
// //             headers: {
// //               Authorization: `Bearer ${token}`,
// //             },
// //           }
// //         );

// //         const result = await res.json();
// //         console.log("Fetched result:", result);

// //         setData(result);
// //       } catch (err) {
// //         console.error("Fetch error:", err);
// //       } finally {
// //         setLoading(false);
// //       }
// //     };

// //     if (id) fetchPrescription();
// //   }, [id]);

// useEffect(() => {
//   const fetchPrescription = async () => {
//     try {
//       const token = await AsyncStorage.getItem('token');

//       const res = await fetch(
//         `${BASE_URL}/api/prescriptions/${id}`,
//         {
//           headers: {
//             Authorization: `Bearer ${token}`,
//           },
//         }
//       );

//       if (!res.ok) {
//         setData(null);
//         return;
//       }

//       const result: Prescription = await res.json();
//       setData(result);

//     } catch (err) {
//       console.error(err);
//       setData(null);
//     } finally {
//       setLoading(false);
//     }
//   };

//   if (id) fetchPrescription();
// }, [id]);

//   if (loading) {
//     return (
//       <View style={styles.center}>
//         <ActivityIndicator size="large" />
//         <Text>Loading...</Text>
//       </View>
//     );
//   }

//   if (!data) {
//     return (
//       <View style={styles.center}>
//         <Text>No prescription found.</Text>
//       </View>
//     );
//   }

//   return (
//     <ScrollView style={styles.container}>
//       <Text style={styles.title}>Full Treatment Plan</Text>

//       <Text>Diagnosis: {data.diagnosis ?? "N/A"}</Text>
//       <Text>Body Part: {data.bodyPart ?? "N/A"}</Text>
//       <Text>Severity: {data.severity ?? "N/A"}</Text>

//       {/* ================= Medicines ================= */}
//       <Text style={styles.section}>Medicines</Text>
//       {data.medicines?.length ? (
//         data.medicines.map((m, i) => (
//           <Text key={i}>• {m}</Text>
//         ))
//       ) : (
//         <Text>No medicines prescribed</Text>
//       )}

//       {/* ================= Diet Plan ================= */}
//       <Text style={styles.section}>Diet Plan</Text>
//       {data.dietPlan?.length ? (
//         data.dietPlan.map((d, i) => (
//           <Text key={i}>• {d}</Text>
//         ))
//       ) : (
//         <Text>No diet plan provided</Text>
//       )}

//       {/* ================= Exercise Plan ================= */}
//       <Text style={styles.section}>Exercise Plan</Text>
//       {data.exercisePlan?.length ? (
//         data.exercisePlan.map((week, i) => (
//           <View key={i} style={{ marginBottom: 10 }}>
//             <Text>
//               Week {week.week} ({week.intensity})
//             </Text>

//             {week.exercises?.length ? (
//               week.exercises.map((ex, j) => (
//                 <Text key={j}>– {ex}</Text>
//               ))
//             ) : (
//               <Text>No exercises listed</Text>
//             )}
//           </View>
//         ))
//       ) : (
//         <Text>No exercises prescribed</Text>
//       )}
//     </ScrollView>
//   );
// }

// const styles = StyleSheet.create({
//   container: { padding: 20 },
//   center: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
//   title: {
//     fontSize: 22,
//     fontWeight: 'bold',
//     marginBottom: 15,
//   },
//   section: {
//     marginTop: 15,
//     fontWeight: 'bold',
//   },
// });


import { useEffect, useState } from 'react';
import { ScrollView, Text, View, StyleSheet, ActivityIndicator } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import BASE_URL from '../../config/api';

type Prescription = {
  _id: string;
  diagnosis: string;
  bodyPart: string;
  severity: string;
  medicines?: string[];
  dietPlan?: string[];
  exercisePlan?: { week: number; intensity: string; exercises?: string[] }[];
};

export default function PlanResultScreen() {
  const { id } = useLocalSearchParams();
  const [data, setData] = useState<Prescription | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;

    const fetchPrescription = async () => {
      try {
        const token = await AsyncStorage.getItem('token');
        const res = await fetch(`${BASE_URL}/api/prescriptions/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (!res.ok) throw new Error('Prescription not found');

        const result: Prescription = await res.json();
        setData(result);
      } catch (err) {
        console.error(err);
        setData(null);
      } finally {
        setLoading(false);
      }
    };

    fetchPrescription();
  }, [id]);

  if (loading)
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" />
        <Text>Loading prescription...</Text>
      </View>
    );

  if (!data)
    return (
      <View style={styles.center}>
        <Text>No prescription found.</Text>
      </View>
    );

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Full Treatment Plan</Text>

      <Text>Diagnosis: {data.diagnosis ?? 'N/A'}</Text>
      <Text>Body Part: {data.bodyPart ?? 'N/A'}</Text>
      <Text>Severity: {data.severity ?? 'N/A'}</Text>

      <Text style={styles.section}>Medicines</Text>
      {data.medicines?.length ? data.medicines.map((m, i) => <Text key={i}>• {m}</Text>) : <Text>No medicines prescribed</Text>}

      <Text style={styles.section}>Diet Plan</Text>
      {data.dietPlan?.length ? data.dietPlan.map((d, i) => <Text key={i}>• {d}</Text>) : <Text>No diet plan provided</Text>}

      <Text style={styles.section}>Exercise Plan</Text>
      {data.exercisePlan?.length
        ? data.exercisePlan.map((week, i) => (
            <View key={i} style={{ marginBottom: 10 }}>
              <Text>
                Week {week.week} ({week.intensity})
              </Text>
              {week.exercises?.length ? week.exercises.map((ex, j) => <Text key={j}>– {ex}</Text>) : <Text>No exercises listed</Text>}
            </View>
          ))
        : <Text>No exercises prescribed</Text>}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { padding: 20 },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  title: { fontSize: 22, fontWeight: 'bold', marginBottom: 15 },
  section: { marginTop: 15, fontWeight: 'bold' },
});