import React, { useState } from 'react'
import { useNavigation } from '@react-navigation/core'
import { Alert, SafeAreaView, Text, TextInput, View, KeyboardAvoidingView, Platform } from 'react-native'
import AsyncStorage from '@react-native-async-storage/async-storage'

import colors from '../../styles/colors'
import Button from '../../components/Button'

import styles from './styles'

const UserIdentification = () => {
  const navigation = useNavigation();

  const [isFocused, setIsFocused] = useState(false)
  const [isFilled, setIsFilled] = useState(false)
  const [name, setName] = useState<string>('')

  async function handleSubmit() {
    const validateName = name.trim()
    if (!validateName)
      return Alert.alert('Me diz como chamar você. 😥')

    try {
      await AsyncStorage.setItem('@plantmanager:user', validateName)
      navigation.navigate('Confirmation', {
        title: 'Prontinho',
        subtitle: 'Agora vamos começar a cuidar das suas plantinhas com muito cuidado',
        buttonTitle: 'Começar',
        icon: 'smile',
        nextScreen: 'PlantSelect'
      })
    } catch {
      Alert.alert('Não foi possível salvar o seu nome. 😥')
    }

  }

  function handleInputBlur() {
    setIsFocused(false)
    setIsFilled(!!name)
  }

  function handleInputFocus() {
    setIsFocused(true)
  }

  function handleInputChange(value: string) {
    setIsFilled(!!value);
    setName(value)
  }

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <View style={styles.content}>
          <View style={styles.form}>
            <View style={styles.header}>
              <Text style={styles.emoji}> {isFilled ? '😃' : '🤔'} </Text>

              <Text style={styles.title} > Como podemos {'\n'} chamar você?</Text>
            </View>
            <TextInput
              style={[
                styles.input,
                (isFocused || isFilled) && { borderColor: colors.green }

              ]}
              placeholder='Digite um nome'
              onBlur={handleInputBlur}
              onFocus={handleInputFocus}
              onChangeText={handleInputChange}
            />

            <View style={styles.footer}>
              <Button title='Confirmar' onPress={handleSubmit} />
            </View>
          </View>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  )
}

export default UserIdentification;