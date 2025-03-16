import { useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Animated,
  ImageBackground,
} from "react-native";
import { Feather } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import CustomHeader from "../components/CustomHeader";
import { LinearGradient } from "expo-linear-gradient";

export default function HomeScreen() {
  const router = useRouter();
  const scrollY = useRef(new Animated.Value(0)).current;

  return (
    <View style={styles.container}>
      <ImageBackground
        source={{
          uri: "https://images.unsplash.com/photo-1476984251899-8d7fdfc5c92c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80",
        }}
        style={styles.headerBackground}
      >
        <LinearGradient
          colors={["rgba(0,0,0,0.6)", "transparent"]}
          style={styles.gradient}
        />
        <View style={styles.heroContent}>
          <Text style={styles.heroTitle}>Zavod IT Test Task</Text>
          <Text style={styles.heroSubtitle}>
            Discover and navigate with ease
          </Text>

          <TouchableOpacity
            style={styles.exploreButton}
            onPress={() => router.push("/map")}
          >
            <Text style={styles.exploreButtonText}>Explore Map</Text>
            <Feather name="arrow-right" size={18} color="#fff" />
          </TouchableOpacity>
        </View>
      </ImageBackground>

      <CustomHeader
        title="Zavod IT Test Task"
        showBackButton={false}
        transparent={true}
      />

      <Animated.ScrollView
        contentContainerStyle={styles.content}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { y: scrollY } } }],
          { useNativeDriver: true }
        )}
        scrollEventThrottle={16}
      >
        <View style={styles.featuresSection}>
          <Text style={styles.sectionTitle}>Features</Text>

          <View style={styles.featureContainer}>
            <View style={styles.featureItem}>
              <View style={styles.featureIconContainer}>
                <Feather name="map-pin" size={24} color="#fff" />
              </View>
              <Text style={styles.featureTitle}>Discover Places</Text>
              <Text style={styles.featureDescription}>
                Find interesting locations around you
              </Text>
            </View>

            <View style={styles.featureItem}>
              <View
                style={[
                  styles.featureIconContainer,
                  { backgroundColor: "#e74c3c" },
                ]}
              >
                <Feather name="navigation" size={24} color="#fff" />
              </View>
              <Text style={styles.featureTitle}>Get Directions</Text>
              <Text style={styles.featureDescription}>
                Navigate to your destination easily
              </Text>
            </View>

            <View style={styles.featureItem}>
              <View
                style={[
                  styles.featureIconContainer,
                  { backgroundColor: "#2ecc71" },
                ]}
              >
                <Feather name="user" size={24} color="#fff" />
              </View>
              <Text style={styles.featureTitle}>Personalized</Text>
              <Text style={styles.featureDescription}>
                Customize your profile and preferences
              </Text>
            </View>
          </View>
        </View>

        <View style={styles.menuSection}>
          <Text style={styles.sectionTitle}>Quick Access</Text>

          <View style={styles.cardContainer}>
            <TouchableOpacity
              style={styles.card}
              onPress={() => router.push("/profile")}
            >
              <View style={styles.cardContent}>
                <Feather name="user" size={30} color="#3498db" />
                <Text style={styles.cardTitle}>Profile</Text>
                <Text style={styles.cardDescription}>
                  Update your personal information
                </Text>
              </View>
              <View style={styles.cardAction}>
                <Feather name="chevron-right" size={20} color="#bdc3c7" />
              </View>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.card}
              onPress={() => router.push("/support")}
            >
              <View style={styles.cardContent}>
                <Feather name="message-circle" size={30} color="#9b59b6" />
                <Text style={styles.cardTitle}>Support</Text>
                <Text style={styles.cardDescription}>
                  Chat with our support team
                </Text>
              </View>
              <View style={styles.cardAction}>
                <Feather name="chevron-right" size={20} color="#bdc3c7" />
              </View>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.card}
              onPress={() => router.push("/history")}
            >
              <View style={styles.cardContent}>
                <Feather name="clock" size={30} color="#f39c12" />
                <Text style={styles.cardTitle}>History</Text>
                <Text style={styles.cardDescription}>
                  View your navigation history
                </Text>
              </View>
              <View style={styles.cardAction}>
                <Feather name="chevron-right" size={20} color="#bdc3c7" />
              </View>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.card}
              onPress={() => router.push("/map")}
            >
              <View style={styles.cardContent}>
                <Feather name="map" size={30} color="#2ecc71" />
                <Text style={styles.cardTitle}>Map</Text>
                <Text style={styles.cardDescription}>
                  Explore locations and navigate
                </Text>
              </View>
              <View style={styles.cardAction}>
                <Feather name="chevron-right" size={20} color="#bdc3c7" />
              </View>
            </TouchableOpacity>
          </View>
        </View>
      </Animated.ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  headerBackground: {
    height: 280,
    width: "100%",
  },
  gradient: {
    position: "absolute",
    left: 0,
    right: 0,
    top: 0,
    height: 100,
  },
  heroContent: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  heroTitle: {
    fontSize: 32,
    fontFamily: "Inter-Bold",
    color: "#fff",
    marginBottom: 10,
    textShadowColor: "rgba(0, 0, 0, 0.3)",
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 3,
  },
  heroSubtitle: {
    fontSize: 18,
    fontFamily: "Inter-Regular",
    color: "#fff",
    marginBottom: 20,
    textShadowColor: "rgba(0, 0, 0, 0.3)",
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 3,
  },
  exploreButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(52, 152, 219, 0.9)",
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
  content: {
    paddingTop: 20,
    paddingBottom: 40,
  },
  featuresSection: {
    padding: 20,
  },
  sectionTitle: {
    fontSize: 22,
    fontFamily: "Inter-Bold",
    color: "#2c3e50",
    marginBottom: 20,
  },
  featureContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  featureItem: {
    width: "30%",
    alignItems: "center",
  },
  featureIconContainer: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: "#3498db",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 10,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  featureTitle: {
    fontSize: 16,
    fontFamily: "Inter-SemiBold",
    marginBottom: 5,
    color: "#2c3e50",
    textAlign: "center",
  },
  featureDescription: {
    fontSize: 12,
    textAlign: "center",
    color: "#7f8c8d",
    fontFamily: "Inter-Regular",
  },
  menuSection: {
    padding: 20,
  },
  cardContainer: {
    width: "100%",
  },
  card: {
    flexDirection: "row",
    backgroundColor: "#fff",
    borderRadius: 12,
    marginBottom: 15,
    padding: 15,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    alignItems: "center",
  },
  cardContent: {
    flex: 1,
  },
  cardTitle: {
    fontSize: 18,
    fontFamily: "Inter-SemiBold",
    marginTop: 10,
    marginBottom: 5,
    color: "#2c3e50",
  },
  cardDescription: {
    fontSize: 14,
    color: "#7f8c8d",
    fontFamily: "Inter-Regular",
  },
  cardAction: {
    padding: 10,
  },
});
