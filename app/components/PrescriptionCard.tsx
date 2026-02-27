// app/components/PrescriptionCard.tsx
import { TouchableOpacity, Text, View } from 'react-native';
import { router } from 'expo-router';

export default function PrescriptionCard({ prescription }: { prescription: any }) {
    return (
        <TouchableOpacity
            onPress={() => router.push(`/plan-result/${prescription._id}`)}
            style={{
                backgroundColor: '#1E1E1E',
                borderRadius: 12,
                padding: 16,
                marginVertical: 6,
            }}
        >
            <Text style={{ color: '#fff', fontSize: 18, fontWeight: '600' }}>
                Diagnosis: {prescription.diagnosis}
            </Text>
            <Text style={{ color: '#ccc', marginTop: 4 }}>
                Body Part: {prescription.bodyPart} | Severity: {prescription.severity}
            </Text>
            <Text style={{ color: '#888', marginTop: 4, fontSize: 12 }}>
                {new Date(prescription.createdAt).toLocaleString()}
            </Text>
        </TouchableOpacity>
    );
}