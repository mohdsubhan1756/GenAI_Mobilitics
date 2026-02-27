// Before Designing
// import { useLocalSearchParams, router } from 'expo-router';
// import { useEffect, useState } from 'react';
// import { ScrollView, Text, View } from 'react-native';
// import BASE_URL from '../../config/api';
// import AsyncStorage from '@react-native-async-storage/async-storage';

// export default function PrescriptionDetailScreen() {
//     const { id } = useLocalSearchParams();
//     const [prescription, setPrescription] = useState<any>(null);

//     const fetchPrescription = async () => {
//         try {
//             const token = await AsyncStorage.getItem('token');
//             if (!token) {
//                 router.replace('/login');
//                 return;
//             }

//             const res = await fetch(`${BASE_URL}/api/prescriptions/${id}`, {
//                 method: 'GET',
//                 headers: { 'Content-Type': 'application/json' },
//             });

//             if (!res.ok) {
//                 console.error('Server error:', res.status);
//                 return;
//             }

//             const data = await res.json();
//             setPrescription(data);
//         } catch (err) {
//             console.error(err);
//         }
//     };

//     useEffect(() => {
//         fetchPrescription();
//     }, []);

//     if (!prescription) {
//         return (
//             <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#121212' }}>
//                 <Text style={{ color: '#fff' }}>Loading...</Text>
//             </View>
//         );
//     }

//     return (
//         <ScrollView style={{ flex: 1, backgroundColor: '#121212', padding: 12 }}>
//             <Text style={{ color: '#fff', fontSize: 20, fontWeight: '700' }}>
//                 Diagnosis: {prescription.diagnosis}
//             </Text>
//             <Text style={{ color: '#ccc', marginTop: 4 }}>
//                 Body Part: {prescription.bodyPart} | Severity: {prescription.severity}
//             </Text>
//             <Text style={{ color: '#888', marginTop: 2, fontSize: 12 }}>
//                 Created At: {new Date(prescription.createdAt).toLocaleString()}
//             </Text>

//             <Text style={{ color: '#fff', marginTop: 12, fontSize: 16, fontWeight: '600' }}>Medicines:</Text>
//             {prescription.medicines.map((m: string, i: number) => (
//                 <Text key={i} style={{ color: '#ccc', marginLeft: 8 }}>
//                     - {m}
//                 </Text>
//             ))}

//             <Text style={{ color: '#fff', marginTop: 12, fontSize: 16, fontWeight: '600' }}>Diet Plan:</Text>
//             {prescription.dietPlan.map((d: string, i: number) => (
//                 <Text key={i} style={{ color: '#ccc', marginLeft: 8 }}>
//                     - {d}
//                 </Text>
//             ))}

//             <Text style={{ color: '#fff', marginTop: 12, fontSize: 16, fontWeight: '600' }}>Exercise Plan:</Text>
//             {prescription.exercisePlan.map((week: any, i: number) => (
//                 <View key={i} style={{ marginLeft: 8, marginBottom: 8 }}>
//                     <Text style={{ color: '#ccc' }}>
//                         Week {week.week} - Intensity: {week.intensity}
//                     </Text>
//                     {week.exercises.map((ex: string, j: number) => (
//                         <Text key={j} style={{ color: '#ccc', marginLeft: 12 }}>
//                             • {ex}
//                         </Text>
//                     ))}
//                 </View>
//             ))}

//             <Text style={{ color: '#fff', marginTop: 12, fontSize: 16, fontWeight: '600' }}>Raw AI Response:</Text>
//             <Text style={{ color: '#ccc', fontSize: 12 }}>{JSON.stringify(prescription.rawResponse, null, 2)}</Text>
//         </ScrollView>
//     );
// }



