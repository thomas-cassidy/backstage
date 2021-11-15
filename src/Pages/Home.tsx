import { StackNavigationProp } from '@react-navigation/stack'
import React from 'react'
import { Image, ScrollView, Dimensions, SafeAreaView } from 'react-native'
import { BarLink } from '../Components'
import { GlobalStyles, Sizes } from '../Util/GlobalStyles'

const { width } = Dimensions.get('window')

interface Props {
    navigation: StackNavigationProp<any, 'Home'>
}

const Home = ({ navigation }: Props) => {
    return (
        <SafeAreaView style={GlobalStyles.container}>
            <Image source={require('../../assets/poelogo.png')}
                style={{ width: width - Sizes.l, height: width - Sizes.l, resizeMode: 'contain' }}
                width={width}
            />
            <ScrollView style={{ flex: 1 }}>
                <BarLink
                    label={'Cast'}
                    onPress={() => navigation.navigate('Cast')}
                />
                <BarLink
                    label={'Cue Sheets'}
                    onPress={() => navigation.navigate('CueSheets')}
                />
                <BarLink
                    label={'To Dos'}
                    onPress={() => navigation.navigate('Todos')}
                />
                <BarLink
                    label={'Settings'}
                    onPress={() => navigation.navigate('Cast')}
                />
            </ScrollView>
        </SafeAreaView>
    )
}

export default Home
