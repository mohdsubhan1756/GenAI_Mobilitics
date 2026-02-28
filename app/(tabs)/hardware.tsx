import React, { useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from "react-native";

// Tab options
const tabs = ["Accelerometer", "Gyroscope", "Mobility Insights"];

export default function ConnectHardwareTab() {
  const [activeTab, setActiveTab] = useState("Accelerometer");

  const renderContent = () => {
    switch (activeTab) {
      case "Accelerometer":
        return (
          <View style={styles.card}>
            <Text style={styles.cardTitle}>Accelerometer</Text>
            <Text style={styles.cardText}>
              Detect motion and orientation changes to analyze mobility patterns.
            </Text>
            <TouchableOpacity style={styles.connectButton}>
              <Text style={styles.connectButtonText}>Connect Accelerometer</Text>
            </TouchableOpacity>
          </View>
        );
      case "Gyroscope":
        return (
          <View style={styles.card}>
            <Text style={styles.cardTitle}>Gyroscope</Text>
            <Text style={styles.cardText}>
              Detect rotation and balance to identify potential mobility issues.
            </Text>
            <TouchableOpacity style={styles.connectButton}>
              <Text style={styles.connectButtonText}>Connect Gyroscope</Text>
            </TouchableOpacity>
          </View>
        );
      case "Mobility Insights":
        return (
          <View style={styles.card}>
            <Text style={styles.cardTitle}>Mobility Insights</Text>
            <Text style={styles.cardText}>
              Once hardware is connected, get real-time mobility analysis and reports.
            </Text>
            <TouchableOpacity style={styles.connectButton}>
              <Text style={styles.connectButtonText}>View Insights</Text>
            </TouchableOpacity>
          </View>
        );
      default:
        return null;
    }
  };

  return (
    <View style={styles.container}>
      {/* Tab Bar */}
      <View style={styles.tabBar}>
        {tabs.map((tab) => (
          <TouchableOpacity
            key={tab}
            style={[
              styles.tabItem,
              activeTab === tab && styles.activeTabItem,
            ]}
            onPress={() => setActiveTab(tab)}
          >
            <Text
              style={[
                styles.tabText,
                activeTab === tab && styles.activeTabText,
              ]}
            >
              {tab}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Content */}
      <ScrollView contentContainerStyle={styles.contentContainer}>
        {renderContent()}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f0f4f7" },
  tabBar: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginTop: 20,
    backgroundColor: "#ffffff",
    elevation: 2,
    borderRadius: 10,
    marginHorizontal: 10,
  },
  tabItem: {
    paddingVertical: 12,
    paddingHorizontal: 20,
  },
  activeTabItem: {
    borderBottomWidth: 3,
    borderBottomColor: "#4f46e5",
  },
  tabText: {
    color: "#6b7280",
    fontWeight: "500",
  },
  activeTabText: {
    color: "#4f46e5",
    fontWeight: "700",
  },
  contentContainer: {
    padding: 20,
    alignItems: "center",
  },
  card: {
    backgroundColor: "#ffffff",
    padding: 20,
    width: "100%",
    borderRadius: 15,
    marginVertical: 10,
    elevation: 4,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 5 },
  },
  cardTitle: { fontSize: 20, fontWeight: "700", marginBottom: 10 },
  cardText: { fontSize: 16, color: "#4b5563", marginBottom: 20 },
  connectButton: {
    backgroundColor: "#4f46e5",
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: "center",
  },
  connectButtonText: { color: "#fff", fontWeight: "600", fontSize: 16 },
});