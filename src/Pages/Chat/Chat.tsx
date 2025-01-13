import {
  View,
  SafeAreaView,
  KeyboardAvoidingView,
  Dimensions,
  StyleSheet,
  TextInput,
  ScrollView,
  Platform,
  Keyboard,
} from "react-native";
import React, { useEffect, useRef, useState } from "react";
import { StackNavigationProp } from "@react-navigation/stack";
import { AppRoutes } from "../../Util/Routes";
import { GlobalColors, GlobalStyles, Sizes } from "../../Util/GlobalStyles";
import { PageHeader, RoundButton } from "../../Components";
// import DismissKeyboard from "../../Components/DismissKeyboard";
import { useAppSelector } from "../../Redux/hooks";
import { Text } from "react-native";
import { getAuth, getChat, getShow, getUser, getWs } from "../../Redux/Helpers";
import { Message } from "../../Types/AppTypes";

const { width } = Dimensions.get("screen");

const { container } = GlobalStyles;

type Props = {
  navigation: StackNavigationProp<AppRoutes, "Chat">;
};

const Chat = ({ navigation }: Props) => {
  const chat = useAppSelector(getChat);
  const show = useAppSelector(getShow);
  const auth = useAppSelector(getAuth);
  const ws = useAppSelector(getWs);
  const [message, setMessage] = useState("");

  const scrollRef = useRef<ScrollView>(null);

  useEffect(() => {
    scrollRef.current?.scrollToEnd({ animated: false });
  }, [chat]);

  useEffect(() => {
    const keyboardDidShowListener = Keyboard.addListener("keyboardDidShow", () => {
      scrollRef.current?.scrollToEnd({ animated: true });
    });

    return () => {
      keyboardDidShowListener.remove();
    };
  }, []);

  const handleTextInput = (t: string) => {
    setMessage(t);
  };

  const handleSend = () => {
    if (!message) return;
    ws?.send(
      JSON.stringify({
        showId: show._id,
        token: auth.ACCESS_TOKEN,
        message,
      })
    );
    setMessage("");
  };

  return (
    <SafeAreaView style={container}>
      <PageHeader label="Chat" back />
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{ flex: 1 }}
        keyboardVerticalOffset={Platform.OS === "ios" ? 0 : 0}
      >
        <ScrollView
          showsVerticalScrollIndicator={false}
          style={{
            flex: 1,
            marginBottom: 10,
            borderTopColor: "white",
            borderTopWidth: StyleSheet.hairlineWidth,
          }}
          ref={scrollRef}
          onContentSizeChange={() => scrollRef.current?.scrollToEnd({ animated: false })}
        >
          {chat.map((message, i) => (
            <ChatMessage key={i} {...{ message }} />
          ))}
        </ScrollView>
        <View style={styles.messageInputWrapper}>
          <TextInput
            style={styles.messageInput}
            value={message}
            onChangeText={handleTextInput}
            onSubmitEditing={handleSend}
          />
          <RoundButton style={{ marginBottom: 0 }} label="Send" onPress={handleSend} />
        </View>
      </KeyboardAvoidingView>
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
  },
  messageInput: {
    ...GlobalStyles.text_medium,
    flex: 1,
    color: GlobalColors.background,
    paddingHorizontal: Sizes.m,
  },
});

interface MessageProps {
  message: Message;
}

const ChatMessage = ({ message }: MessageProps) => {
  const user = useAppSelector(getUser);

  const styles = StyleSheet.create({
    container: {
      backgroundColor: message.user === user?.name ? GlobalColors.tertiary : GlobalColors.secondary,
      borderRadius: Sizes.s,
      paddingHorizontal: Sizes.s,
      paddingVertical: Sizes.xs,
      minWidth: 100,
      maxWidth: width - Sizes.l * 2,
      alignSelf: message.user === user?.name ? "flex-end" : "flex-start",
      marginBottom: Sizes.s,
    },
    username: {
      ...GlobalStyles.text_small,
      color: GlobalColors.text_primary,
      opacity: 0.5,
    },
    message: {
      ...GlobalStyles.text_medium,
      color: GlobalColors.background,
    },
    time: {
      ...GlobalStyles.text_small,
      color: GlobalColors.text_primary,
      opacity: 0.5,
    },
  });

  return (
    <View style={styles.container}>
      <Text style={styles.username}>{message.user}</Text>
      <Text style={styles.message}>{message.message}</Text>
      <Text style={styles.time}>{message.dateCreated}</Text>
    </View>
  );
};
