import { useNavigation } from '@react-navigation/core'
import { StackNavigationProp } from '@react-navigation/stack'
import React from 'react'
import { View, Text, StyleSheet, Dimensions, Image, Pressable } from 'react-native'
import { CastMember } from '../../Types/AppTypes'
import { GlobalColors, GlobalStyles, Sizes } from '../../Util/GlobalStyles'
import { AppRoutes } from '../../Util/Routes'

const { width, height } = Dimensions.get('window')

interface Props {
    castMember: CastMember
}

const image_size = 110

const
    CastMemberSmall = ({ castMember }: Props) => {
        const navigation = useNavigation<StackNavigationProp<AppRoutes, 'Cast'>>()

        return (
            <Pressable
                style={styles.container}
                onPress={() => navigation.navigate('CastProfile', { id: castMember.id })}
            >
                <View style={{ flexDirection: 'row', marginBottom: Sizes.s }}>
                    <Image source={{ uri: castMember.image ? castMember.image : 'https://images-na.ssl-images-amazon.com/images/I/51+E4VHsZ6L.jpg' }}
                        height={120}
                        width={120}
                        style={styles.image} />
                    <View style={styles.text_right}>
                        <Text style={GlobalStyles.text_label}>
                            Role:
                        </Text>
                        <Text style={GlobalStyles.text_medium}>
                            {castMember.role}
                        </Text>
                        <Text style={GlobalStyles.text_label}>
                            Name:
                        </Text>
                        <Text style={GlobalStyles.text_medium}>
                            {castMember.name}
                        </Text>
                    </View>
                </View>
                <View>
                    <Text style={GlobalStyles.text_label}>
                        Notes:
                    </Text>
                    <Text style={GlobalStyles.text_small}>
                        {castMember.notes}
                    </Text>
                </View>
            </Pressable >
        )
    }

export default CastMemberSmall

const styles = StyleSheet.create({
    container: {
        width,
        padding: Sizes.m,
        borderBottomColor: GlobalColors.text_primary,
        borderBottomWidth: StyleSheet.hairlineWidth,
        justifyContent: 'center',
        paddingHorizontal: Sizes.m,
    },
    image: {
        height: image_size,
        width: image_size,
        borderRadius: Sizes.s,
        borderColor: GlobalColors.text_primary,
        borderWidth: StyleSheet.hairlineWidth,
        backgroundColor: 'grey',
    },
    text_right: {
        paddingLeft: Sizes.m,
        justifyContent: 'space-evenly',
    }
})