import { useLocalSearchParams, router } from 'expo-router';
import { useEffect, useState } from 'react';
import { ScrollView, Text, View, StyleSheet } from 'react-native';
import BASE_URL from '../../config/api';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function PrescriptionDetailScreen() {

    const { id } = useLocalSearchParams();
    const [prescription, setPrescription] = useState<any>(null);

    const fetchPrescription = async () => {
        try {

            const token = await AsyncStorage.getItem('token');

            if (!token) {
                router.replace('/login');
                return;
            }

            const res = await fetch(`${BASE_URL}/api/prescriptions/${id}`, {
                method: 'GET',
                headers: { 'Content-Type': 'application/json' },
            });

            if (!res.ok) {
                console.error('Server error:', res.status);
                return;
            }

            const data = await res.json();
            setPrescription(data);

        } catch (err) {
            console.error(err);
        }
    };

    useEffect(() => {
        fetchPrescription();
    }, []);

    if (!prescription) {
        return (
            <View style={styles.loadingContainer}>
                <Text style={styles.loadingText}>Loading Prescription...</Text>
            </View>
        );
    }

    return (

        <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>

            {/* Diagnosis Card */}

            <View style={styles.card}>

                <Text style={styles.title}>
                    🩺 Diagnosis
                </Text>

                <Text style={styles.diagnosis}>
                    {prescription.diagnosis}
                </Text>

                <Text style={styles.info}>
                    🦴 Body Part: {prescription.bodyPart}
                </Text>

                <Text style={styles.info}>
                    ⚠ Severity: {prescription.severity}
                </Text>

                <Text style={styles.date}>
                    📅 {new Date(prescription.createdAt).toLocaleString()}
                </Text>

            </View>

            {/* Medicines */}

            <View style={styles.card}>

                <Text style={styles.sectionTitle}>
                    💊 Medicines
                </Text>

                {prescription.medicines.map((m: string, i: number) => (
                    <Text key={i} style={styles.listItem}>
                        • {m}
                    </Text>
                ))}

            </View>

            {/* Diet Plan */}

            <View style={styles.card}>

                <Text style={styles.sectionTitle}>
                    🥗 Diet Plan
                </Text>

                {prescription.dietPlan.map((d: string, i: number) => (
                    <Text key={i} style={styles.listItem}>
                        • {d}
                    </Text>
                ))}

            </View>

            {/* Exercise Plan */}

            <View style={styles.card}>

                <Text style={styles.sectionTitle}>
                    🏋 Exercise Plan
                </Text>

                {prescription.exercisePlan.map((week: any, i: number) => (

                    <View key={i} style={styles.exerciseBlock}>

                        <Text style={styles.weekTitle}>
                            Week {week.week} • Intensity: {week.intensity}
                        </Text>

                        {week.exercises.map((ex: string, j: number) => (
                            <Text key={j} style={styles.exerciseItem}>
                                • {ex}
                            </Text>
                        ))}

                    </View>

                ))}

            </View>

            {/* Raw AI Response */}

            <View style={styles.card}>

                <Text style={styles.sectionTitle}>
                    🤖 Raw AI Response
                </Text>

                <Text style={styles.raw}>
                    {JSON.stringify(prescription.rawResponse, null, 2)}
                </Text>

            </View>

        </ScrollView>

    );
}

const styles = StyleSheet.create({

    container: {
        flex: 1,
        backgroundColor: '#0F172A',
        padding: 16
    },

    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#0F172A'
    },

    loadingText: {
        color: '#fff',
        fontSize: 18
    },

    card: {
        backgroundColor: '#1E293B',
        borderRadius: 16,
        padding: 18,
        marginBottom: 14,

        shadowColor: '#000',
        shadowOpacity: 0.25,
        shadowRadius: 6,
        elevation: 6
    },

    title: {
        fontSize: 20,
        fontWeight: '700',
        color: '#38BDF8',
        marginBottom: 10
    },

    diagnosis: {
        fontSize: 22,
        fontWeight: '700',
        color: '#fff',
        marginBottom: 6
    },

    info: {
        color: '#CBD5F5',
        fontSize: 15,
        marginTop: 2
    },

    date: {
        marginTop: 6,
        fontSize: 12,
        color: '#94A3B8'
    },

    sectionTitle: {
        fontSize: 18,
        fontWeight: '700',
        color: '#38BDF8',
        marginBottom: 8
    },

    listItem: {
        color: '#E2E8F0',
        fontSize: 15,
        marginVertical: 2
    },

    exerciseBlock: {
        marginTop: 6,
        padding: 8,
        backgroundColor: '#020617',
        borderRadius: 10
    },

    weekTitle: {
        color: '#FACC15',
        fontWeight: '600',
        marginBottom: 4
    },

    exerciseItem: {
        color: '#E2E8F0',
        marginLeft: 8,
        fontSize: 14
    },

    raw: {
        color: '#94A3B8',
        fontSize: 12
    }

});