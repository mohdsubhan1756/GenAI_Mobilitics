// import BASE_URL from '../../config/api.js';
// import { Accelerometer } from 'expo-sensors';
// import { useRef, useState } from 'react';
// import { Button, Text, View, StyleSheet } from 'react-native';

// type Sensor = { x:number,y:number,z:number };

// export default function TremorScreen() {

//   const dataRef = useRef<Sensor[]>([]);
//   const [prediction,setPrediction] = useState("");
//   const [recording,setRecording] = useState(false);
//   const [timer,setTimer] = useState(0);

//   const startTest = () => {

//     dataRef.current = [];
//     setPrediction("");
//     setRecording(true);
//     setTimer(20);

//     Accelerometer.setUpdateInterval(50);

//     const sub = Accelerometer.addListener(d=>{
//       dataRef.current.push({x:d.x,y:d.y,z:d.z});
//     });

//     const interval = setInterval(()=>{
//       setTimer(t=>t-1);
//     },1000);

//     setTimeout(async()=>{

//       sub.remove();
//       clearInterval(interval);
//       setRecording(false);

//       await runPrediction();

//     },20000);

//   }

//   const extractFeatures = () => {

//     const xs = dataRef.current.map(d=>d.x);
//     const ys = dataRef.current.map(d=>d.y);
//     const zs = dataRef.current.map(d=>d.z);

//     const mean = (arr:number[]) =>
//       arr.reduce((a,b)=>a+b,0)/arr.length;

//     const std = (arr:number[]) => {
//       const m = mean(arr);
//       return Math.sqrt(arr.reduce((s,v)=>s+(v-m)*(v-m),0)/arr.length);
//     }

//     return {
//       meanX:mean(xs),
//       meanY:mean(ys),
//       meanZ:mean(zs),
//       stdX:std(xs),
//       stdY:std(ys),
//       stdZ:std(zs)
//     }
//   }

//   const runPrediction = async () => {

//     if(dataRef.current.length === 0){
//       alert("No sensor data collected");
//       return;
//     }

//     const features = extractFeatures();

//     const tremorScore =
//       Math.sqrt(
//         features.stdX**2 +
//         features.stdY**2 +
//         features.stdZ**2
//       );

//     let result = "";
//     let percentage = 0;

//     // Correct thresholds based on your real dataset

//     if(tremorScore < 0.01){
//       result = "Stable";
//       percentage = 5;
//     }
//     else if(tremorScore < 0.08){
//       result = "Normal Hand Stability";
//       percentage = 15;
//     }
//     else if(tremorScore < 0.18){
//       result = "Mild Tremor";
//       percentage = 35;
//     }
//     else if(tremorScore < 0.40){
//       result = "Moderate Tremor";
//       percentage = 65;
//     }
//     else{
//       result = "Severe Tremor";
//       percentage = 90;
//     }

//     const output =
// `Result: ${result}

// Tremor Score: ${tremorScore.toFixed(4)}

// Affected Level: ${percentage}%`;

//     setPrediction(output);

//     try{

//       await fetch(`${BASE_URL}/api/tremor/predict`,{
//         method:"POST",
//         headers:{'Content-Type':'application/json'},
//         body:JSON.stringify({
//           ...features,
//           tremorScore,
//           result
//         })
//       });

//     }catch(e){

//       console.log("Server not reachable, using local prediction");

//     }

//   }

//   return(
//     <View style={styles.container}>

//       <Text style={styles.title}>Hand Tremor Detection</Text>

//       <Button
//         title={recording ? "Testing..." : "Start 20 Second Test"}
//         onPress={startTest}
//         disabled={recording}
//       />

//       {recording && (
//         <Text style={styles.timer}>
//           Hold your phone steady: {timer}s
//         </Text>
//       )}

//       {prediction !== "" && (
//         <Text style={styles.result}>
//           {prediction}
//         </Text>
//       )}

//     </View>
//   )
// }

// const styles = StyleSheet.create({

//   container:{
//     flex:1,
//     justifyContent:'center',
//     alignItems:'center',
//     padding:20
//   },

//   title:{
//     fontSize:24,
//     fontWeight:'bold',
//     marginBottom:25
//   },

//   timer:{
//     marginTop:20,
//     fontSize:18,
//     color:"orange"
//   },

