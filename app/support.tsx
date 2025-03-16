import { useState, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  FlatList,
  KeyboardAvoidingView,
  Platform,
  Animated,
} from "react-native";
import { Feather } from "@expo/vector-icons";
import CustomHeader from "../components/CustomHeader";

const initialMessages = [
  {
    id: "1",
    text: "Hello! How can I help you today?",
    sender: "support",
    timestamp: new Date(Date.now() - 3600000).toISOString(),
  },
];

export default function SupportScreen() {
  const [messages, setMessages] = useState(initialMessages);
  const [inputText, setInputText] = useState("");
  const flatListRef = useRef(null);
  const scrollY = useRef(new Animated.Value(0)).current;

  const sendMessage = () => {
    if (inputText.trim() === "") return;

    const newUserMessage = {
      id: Date.now().toString(),
      text: inputText,
      sender: "user",
      timestamp: new Date().toISOString(),
    };

    setMessages((prevMessages) => [...prevMessages, newUserMessage]);
    setInputText("");

    // Simulate support response after a short delay
    setTimeout(() => {
      const supportResponses = [
        "I understand your concern. Let me check that for you.",
        "Thanks for reaching out! I'll help you resolve this issue.",
        "I'm looking into this right now. Give me a moment please.",
        "That's a good question. Here's what you need to know...",
        "I'd be happy to assist you with that request.",
      ];

      const randomResponse =
        supportResponses[Math.floor(Math.random() * supportResponses.length)];

      const newSupportMessage = {
        id: (Date.now() + 1).toString(),
        text: randomResponse,
        sender: "support",
        timestamp: new Date().toISOString(),
      };

      setMessages((prevMessages) => [...prevMessages, newSupportMessage]);
    }, 1000);
  };

  const formatTime = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  };

  const renderMessage = ({ item }) => {
    const isSupport = item.sender === "support";

    return (
      <View
        style={[
          styles.messageContainer,
          isSupport ? styles.supportMessage : styles.userMessage,
        ]}
      >
        {isSupport && (
          <View style={styles.supportAvatar}>
            <Feather name="headphones" size={16} color="#fff" />
          </View>
        )}
        <View
          style={[
            styles.messageBubble,
            isSupport ? styles.supportBubble : styles.userBubble,
          ]}
        >
          <Text
            style={[
              styles.messageText,
              isSupport ? styles.supportText : styles.userText,
            ]}
          >
            {item.text}
          </Text>
          <Text style={styles.timestamp}>{formatTime(item.timestamp)}</Text>
        </View>
      </View>
    );
  };

  const AnimatedFlatList = Animated.createAnimatedComponent(FlatList);

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={styles.container}
      keyboardVerticalOffset={90}
    >
      <CustomHeader
        title="Customer Support"
        animatedValue={scrollY}
        rightComponent={
          <TouchableOpacity style={styles.infoButton}>
            <Feather name="info" size={22} color="#3498db" />
          </TouchableOpacity>
        }
      />

      <View style={styles.supportBanner}>
        <View style={styles.supportIconContainer}>
          <Feather name="headphones" size={20} color="#fff" />
        </View>
        <View>
          <Text style={styles.supportTitle}>Customer Support</Text>
          <Text style={styles.supportStatus}>Online • Ready to help</Text>
        </View>
      </View>

      <AnimatedFlatList
        ref={flatListRef}
        data={messages}
        renderItem={renderMessage}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.messagesList}
        onContentSizeChange={() =>
          flatListRef.current.scrollToEnd({ animated: true })
        }
        onLayout={() => flatListRef.current.scrollToEnd({ animated: true })}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { y: scrollY } } }],
          { useNativeDriver: true }
        )}
        scrollEventThrottle={16}
      />

      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Type your message..."
          value={inputText}
          onChangeText={setInputText}
          multiline
        />
        <TouchableOpacity
          style={[
            styles.sendButton,
            inputText.trim() === "" && styles.sendButtonDisabled,
          ]}
          onPress={sendMessage}
          disabled={inputText.trim() === ""}
        >
          <Feather
            name="send"
            size={20}
            color={inputText.trim() === "" ? "#B3D4FF" : "#fff"}
          />
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  supportBanner: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#3498db",
    padding: 15,
    marginTop: 80,
  },
  supportIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#2980b9",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 10,
  },
  supportTitle: {
    color: "#fff",
    fontSize: 16,
    fontFamily: "Inter-Bold",
  },
  supportStatus: {
    color: "#e1f0fa",
    fontSize: 12,
    fontFamily: "Inter-Regular",
  },
  messagesList: {
    padding: 15,
    paddingBottom: 20,
  },
  messageContainer: {
    flexDirection: "row",
    marginBottom: 15,
    maxWidth: "80%",
  },
  supportMessage: {
    alignSelf: "flex-start",
  },
  userMessage: {
    alignSelf: "flex-end",
    justifyContent: "flex-end",
  },
  supportAvatar: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: "#3498db",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 8,
  },
  messageBubble: {
    padding: 12,
    borderRadius: 18,
    maxWidth: "100%",
  },
  supportBubble: {
    backgroundColor: "#e1f0fa",
    borderBottomLeftRadius: 5,
  },
  userBubble: {
    backgroundColor: "#3498db",
    borderBottomRightRadius: 5,
  },
  messageText: {
    fontSize: 15,
    fontFamily: "Inter-Regular",
  },
  supportText: {
    color: "#2c3e50",
  },
  userText: {
    color: "#fff",
  },
  timestamp: {
    fontSize: 11,
    color: "#7f8c8d",
    alignSelf: "flex-end",
    marginTop: 4,
    fontFamily: "Inter-Regular",
  },
  inputContainer: {
    flexDirection: "row",
    padding: 10,
    backgroundColor: "#fff",
    borderTopWidth: 1,
    borderTopColor: "#e1e1e1",
  },
  input: {
    flex: 1,
    backgroundColor: "#f5f5f5",
    borderRadius: 20,
    paddingHorizontal: 15,
    paddingVertical: 10,
    fontSize: 16,
    fontFamily: "Inter-Regular",
    maxHeight: 100,
  },
  sendButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#3498db",
    justifyContent: "center",
    alignItems: "center",
    marginLeft: 10,
  },
  sendButtonDisabled: {
    backgroundColor: "#e1f0fa",
  },
  infoButton: {
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
});
