import React, { useState } from 'react'
import { View, Text, StyleSheet, Dimensions, SafeAreaView, TextInput } from 'react-native'
import { StackNavigationProp } from '@react-navigation/stack'
import { PageHeader, RoundButton } from '../../Components'
import { useAppDispatch } from '../../Redux/hooks'
import { ADD_PLOT } from '../../Redux/plots'
import { GlobalColors, GlobalStyles, Sizes } from '../../Util/GlobalStyles'
import { AppRoutes } from '../../Util/Routes'

const { width } = Dimensions.get('window')

const image_size = width / 2.5

interface Props {
    navigation: StackNavigationProp<AppRoutes, 'NewCueSheet'>
}

const NewCueSheet = ({ navigation }: Props) => {
    const dispatch = useAppDispatch()

    const [title, setTitle] = useState('')

    const handleFormChange = (text: string) => {
        setTitle(text)
        return
    }

    return (
        <SafeAreaView style={GlobalStyles.container}>
            <PageHeader
                back
                backLabel='Cancel'
                label={'New Plot'}
            />

            <View style={styles.form}>
                <View style={styles.formLine}>
                    <Text style={styles.text_label}>
                        Title:
                    </Text>
                    <TextInput
                        style={styles.inputField}
                        placeholder='Enter Cue Sheet Title'
                        placeholderTextColor={'#ffffff40'}
                        onChange={(e) => handleFormChange(e.nativeEvent.text)}
                    />
                </View>
            </View>
            <RoundButton
                label='Save'
                onPress={async () => {
                    if (!title) return alert('Your cue sheet needs a title')
                    await dispatch(ADD_PLOT({ name: title }))
                    navigation.goBack()
                }}
            />
        </SafeAreaView>
    )
}

export default NewCueSheet

const styles = StyleSheet.create({
    form: {
        width,
        flex: 1,
        padding: Sizes.m,
    },
    formLine: {
        flexDirection: 'row',
        height: 50,
        borderColor: GlobalColors.text_primary,
        borderBottomWidth: StyleSheet.hairlineWidth,
        alignItems: 'center'
    },
    text_label: {
        ...GlobalStyles.text_label,
        marginRight: Sizes.m
    },
    inputField: {
        ...GlobalStyles.text_medium,
        flex: 1
    }
})