//   result:{
//     marginTop:25,
//     fontSize:18,
//     color:"green",
//     textAlign:"center",
//     lineHeight:28
//   }

// });






// import BASE_URL from '../../config/api.js';
// import { Accelerometer } from 'expo-sensors';
// import { useRef, useState } from 'react';
// import {
//   Button,
//   Text,
//   View,
//   StyleSheet,
//   ActivityIndicator,
//   Dimensions,
//   ScrollView
// } from 'react-native';

// import { LineChart } from 'react-native-chart-kit';

// type Sensor = { x:number,y:number,z:number };

// export default function TremorScreen() {

//   const dataRef = useRef<Sensor[]>([]);
//   const [prediction,setPrediction] = useState("");
//   const [recording,setRecording] = useState(false);
//   const [processing,setProcessing] = useState(false);
//   const [timer,setTimer] = useState(0);

//   const [chartX,setChartX] = useState<number[]>([]);
//   const [chartY,setChartY] = useState<number[]>([]);
//   const [chartZ,setChartZ] = useState<number[]>([]);

//   const screenWidth = Dimensions.get("window").width;

//   const startTest = () => {

//     dataRef.current = [];
//     setPrediction("");
//     setRecording(true);
//     setProcessing(false);
//     setTimer(20);

//     setChartX([]);
//     setChartY([]);
//     setChartZ([]);

//     Accelerometer.setUpdateInterval(50);

//     const sub = Accelerometer.addListener(d=>{

//       dataRef.current.push({x:d.x,y:d.y,z:d.z});

//       // keep last 40 values for chart
//       setChartX(prev => [...prev.slice(-39), d.x]);
//       setChartY(prev => [...prev.slice(-39), d.y]);
//       setChartZ(prev => [...prev.slice(-39), d.z]);

//     });

//     const interval = setInterval(()=>{
//       setTimer(t=>t-1);
//     },1000);

//     setTimeout(async()=>{

//       sub.remove();
//       clearInterval(interval);
//       setRecording(false);
//       setProcessing(true);

//       await runPrediction();

//       setProcessing(false);

//     },20000);

//   }

//   const extractFeatures = () => {

//     const xs = dataRef.current.map(d=>d.x);
//     const ys = dataRef.current.map(d=>d.y);
//     const zs = dataRef.current.map(d=>d.z);

//     const mean = (arr:number[]) =>
//       arr.reduce((a,b)=>a+b,0)/arr.length;

//     const std = (arr:number[]) => {
//       const m = mean(arr);
//       return Math.sqrt(arr.reduce((s,v)=>s+(v-m)*(v-m),0)/arr.length);
//     }

//     return {
//       meanX:mean(xs),
//       meanY:mean(ys),
//       meanZ:mean(zs),
//       stdX:std(xs),
//       stdY:std(ys),
//       stdZ:std(zs)
//     }
//   }

//   const runPrediction = async () => {

//     if(dataRef.current.length === 0){
//       alert("No sensor data collected");
//       return;
//     }

//     const features = extractFeatures();

//     const tremorScore =
//       Math.sqrt(
//         features.stdX**2 +
//         features.stdY**2 +
//         features.stdZ**2
//       );

//     let result = "";
//     let percentage = 0;

//     if(tremorScore < 0.01){
//       result = "Stable";
//       percentage = 5;
//     }
//     else if(tremorScore < 0.08){
//       result = "Normal Hand Stability";
//       percentage = 15;
//     }
//     else if(tremorScore < 0.18){
//       result = "Mild Tremor";
//       percentage = 35;
//     }
//     else if(tremorScore < 0.40){
//       result = "Moderate Tremor";
//       percentage = 65;
//     }
//     else{
//       result = "Severe Tremor";
//       percentage = 90;
//     }

//     const output =
// `Result: ${result}

// Tremor Score: ${tremorScore.toFixed(4)}

// Affected Level: ${percentage}%`;

//     setPrediction(output);

//     try{

//       await fetch(`${BASE_URL}/api/tremor/predict`,{
//         method:"POST",
//         headers:{'Content-Type':'application/json'},
//         body:JSON.stringify({
//           ...features,
//           tremorScore,
//           result
//         })
//       });

//     }catch(e){
//       console.log("Server not reachable, using local prediction");
//     }

//   }

//   return(

//     <ScrollView contentContainerStyle={styles.container}>

