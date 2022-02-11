import { StyleSheet } from "react-native";

export const GlobalColors = {
    background: "#020f56",
    text_primary: "#fff",
    secondary: "#ffb600",
    tertiary: "#df160d",
};

export const EditColors: typeof GlobalColors = {
    background: GlobalColors.text_primary,
    text_primary: GlobalColors.background,
    secondary: "#ffb600",
    tertiary: "df160d",
};

export const font_main = "Helvetica Neue";

export const Sizes = {
    xs: 8,
    s: 14,
    m: 24,
    l: 32,
    xl: 40,
};

export const GlobalStyles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: GlobalColors.background,
        alignItems: "center",
        justifyContent: "center",
    },
    text_label: {
        fontFamily: font_main,
        fontSize: 18,
        color: GlobalColors.text_primary,
        opacity: 0.7,
    },
    text_small: {
        fontFamily: font_main,
        fontSize: 18,
        color: GlobalColors.text_primary,
    },
    text_medium: {
        fontFamily: font_main,
        fontSize: 24,
        color: GlobalColors.text_primary,
    },
    text_large: {
        fontFamily: font_main,
        fontSize: 32,
        color: GlobalColors.text_primary,
    },
    page_header: {
        fontFamily: font_main,
        fontSize: 38,
        color: GlobalColors.text_primary,
    },
});
