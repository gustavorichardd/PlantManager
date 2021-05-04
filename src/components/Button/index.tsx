import React from 'react'
import { TouchableOpacity, Text, TouchableOpacityProps } from 'react-native'
import styles from './styles'


interface ButtonsProps extends TouchableOpacityProps {
  title: string
}

const Button = ({ title, ...rest }: ButtonsProps) => {
  return (
    <TouchableOpacity style={styles.container}>
      <Text
        style={styles.text}
        {...rest}
      >
        {title}

      </Text>
    </TouchableOpacity>
  )
}

export default Button;