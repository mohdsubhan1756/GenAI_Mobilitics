import AsyncStorage from '@react-native-async-storage/async-storage';
import { router } from 'expo-router';
import { Accelerometer, AccelerometerMeasurement } from 'expo-sensors';
import { fft } from 'fft-js';
import { useEffect, useRef, useState } from 'react';
import {
  Button,
  Dimensions,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { LineChart } from 'react-native-chart-kit';
import * as ss from 'simple-statistics';
import BASE_URL from '../../config/api';


type SensorRecord = {
  x: number;
  y: number;
  z: number;
  t: number;
};

type Features = {
  varianceX: number;
  peakToPeakY: number;
  swayFrequency: number;
};

type TestResponse = {
  status: string;
};


type Prescription = {
  _id: string;
  diagnosis: string;
  bodyPart: string;
  severity: string;
  medicines: string[];
  dietPlan: string[];
  exercisePlan: {
    week: number;
    intensity: string;
    exercises: string[];
  }[];
};



const SCREEN_WIDTH = Dimensions.get('window').width;


export default function HomeScreen() {
  const [data, setData] = useState<AccelerometerMeasurement>({
    x: 0,
    y: 0,
    z: 0,
    timestamp: 0,
  });

  const [recording, setRecording] = useState<boolean>(false);
  const [records, setRecords] = useState<SensorRecord[]>([]);
  const [timer, setTimer] = useState<number>(0);

  const [stabilityScore, setStabilityScore] = useState<number | null>(null);
  const [status, setStatus] = useState<string | null>(null);

  const [userId, setUserId] = useState<string | null>(null);
  const [scoreHistory, setScoreHistory] = useState<number[]>([]);
  const [latestPrescription, setLatestPrescription] =
    useState<Prescription | null>(null);

  const submittedRef = useRef<boolean>(false);


  useEffect(() => {
    const checkLogin = async (): Promise<void> => {
      const token = await AsyncStorage.getItem('token');
      if (!token) {
        router.replace('/login');
        return;
      }
      console.log("Token: ",token);

      const payload = JSON.parse(atob(token.split('.')[1])) as { id: string };
      setUserId(payload.id);
      console.log("Payload id: ", payload.id);
    };

    checkLogin();
  }, []);


  useEffect(() => {
    if (!userId) return;

    const fetchPrescription = async (): Promise<void> => {
      try {
        const token = await AsyncStorage.getItem('token');

        const res = await fetch(
          `${BASE_URL}/api/prescriptions/my`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const data = (await res.json()) as Prescription[];
        if (data.length > 0) setLatestPrescription(data[0]);
      } catch (err) {
        console.error(err);
      }
    };

    fetchPrescription();
  }, [userId]);

  /* ===================== FEATURE EXTRACTION ===================== */

  const extractFeatures = (records: SensorRecord[]): Features | null => {
    if (records.length < 128) return null;

    const xArray: number[] = records.map((r: SensorRecord) => r.x);
    const yArray: number[] = records.map((r: SensorRecord) => r.y);

    const varianceX = ss.variance(xArray);
    const peakToPeakY = Math.max(...yArray) - Math.min(...yArray);

    const fftLength = Math.pow(
      2,
      Math.floor(Math.log2(xArray.length))
    );

    const signal = xArray.slice(0, fftLength);

    const phasors: [number, number][] = fft(signal) as [number, number][];

    const magnitudes: number[] = phasors
      .slice(1)
      .map((p: [number, number]) => Math.hypot(p[0], p[1]));

    const maxIndex = magnitudes.indexOf(Math.max(...magnitudes)) + 1;
    const swayFrequency = (maxIndex * 20) / fftLength;

    return { varianceX, peakToPeakY, swayFrequency };
  };

  const calculateStabilityScore = (f: Features): number => {
    const normVariance = Math.min(f.varianceX / 0.02, 1);
    const normPeak = Math.min(f.peakToPeakY / 0.5, 1);
    const normFreq = Math.min(f.swayFrequency / 2, 1);

    return Math.max(
      0,
      Math.min(100, 100 - (normVariance * 40 + normPeak * 40 + normFreq * 20))
    );
  };

  /* ===================== ACCELEROMETER ===================== */

  useEffect(() => {
    Accelerometer.setUpdateInterval(50);

    const sub = Accelerometer.addListener(
      (d: AccelerometerMeasurement) => {
        setData(d);
        if (recording) {
          setRecords(prev => [
            ...prev,
            { x: d.x, y: d.y, z: d.z, t: Date.now() },
          ]);
        }
      }
    );

    return () => sub.remove();
  }, [recording]);

  const startRecording = (): void => {
    submittedRef.current = false;
    setRecords([]);
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

  /* ===================== SUBMIT ===================== */

  useEffect(() => {
    if (!recording && records.length >= 128 && !submittedRef.current && userId) {
      submittedRef.current = true;

      const features = extractFeatures(records);
      if (!features) return;

      const score = calculateStabilityScore(features);
      setStabilityScore(score);
      setScoreHistory(prev => [...prev.slice(-9), score]);

      // fetch('http://192.168.0.108:5000/api/tests/add', {
      fetch(`${BASE_URL}/api/tests/add`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...features,
          stabilityScore: score,
          userId,
        }),
      })
        .then(res => res.json() as Promise<TestResponse>)
        .then((data: TestResponse) => setStatus(data.status))
        .catch(() => setStatus('Evaluation Failed'));
    }
  }, [recording, records, userId]);

  /* ===================== UI ===================== */

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Balance & Stability Dashboard</Text>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>Live Accelerometer</Text>
        <Text>X: {data.x.toFixed(2)}</Text>
        <Text>Y: {data.y.toFixed(2)}</Text>
        <Text>Z: {data.z.toFixed(2)}</Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>30s Test</Text>
        <Text style={styles.timer}>Timer: {timer}s</Text>
        <Button
          title={recording ? 'Recording…' : 'Start Test'}
          onPress={startRecording}
          disabled={recording}
        />
      </View>

      {scoreHistory.length > 1 && (
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Stability Trend</Text>
          <LineChart
            data={{
              labels: scoreHistory.map((_, i) => `${i + 1}`),
              datasets: [{ data: scoreHistory }],
            }}
            width={SCREEN_WIDTH - 40}
            height={220}
            chartConfig={{
              backgroundGradientFrom: '#fff',
              backgroundGradientTo: '#fff',
              decimalPlaces: 1,
              color: o => `rgba(34,197,94,${o})`,
            }}
            bezier
          />
        </View>
      )}

      {latestPrescription && (
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Latest Prescription</Text>

          <Text>
            {latestPrescription.diagnosis} ({latestPrescription.severity})
          </Text>

          <Button
            title="View Full Plan"
            onPress={() =>
              // router.push(`/plan-result/${latestPrescription._id}`)
              router.push({
                pathname: '/plan-result/[id]',
                params: { id: latestPrescription._id },
              })
      }
    />
        </View>
      )}
      {stabilityScore !== null && (
        <View
          style={[
            styles.resultCard,
            status === 'Recovering'
              ? styles.recovering
              : status === 'Stagnant'
                ? styles.stagnant
                : styles.regressing,
          ]}
        >
          <Text style={styles.scoreText}>
            Stability Score: {stabilityScore.toFixed(1)}
          </Text>
          <Text style={styles.statusText}>
            Status: {status ?? 'Evaluating...'}
          </Text>
        </View>
      )}

    </ScrollView >
  );
}


