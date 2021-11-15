import React, { ReactNode, useEffect, useState } from 'react'
import { Provider } from 'react-redux'
import { PersistGate } from 'redux-persist/integration/react'
import AppLoading from 'expo-app-loading'
import store from '../Redux/store'
import persistStore from 'redux-persist/es/persistStore'
// import { AsyncStorage } from 'react-native'

interface Props {
    children: ReactNode
}

const LoadAssets = ({ children }: Props) => {
    const [ready, setReady] = useState(false)

    // let persistor = persistStore(store)

    useEffect(() => {
        //get app data here
        // console.log({ initialState: store.getState() })
        setReady(true)
    }, [])

    if (!ready) {
        return (
            <AppLoading />
        )
    }

    else {
        return (
            <Provider store={store}>
                <PersistGate persistor={persistor} loading={null}>
                    {children}
                </PersistGate>
            </Provider>
        )
    }
}

export default LoadAssets
