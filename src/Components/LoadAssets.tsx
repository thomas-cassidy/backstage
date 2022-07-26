import React, { ReactNode, useEffect, useState } from "react";
import AppLoading from "expo-app-loading";
import { useAppDispatch } from "../Redux/hooks";
import { CLEAR_LOADING } from "../Redux/auth";

interface Props {
    children: ReactNode;
}

const LoadAssets = ({ children }: Props) => {
    const [ready, setReady] = useState(false);
    const dispatch = useAppDispatch();

    useEffect(() => {
        dispatch(CLEAR_LOADING());
        return setReady(true);
    }, []);

    if (!ready) {
        return <AppLoading />;
    } else {
        return <>{children}</>;
    }
};

export default LoadAssets;
