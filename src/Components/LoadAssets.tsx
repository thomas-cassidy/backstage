import React, { ReactNode, useEffect, useState } from "react";
// import { PersistGate } from 'redux-persist/integration/react'
import AppLoading from "expo-app-loading";
import AsyncStorage from "@react-native-async-storage/async-storage";
// import persistStore from 'redux-persist/es/persistStore'
// import { useAppDispatch, useAppSelector } from "../Redux/hooks";

interface Props {
    children: ReactNode;
}

const LoadAssets = ({ children }: Props) => {
    const [ready, setReady] = useState(false);
    // const { auth } = useAppSelector((state) => state);
    // const dispatch = useAppDispatch();

    // let persistor = persistStore(store)
    const retrieveData = async () => {
        try {
            let data = await AsyncStorage.getItem("THEATRE_APP_STATE");
            data && console.log(JSON.parse(data));
        } catch {
            console.error();
        }
    };

    useEffect(() => {
        retrieveData();
        return setReady(true);
    }, []);

    if (!ready) {
        return <AppLoading />;
    } else {
        return <>{children}</>;
    }
};

export default LoadAssets;
