import React, { useEffect, useState } from 'react'
import { Text, View, FlatList, ActivityIndicator } from 'react-native'
import { useNavigation } from '@react-navigation/core';
import { PlantProps } from '../../libs/storage';

import PlantCardPrimary from '../../components/PlantCardPrimary';
import EnviromentButton from '../../components/EnvironmentButton';
import Header from '../../components/Header';
import Load from '../../components/Load'

import api from '../../services/api';

import styles from './styles';
import colors from '../../styles/colors';

interface EnvironmentProps {
  key: string;
  title: string
}

const PlantSelect = () => {
  const [environment, setEnvironment] = useState<EnvironmentProps[]>([]);
  const [plants, setPlants] = useState<PlantProps[]>([])
  const [filteredPlants, setFilteredPlants] = useState<PlantProps[]>([])
  const [environmentSelected, setEnvironmentSelected] = useState('all');
  const [loading, setLoading] = useState(true)

  const [page, setPage] = useState(1);
  const [loadingMore, setLoadingMore] = useState(false)

  const navigation = useNavigation();

  async function fetchPlants() {
    const { data } = await api
      .get(`plants?_sort=name&_order=asc&_page=${page}&_limit=8`);

    if (!data)
      return setLoading(true)

    if (page > 1) {
      setPlants(oldValue => [...oldValue, ...data])
      setFilteredPlants(oldValue => [...oldValue, ...data])
    } else {
      setPlants(data);
      setFilteredPlants(data);

    }
    setLoading(false)
    setLoadingMore(false)
  }

  function handleEnvironmentSelected(environment: string) {
    setEnvironmentSelected(environment);

    if (environment == 'all')
      return setFilteredPlants(plants);

    const filtered = plants.filter(plant =>
      plant.environments.includes(environment)
    )

    setFilteredPlants(filtered)
  }

  function handleFetchMore(distance: number) {
    if (distance < 1)
      return;
    setLoadingMore(true);
    setPage(oldValue => oldValue + 1);
    fetchPlants();
  }

  function handlePlantSelect(plant: PlantProps) {
    navigation.navigate('PlantSave', { plant });
  }

  useEffect(() => {
    async function fetchEnviorenment() {
      const { data } = await api
        .get('plants_environments?_sort=title&_order=asc');
      setEnvironment([
        {
          key: 'all',
          title: 'Todos'
        },
        ...data
      ]);
    }
    fetchEnviorenment();
  }, [])

  useEffect(() => {
    fetchPlants();
  }, [])


  if (loading)
    return <Load />
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Header />

        <Text style={styles.title} > Em qual ambiente </Text>
        <Text style={styles.subtitle} > Você quer colocar sua planta? </Text>
      </View>

      <View style={styles.flatListView}>
        <FlatList
          data={environment}
          keyExtractor={(item) => String(item.key)}
          renderItem={({ item }) => (
            <EnviromentButton
              key={item.key}
              title={item.title}
              active={item.key === environmentSelected}
              onPress={() => handleEnvironmentSelected(item.key)}
            />
          )}
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.environmentList}
        />
      </View>

      <View style={styles.plants}>
        <FlatList
          data={filteredPlants}
          keyExtractor={(item) => String(item.id)}
          renderItem={({ item }) => (
            <PlantCardPrimary data={item} onPress={() => handlePlantSelect(item)} />
          )}
          showsVerticalScrollIndicator={false}
          numColumns={2}
          onEndReachedThreshold={0.1}
          onEndReached={({ distanceFromEnd }) => handleFetchMore(distanceFromEnd)}
          ListFooterComponent={
            loadingMore ?
              <ActivityIndicator color={colors.green} />
              : <></>
          }
        >

        </FlatList>
      </View>

    </View>
  )
}

export default PlantSelect;