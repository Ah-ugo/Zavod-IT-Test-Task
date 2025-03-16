import { useRef, useState, useEffect, useCallback } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Animated,
  FlatList,
  Alert,
  ActivityIndicator,
  RefreshControl,
} from "react-native";
import { Feather } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import CustomHeader from "../components/CustomHeader";
import AsyncStorage from "@react-native-async-storage/async-storage";

const AnimatedFlatList = Animated.createAnimatedComponent(FlatList);

export default function HistoryScreen() {
  const router = useRouter();
  const scrollY = useRef(new Animated.Value(0)).current;
  const [historyData, setHistoryData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const loadNavigationHistory = useCallback(async () => {
    try {
      const historyJson = await AsyncStorage.getItem("navigationHistory");
      if (historyJson) {
        const history = JSON.parse(historyJson);
        setHistoryData(history);
      } else {
        // If no history exists, set empty array
        setHistoryData([]);
      }
    } catch (error) {
      console.error("Error loading navigation history:", error);
      Alert.alert("Error", "Could not load navigation history", [
        { text: "OK" },
      ]);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  const clearNavigationHistory = async () => {
    try {
      Alert.alert(
        "Clear History",
        "Are you sure you want to clear all navigation history?",
        [
          {
            text: "Cancel",
            style: "cancel",
          },
          {
            text: "Clear",
            style: "destructive",
            onPress: async () => {
              await AsyncStorage.removeItem("navigationHistory");
              setHistoryData([]);
              Alert.alert("Success", "Navigation history cleared");
            },
          },
        ]
      );
    } catch (error) {
      console.error("Error clearing navigation history:", error);
      Alert.alert("Error", "Could not clear navigation history", [
        { text: "OK" },
      ]);
    }
  };

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    loadNavigationHistory();
  }, [loadNavigationHistory]);

  useEffect(() => {
    loadNavigationHistory();
  }, [loadNavigationHistory]);

  const renderHistoryItem = ({ item }: any) => (
    <TouchableOpacity
      style={styles.historyItem}
      onPress={() =>
        router.push({
          pathname: "/map",
          //   params: {
          //     origin: item.origin,
          //     destination: item.destination,
          //     originLat: item.originLat,
          //     originLng: item.originLng,
          //     destLat: item.destLat,
          //     destLng: item.destLng,
          //   },
        })
      }
    >
      <View style={styles.iconContainer}>
        <Feather name="map-pin" size={24} color="#3498db" />
      </View>

      <View style={styles.routeInfo}>
        <View style={styles.routeHeader}>
          <Text style={styles.routeTitle}>
            {item.origin} to {item.destination}
          </Text>
          <Text style={styles.routeDate}>{item.date}</Text>
        </View>

        <View style={styles.routeDetails}>
          <View style={styles.locationContainer}>
            <View style={styles.dotStart} />
            <Text style={styles.locationText}>{item.origin}</Text>
          </View>

          <View style={styles.routeLine}>
            <View style={styles.line} />
          </View>

          <View style={styles.locationContainer}>
            <View style={styles.dotEnd} />
            <Text style={styles.locationText}>{item.destination}</Text>
          </View>
        </View>

        <View style={styles.routeFooter}>
          <Text style={styles.routeTime}>
            <Feather name="clock" size={14} color="#7f8c8d" /> {item.time}
          </Text>
          <TouchableOpacity
            style={styles.repeatButton}
            onPress={() =>
              router.push({
                pathname: "/map",
                // params: {
                //   origin: item.origin,
                //   destination: item.destination,
                //   originLat: item.originLat,
                //   originLng: item.originLng,
                //   destLat: item.destLat,
                //   destLng: item.destLng,
                // },
              })
            }
          >
            <Feather name="repeat" size={14} color="#3498db" />
            <Text style={styles.repeatText}>Repeat</Text>
          </TouchableOpacity>
        </View>
      </View>
    </TouchableOpacity>
  );

  const renderEmptyComponent = () => (
    <View style={styles.emptyContainer}>
      <Feather name="map" size={60} color="#bdc3c7" />
      <Text style={styles.emptyTitle}>No Navigation History</Text>
      <Text style={styles.emptyDescription}>
        Your navigation history will appear here after you navigate to a
        location.
      </Text>
      <TouchableOpacity
        style={styles.exploreButton}
        onPress={() => router.push("/map")}
      >
        <Text style={styles.exploreButtonText}>Explore Map</Text>
        <Feather name="arrow-right" size={16} color="#fff" />
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>
      <CustomHeader
        title="Navigation History"
        animatedValue={scrollY}
        rightComponent={
          <TouchableOpacity
            style={styles.filterButton}
            onPress={clearNavigationHistory}
            disabled={historyData.length === 0}
          >
            <Feather
              name="trash-2"
              size={22}
              color={historyData.length === 0 ? "#bdc3c7" : "#e74c3c"}
            />
          </TouchableOpacity>
        }
      />

      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#3498db" />
          <Text style={styles.loadingText}>Loading history...</Text>
        </View>
      ) : (
        <AnimatedFlatList
          data={historyData}
          renderItem={renderHistoryItem}
          keyExtractor={(item) => item.id}
          contentContainerStyle={[
            styles.historyList,
            historyData.length === 0 && styles.emptyList,
          ]}
          onScroll={Animated.event(
            [{ nativeEvent: { contentOffset: { y: scrollY } } }],
            { useNativeDriver: true }
          )}
          scrollEventThrottle={16}
          ListHeaderComponent={
            <View style={styles.header}>
              <Text style={styles.headerTitle}>Navigation History</Text>
              <Text style={styles.headerSubtitle}>Your recent trips</Text>
            </View>
          }
          ListEmptyComponent={renderEmptyComponent}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              colors={["#3498db"]}
              tintColor="#3498db"
            />
          }
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  header: {
    padding: 20,
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderBottomColor: "#e1e1e1",
    marginTop: 56,
  },
  headerTitle: {
    fontSize: 22,
    fontFamily: "Inter-Bold",
    color: "#2c3e50",
  },
  headerSubtitle: {
    fontSize: 14,
    color: "#7f8c8d",
    marginTop: 5,
    fontFamily: "Inter-Regular",
  },
  historyList: {
    paddingBottom: 20,
    marginTop: 20,
  },
  emptyList: {
    flexGrow: 1,
  },
  historyItem: {
    flexDirection: "row",
    backgroundColor: "#fff",
    borderRadius: 10,
    margin: 15,
    marginTop: 0,
    padding: 15,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  iconContainer: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: "#e1f0fa",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 15,
  },
  routeInfo: {
    flex: 1,
  },
  routeHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
  },
  routeTitle: {
    fontSize: 16,
    fontFamily: "Inter-Bold",
    color: "#2c3e50",
    flex: 1,
  },
  routeDate: {
    fontSize: 12,
    color: "#7f8c8d",
    fontFamily: "Inter-Regular",
    marginLeft: 8,
  },
  routeDetails: {
    marginBottom: 10,
  },
  locationContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 3,
  },
  dotStart: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: "#3498db",
    marginRight: 10,
  },
  dotEnd: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: "#e74c3c",
    marginRight: 10,
  },
  locationText: {
    fontSize: 14,
    color: "#34495e",
    fontFamily: "Inter-Regular",
  },
  routeLine: {
    paddingLeft: 5,
    height: 15,
  },
  line: {
    width: 1,
    height: "100%",
    backgroundColor: "#bdc3c7",
    marginLeft: 4,
  },
  routeFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 5,
  },
  routeTime: {
    fontSize: 12,
    color: "#7f8c8d",
    fontFamily: "Inter-Regular",
  },
  repeatButton: {
    flexDirection: "row",
    alignItems: "center",
  },
  repeatText: {
    fontSize: 12,
    color: "#3498db",
    marginLeft: 5,
    fontFamily: "Inter-Medium",
  },
  filterButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#fff",
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,
    elevation: 2,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingTop: 56,
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: "#7f8c8d",
    fontFamily: "Inter-Regular",
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  emptyTitle: {
    fontSize: 20,
    fontFamily: "Inter-Bold",
    color: "#2c3e50",
    marginTop: 20,
    marginBottom: 10,
  },
  emptyDescription: {
    fontSize: 16,
    textAlign: "center",
    color: "#7f8c8d",
    fontFamily: "Inter-Regular",
    marginBottom: 30,
  },
  exploreButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#3498db",
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 30,
  },
  exploreButtonText: {
    color: "#fff",
    fontFamily: "Inter-SemiBold",
    fontSize: 16,
    marginRight: 8,
  },
});
