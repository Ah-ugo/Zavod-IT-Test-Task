import { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Modal,
  Alert,
  Platform,
  Linking,
  ActivityIndicator,
} from "react-native";
import MapView, { Marker, PROVIDER_GOOGLE } from "react-native-maps";
import { AntDesign, Feather } from "@expo/vector-icons";
import * as Location from "expo-location";
import CustomHeader from "../components/CustomHeader";
import AsyncStorage from "@react-native-async-storage/async-storage";

// Function to fetch nearby places using Google Places API
// const fetchNearbyPlaces = async (latitude, longitude, radius = 5000) => {
//   try {
//     // const apiKey = "YOUR_GOOGLE_PLACES_API_KEY";
//     const apiKey = "";

//     // Using nearbysearch to get places in the vicinity
//     const url = `https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${latitude},${longitude}&radius=${radius}&type=establishment&key=${apiKey}`;

//     const response = await fetch(url);
//     const data = await response.json();

//     if (data.status === "OK" && data.results) {
//       // Select a random subset of 7 places if there are more than 7 results
//       let placesToUse = data.results;
//       if (placesToUse.length > 7) {
//         // Shuffle array and take first 7
//         placesToUse = [...data.results]
//           .sort(() => 0.5 - Math.random())
//           .slice(0, 7);
//       }

//       return placesToUse.map((place) => ({
//         id: place.place_id,
//         name: place.name,
//         type: place.types?.[0]?.replace(/_/g, " ") || "Business",
//         description: place.vicinity || "Local business",
//         rating: place.rating,
//         coordinate: {
//           latitude: place.geometry.location.lat,
//           longitude: place.geometry.location.lng,
//         },
//         place_id: place.place_id, // Save for detailed queries if needed
//       }));
//     } else {
//       throw new Error(`Failed to fetch places: ${data.status}`);
//     }
//   } catch (error) {
//     console.error("Error in fetchNearbyPlaces:", error);
//     throw error;
//   }
// };

