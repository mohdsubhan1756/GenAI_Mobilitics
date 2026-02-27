// import { useEffect, useState } from 'react';
// import { FlatList, Text, View } from 'react-native';
// import BASE_URL from '../../config/api';


// export default function HistoryScreen() {
//     const [history, setHistory] = useState<any[]>([]);

//     useEffect(() => {
//         fetch(`${BASE_URL}/api/tests`)
//             .then(res => res.json())
//             .then(data => setHistory(data))
//             .catch(err => console.error('Fetch error:', err));
//     }, []);

//     const statusColors: Record<string, string> = {
//         Recovering: '#4CAF50', 
//         Stagnant: '#FF9800',  
//         Regressing: '#F44336',
//     };

//     return (
//         <View style={{ flex: 1, backgroundColor: '#121212', padding: 12 }}>
//             {history.length === 0 ? (
//                 <Text style={{ color: '#fff', textAlign: 'center', marginTop: 30, fontSize: 18 }}>
//                     No history yet
//                 </Text>
//             ) : (
//                 <FlatList
//                     data={history.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())}
//                     keyExtractor={(item, index) => item._id || index.toString()}
//                     renderItem={({ item }) => (
//                         <View
//                             style={{
//                                 backgroundColor: '#1E1E1E',
//                                 borderRadius: 12,
//                                 padding: 16,
//                                 marginVertical: 6,
//                                 shadowColor: '#000',
//                                 shadowOpacity: 0.3,
//                                 shadowRadius: 6,
//                                 shadowOffset: { width: 0, height: 3 },
//                                 elevation: 3, // Android shadow
//                             }}
//                         >
//                             <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 }}>
//                                 <Text style={{ color: '#fff', fontSize: 18, fontWeight: '600' }}>
//                                     Score: {item.stabilityScore?.toFixed(1)}
//                                 </Text>
//                                 <View
//                                     style={{
//                                         backgroundColor: statusColors[item.status] || '#777',
//                                         borderRadius: 8,
//                                         paddingHorizontal: 10,
//                                         paddingVertical: 4,
//                                     }}
//                                 >
//                                     <Text style={{ color: '#fff', fontWeight: '600' }}>{item.status}</Text>
//                                 </View>
//                             </View>

//                             <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 6 }}>
//                                 <Text style={{ color: '#ccc' }}>VarianceX: {item.varianceX?.toFixed(3)}</Text>
//                                 <Text style={{ color: '#ccc' }}>PeakY: {item.peakToPeakY?.toFixed(3)}</Text>
//                             </View>
//                             <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 2 }}>
//                                 <Text style={{ color: '#ccc' }}>SwayFreq: {item.swayFrequency?.toFixed(3)}</Text>
//                                 <Text style={{ color: '#ccc', fontStyle: 'italic', fontSize: 12 }}>
//                                     {new Date(item.createdAt).toLocaleString()}
//                                 </Text>
//                             </View>
//                         </View>
//                     )}
//                     showsVerticalScrollIndicator={false}
//                     contentContainerStyle={{ paddingBottom: 20 }}
//                 />
//             )}
//         </View>
//     );
// }



import { router, useFocusEffect } from 'expo-router';
import { useCallback, useState } from 'react';
import { FlatList, Text, TouchableOpacity, View } from 'react-native';
import BASE_URL from '../../config/api';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function MyPrescriptionsScreen() {
    const [prescriptions, setPrescriptions] = useState<any[]>([]);

    const fetchPrescriptions = async () => {
        try {
            const token = await AsyncStorage.getItem('token');
            if (!token) {
                router.replace('/login');
                return;
            }

            const payload = JSON.parse(atob(token.split('.')[1])) as { id: string };
            console.log('Logged in userId:', payload.id);

            const res = await fetch(`${BASE_URL}/api/prescriptions/my`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ userId: payload.id }),
            });

            if (!res.ok) {
                console.error('Server error:', res.status);
                return;
            }

            const data = await res.json();
            setPrescriptions(data);
        } catch (err) {
            console.error('Fetch error:', err);
        }
    };

    useFocusEffect(
        useCallback(() => {
            fetchPrescriptions();
        }, [])
    );

    return (
        <View style={{ flex: 1, backgroundColor: '#121212', padding: 12 }}>
            {prescriptions.length === 0 ? (
                <Text style={{ color: '#fff', textAlign: 'center', marginTop: 30, fontSize: 18 }}>
                    No prescriptions yet
                </Text>
            ) : (
                <FlatList
                    data={[...prescriptions].sort(
                        (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
                    )}
                    keyExtractor={(item) => item._id}
                    renderItem={({ item }) => (
                        <TouchableOpacity
                            onPress={() =>
                                router.push({
                                    pathname: '/plan-result/detail',
                                    params: { id: item._id },
                                })
                            }
                            style={{
                                backgroundColor: '#1E1E1E',
                                borderRadius: 12,
                                padding: 16,
                                marginVertical: 6,
                            }}
                        >
                            <Text style={{ color: '#fff', fontSize: 18, fontWeight: '600' }}>
                                Diagnosis: {item.diagnosis}
                            </Text>
                            <Text style={{ color: '#ccc', marginTop: 4 }}>
                                Body Part: {item.bodyPart} | Severity: {item.severity}
                            </Text>
                            <Text style={{ color: '#888', marginTop: 4, fontSize: 12 }}>
                                {new Date(item.createdAt).toLocaleString()}
                            </Text>
                        </TouchableOpacity>
                    )}
                    showsVerticalScrollIndicator={false}
                    contentContainerStyle={{ paddingBottom: 20 }}
                />
            )}
        </View>
    );
}

