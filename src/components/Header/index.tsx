import React, { useEffect, useState } from 'react'
import { View, Text, Image } from 'react-native'
import AsyncStorage from '@react-native-async-storage/async-storage'

import styles from './styles'
import Avatar from '../../assets/gardener.png'

const Header = () => {
  const [userName, setUserName] = useState<string>()

  useEffect(() => {
    async function loadStorageUserName() {
      const asyncUserName = await AsyncStorage.getItem('@plantmanager:user');
      setUserName(asyncUserName || '')
    }
    loadStorageUserName()
  }, [])

  return (
    <View style={styles.container}>
      <View>
        <Text style={styles.greeting} > Olá, </Text>
        <Text style={styles.userName}> {userName} </Text>
      </View>

      <Image source={Avatar} style={styles.image} />

    </View>


  )
}

export default Header;