//       <Text style={styles.title}>Hand Tremor Detection</Text>

//       <View style={styles.card}>

//         <Button
//           title={recording ? "Recording..." : "Start 20 Second Test"}
//           onPress={startTest}
//           disabled={recording}
//         />

//         {recording && (
//           <>
//             <Text style={styles.timer}>
//               Recording Sensor Data
//             </Text>

//             <Text style={styles.countdown}>
//               {timer} seconds remaining
//             </Text>
//           </>
//         )}

//         {processing && (
//           <View style={{marginTop:20,alignItems:"center"}}>
//             <ActivityIndicator size="large" color="#007bff"/>
//             <Text style={{marginTop:10}}>Processing Sensor Data...</Text>
//           </View>
//         )}

//       </View>


//       {/* Graph */}

//       {(chartX.length > 5) && (
//         <View style={styles.graphCard}>

//           <Text style={styles.graphTitle}>Accelerometer Graph</Text>

//           <LineChart
//             data={{
//               labels: [],
//               datasets: [
//                 { data: chartX },
//                 { data: chartY },
//                 { data: chartZ }
//               ]
//             }}
//             width={screenWidth-40}
//             height={220}
//             chartConfig={{
//               backgroundGradientFrom: "#ffffff",
//               backgroundGradientTo: "#ffffff",
//               decimalPlaces: 2,
//               color: (opacity = 1) => `rgba(0,0,255,${opacity})`,
//               labelColor: () => "#333"
//             }}
//             bezier
//             style={{borderRadius:10}}
//           />

//           <Text style={styles.legend}>
//             X (blue)   Y (blue)   Z (blue)
//           </Text>

//         </View>
//       )}


//       {/* Result */}

//       {prediction !== "" && (
//         <View style={styles.resultCard}>
//           <Text style={styles.resultText}>{prediction}</Text>
//         </View>
//       )}

//     </ScrollView>
//   )
// }

// const styles = StyleSheet.create({

//   container:{
//     flexGrow:1,
//     justifyContent:'center',
//     alignItems:'center',
//     padding:20,
//     backgroundColor:"#f2f6ff"
//   },

//   title:{
//     fontSize:26,
//     fontWeight:'bold',
//     marginBottom:20,
//     color:"#222"
//   },

//   card:{
//     width:"100%",
//     backgroundColor:"#fff",
//     padding:20,
//     borderRadius:12,
//     elevation:3,
//     marginBottom:20
//   },

//   timer:{
//     marginTop:15,
//     fontSize:18,
//     color:"#ff8800",
//     textAlign:"center"
//   },

//   countdown:{
//     fontSize:22,
//     fontWeight:"bold",
//     textAlign:"center",
//     marginTop:5
//   },

//   graphCard:{
//     backgroundColor:"#fff",
//     padding:15,
//     borderRadius:12,
//     elevation:3,
//     marginBottom:20
//   },

//   graphTitle:{
//     fontSize:18,
//     fontWeight:"bold",
//     marginBottom:10,
//     textAlign:"center"
//   },

//   legend:{
//     textAlign:"center",
//     marginTop:8,
//     color:"#666"
//   },

//   resultCard:{
//     backgroundColor:"#e8f5e9",
//     padding:20,
//     borderRadius:12,
//     elevation:2,
//     width:"100%"
//   },

//   resultText:{
//     fontSize:18,
//     textAlign:"center",
//     lineHeight:28,
//     color:"#1b5e20"
//   }

// });



// Before Designing
// import BASE_URL from '../../config/api.js';
// import { Accelerometer } from 'expo-sensors';
// import { useRef, useState } from 'react';
// import {
//   Button,
//   Text,
//   View,
//   StyleSheet,
//   ActivityIndicator,
//   Dimensions,
//   ScrollView,
//   Modal,
//   FlatList,
//   TouchableOpacity
// } from 'react-native';

// import { LineChart } from 'react-native-chart-kit';

// type Sensor = { x:number,y:number,z:number };

// export default function TremorScreen() {

//   const dataRef = useRef<Sensor[]>([]);
//   const [prediction,setPrediction] = useState("");
//   const [recording,setRecording] = useState(false);
//   const [processing,setProcessing] = useState(false);
//   const [timer,setTimer] = useState(0);

//   const [history,setHistory] = useState<any[]>([]);
//   const [historyVisible,setHistoryVisible] = useState(false);

