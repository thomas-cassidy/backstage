import React, { ReactNode, useEffect, useState } from 'react'
// import { PersistGate } from 'redux-persist/integration/react'
import AppLoading from 'expo-app-loading'
// import persistStore from 'redux-persist/es/persistStore'
import { useAppDispatch, useAppSelector } from '../Redux/hooks'
import { getSomething } from '../Redux/test/Test'

interface Props {
    children: ReactNode
}

const LoadAssets = ({ children }: Props) => {
    const [ready, setReady] = useState(false)
    const testState = useAppSelector(state => state.test)
    const dispatch = useAppDispatch()

    // let persistor = persistStore(store)

    useEffect(() => {
        //fetch data
        dispatch(getSomething()).then(() => setReady(true))
    }, [])

    useEffect(() => {
        console.log(testState.status)
    }, [testState])

    if (!ready) {
        return (
            <AppLoading />
        )
    }

    else {
        return (

            <>
                {children}
            </>

        )
    }
}

export default LoadAssets
