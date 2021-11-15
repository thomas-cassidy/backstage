import { RouteProp } from '@react-navigation/core'
import { StackNavigationProp } from '@react-navigation/stack'
import React, { useRef, useState, useEffect } from 'react'
import { Dimensions, SafeAreaView, StyleSheet } from 'react-native'
import { ScrollView } from 'react-native-gesture-handler'
import { PageHeader } from '../../Components'
import { useAppDispatch, useAppSelector } from '../../Redux/hooks'
import { ADD_CUE, DELETE_CUE, EDIT_CUE } from '../../Redux/plots'
import { CueType, Plot } from '../../Types/AppTypes'
import { GlobalColors, GlobalStyles } from '../../Util/GlobalStyles'
import { AppRoutes } from '../../Util/Routes'
import Cue from './Cue'

const { width } = Dimensions.get('window')

interface Props {
    route: RouteProp<AppRoutes, 'PlotPage'>,
    navigation: StackNavigationProp<AppRoutes, 'PlotPage'>
}

const PlotPageContainer = ({ route, navigation }: Props) => {
    const [editing, setEditing] = useState(false)
    const scrollRef = useRef<ScrollView>(null)
    const { id } = route.params
    const [cast, plots] = useAppSelector(({ cast, plots }) => [cast.cast, plots.plots])

    const plot = plots.find(p => p.id === id)

    if (!plot) {
        return <p>OH NO IT'S FUCKED</p>
    }
    return <PlotPage route={route} navigation={navigation} plot={plot} />


}

type PlotPageProps = Props & {
    plot: Plot
}

/*
type RemoteData<E, A> = { type: "Loading" } | { type: "Error", error: E } | { type: "Ready", data: A }

switch (remoteData.type) {
    case 'Loading':
            return null
    case 'Error':
        return "OH NO"
    case "Ready":
        return <Component data={remoteData.data}/>
}
*/

const PlotPage = ({ route, navigation, plot }: PlotPageProps) => {
    const [editing, setEditing] = useState(false)
    const scrollRef = useRef<ScrollView>(null)
    const { id } = route.params
    const [cast, plots] = useAppSelector(({ cast, plots }) => [cast.cast, plots.plots])
    const dispatch = useAppDispatch()

    const [_, setPlot] = useState(() => plots.find(p => p.id === id))

    useEffect(() => {
        setPlot(() => {
            for (let p of plots) {
                if (p.id === id) return p
            }
        })
    }, [plots])

    const handleChange = (index: number, field: keyof CueType, value: string) => {
        dispatch(EDIT_CUE({ ...{ id, index, field, value } }))
    }

    const handleAddCue = async (index: number) => {
        await dispatch(ADD_CUE({ id, index }))
        handleScroll(index)
    }
    const handleDelCue = async (index: number) => {
        dispatch(DELETE_CUE({ id, index }))
    }

    const handleScroll = (index: number) => {
        scrollRef.current?.scrollTo({ x: (index + 1) * width })
    }

    const editColors: typeof GlobalColors = {
        background: '#fff',
        text_primary: GlobalColors.background,
        secondary: '#ffb600',
        tertiary: 'df160d'
    }

    const styles = StyleSheet.create({
        container: {
            ...GlobalStyles.container,
            backgroundColor: editing ? editColors.background : GlobalColors.background
        }
    })

    return (
        <SafeAreaView
            style={styles.container}
        >
            <PageHeader label={plot?.name}
                edit
                onEdit={() => setEditing(prev => !prev)}
                back
                backLabel='Exit'
                light={!editing}
            />
            <ScrollView
                ref={scrollRef}
                style={{ flex: 1, width }}
                horizontal
                snapToInterval={width}
                decelerationRate={'fast'}
            >
                {
                    plot.cues.map(({ cuePoint, notes, location, castMembers }, index) => {
                        let next
                        if (index !== plot.cues.length - 1) next = plot.cues[index + 1].cuePoint

                        return (
                            <Cue
                                editing={editing}
                                key={index}
                                {...{ index, cuePoint, location, notes, castMembers, next, handleChange }}
                                onNext={() => scrollRef.current?.scrollTo({ x: index * width })}
                                handleAddCue={() => handleAddCue(index)}
                                handleDelCue={() => handleDelCue(index)}
                                handleScroll={() => handleScroll(index)}
                                cueCount={plot.cues.length}
                            />
                        )
                    })

                }

            </ScrollView>
        </SafeAreaView>
    )
}

export default PlotPageContainer