//   const [chartX,setChartX] = useState<number[]>([]);
//   const [chartY,setChartY] = useState<number[]>([]);
//   const [chartZ,setChartZ] = useState<number[]>([]);

//   const screenWidth = Dimensions.get("window").width;

//   const fetchHistory = async () => {

//     try{

//       const res = await fetch(`${BASE_URL}/api/tremor/history`);
//       const data = await res.json();

//       setHistory(data);
//       setHistoryVisible(true);

//     }catch(e){

//       alert("Failed to load history");

//     }

//   }

//   const startTest = () => {

//     dataRef.current = [];
//     setPrediction("");
//     setRecording(true);
//     setProcessing(false);
//     setTimer(20);

//     setChartX([]);
//     setChartY([]);
//     setChartZ([]);

//     Accelerometer.setUpdateInterval(50);

//     const sub = Accelerometer.addListener(d=>{

//       dataRef.current.push({x:d.x,y:d.y,z:d.z});

//       setChartX(prev => [...prev.slice(-39), d.x]);
//       setChartY(prev => [...prev.slice(-39), d.y]);
//       setChartZ(prev => [...prev.slice(-39), d.z]);

//     });

//     const interval = setInterval(()=>{
//       setTimer(t=>t-1);
//     },1000);

//     setTimeout(async()=>{

//       sub.remove();
//       clearInterval(interval);
//       setRecording(false);
//       setProcessing(true);

//       await runPrediction();

//       setProcessing(false);

//     },20000);

//   }

//   const extractFeatures = () => {

//     const xs = dataRef.current.map(d=>d.x);
//     const ys = dataRef.current.map(d=>d.y);
//     const zs = dataRef.current.map(d=>d.z);

//     const mean = (arr:number[]) =>
//       arr.reduce((a,b)=>a+b,0)/arr.length;

//     const std = (arr:number[]) => {
//       const m = mean(arr);
//       return Math.sqrt(arr.reduce((s,v)=>s+(v-m)*(v-m),0)/arr.length);
//     }

//     return {
//       meanX:mean(xs),
//       meanY:mean(ys),
//       meanZ:mean(zs),
//       stdX:std(xs),
//       stdY:std(ys),
//       stdZ:std(zs)
//     }
//   }

//   const runPrediction = async () => {

//     if(dataRef.current.length === 0){
//       alert("No sensor data collected");
//       return;
//     }

//     const features = extractFeatures();

//     const tremorScore =
//       Math.sqrt(
//         features.stdX**2 +
//         features.stdY**2 +
//         features.stdZ**2
//       );

//     let result = "";
//     let percentage = 0;

//     if(tremorScore < 0.01){
//       result = "Stable";
//       percentage = 5;
//     }
//     else if(tremorScore < 0.08){
//       result = "Normal Hand Stability";
//       percentage = 15;
//     }
//     else if(tremorScore < 0.18){
//       result = "Mild Tremor";
//       percentage = 35;
//     }
//     else if(tremorScore < 0.40){
//       result = "Moderate Tremor";
//       percentage = 65;
//     }
//     else{
//       result = "Severe Tremor";
//       percentage = 90;
//     }

//     const output =
// `Result: ${result}

// Tremor Score: ${tremorScore.toFixed(4)}

// Affected Level: ${percentage}%`;

//     setPrediction(output);

//     try{

//       await fetch(`${BASE_URL}/api/tremor/predict`,{
//         method:"POST",
//         headers:{'Content-Type':'application/json'},
//         body:JSON.stringify({
//           ...features,
//           tremorScore,
//           result
//         })
//       });

//     }catch(e){

//       console.log("Server not reachable");

//     }

//   }

//   return(

//     <ScrollView contentContainerStyle={styles.container}>

//       <Text style={styles.title}>Hand Tremor Detection</Text>

//       <View style={styles.buttonRow}>

//         <Button
//           title={recording ? "Recording..." : "Start Test"}
//           onPress={startTest}
//           disabled={recording}
//         />

//         <Button
//           title="History"
//           onPress={fetchHistory}
//         />

//       </View>

//       {recording && (
//         <Text style={styles.timer}>
//           Recording... {timer}s
//         </Text>
//       )}

//       {processing && (
//         <ActivityIndicator size="large" style={{marginTop:20}} />
//       )}

