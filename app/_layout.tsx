import { useEffect } from "react";
import { Drawer } from "expo-router/drawer";
import { useFonts } from "expo-font";
import { SplashScreen } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { Feather } from "@expo/vector-icons";
import {
  DrawerContentScrollView,
  DrawerItemList,
} from "@react-navigation/drawer";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";

// Prevent the splash screen from auto-hiding
SplashScreen.preventAutoHideAsync();

export default function Layout() {
  const [fontsLoaded] = useFonts({
    "Inter-Regular": require("../assets/fonts/Inter_18pt-Regular.ttf"),
    "Inter-Medium": require("../assets/fonts/Inter_18pt-Medium.ttf"),
    "Inter-Bold": require("../assets/fonts/Inter_18pt-Bold.ttf"),
  });

  useEffect(() => {
    if (fontsLoaded) {
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded]);

  if (!fontsLoaded) {
    return null;
  }

  return (
    <>
      <StatusBar style="light" />
      <Drawer
        screenOptions={{
          // drawerPosition: "right",
          headerShown: false,
          drawerType: "slide",
          headerStyle: {
            backgroundColor: "#3498db",
          },
          headerTintColor: "#fff",
          headerTitleStyle: {
            fontFamily: "Inter-Bold",
          },
          drawerActiveBackgroundColor: "#3498db",
          drawerActiveTintColor: "#fff",
          drawerInactiveTintColor: "#333",
          drawerLabelStyle: {
            // marginLeft: -20,
            fontFamily: "Inter-Medium",
            fontSize: 16,
          },
        }}
        drawerContent={(props) => <CustomDrawerContent {...props} />}
      >
        <Drawer.Screen
          name="index"
          options={{
            title: "Home",
            drawerIcon: ({ color }) => (
              <Feather name="home" size={22} color={color} />
            ),
          }}
        />
        <Drawer.Screen
          name="map"
          options={{
            title: "Map",
            drawerIcon: ({ color }) => (
              <Feather name="map" size={22} color={color} />
            ),
          }}
        />
        <Drawer.Screen
          name="profile"
          options={{
            title: "Profile",
            drawerIcon: ({ color }) => (
              <Feather name="user" size={22} color={color} />
            ),
          }}
        />
        <Drawer.Screen
          name="support"
          options={{
            title: "Support",
            drawerIcon: ({ color }) => (
              <Feather name="message-circle" size={22} color={color} />
            ),
          }}
        />
        <Drawer.Screen
          name="history"
          options={{
            title: "History",
            drawerIcon: ({ color }) => (
              <Feather name="clock" size={22} color={color} />
            ),
          }}
        />
      </Drawer>
    </>
  );
}

function CustomDrawerContent(props: any) {
  return (
    <View style={styles.container}>
      <DrawerContentScrollView
        {...props}
        contentContainerStyle={styles.drawerContent}
      >
        <View style={styles.drawerHeader}>
          <View style={styles.userIconContainer}>
            <Feather name="user" size={40} color="#fff" />
          </View>
          <Text style={styles.userName}>Ahuekwe Prince</Text>
          <Text style={styles.userEmail}>ahuekweprinceugo@gmail.com</Text>
        </View>

        <View style={styles.drawerItemsContainer}>
          <DrawerItemList {...props} />
        </View>
      </DrawerContentScrollView>

      <View style={styles.drawerFooter}>
        <TouchableOpacity style={styles.footerButton}>
          <Feather name="settings" size={22} color="#333" />
          <Text style={styles.footerButtonText}>Settings</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.footerButton}>
          <Feather name="help-circle" size={22} color="#333" />
          <Text style={styles.footerButtonText}>Help</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  drawerContent: {
    flex: 1,
  },
  drawerHeader: {
    padding: 20,
    backgroundColor: "#3498db",
    marginBottom: 10,
  },
  userIconContainer: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: "rgba(255, 255, 255, 0.3)",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 10,
  },
  userName: {
    color: "#fff",
    fontSize: 18,
    fontFamily: "Inter-Bold",
    marginBottom: 5,
  },
  userEmail: {
    color: "#e1f0fa",
    fontSize: 14,
    fontFamily: "Inter-Regular",
  },
  drawerItemsContainer: {
    flex: 1,
    paddingTop: 10,
  },
  drawerFooter: {
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: "#ccc",
  },
  footerButton: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 15,
  },
  footerButtonText: {
    fontSize: 15,
    marginLeft: 15,
    color: "#333",
    fontFamily: "Inter-Medium",
  },
});
