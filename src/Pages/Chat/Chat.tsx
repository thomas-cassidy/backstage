import {
  View,
  SafeAreaView,
  KeyboardAvoidingView,
  Dimensions,
  StyleSheet,
  TextInput,
  ScrollView,
} from "react-native";
import React, { useState } from "react";
import { StackNavigationProp } from "@react-navigation/stack";
import { AppRoutes } from "../../Util/Routes";
import { GlobalColors, GlobalStyles, Sizes } from "../../Util/GlobalStyles";
import { PageHeader, RoundButton } from "../../Components";
// import DismissKeyboard from "../../Components/DismissKeyboard";
import { useAppDispatch } from "../../Redux/hooks";
import { Text } from "react-native";

const { width } = Dimensions.get("screen");

const { container } = GlobalStyles;

const chatExampleText: Message[] = [
  { from: "me", text: "Hello" },
  { from: "them", text: "Hi" },
  { from: "me", text: "How are you?" },
  { from: "them", text: "Good, you?" },
  { from: "me", text: "I'm good" },
  { from: "them", text: "That's good" },
  { from: "me", text: "Yes" },
  { from: "them", text: "..." },
  { from: "me", text: "..." },
];
type Props = {
  navigation: StackNavigationProp<AppRoutes, "Chat">;
};

const Chat = ({ navigation }: Props) => {
  const dispatch = useAppDispatch();
  const [message, setMessage] = useState("");

  const handleTextInput = (t: string) => {
    setMessage(t);
  };

  return (
    <SafeAreaView style={container}>
      <PageHeader label="Chat" back />
      {/* <DismissKeyboard> */}
      <KeyboardAvoidingView behavior="position" style={{ flex: 1 }}>
        <View style={{ flex: 1 }}>
          <ScrollView contentContainerStyle={{ flex: 1 }}>
            {chatExampleText.map((message, i) => (
              <ChatMessage key={i} {...{ message }} />
            ))}
          </ScrollView>
        </View>
        <View style={styles.messageInputWrapper}>
          <TextInput style={styles.messageInput} value={message} onChangeText={handleTextInput} />
          <RoundButton
            style={{ marginBottom: 0 }}
            label="Send"
            onPress={() => {
              setMessage("");
            }}
          />
        </View>
      </KeyboardAvoidingView>
      {/* </DismissKeyboard> */}
    </SafeAreaView>
  );
};

export default Chat;

const styles = StyleSheet.create({
  messageInputWrapper: {
    width: width - Sizes.l,
    borderRadius: 25,
    backgroundColor: GlobalColors.text_primary,
    flexDirection: "row",
    // paddingHorizontal: Sizes.m,
  },
  messageContainer: {
    flex: 1,
    // width: width - Sizes.l,
    backgroundColor: "blue",
  },
  messageInput: {
    ...GlobalStyles.text_medium,
    flex: 1,
    color: GlobalColors.background,
    paddingHorizontal: Sizes.m,
  },
});

interface Message {
  from: string;
  text: string;
}

interface MessageProps {
  message: Message;
}

const ChatMessage = ({ message }: MessageProps) => {
  const styles = StyleSheet.create({
    container: {
      backgroundColor: message.from === "me" ? GlobalColors.tertiary : GlobalColors.secondary,
      borderRadius: 25,
      padding: Sizes.s,
      minWidth: 100,
      maxWidth: width - Sizes.l,
      alignSelf: message.from === "me" ? "flex-end" : "flex-start",
    },
    text: {
      ...GlobalStyles.text_medium,
      color: GlobalColors.background,
    },
  });
  return (
    <View style={styles.container}>
      <Text style={styles.text}>{message.text}</Text>
    </View>
  );
};