//       {chartX.length > 5 && (

//         <LineChart
//           data={{
//             labels:[],
//             datasets:[
//               {data:chartX},
//               {data:chartY},
//               {data:chartZ}
//             ]
//           }}
//           width={screenWidth-40}
//           height={220}
//           chartConfig={{
//             backgroundGradientFrom:"#fff",
//             backgroundGradientTo:"#fff",
//             decimalPlaces:2,
//             color:(o=1)=>`rgba(0,0,255,${o})`
//           }}
//           bezier
//           style={{marginTop:20,borderRadius:10}}
//         />

//       )}

//       {prediction !== "" && (

//         <View style={styles.resultCard}>
//           <Text style={styles.result}>{prediction}</Text>
//         </View>

//       )}

//       {/* HISTORY MODAL */}

//       <Modal visible={historyVisible} animationType="slide">

//         <View style={{flex:1,padding:20}}>

//           <Text style={styles.historyTitle}>
//             Tremor Test History
//           </Text>

//           <FlatList
//             data={history}
//             keyExtractor={(item)=>item._id}
//             renderItem={({item})=>{

//   const score = Math.sqrt(
//     item.stdX**2 +
//     item.stdY**2 +
//     item.stdZ**2
//   );

//   return(

//     <View style={styles.historyCard}>

//       <Text style={styles.historyResult}>
//         {item.result}
//       </Text>

//       <Text>
//         Score: {score.toFixed(4)}
//       </Text>

//       <Text>
//         {new Date(item.createdAt).toLocaleString()}
//       </Text>

//     </View>

//   )

// }}
//           />

//           <TouchableOpacity
//             style={styles.closeBtn}
//             onPress={()=>setHistoryVisible(false)}
//           >
//             <Text style={{color:"#fff"}}>Close</Text>
//           </TouchableOpacity>

//         </View>

//       </Modal>

//     </ScrollView>
//   )
// }

// const styles = StyleSheet.create({

//   container:{
//     flexGrow:1,
//     justifyContent:'center',
//     alignItems:'center',
//     padding:20,
//     backgroundColor:"#f4f6ff"
//   },

//   title:{
//     fontSize:26,
//     fontWeight:'bold',
//     marginBottom:20
//   },

//   buttonRow:{
//     flexDirection:"row",
//     gap:15
//   },

//   timer:{
//     marginTop:20,
//     fontSize:18,
//     color:"orange"
//   },

//   resultCard:{
//     marginTop:20,
//     backgroundColor:"#e8f5e9",
//     padding:20,
//     borderRadius:10
//   },

//   result:{
//     fontSize:18,
//     textAlign:"center"
//   },

//   historyTitle:{
//     fontSize:24,
//     fontWeight:"bold",
//     marginBottom:20
//   },

//   historyCard:{
//     padding:15,
//     backgroundColor:"#fff",
//     borderRadius:10,
//     marginBottom:10,
//     elevation:2
//   },

//   historyResult:{
//     fontSize:18,
//     fontWeight:"bold"
//   },

//   closeBtn:{
//     marginTop:20,
//     backgroundColor:"#007bff",
//     padding:15,
//     alignItems:"center",
//     borderRadius:10
//   }

// });



import AsyncStorage from '@react-native-async-storage/async-storage';
import BASE_URL from '../../config/api.js';
import { Accelerometer } from 'expo-sensors';
import { useRef, useState } from 'react';
import {
  Button,
  Text,
  View,
  StyleSheet,
  ActivityIndicator,
  Dimensions,
  ScrollView,
  Modal,
  FlatList,
  TouchableOpacity
} from 'react-native';

import { LineChart } from 'react-native-chart-kit';
import { router } from 'expo-router';

type Sensor = { x:number,y:number,z:number };

