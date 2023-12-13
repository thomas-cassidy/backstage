import { useRef } from "react";
import {
  useAnimatedValue,
  Animated,
  PanResponder,
  Alert,
  TextInput,
  View,
  StyleSheet,
  Dimensions,
  Text,
} from "react-native";
import { GlobalStyles, GlobalColors, Sizes } from "../Util/GlobalStyles";

const { width } = Dimensions.get("window");

interface Props {
  canSwipeFromLeft?: boolean;
  onDeleteMessage?: { title: string; message?: string };
  canDelete?: boolean;
  onDelete?: () => void;
  functionLeft?: () => void;
  renderLeft?: React.ReactNode;
  onSwipeFromLeft?: () => void;
  children?: React.ReactNode;
}

const Swipeable = ({
  canDelete = false,
  onDelete = () => null,
  onDeleteMessage,
  canSwipeFromLeft = false,
  renderLeft,
  onSwipeFromLeft,
  children,
}: Props) => {
  const positionX = useAnimatedValue(0);

  const resetPosition = (callback?: () => void) => {
    Animated.timing(positionX, { toValue: 0, useNativeDriver: true }).start(callback);
  };

  const panResponder = PanResponder.create({
    onMoveShouldSetPanResponder: (_, { dx }) => Math.abs(dx) > 10 || Math.abs(dx) < -10,
    onPanResponderMove: (e, { dx, dy }) => {
      if (dy > 5 || dy < -10)
        return Animated.timing(positionX, { toValue: 0, useNativeDriver: true }).start();
      if (dx > 0 && !canSwipeFromLeft) return;
      if (dx < 0 && !canDelete) return;
      if (dx > width / 3) {
        return positionX.setValue(width / 3);
      } else if (dx <= -width / 3) {
        return positionX.setValue(-width / 3);
      } else {
        positionX.setValue(dx);
      }
    },
    onPanResponderRelease: (_, { dx, dy }) => {
      if (dx < 5 && dy < 5) {
        textInputRef.current?.focus();
      }
      if (dx > 0 && !canSwipeFromLeft) return;
      if (dx < 0 && !canDelete) return;
      if (dx > width / 3)
        return Animated.timing(positionX, {
          toValue: width / 3,
          useNativeDriver: true,
          duration: 100,
        }).start(() => resetPosition(onSwipeFromLeft));

      if (dx < -width / 3) {
        Animated.timing(positionX, {
          toValue: -width / 3,
          useNativeDriver: true,
          duration: 100,
        }).start();
        return Alert.alert(onDeleteMessage?.title || "Are you sure?", onDeleteMessage?.message, [
          { text: "Cancel", onPress: () => resetPosition() },
          {
            text: "Delete",
            style: "destructive",
            onPress: () => resetPosition(onDelete),
          },
        ]);
      }
      resetPosition();
    },
  });

  const textInputRef = useRef<TextInput>(null);

  const styles = StyleSheet.create({
    delete: {
      ...GlobalStyles.text_medium,

      height: 60,
      width: width / 2,
      backgroundColor: "red",
      alignSelf: "flex-end",
      paddingRight: Sizes.m,
      textAlign: "right",
      textAlignVertical: "center",
      lineHeight: 60,
    },
    overlay: {
      position: "absolute",
      transform: [
        {
          translateY: 0,
        },
        { translateX: positionX },
      ],
      backgroundColor: GlobalColors.background,
      flexDirection: "row",
      width,
      height: 60,
      alignItems: "center",
      justifyContent: "space-between",
      paddingHorizontal: Sizes.m,
      paddingVertical: Sizes.s,
      borderBottomWidth: StyleSheet.hairlineWidth,
      borderBottomColor: GlobalColors.text_primary,
    },
  });

  return (
    <Animated.View
      style={{
        width,
        height: 60,
        flexDirection: "row",
        alignItems: "center",
      }}
    >
      <View style={{ width: width / 2 }}>{renderLeft}</View>

      <Text style={styles.delete}>Delete</Text>
      <Animated.View {...panResponder.panHandlers} style={styles.overlay}>
        {children}
      </Animated.View>
    </Animated.View>
  );
};

export default Swipeable;