const fetchNearbyPlaces = async (
  latitude: any,
  longitude: any,
  radius = 15000
) => {
  try {
    // Convert radius from meters to degrees (approximate)
    const radiusDegrees = radius / 111000; // 1 degree is approximately 111 km

    // Create bounding box for the search - expanded for Owerri Municipal
    const bbox = `${longitude - radiusDegrees},${latitude - radiusDegrees},${
      longitude + radiusDegrees
    },${latitude + radiusDegrees}`;

    // Enhanced Overpass API query to find more amenities in Owerri Municipal
    const query = `
          [out:json];
          (
            // Basic amenities
            node["amenity"](${bbox});
            way["amenity"](${bbox});
            relation["amenity"](${bbox});
            
            // Shops and markets
            node["shop"](${bbox});
            way["shop"](${bbox});
            
            // Tourism spots
            node["tourism"](${bbox});
            way["tourism"](${bbox});
            
            // Leisure facilities
            node["leisure"](${bbox});
            way["leisure"](${bbox});
            
            // Public services
            node["office"](${bbox});
            way["office"](${bbox});
            node["shop"](around:${radius}, ${latitude}, ${longitude});
        node["amenity"="restaurant"](around:${radius}, ${latitude}, ${longitude});
        node["amenity"="hotel"](around:${radius}, ${latitude}, ${longitude});
        node["amenity"="supermarket"](around:${radius}, ${latitude}, ${longitude});
        node["amenity"="mall"](around:${radius}, ${latitude}, ${longitude});
        node["amenity"="school"](around:${radius}, ${latitude}, ${longitude});
        node["amenity"="church"](around:${radius}, ${latitude}, ${longitude});
        node["amenity"="lounge"](around:${radius}, ${latitude}, ${longitude});
        node["amenity"="club"](around:${radius}, ${latitude}, ${longitude});
            
            // Educational institutions
            node["education"](${bbox});
            way["education"](${bbox});
            node["amenity"="school"](${bbox});
            way["amenity"="school"](${bbox});
            node["amenity"="university"](${bbox});
            way["amenity"="university"](${bbox});
            
            // Healthcare facilities
            node["healthcare"](${bbox});
            way["healthcare"](${bbox});
            node["amenity"="hospital"](${bbox});
            way["amenity"="clinic"](${bbox});
            
            // Religious places
            node["amenity"="place_of_worship"](${bbox});
            way["amenity"="place_of_worship"](${bbox});
            
            // Transportation hubs
            node["public_transport"](${bbox});
            way["public_transport"](${bbox});
          );
          out body;
          out center;
        `;

    const response = await fetch("https://overpass-api.de/api/interpreter", {
      method: "POST",
      body: query,
    });

    const data = await response.json();

    if (data && data.elements) {
      let places = data.elements.filter(
        (place) => place.tags && place.tags.name
      );

      places = places.map((place) => {
        if (
          (place.type === "way" || place.type === "relation") &&
          place.center
        ) {
          return {
            ...place,
            lat: place.center.lat,
            lon: place.center.lon,
          };
        }
        return place;
      });

      if (places.length > 15) {
        places = [...places].sort(() => 0.5 - Math.random()).slice(0, 8);
      }

      return places.map((place, index) => ({
        id: `${place.id}-${index}`,
        name: place.tags.name,
        type: (
          place.tags.amenity ||
          place.tags.shop ||
          place.tags.tourism ||
          place.tags.leisure ||
          place.tags.office ||
          place.tags.healthcare ||
          place.tags.education ||
          "establishment"
        ).replace("_", " "),
        description:
          place.tags.description ||
          `${place.tags.name} (${
            place.tags.amenity ||
            place.tags.shop ||
            place.tags.tourism ||
            place.tags.leisure ||
            place.tags.office ||
            place.tags.healthcare ||
            place.tags.education ||
            "local establishment"
          })`,
        rating: null,
        coordinate: {
          latitude: place.lat,
          longitude: place.lon,
        },
        place_id: place.id.toString(),
      }));
    } else {
      throw new Error("Failed to fetch places from Overpass API");
    }
  } catch (error) {
    console.error("Error in fetchNearbyPlaces:", error);
    throw error;
  }
};

const saveNavigationHistory = async (origin, destination) => {
  try {
    const historyJson = await AsyncStorage.getItem("navigationHistory");
    let history = historyJson ? JSON.parse(historyJson) : [];

    const newHistoryItem = {
      id: Date.now().toString(),
      origin: origin,
      destination: destination,
      date: new Date().toISOString().split("T")[0],
      time: new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
    };

    history = [newHistoryItem, ...history];

    if (history.length > 5) {
      history = history.slice(0, 5);
    }

    await AsyncStorage.setItem("navigationHistory", JSON.stringify(history));
  } catch (error) {
    console.error("Error saving navigation history:", error);
  }
};

const openMapsWithDirections = (destLat, destLng, destName) => {
  const scheme = Platform.select({
    ios: "maps://0,0?q=",
    android: "geo:0,0?q=",
  });
  const latLng = `${destLat},${destLng}`;
  const label = destName;
  const url = Platform.select({
    ios: `${scheme}${label}@${latLng}`,
    android: `${scheme}${latLng}(${label})`,
  });

  Linking.openURL(url).catch((err) => {
    Alert.alert("Error", "Could not open maps application");
    console.error("Error opening maps:", err);
  });
};