export default function TremorScreen() {

  const dataRef = useRef<Sensor[]>([]);
  const [prediction,setPrediction] = useState("");
  const [recording,setRecording] = useState(false);
  const [processing,setProcessing] = useState(false);
  const [timer,setTimer] = useState(0);

  const [history,setHistory] = useState<any[]>([]);
  const [historyVisible,setHistoryVisible] = useState(false);

  const [chartX,setChartX] = useState<number[]>([]);
  const [chartY,setChartY] = useState<number[]>([]);
  const [chartZ,setChartZ] = useState<number[]>([]);

  const [userId, setUserId] = useState<string | null>(null);

  const screenWidth = Dimensions.get("window").width;


  const fetchHistory = async () => {

    try{

      const token = await AsyncStorage.getItem('token');
            if (!token) {
                router.replace('/login');
                return;
            }
            const payload = JSON.parse(atob(token.split('.')[1])) as { id: string };
            setUserId(payload.id);

            const res = await fetch(`${BASE_URL}/api/tremor/history`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ userId: payload.id }),
            });
            const data = await res.json();
            setHistory(data);

      setHistoryVisible(true);

    }catch(e){

      alert("Failed to load history");

    }

  }

  const startTest = () => {

    dataRef.current = [];
    setPrediction("");
    setRecording(true);
    setProcessing(false);
    setTimer(20);

    setChartX([]);
    setChartY([]);
    setChartZ([]);

    Accelerometer.setUpdateInterval(50);

    const sub = Accelerometer.addListener(d=>{

      dataRef.current.push({x:d.x,y:d.y,z:d.z});

      setChartX(prev => [...prev.slice(-39), d.x]);
      setChartY(prev => [...prev.slice(-39), d.y]);
      setChartZ(prev => [...prev.slice(-39), d.z]);

    });

    const interval = setInterval(()=>{
      setTimer(t=>t-1);
    },1000);

    setTimeout(async()=>{

      sub.remove();
      clearInterval(interval);
      setRecording(false);
      setProcessing(true);

      await runPrediction();

      setProcessing(false);

    },20000);

  }

  const extractFeatures = () => {

    const xs = dataRef.current.map(d=>d.x);
    const ys = dataRef.current.map(d=>d.y);
    const zs = dataRef.current.map(d=>d.z);

    const mean = (arr:number[]) =>
      arr.reduce((a,b)=>a+b,0)/arr.length;

    const std = (arr:number[]) => {
      const m = mean(arr);
      return Math.sqrt(arr.reduce((s,v)=>s+(v-m)*(v-m),0)/arr.length);
    }

    return {
      meanX:mean(xs),
      meanY:mean(ys),
      meanZ:mean(zs),
      stdX:std(xs),
      stdY:std(ys),
      stdZ:std(zs)
    }
  }

  const runPrediction = async () => {

    if(dataRef.current.length === 0){
      alert("No sensor data collected");
      return;
    }

    const features = extractFeatures();

    const tremorScore =
      Math.sqrt(
        features.stdX**2 +
        features.stdY**2 +
        features.stdZ**2
      );

    let result = "";
    let percentage = 0;

    if(tremorScore < 0.01){
      result = "Stable";
      percentage = 5;
    }
    else if(tremorScore < 0.08){
      result = "Normal Hand Stability";
      percentage = 15;
    }
    else if(tremorScore < 0.18){
      result = "Mild Tremor";
      percentage = 35;
    }
    else if(tremorScore < 0.40){
      result = "Moderate Tremor";
      percentage = 65;
    }
    else{
      result = "Severe Tremor";
      percentage = 90;
    }

    const output =
`Result: ${result}

Tremor Score: ${tremorScore.toFixed(4)}

Affected Level: ${percentage}%`;

    setPrediction(output);

    try{

      await fetch(`${BASE_URL}/api/tremor/predict`,{
        method:"POST",
        headers:{'Content-Type':'application/json'},
        body:JSON.stringify({
          ...features,
          tremorScore,
          result,
          userId
        })
      });

    }catch(e){

      console.log("Server not reachable");

    }

  }

  return(

    <ScrollView contentContainerStyle={styles.container}>

      <Text style={styles.title}>Hand Tremor Detection</Text>

      <View style={styles.card}>

        <View style={styles.buttonRow}>

          <TouchableOpacity
            style={[styles.primaryBtn, recording && styles.disabledBtn]}
            onPress={startTest}
            disabled={recording}
          >
            <Text style={styles.btnText}>
              {recording ? "Recording..." : "Start Test"}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.secondaryBtn}
            onPress={fetchHistory}
          >
            <Text style={styles.btnText}>History</Text>
          </TouchableOpacity>

        </View>

        {recording && (
          <Text style={styles.timer}>
            Recording... {timer}s
          </Text>
        )}

        {processing && (
          <ActivityIndicator size="large" style={{marginTop:20}} />
        )}

      </View>

      {chartX.length > 5 && (

        <View style={styles.chartCard}>

          <Text style={styles.chartTitle}>Live Sensor Graph</Text>

          <LineChart
            data={{
              labels:[],
              datasets:[
                {data:chartX},
                {data:chartY},
                {data:chartZ}
              ]
            }}
            width={screenWidth-40}
            height={220}
            chartConfig={{
              backgroundGradientFrom:"#fff",
              backgroundGradientTo:"#fff",
              decimalPlaces:2,
              color:(o=1)=>`rgba(33,150,243,${o})`
            }}
            bezier
            style={{borderRadius:10}}
          />

        </View>

      )}

      {prediction !== "" && (

        <View style={styles.resultCard}>
          <Text style={styles.result}>{prediction}</Text>
        </View>

      )}

      <Modal visible={historyVisible} animationType="slide">

        <View style={styles.modalContainer}>

          <Text style={styles.historyTitle}>
            Tremor Test History
          </Text>

          <FlatList
            data={history}
            keyExtractor={(item)=>item._id}
            renderItem={({item})=>{

  const score = Math.sqrt(
    item.stdX**2 +
    item.stdY**2 +
    item.stdZ**2
  );

  return(

    <View style={styles.historyCard}>

      <Text style={styles.historyResult}>
        {item.result}
      </Text>

      <Text style={styles.historyText}>
        Score: {score.toFixed(4)}
      </Text>

      <Text style={styles.historyDate}>
        {new Date(item.createdAt).toLocaleString()}
      </Text>

    </View>

  )

}}
          />

          <TouchableOpacity
            style={styles.closeBtn}
            onPress={()=>setHistoryVisible(false)}
          >
            <Text style={{color:"#fff",fontWeight:"bold"}}>Close</Text>
          </TouchableOpacity>

        </View>

      </Modal>

    </ScrollView>
  )
}

