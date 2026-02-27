

// // Before Designing
// import { router, useFocusEffect } from 'expo-router';
// import { useCallback, useState } from 'react';
// import { FlatList, Text, TouchableOpacity, View } from 'react-native';
// import BASE_URL from '../../config/api';
// import AsyncStorage from '@react-native-async-storage/async-storage';

// export default function MyPrescriptionsScreen() {
//     const [prescriptions, setPrescriptions] = useState<any[]>([]);

//     const fetchPrescriptions = async () => {
//         try {
//             const token = await AsyncStorage.getItem('token');
//             if (!token) {
//                 router.replace('/login');
//                 return;
//             }

//             const payload = JSON.parse(atob(token.split('.')[1])) as { id: string };
//             console.log('Logged in userId:', payload.id);

//             const res = await fetch(`${BASE_URL}/api/prescriptions/my`, {
//                 method: 'POST',
//                 headers: { 'Content-Type': 'application/json' },
//                 body: JSON.stringify({ userId: payload.id }),
//             });

//             if (!res.ok) {
//                 console.error('Server error:', res.status);
//                 return;
//             }

//             const data = await res.json();
//             setPrescriptions(data);
//         } catch (err) {
//             console.error('Fetch error:', err);
//         }
//     };

//     useFocusEffect(
//         useCallback(() => {
//             fetchPrescriptions();
//         }, [])
//     );

//     return (
//         <View style={{ flex: 1, backgroundColor: '#121212', padding: 12 }}>
//             {prescriptions.length === 0 ? (
//                 <Text style={{ color: '#fff', textAlign: 'center', marginTop: 30, fontSize: 18 }}>
//                     No prescriptions yet
//                 </Text>
//             ) : (
//                 <FlatList
//                     data={[...prescriptions].sort(
//                         (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
//                     )}
//                     keyExtractor={(item) => item._id}
//                     renderItem={({ item }) => (
//                         <TouchableOpacity
//                             onPress={() =>
//                                 router.push({
//                                     pathname: '/plan-result/detail',
//                                     params: { id: item._id },
//                                 })
//                             }
//                             style={{
//                                 backgroundColor: '#1E1E1E',
//                                 borderRadius: 12,
//                                 padding: 16,
//                                 marginVertical: 6,
//                             }}
//                         >
//                             <Text style={{ color: '#fff', fontSize: 18, fontWeight: '600' }}>
//                                 Diagnosis: {item.diagnosis}
//                             </Text>
//                             <Text style={{ color: '#ccc', marginTop: 4 }}>
//                                 Body Part: {item.bodyPart} | Severity: {item.severity}
//                             </Text>
//                             <Text style={{ color: '#888', marginTop: 4, fontSize: 12 }}>
//                                 {new Date(item.createdAt).toLocaleString()}
//                             </Text>
//                         </TouchableOpacity>
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
import {
  FlatList,
  Text,
  TouchableOpacity,
  View,
  StyleSheet
} from 'react-native';

import AsyncStorage from '@react-native-async-storage/async-storage';
import BASE_URL from '../../config/api';

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

      const res = await fetch(`${BASE_URL}/api/prescriptions/my`,{
        method:"POST",
        headers:{'Content-Type':'application/json'},
        body:JSON.stringify({userId:payload.id})
      });

      const data = await res.json();

      setPrescriptions(data);

    } catch(err){

      console.log(err);

    }

  };

  useFocusEffect(
    useCallback(()=>{
      fetchPrescriptions();
    },[])
  );

  const renderItem = ({item}:any)=>{

    return(

      <TouchableOpacity

        style={styles.card}

        onPress={()=>router.push({
          pathname:'/plan-result/detail',
          params:{id:item._id}
        })}

      >

        <Text style={styles.diagnosis}>
          {item.diagnosis}
        </Text>

        <View style={styles.row}>

          <Text style={styles.label}>
            🦴 Body Part:
          </Text>

          <Text style={styles.value}>
            {item.bodyPart}
          </Text>

        </View>

        <View style={styles.row}>

          <Text style={styles.label}>
            ⚠ Severity:
          </Text>

          <Text style={[
            styles.severity,
            item.severity === "High" && styles.high,
            item.severity === "Moderate" && styles.medium,
            item.severity === "Low" && styles.low
          ]}>
            {item.severity}
          </Text>

        </View>

        <Text style={styles.date}>
          📅 {new Date(item.createdAt).toLocaleString()}
        </Text>

      </TouchableOpacity>

    )

  }

  return(

    <View style={styles.container}>

      <Text style={styles.title}>
        My Prescriptions
      </Text>

      {prescriptions.length === 0 ? (

        <View style={styles.emptyContainer}>

          <Text style={styles.emptyIcon}>
            📄
          </Text>

          <Text style={styles.emptyText}>
            No prescriptions yet
          </Text>

        </View>

      ) : (

        <FlatList

          data={[...prescriptions].sort(
            (a,b)=>new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
          )}

          keyExtractor={(item)=>item._id}

          renderItem={renderItem}

          showsVerticalScrollIndicator={false}

          contentContainerStyle={{
            paddingBottom:30
          }}

        />

      )}

    </View>

  )

}

const styles = StyleSheet.create({

  container:{
    flex:1,
    backgroundColor:"#0F172A",
    padding:16
  },

  title:{
    paddingTop: 40,
    textAlign: "center",
    fontSize:26,
    fontWeight:"bold",
    color:"#fff",
    marginBottom:18
  },

  card:{
    backgroundColor:"#1E293B",
    padding:18,
    borderRadius:16,
    marginBottom:12,

    shadowColor:"#000",
    shadowOpacity:0.25,
    shadowRadius:6,
    elevation:6
  },

  diagnosis:{
    fontSize:20,
    fontWeight:"700",
    color:"#38BDF8",
    marginBottom:10
  },

  row:{
    flexDirection:"row",
    marginTop:3
  },

  label:{
    color:"#94A3B8",
    fontSize:15,
    width:90
  },

  value:{
    color:"#E2E8F0",
    fontSize:15
  },

  severity:{
    fontSize:15,
    fontWeight:"600"
  },

  high:{
    color:"#EF4444"
  },

  medium:{
    color:"#F59E0B"
  },

  low:{
    color:"#22C55E"
  },

  date:{
    marginTop:8,
    fontSize:12,
    color:"#94A3B8"
  },

  emptyContainer:{
    flex:1,
    justifyContent:"center",
    alignItems:"center"
  },

  emptyIcon:{
    fontSize:60,
    marginBottom:10
  },

  emptyText:{
    fontSize:18,
    color:"#94A3B8"
  }

});