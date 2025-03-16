import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Animated,
  Platform,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Feather } from "@expo/vector-icons";
import { useNavigation, usePathname } from "expo-router";
import { BlurView } from "expo-blur";

export default function CustomHeader({
  title,
  showBackButton = true,
  rightComponent,
  transparent = false,
  animatedValue = new Animated.Value(0),
}: any) {
  const navigation = useNavigation();
  const insets = useSafeAreaInsets();
  const pathname = usePathname();

  const isHomeScreen = pathname === "/index" || pathname === "/";

  const headerOpacity = animatedValue.interpolate({
    inputRange: [0, 60],
    outputRange: [0, 1],
    extrapolate: "clamp",
  });

  const titleOpacity = animatedValue.interpolate({
    inputRange: [0, 30, 60],
    outputRange: [0, 0.5, 1],
    extrapolate: "clamp",
  });

  return (
    <View
      style={[
        styles.headerContainer,
        { paddingTop: insets.top },
        transparent && styles.transparentHeader,
      ]}
    >
      {!transparent && (
        <View style={styles.headerBackground}>
          <Animated.View
            style={[styles.blurContainer, { opacity: headerOpacity }]}
          >
            <BlurView intensity={80} style={styles.blur} tint="light" />
          </Animated.View>
          <View style={styles.headerGradient} />
        </View>
      )}

      <View style={styles.headerContent}>
        <View style={styles.leftContainer}>
          {isHomeScreen ? (
            <TouchableOpacity
              style={styles.menuButton}
              onPress={() => navigation.openDrawer()}
            >
              <Feather
                name="menu"
                size={24}
                color={transparent ? "#fff" : "#333"}
              />
            </TouchableOpacity>
          ) : (
            showBackButton && (
              <TouchableOpacity
                style={styles.backButton}
                onPress={() => navigation.goBack()}
              >
                <Feather
                  name="arrow-left"
                  size={24}
                  color={transparent ? "#fff" : "#333"}
                />
              </TouchableOpacity>
            )
          )}
        </View>

        <Animated.View
          style={[
            styles.titleContainer,
            { opacity: transparent ? 1 : titleOpacity },
          ]}
        >
          <Text
            style={[styles.title, transparent && styles.transparentTitle]}
            numberOfLines={1}
          >
            {title}
          </Text>
        </Animated.View>

        <View style={styles.rightContainer}>
          {rightComponent || <View style={styles.placeholder} />}
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  headerContainer: {
    width: "100%",
    position: "absolute",
    top: 0,
    left: 0,
    zIndex: 100,
  },
  transparentHeader: {
    backgroundColor: "transparent",
  },
  headerBackground: {
    ...StyleSheet.absoluteFillObject,
    overflow: "hidden",
    // backgroundColor: "blue",
  },
  blurContainer: {
    ...StyleSheet.absoluteFillObject,
  },
  blur: {
    ...StyleSheet.absoluteFillObject,
  },
  headerGradient: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(255, 255, 255, 0.85)",
  },
  headerContent: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    height: 56,
    paddingHorizontal: 16,
  },
  leftContainer: {
    width: 40,
    alignItems: "flex-start",
  },
  titleContainer: {
    flex: 1,
    alignItems: "center",
  },
  title: {
    fontSize: 18,
    fontFamily: "Inter-SemiBold",
    color: "#333",
  },
  transparentTitle: {
    color: "#fff",
    textShadowColor: "rgba(0, 0, 0, 0.3)",
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 3,
  },
  rightContainer: {
    width: 40,
    alignItems: "flex-end",
  },
  menuButton: {
    padding: 8,
  },
  backButton: {
    padding: 8,
  },
  placeholder: {
    width: 24,
    height: 24,
  },
});
