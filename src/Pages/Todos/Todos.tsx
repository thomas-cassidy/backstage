import React, { useEffect, useRef, useState } from "react";
import {
  Alert,
  Animated,
  Dimensions,
  KeyboardAvoidingView,
  PanResponder,
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
  TextInputProps,
  View,
  useAnimatedValue,
  ScrollView,
} from "react-native";
import { PageHeader, RadioButton, RoundButton } from "../../Components";
import { useAppDispatch, useAppSelector } from "../../Redux/hooks";
import { ADD_TODO, DELETE_TODO, UPDATE_TODO } from "../../Redux/todos";
import { GlobalColors, GlobalStyles, Sizes } from "../../Util/GlobalStyles";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { faStar } from "@fortawesome/free-solid-svg-icons";
import { ToDo } from "../../Types/AppTypes";

const { width } = Dimensions.get("window");

const Todos = () => {
  const { todos } = useAppSelector((state) => state.todos);
  const dispatch = useAppDispatch();
  const [newTodoName, setNewTodoName] = useState("");

  const [renderList, setRenderList] = useState<ToDo[]>(() =>
    todos.map((t) => t).sort((a, b) => (a.priority === b.priority ? 0 : a.priority ? -1 : 1))
  );

  useEffect(() => {
    setRenderList(
      todos
        .map((t) => t)
        .sort((a, b) => (a.priority === b.priority ? 0 : a.priority ? -1 : 1))
        .sort((a, b) => (a.completed === b.completed ? 0 : a.completed ? 1 : -1))
    );
  }, [todos]);

  const textBoxRef = useRef<TextInput>(null);

  return (
    <SafeAreaView style={GlobalStyles.container}>
      <PageHeader label={"To Dos"} back />
      <ScrollView style={styles.todosContainer}>
        {todos.map(({ name, completed, priority, _id }, index) => {
          return (
            // <View key={index} style={{ height: 60, alignItems: "center" }}>
            <Todo
              key={index}
              setComplete={() =>
                dispatch(UPDATE_TODO({ _id, name, completed: !completed, priority }))
              }
              setPriority={() =>
                dispatch(UPDATE_TODO({ _id, completed, name, priority: !priority }))
              }
              setDeleted={() => {
                dispatch(DELETE_TODO({ _id, completed, name, priority }));
              }}
              {...{ completed, priority }}
              value={todos[index].name}
              onChangeText={(text: string) =>
                setRenderList((prev) => {
                  let temp = [...prev];
                  temp[index].name = text;
                  return temp;
                })
              }
              onEndEditing={({ nativeEvent: { text } }) =>
                dispatch(UPDATE_TODO({ _id, name: text, completed, priority }))
              }
              index={renderList.findIndex((t) => t._id === _id)}
            />
            // </View>
          );
        })}
      </ScrollView>
      <KeyboardAvoidingView enabled behavior="padding">
        <View style={styles.newTodo}>
          <TextInput
            style={styles.newTodoInput}
            value={newTodoName}
            onChangeText={(text) => setNewTodoName(text)}
            onSubmitEditing={() =>
              dispatch(ADD_TODO(newTodoName)).then((e) => {
                setNewTodoName("");
              })
            }
            ref={textBoxRef}
          />
          <RoundButton
            style={{ marginBottom: 0 }}
            label={"New To Do"}
            onPress={() =>
              dispatch(ADD_TODO(newTodoName)).then((e) => {
                textBoxRef.current?.blur();
                setNewTodoName("");
              })
            }
          />
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};
export default Todos;

const styles = StyleSheet.create({
  todosContainer: {
    width,
    flex: 1,
    borderRadius: Sizes.s,
  },
  newTodo: {
    bottom: Sizes.xs,
    flexDirection: "row",
    width: width - Sizes.l,
    backgroundColor: GlobalColors.text_primary,
    borderRadius: Sizes.xl,
  },
  newTodoInput: {
    ...GlobalStyles.text_medium,
    flex: 1,
    color: GlobalColors.background,
    paddingHorizontal: Sizes.m,
  },
});

interface TodoProps extends TextInputProps {
  completed: boolean;
  priority: boolean;
  setComplete: () => void;
  setDeleted: () => void;
  setPriority: () => void;
  index: number;
}

const Todo = ({
  priority,
  completed,
  value,
  onChangeText,
  onEndEditing,
  onBlur,
  setComplete,
  setDeleted,
  setPriority,
  index,
}: TodoProps) => {
  // const [editing, setEditing] = useState(false);
  const { extraStyles } = StyleSheet.create({
    extraStyles: {
      opacity: completed ? 0.5 : 1,
      textDecorationLine: completed ? "line-through" : "none",
      textDecorationStyle: "solid",
    },
  });
  const positionX = useAnimatedValue(0);
  const positionY = useAnimatedValue(index * 60);

  useEffect(() => {
    Animated.timing(positionY, { toValue: index * 60, useNativeDriver: true }).start();
  }, [index]);

  const resetPosition = (callback?: () => void) => {
    Animated.timing(positionX, { toValue: 0, useNativeDriver: true }).start(callback);
  };

  const panResponder = PanResponder.create({
    onMoveShouldSetPanResponder: (_, { dx }) => Math.abs(dx) > 10 || Math.abs(dx) < -10,
    onPanResponderMove: (e, { dx, dy }) => {
      if (dy > 5 || dy < -10)
        return Animated.timing(positionX, { toValue: 0, useNativeDriver: true }).start();
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
      if (dx > width / 3)
        return Animated.timing(positionX, {
          toValue: width / 3,
          useNativeDriver: true,
          duration: 100,
        }).start(() => resetPosition(setPriority));

      if (dx < -width / 3) {
        Animated.timing(positionX, {
          toValue: -width / 3,
          useNativeDriver: true,
          duration: 100,
        }).start();
        return Alert.alert("Are you sure?", undefined, [
          { text: "Cancel", onPress: () => resetPosition() },
          {
            text: "Delete",
            style: "destructive",
            onPress: () => resetPosition(setDeleted),
          },
        ]);
      }
      resetPosition();
    },
  });

  const textInputRef = useRef<TextInput>(null);

  const AnimatedTextInput = Animated.createAnimatedComponent(TextInput);

  return (
    <Animated.View
      style={{
        position: "absolute",
        transform: [{ translateY: positionY }],
        width,
        height: 60,
        flexDirection: "row",
        alignItems: "center",
      }}
    >
      <Text
        style={[
          GlobalStyles.text_medium,
          {
            height: 60,
            width: width / 2,
            backgroundColor: GlobalColors.secondary,
            alignSelf: "flex-end",
            paddingLeft: Sizes.m,
            textAlignVertical: "center",
            lineHeight: 60,
          },
        ]}
      >
        Priority
      </Text>
      <Text
        style={[
          GlobalStyles.text_medium,
          {
            height: 60,
            width: width / 2,
            backgroundColor: "red",
            alignSelf: "flex-end",
            paddingRight: Sizes.m,
            textAlign: "right",
            textAlignVertical: "center",
            lineHeight: 60,
          },
        ]}
      >
        Delete
      </Text>
      <Animated.View
        {...panResponder.panHandlers}
        style={{
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
        }}
      >
        <View style={{ flexDirection: "row" }}>
          {priority && (
            <FontAwesomeIcon
              icon={faStar}
              size={Sizes.m}
              color="gold"
              style={{ marginRight: Sizes.s }}
            />
          )}

          <AnimatedTextInput
            onPressIn={() => console.log("plop")}
            {...panResponder.panHandlers}
            ref={textInputRef}
            pointerEvents={"none"}
            {...{ onChangeText, onBlur, value, onEndEditing }}
            style={{ ...GlobalStyles.text_medium, paddingLeft: 0, ...extraStyles }}
            blurOnSubmit
          />
        </View>

        <RadioButton selected={completed} light onPress={setComplete} />
      </Animated.View>
    </Animated.View>
  );
};