const styles = StyleSheet.create({

  container:{
    flexGrow:1,
    alignItems:'center',
    padding:20,
    backgroundColor:"#eef2ff"
  },

  title:{
    paddingTop: 50,
    fontSize:28,
    fontWeight:'bold',
    marginBottom:20,
    color:"#333"
  },

  card:{
    width:"100%",
    backgroundColor:"#fff",
    padding:20,
    borderRadius:12,
    elevation:3
  },

  buttonRow:{
    flexDirection:"row",
    justifyContent:"space-between"
  },

  primaryBtn:{
    backgroundColor:"#4f46e5",
    padding:14,
    borderRadius:10,
    width:"48%",
    alignItems:"center"
  },

  secondaryBtn:{
    backgroundColor:"#10b981",
    padding:14,
    borderRadius:10,
    width:"48%",
    alignItems:"center"
  },

  disabledBtn:{
    backgroundColor:"#9ca3af"
  },

  btnText:{
    color:"#fff",
    fontWeight:"bold"
  },

  timer:{
    marginTop:15,
    fontSize:16,
    color:"#f59e0b",
    textAlign:"center"
  },

  chartCard:{
    marginTop:20,
    backgroundColor:"#fff",
    padding:15,
    borderRadius:12,
    elevation:3
  },

  chartTitle:{
    fontSize:16,
    fontWeight:"bold",
    marginBottom:10
  },

  resultCard:{
    marginTop:20,
    backgroundColor:"#dcfce7",
    padding:20,
    borderRadius:12,
    elevation:3
  },

  result:{
    fontSize:18,
    textAlign:"center",
    fontWeight:"500"
  },

  modalContainer:{
    flex:1,
    padding:20,
    backgroundColor:"#f1f5f9"
  },

  historyTitle:{
    fontSize:24,
    fontWeight:"bold",
    marginBottom:20
  },

  historyCard:{
    padding:15,
    backgroundColor:"#fff",
    borderRadius:12,
    marginBottom:12,
    elevation:2
  },

  historyResult:{
    fontSize:18,
    fontWeight:"bold",
    marginBottom:4
  },

  historyText:{
    fontSize:15
  },

  historyDate:{
    fontSize:13,
    color:"#6b7280",
    marginTop:3
  },

  closeBtn:{
    marginTop:20,
    backgroundColor:"#ef4444",
    padding:15,
    alignItems:"center",
    borderRadius:10
  }

});