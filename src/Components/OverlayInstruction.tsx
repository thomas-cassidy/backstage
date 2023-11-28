import { StyleSheet, Text, useAnimatedValue, Animated } from "react-native";
import React, { PropsWithChildren, useEffect, useState } from "react";
import { GlobalStyles } from "../Util/GlobalStyles";

const Overlay = ({ children, message="Do the thing to get the thing. Cool?" , callback}: PropsWithChildren<{message?: string, callback?: ()=>void}>) => {
    const [show, setShow] = useState(true)
    const anim = useAnimatedValue(1)

    useEffect(()=>{
        setTimeout(()=>{
            Animated.timing(anim, {toValue: 0, useNativeDriver: true}).start(()=>{
                setShow(false)
                if (callback) callback()
            })
        }, 1000)
    }, [])

    if (show) {
        return (
          <Animated.View
            style={{...StyleSheet.absoluteFillObject, backgroundColor: "#1B1F27b0", opacity: anim, justifyContent: "center", alignItems: "center",}}
          >
            <Text style={GlobalStyles.text_large}>
                  {message}
            </Text>
            {children}
          </Animated.View>
        );
    }
    return <></>
};

export default Overlay;
