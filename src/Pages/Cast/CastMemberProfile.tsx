import React, { useState, useEffect } from 'react'
import { View, Text, SafeAreaView, Image, Dimensions, StyleSheet, Alert } from 'react-native'
import { RouteProp } from '@react-navigation/core'
import { StackNavigationProp } from '@react-navigation/stack'
import { TextInput } from 'react-native-gesture-handler'
import { GlobalColors, GlobalStyles, Sizes } from '../../Util/GlobalStyles'
import { AppRoutes } from '../../Util/Routes'
import { PageHeader, RoundButton } from '../../Components'
import { CastMember } from '../../Types/AppTypes'
import { useAppDispatch, useAppSelector } from '../../Redux/hooks'
import { ADD_CASTMEMBER, EDIT_CASTMEMBER, REMOVE_CASTMEMBER } from '../../Redux/cast'
import { RootState } from '../../Redux/store'

const { width } = Dimensions.get('window')

const image_size = width / 2.5

interface Props {
    route: RouteProp<AppRoutes, 'CastProfile'>
    navigation: StackNavigationProp<AppRoutes, 'CastProfile'>
}

interface Form {
    name: string,
    role: string,
    group: string | undefined,
    notes: string,
    image: string | undefined,
}

const makeStyles = (color: string, background: string) =>
    StyleSheet.create({
        container: {
            ...GlobalStyles.container,
            backgroundColor: background
        },
        image: {
            height: image_size,
            width: image_size,
            borderRadius: Sizes.s,
            borderColor: color,
            borderWidth: StyleSheet.hairlineWidth,
            backgroundColor: 'grey',
        },
        form: {
            width,
            flex: 1,
            padding: Sizes.m,
        },
        formLine: {
            flexDirection: 'row',
            height: 50,
            borderColor: color,
            borderBottomWidth: StyleSheet.hairlineWidth,
            alignItems: 'center'
        },
        notesSection: {
            borderColor: color,
            paddingTop: Sizes.s,
            flex: 1
        },
        text_label: {
            ...GlobalStyles.text_label,
            color,
            marginRight: Sizes.m
        },
        inputField: {
            ...GlobalStyles.text_medium,
            color,
            flex: 1
        }
    })

const getCast = (state: RootState) => state.cast.cast

const CastMemberProfile = ({ route, navigation }: Props) => {
    const { id } = route.params
    const cast = useAppSelector(getCast)
    const dispatch = useAppDispatch()

    const [castMember, setCastMember] = useState<CastMember>(() => {
        for (let c of cast) {
            if (c.id === id) {
                return { ...c }
            }
        }
        return {
            name: '',
            role: '',
            group: '',
            notes: '',
            image: '',
            id: cast[cast.length - 1].id + 1
        }
    })

    const [newCastMember, setNewCastMember] = useState(id === -1)
    const [editing, setEditing] = useState(id === -1)

    const handleFormChange = (field: keyof Form, value: string) => {
        setCastMember(prev => {
            let newState = { ...prev }
            newState[field] = value
            return newState
        })
        if (newCastMember) {
            return
        }
        else return dispatch(EDIT_CASTMEMBER({ ...castMember, [field]: value }))
    }

    const color = editing ? GlobalColors.background : GlobalColors.text_primary
    const background = editing ? GlobalColors.text_primary : GlobalColors.background
    const styles = makeStyles(color, background)

    return (
        <SafeAreaView style={styles.container}>
            <PageHeader
                label={editing ? 'Edit Mode' : castMember.name}
                light={!editing}
                edit
                onEdit={() => setEditing(prev => !prev)} />
            <Image source={{ uri: castMember.image ? castMember.image : 'https://images-na.ssl-images-amazon.com/images/I/51+E4VHsZ6L.jpg' }}
                height={120}
                width={120}
                style={styles.image} />

            <View style={styles.form}>
                <View style={styles.formLine}>
                    <Text style={styles.text_label}>
                        Role:
                    </Text>
                    <TextInput
                        editable={editing}
                        style={styles.inputField}
                        onChange={(e) => handleFormChange('role', e.nativeEvent.text)}
                    >
                        {castMember.role}
                    </TextInput>
                </View>
                <View style={styles.formLine}>
                    <Text style={styles.text_label}>
                        Name:
                    </Text>
                    <TextInput
                        editable={editing}
                        style={styles.inputField}
                        onChange={(e) => handleFormChange('name', e.nativeEvent.text)}
                    >
                        {castMember.name}
                    </TextInput>
                </View>
                <View style={styles.formLine}>
                    <Text style={styles.text_label}>
                        Group:
                    </Text>
                    <TextInput
                        editable={editing}
                        style={styles.inputField}
                        onChange={(e) => handleFormChange('group', e.nativeEvent.text)}
                    >
                        {castMember.group}
                    </TextInput>
                </View>
                <View style={styles.notesSection}>
                    <Text style={styles.text_label}>
                        Notes:
                    </Text>
                    <TextInput
                        editable={editing}
                        multiline
                        style={{ ...GlobalStyles.text_medium, color, flex: 1 }}
                        onChange={(e) => handleFormChange('notes', e.nativeEvent.text)}
                    >
                        {castMember.notes}
                    </TextInput>
                </View>
            </View>
            {editing && newCastMember &&
                <RoundButton
                    label='Save'
                    onPress={async () => {
                        await dispatch(ADD_CASTMEMBER(castMember))
                        navigation.goBack()
                    }}
                />
            }
            {editing &&
                <RoundButton
                    label='Delete Cast Member'
                    altColor
                    onPress={async () => {
                        await dispatch(REMOVE_CASTMEMBER(castMember))
                        navigation.goBack()
                    }}
                />
            }
        </SafeAreaView>
    )
}



export default CastMemberProfile