export default function MapScreen() {
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [userLocation, setUserLocation] = useState(null);
  const [mapRegion, setMapRegion] = useState(null);
  const [locations, setLocations] = useState([]);
  const [locationPermission, setLocationPermission] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [loadingMessage, setLoadingMessage] = useState(
    "Fetching your location..."
  );
  const mapRef = useRef(null);

  useEffect(() => {
    const setupLocationAndPlaces = async () => {
      try {
        setIsLoading(true);
        setLoadingMessage("Requesting location permission...");

        const { status } = await Location.requestForegroundPermissionsAsync();
        setLocationPermission(status === "granted");

        if (status === "granted") {
          setLoadingMessage("Getting your current location...");

          const location = await Location.getCurrentPositionAsync({
            accuracy: Location.Accuracy.High,
          });

          const userCoords = {
            latitude: location.coords.latitude,
            longitude: location.coords.longitude,
          };

          setUserLocation(userCoords);

          const newRegion = {
            ...userCoords,
            latitudeDelta: 0.1,
            longitudeDelta: 0.1,
          };

          setMapRegion(newRegion);

          setLoadingMessage("Finding places across Owerri Municipal...");
          const nearbyPlaces = await fetchNearbyPlaces(
            userCoords.latitude,
            userCoords.longitude,
            15000
          );

          setLocations(nearbyPlaces);
          console.log(nearbyPlaces, "nearbyplaces, ===");
          console.log(locations, "All Markers Being Mapped:");
        } else {
          Alert.alert(
            "Location Permission Denied",
            "This app needs access to your location to show nearby places. Please enable location services in your settings.",
            [{ text: "OK" }]
          );
        }
      } catch (error) {
        console.error("Error setting up location and places:", error);
        Alert.alert(
          "Error",
          "There was a problem getting your location or nearby places. Please try again later."
        );
      } finally {
        setIsLoading(false);
      }
    };

    setupLocationAndPlaces();
  }, []);

  const onMarkerPress = (location) => {
    console.log("Marker pressed:", location);
    setSelectedLocation(location);
    setModalVisible(true);
  };

  const startNavigation = () => {
    setModalVisible(false);

    if (selectedLocation) {
      saveNavigationHistory("Current Location", selectedLocation.name);

      openMapsWithDirections(
        selectedLocation.coordinate.latitude,
        selectedLocation.coordinate.longitude,
        selectedLocation.name
      );
    }
  };

  const centerOnUserLocation = async () => {
    if (locationPermission && userLocation) {
      try {
        setIsLoading(true);
        setLoadingMessage("Updating your location...");

        const location = await Location.getCurrentPositionAsync({
          accuracy: Location.Accuracy.Balanced,
        });

        const newUserLocation = {
          latitude: location.coords.latitude,
          longitude: location.coords.longitude,
        };

        setUserLocation(newUserLocation);

        const newRegion = {
          ...newUserLocation,
          latitudeDelta: 0.1,
          longitudeDelta: 0.1,
        };

        mapRef.current?.animateToRegion(newRegion, 1000);
        setIsLoading(false);
      } catch (error) {
        console.error("Error getting current location:", error);
        setIsLoading(false);
        Alert.alert("Error", "Could not update your current location");
      }
    }
  };

  const refreshLocations = async () => {
    if (!userLocation) return;

    setIsLoading(true);
    setLoadingMessage("Finding new places nearby...");
    console.log(locations, "locations====");

    try {
      const nearbyPlaces = await fetchNearbyPlaces(
        userLocation.latitude,
        userLocation.longitude
      );
      setLocations(nearbyPlaces);
    } catch (error) {
      console.error("Error refreshing locations:", error);
      Alert.alert("Error", "Could not load nearby places");
    } finally {
      setIsLoading(false);
    }
  };

  if (!mapRegion) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#3498db" />
        <Text style={styles.loadingText}>{loadingMessage}</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <MapView style={{ flex: 1 }} region={mapRegion} showsUserLocation={true}>
        {locations.map((place, index) => (
          <Marker
            key={place.id || index}
            coordinate={{
              latitude: place.coordinate.latitude,
              longitude: place.coordinate.longitude,
            }}
            title={place.name}
            onPress={() => onMarkerPress(place)}
            description={place.description}
          />
        ))}
      </MapView>

      <CustomHeader
        title="Explore Map"
        transparent={true}
        rightComponent={
          <TouchableOpacity
            style={styles.locationButton}
            onPress={centerOnUserLocation}
            disabled={isLoading}
          >
            <Feather name="crosshair" size={22} color="#fff" />
          </TouchableOpacity>
        }
      />

      {isLoading && (
        <View style={styles.loadingOverlay}>
          <ActivityIndicator size="large" color="#ffffff" />
          <Text style={styles.loadingOverlayText}>{loadingMessage}</Text>
        </View>
      )}

      <View style={styles.mapControls}>
        <TouchableOpacity
          style={styles.controlButton}
          onPress={centerOnUserLocation}
          disabled={isLoading}
        >
          <Feather
            name="navigation"
            size={22}
            color={isLoading ? "#ccc" : "#333"}
          />
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.controlButton}
          onPress={refreshLocations}
          disabled={isLoading}
        >
          <Feather
            name="refresh-cw"
            size={22}
            color={isLoading ? "#ccc" : "#333"}
          />
        </TouchableOpacity>
      </View>

      {/* Location Details Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>{selectedLocation?.name}</Text>
              <TouchableOpacity
                style={styles.closeButton}
                onPress={() => setModalVisible(false)}
              >
                <Feather name="x" size={24} color="#333" />
              </TouchableOpacity>
            </View>

            <View style={styles.modalContent}>
              <Text style={styles.modalType}>
                {selectedLocation?.type?.charAt(0).toUpperCase() +
                  selectedLocation?.type?.slice(1)}
              </Text>

              {selectedLocation?.rating && (
                <View style={styles.ratingContainer}>
                  <Feather name="star" size={18} color="#FFD700" />
                  <Text style={styles.ratingText}>
                    {selectedLocation.rating.toFixed(1)}
                  </Text>
                </View>
              )}

              <Text style={styles.modalDescription}>
                {selectedLocation?.description}
              </Text>

              <TouchableOpacity
                style={styles.navigationButton}
                onPress={startNavigation}
              >
                <Feather name="navigation" size={20} color="#fff" />
                <Text style={styles.navigationButtonText}>
                  Navigate from Current Location
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f5f5f5",
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: "#333",
    fontFamily: "Inter-Medium",
  },
  map: {
    width: "100%",
    height: "100%",
  },
  loadingOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0,0,0,0.6)",
    justifyContent: "center",
    alignItems: "center",
  },
  loadingOverlayText: {
    color: "#ffffff",
    marginTop: 10,
    fontSize: 16,
    fontFamily: "Inter-Medium",
  },
  mapControls: {
    position: "absolute",
    right: 16,
    bottom: 30,
    backgroundColor: "#fff",
    borderRadius: 12,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  controlButton: {
    width: 48,
    height: 48,
    justifyContent: "center",
    alignItems: "center",
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  locationButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "rgba(0, 0, 0, 0.3)",
    justifyContent: "center",
    alignItems: "center",
  },
  centeredView: {
    flex: 1,
    justifyContent: "flex-end",
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  modalView: {
    backgroundColor: "white",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  modalTitle: {
    fontSize: 22,
    fontFamily: "Inter-Bold",
    color: "#333",
    flex: 1,
  },
  closeButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "#f0f0f0",
    justifyContent: "center",
    alignItems: "center",
    marginLeft: 10,
  },
  modalContent: {
    padding: 20,
  },
  modalType: {
    fontSize: 16,
    fontFamily: "Inter-Medium",
    color: "#3498db",
    marginBottom: 10,
  },
  modalDescription: {
    fontSize: 16,
    marginBottom: 20,
    color: "#666",
    fontFamily: "Inter-Regular",
    lineHeight: 24,
  },
  navigationButton: {
    backgroundColor: "#3498db",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    padding: 15,
    borderRadius: 10,
    marginTop: 10,
  },
  navigationButtonText: {
    color: "#fff",
    marginLeft: 10,
    fontSize: 16,
    fontFamily: "Inter-Bold",
  },
  ratingContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 15,
  },
  ratingText: {
    fontSize: 16,
    fontFamily: "Inter-SemiBold",
    color: "#333",
    marginLeft: 5,
  },
});