const styles = StyleSheet.create({
  container: { backgroundColor: '#f4f6f8' },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    textAlign: 'center',
    marginVertical: 20,
  },
  card: {
    backgroundColor: '#fff',
    margin: 15,
    padding: 20,
    borderRadius: 16,
    elevation: 3,
  },
  cardTitle: { fontSize: 18, fontWeight: 'bold', marginBottom: 10 },
  timer: { fontSize: 18, marginBottom: 10 },
  field: {
    fontSize: 15,
    marginBottom: 4,
  },
  label: {
    fontWeight: 'bold',
  },
  sectionTitle: {
    marginTop: 14,
    marginBottom: 6,
    fontSize: 16,
    fontWeight: 'bold',
  },
  listItem: {
    fontSize: 14,
    marginLeft: 8,
    marginBottom: 2,
  },
  exerciseBlock: {
    marginTop: 6,
    marginLeft: 4,
  },
  exerciseHeader: {
    fontWeight: 'bold',
    fontSize: 14,
  },
  empty: {
    fontStyle: 'italic',
    color: '#666',
    marginLeft: 8,
  },


  sensorCard: { width: '90%', backgroundColor: '#fff', padding: 20, borderRadius: 15, marginBottom: 15 },
  timerCard: { width: '90%', backgroundColor: '#fff', padding: 20, borderRadius: 15, alignItems: 'center', marginBottom: 15 },
  recordsCard: { width: '90%', backgroundColor: '#fff', padding: 15, borderRadius: 15 },

  resultCard: { width: '90%', padding: 25, borderRadius: 15, marginTop: 20, alignItems: 'center' },

  recovering: { backgroundColor: '#e0f7e9' },
  stagnant: { backgroundColor: '#fff8e1' },
  regressing: { backgroundColor: '#fdecea' },

  scoreText: { fontSize: 22, fontWeight: 'bold' },
  statusText: { fontSize: 18, marginTop: 8 },
  timerText: { fontSize: 18, marginBottom: 10 },

});