import { StyleSheet } from "react-native";

// export const GlobalColors = {
//   background: "#020f56",
//   text_primary: "#fff",
//   secondary: "#ffb600",
//   tertiary: "#df160d",
// };
export const GlobalColors = {
  background: "hsl(220, 13%, 18%)",
  background_light: "hsl(225, 12.70%, 24.70%)",
  text_primary: "#fff",
  secondary: "#af9650",
  tertiary: "#d46161",
};
// export const GlobalColors = {
//   background: "hsl(220, 13%, 18%)",
//   text_primary: "#fff",
//   secondary: "#af9650",
//   tertiary: "#ff3610",
// };

export const EditColors: typeof GlobalColors = {
  background: GlobalColors.text_primary,
  text_primary: GlobalColors.background,
  background_light: "hsl(223, 13.00%, 21.20%)",
  secondary: "#ffb600",
  tertiary: "#df160d",
};

export const font_main = "Futura";

export const Sizes = {
  xs: 8,
  s: 12,
  m: 24,
  l: 32,
  xl: 40,
};

export const FORM_LINE_HEIGHT = 50;

export const GlobalStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: GlobalColors.background,
    alignItems: "center",
    justifyContent: "center",
  },
  text_label: {
    fontFamily: font_main,
    fontSize: 16,
    color: GlobalColors.text_primary,
    opacity: 0.7,
  },
  text_small: {
    fontFamily: font_main,
    fontSize: 14,
    color: GlobalColors.text_primary,
  },
  text_medium: {
    fontFamily: font_main,
    fontSize: 18,
    color: GlobalColors.text_primary,
  },
  text_large: {
    fontFamily: font_main,
    fontSize: 30,
    color: GlobalColors.text_primary,
  },
  page_header: {
    fontFamily: font_main,
    fontSize: 36,
    color: GlobalColors.text_primary,
  },
});
