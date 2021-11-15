import React from 'react'
import { Dimensions, SafeAreaView, StyleSheet, Text, TextInput } from 'react-native'
import { ScrollView } from 'react-native-gesture-handler'
import { BarLink, PageHeader, RadioButton, RoundButton } from '../../Components'
import { useAppDispatch, useAppSelector } from '../../Redux/hooks'
import { ADD_TODO, EDIT_TODO, SET_COMPLETE } from '../../Redux/todos'
import { GlobalStyles, Sizes } from '../../Util/GlobalStyles'

const { width } = Dimensions.get('window')

interface Props {

}

const Todos = (props: Props) => {
    const { todos } = useAppSelector(state => state.todos)
    const dispatch = useAppDispatch()



    return (
        <SafeAreaView style={GlobalStyles.container}>
            <PageHeader label={'To Dos'} back />
            <ScrollView style={styles.todosContainer} >
                {todos.map(({ name, complete, id }, i) => {
                    const opacity = complete ? 0.5 : 1
                    return (
                        <BarLink
                            // label={name}
                            key={i}
                            style={{ width: '100%' }}
                            onPress={() => dispatch(SET_COMPLETE({ id }))}
                        >
                            <TextInput
                                value={name}
                                style={{ ...GlobalStyles.text_medium, opacity }}
                                onChange={({ nativeEvent: { text } }) => dispatch(EDIT_TODO({ id, value: text }))}
                            />
                            <RadioButton selected={complete} light />
                        </BarLink>
                    )
                })}
            </ScrollView>
            <RoundButton label={'New To Do'} onPress={() => dispatch(ADD_TODO())} />
        </SafeAreaView>
    )
}

export default Todos

const styles = StyleSheet.create({
    todosContainer: {
        width,
        flex: 1,
        borderRadius: Sizes.s
    }
})