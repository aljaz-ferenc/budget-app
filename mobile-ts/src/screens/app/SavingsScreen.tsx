import { Dimensions, LayoutChangeEvent, StyleSheet, View } from "react-native";
import React, { useState } from "react";
import Theme from "theme/colors";
import { FAB, Provider, Text } from "react-native-paper";
import NewSaving from "components/NewSaving";
import { useUserContext } from "context/UserContext";
import { FlatList } from "react-native";
import SavingsItem from "components/SavingsItem";

export default function SavingsScreen() {
  const [modalIsVisible, setModalIsVisible] = useState(false);
  const { user, getAllSavings } = useUserContext();
  
  if(!user) return
  const savings = getAllSavings(user)

  return (
    <Provider>
        <FAB
          onPress={() => setModalIsVisible(true)}
          icon="plus"
          color="white"
          style={styles.fab}
        />
      {savings.length > 0 ? <View style={styles.container}>
        <FlatList
          data={savings}
          keyExtractor={(item) => item.id}
          renderItem={({item}) => <SavingsItem saving={item}/>}
        />
          </View> : <Text style={styles.emptySavingsText}>Create your first saving</Text>}
        <NewSaving
          modalIsVisible={modalIsVisible}
          setModalIsVisible={setModalIsVisible}
        />
    </Provider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Theme.colors.primary,
    paddingTop: 25,
    padding: 10,
    gap: 10,
    flexDirection: "row",
  },
  saving: {
    backgroundColor: Theme.colors.secondary,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: Theme.colors.border,
    height: 120,
    width: "100%",
    justifyContent: "flex-start",
    flexDirection: "row",
    gap: 20,
    alignItems: "center",
    position: "relative",
  },
  percentage: {
    position: "absolute",
    top: "50%",
    left: "50%",
    zIndex: 2,
    fontWeight: "bold",
  },
  iconContainer: {
    justifyContent: "center",
    alignItems: "center",
  },
  chart: {
    justifyContent: "center",
    alignItems: "center",
  },
  chartText: {
    position: "absolute",
    zIndex: 2,
    color: Theme.colors.text,
    fontWeight: "bold",
  },
  text: {
    gap: 10,
  },
  fab: {
    backgroundColor: Theme.colors.blue,
    position: "absolute",
    bottom: 0,
    right: 0,
    margin: 10,
    zIndex: 2,
  },
  emptySavingsText:{
    textAlign:'center',
    color: Theme.colors.secondary,
    fontSize: 24,
    flex:1,
    textAlignVertical: 'center',
    backgroundColor:Theme.colors.primary
  }
});
