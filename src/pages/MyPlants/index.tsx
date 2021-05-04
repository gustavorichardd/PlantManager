import React, { useEffect, useState } from 'react'
import { View, Text, Image, FlatList, ScrollView, Alert } from 'react-native'
import Header from '../../components/Header'
import { loadPlant, PlantProps, removePlant } from '../../libs/storage'
import { formatDistance } from 'date-fns'
import { pt } from 'date-fns/locale'

import PlantCardSecondary from '../../components/PlantCardSecondary'
import Load from '../../components/Load'

import waterDrop from '../../assets/waterdrop.png'
import styles from './styles'

const MyPlants = () => {
  const [myPlants, setMyPlants] = useState<PlantProps[]>([]);
  const [loading, setLoading] = useState(true);
  const [nextWatered, setNextWatered] = useState<string>()

  useEffect(() => {
    async function loadStoragedData() {
      const plantsStoraged = await loadPlant();
      const nextTime = formatDistance(
        new Date(plantsStoraged[0].dateTimeNotification).getTime(),
        new Date().getTime(),
        { locale: pt }
      );
      setNextWatered(
        `Não esqueça de regar a ${plantsStoraged[0].name} à ${nextTime} horas.`
      )
      setMyPlants(plantsStoraged)
      setLoading(false);
    }
    loadStoragedData();
  }, [])

  function handleRemove(plant: PlantProps) {
    Alert.alert('Remover', `Deseja remove a ${plant.name}?`, [
      {
        text: 'Não 🖐',
        style: 'cancel'
      },
      {
        text: 'Sim ✌',
        onPress: async () => {
          try {
            await removePlant(plant.id);


            setMyPlants((oldData) => (
              oldData.filter((item) => item.id !== plant.id)
            ));

          } catch (err) {
            Alert.alert('Não foi possível remover!')
          }
        }
      }
    ])
  }


  if (loading)
    return <Load />
  return (
    <View style={styles.container}>
      <Header />

      <View style={styles.spotlight}>
        <Image source={waterDrop} style={styles.spotlightImage} />
        <Text style={styles.spotlightText}>{nextWatered}</Text>
      </View>

      <View style={styles.plants}>
        <Text style={styles.plantTitle} >Próximas regadas</Text>
        <ScrollView showsVerticalScrollIndicator={false}>
          <FlatList
            data={myPlants}
            keyExtractor={(item) => String(item.id)}
            renderItem={({ item }) => (
              <PlantCardSecondary
                handleRemove={() => { handleRemove(item) }}
                data={item}
              />
            )}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ flex: 1 }}
          />
        </ScrollView>
      </View>
    </View>
  )
}

export default MyPlants;