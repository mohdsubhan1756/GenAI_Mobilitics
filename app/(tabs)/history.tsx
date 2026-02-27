// import { View, Text, FlatList } from 'react-native';
// import { useEffect, useState } from 'react';
// import { MaterialIcons } from '@expo/vector-icons';


// export default function HistoryScreen() {
//     const [history, setHistory] = useState<any[]>([]);

//     useEffect(() => {
//         fetch('http://192.168.0.103:5000/api/tests') // backend GET route
//             .then(res => res.json())
//             .then(data => setHistory(data))
//             .catch(err => console.error('Fetch error:', err));
//     }, []);

//     // Map status to colors
//     const statusColors: Record<string, string> = {
//         Recovering: '#4CAF50', // green
//         Stagnant: '#FF9800',   // orange
//         Regressing: '#F44336', // red
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
import { FlatList, Text, View } from 'react-native';
import BASE_URL from '../../config/api';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function HistoryScreen() {
    const [history, setHistory] = useState<any[]>([]);
    const [userId, setUserId] = useState<string | null>(null);

    const fetchHistory = async () => {
        try {
            const token = await AsyncStorage.getItem('token');
            if (!token) {
                router.replace('/login');
                return;
            }
            const payload = JSON.parse(atob(token.split('.')[1])) as { id: string };
            setUserId(payload.id);
            console.log("Payload id: ", payload.id);

            // const res = await fetch(`${BASE_URL}/api/tests`,{
            //         method: 'POST',
            //         headers: { 'Content-Type': 'application/json' },
            //         body: JSON.stringify({
            //         userId,
            //     }),
                
            // });
            const res = await fetch(`${BASE_URL}/api/tests`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ userId: payload.id }),
            });
            const data = await res.json();
            setHistory(data);
            // console.log("Token: ",token);

        } catch (err) {
            console.error('Fetch error:', err);
        }
    };

    // 🔑 Runs EVERY time screen comes into focus
    useFocusEffect(
        useCallback(() => {
            fetchHistory();
        }, [])
    );

    const statusColors: Record<string, string> = {
        Recovering: '#4CAF50',
        Stagnant: '#FF9800',
        Regressing: '#F44336',
    };

    return (
        <View style={{ flex: 1, backgroundColor: '#121212', padding: 12 }}>
            {history.length === 0 ? (
                <Text
                    style={{
                        color: '#fff',
                        textAlign: 'center',
                        marginTop: 30,
                        fontSize: 18,
                    }}
                >
                    No history yet
                </Text>
            ) : (
                <FlatList
                    data={[...history].sort(
                        (a, b) =>
                            new Date(b.createdAt).getTime() -
                            new Date(a.createdAt).getTime()
                    )}
                    keyExtractor={(item, index) => item._id || index.toString()}
                    renderItem={({ item }) => (
                        <View
                            style={{
                                backgroundColor: '#1E1E1E',
                                borderRadius: 12,
                                padding: 16,
                                marginVertical: 6,
                                elevation: 3,
                            }}
                        >
                            <View
                                style={{
                                    flexDirection: 'row',
                                    justifyContent: 'space-between',
                                    marginBottom: 8,
                                }}
                            >
                                <Text
                                    style={{
                                        color: '#fff',
                                        fontSize: 18,
                                        fontWeight: '600',
                                    }}
                                >
                                    Score: {item.stabilityScore?.toFixed(1)}
                                </Text>

                                <View
                                    style={{
                                        backgroundColor:
                                            statusColors[item.status] || '#777',
                                        borderRadius: 8,
                                        paddingHorizontal: 10,
                                        paddingVertical: 4,
                                    }}
                                >
                                    <Text style={{ color: '#fff', fontWeight: '600' }}>
                                        {item.status}
                                    </Text>
                                </View>
                            </View>

                            <View
                                style={{
                                    flexDirection: 'row',
                                    justifyContent: 'space-between',
                                }}
                            >
                                <Text style={{ color: '#ccc' }}>
                                    VarianceX: {item.varianceX?.toFixed(3)}
                                </Text>
                                <Text style={{ color: '#ccc' }}>
                                    PeakY: {item.peakToPeakY?.toFixed(3)}
                                </Text>
                            </View>

                            <View
                                style={{
                                    flexDirection: 'row',
                                    justifyContent: 'space-between',
                                    marginTop: 2,
                                }}
                            >
                                <Text style={{ color: '#ccc' }}>
                                    SwayFreq: {item.swayFrequency?.toFixed(3)}
                                </Text>
                                <Text
                                    style={{
                                        color: '#ccc',
                                        fontStyle: 'italic',
                                        fontSize: 12,
                                    }}
                                >
                                    {new Date(item.createdAt).toLocaleString()}
                                </Text>
                            </View>
                        </View>
                    )}
                    showsVerticalScrollIndicator={false}
                    contentContainerStyle={{ paddingBottom: 20 }}
                />
            )}
        </View>
    );
}
