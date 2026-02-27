import { useLocalSearchParams, router } from 'expo-router';
import { useEffect, useState } from 'react';
import { ScrollView, Text, View } from 'react-native';
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
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#121212' }}>
                <Text style={{ color: '#fff' }}>Loading...</Text>
            </View>
        );
    }

    return (
        <ScrollView style={{ flex: 1, backgroundColor: '#121212', padding: 12 }}>
            <Text style={{ color: '#fff', fontSize: 20, fontWeight: '700' }}>
                Diagnosis: {prescription.diagnosis}
            </Text>
            <Text style={{ color: '#ccc', marginTop: 4 }}>
                Body Part: {prescription.bodyPart} | Severity: {prescription.severity}
            </Text>
            <Text style={{ color: '#888', marginTop: 2, fontSize: 12 }}>
                Created At: {new Date(prescription.createdAt).toLocaleString()}
            </Text>

            <Text style={{ color: '#fff', marginTop: 12, fontSize: 16, fontWeight: '600' }}>Medicines:</Text>
            {prescription.medicines.map((m: string, i: number) => (
                <Text key={i} style={{ color: '#ccc', marginLeft: 8 }}>
                    - {m}
                </Text>
            ))}

            <Text style={{ color: '#fff', marginTop: 12, fontSize: 16, fontWeight: '600' }}>Diet Plan:</Text>
            {prescription.dietPlan.map((d: string, i: number) => (
                <Text key={i} style={{ color: '#ccc', marginLeft: 8 }}>
                    - {d}
                </Text>
            ))}

            <Text style={{ color: '#fff', marginTop: 12, fontSize: 16, fontWeight: '600' }}>Exercise Plan:</Text>
            {prescription.exercisePlan.map((week: any, i: number) => (
                <View key={i} style={{ marginLeft: 8, marginBottom: 8 }}>
                    <Text style={{ color: '#ccc' }}>
                        Week {week.week} - Intensity: {week.intensity}
                    </Text>
                    {week.exercises.map((ex: string, j: number) => (
                        <Text key={j} style={{ color: '#ccc', marginLeft: 12 }}>
                            • {ex}
                        </Text>
                    ))}
                </View>
            ))}

            <Text style={{ color: '#fff', marginTop: 12, fontSize: 16, fontWeight: '600' }}>Raw AI Response:</Text>
            <Text style={{ color: '#ccc', fontSize: 12 }}>{JSON.stringify(prescription.rawResponse, null, 2)}</Text>
        </ScrollView>
    );
}