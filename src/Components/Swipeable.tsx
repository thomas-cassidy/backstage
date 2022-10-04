import { Text, StyleSheet, TouchableOpacity, Animated } from "react-native";
import React, { PropsWithChildren } from "react";
import {
    FORM_LINE_HEIGHT,
    GlobalColors,
    GlobalStyles,
    Sizes,
} from "../Util/GlobalStyles";
import { Swipeable } from "react-native-gesture-handler";

type DelProps = { shrink: () => void };

const RenderRight = ({ shrink }: DelProps) => {
    return (
        <TouchableOpacity style={styles.underlay} onPress={shrink}>
            <Text style={GlobalStyles.text_medium}>delete</Text>
        </TouchableOpacity>
    );
};

type SwipeProps = {
    onDelete: () => void;
};

const Swipey = ({ onDelete, children }: PropsWithChildren<SwipeProps>) => {
    const HEIGHT = new Animated.Value(FORM_LINE_HEIGHT);

    const shrink = () => {
        Animated.timing(HEIGHT, {
            toValue: 0,
            useNativeDriver: false,
            duration: 300,
        }).start(onDelete);
    };

    return (
        <Animated.View style={{ ...styles.container, height: HEIGHT }}>
            <Swipeable
                useNativeAnimations
                // activeOffsetX={100}
                // friction={5}
                renderRightActions={() => <RenderRight {...{ shrink }} />}
                containerStyle={styles.overlay}
            >
                {children}
            </Swipeable>
        </Animated.View>
    );
};

const styles = StyleSheet.create({
    container: {
        height: FORM_LINE_HEIGHT,
        backgroundColor: "red",
        overflow: "hidden",
    },
    underlay: {
        flexDirection: "row",
        backgroundColor: "red",
        alignItems: "center",
        paddingHorizontal: Sizes.m,
    },
    overlay: {
        flexDirection: "row",
        height: 50,
        backgroundColor: GlobalColors.background,
        borderBottomWidth: StyleSheet.hairlineWidth,
        borderColor: "#fff",
        alignItems: "center",
    },
});

export default Swipey;
