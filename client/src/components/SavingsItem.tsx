import { LayoutChangeEvent, StyleSheet, TouchableOpacity, View } from "react-native";
import React, { useState } from "react";
import Theme from "theme/colors";
import { ProgressChart } from "react-native-chart-kit";
import { Text } from "react-native-paper";
import { Saving } from "../../types";
import { formatCurrency } from "../../utils";
import { useUserContext } from "context/UserContext";
import AddSaving from "./AddSaving";

type Props = {
  saving: Saving;
};

export default function SavingsItem({ saving }: Props) {
  const [chartTextWidth, setChartTextWidth] = useState(0);
  const [chartTextHeight, setChartTextHeight] = useState(0);
  const [savingWidth, setSavingWidth] = useState(0);
  const [savingHeight, setSavingHeight] = useState(0);
  const [modalIsVisible, setModalIsVisible] = useState(false)

  const { user } = useUserContext();

  if (!user) return;

  function onLayoutSaving(e: LayoutChangeEvent) {
    const { width, height } = e.nativeEvent.layout;
    setSavingHeight(height);
    setSavingWidth(width);
  }

  function onLayoutPercentage(e: LayoutChangeEvent) {
    const { width, height } = e.nativeEvent.layout;
    setChartTextHeight(height);
    setChartTextWidth(width);
  }

  const percentageSaved = Math.min(saving.saved / saving.amount, 1) //between 0 and 1, max 1

  return (
    <TouchableOpacity style={styles.saving} onPress={() => setModalIsVisible(true)}>
      <View onLayout={onLayoutSaving} style={styles.chart}>
        <Text
          onLayout={onLayoutPercentage}
          style={[
            styles.chartText,
            {
              top: savingHeight / 2 - chartTextHeight / 2,
              left: savingWidth / 2 - chartTextWidth / 2,
            },
          ]}
          variant="labelLarge"
        >
          {saving.saved === 0 ? 0 : Math.round(percentageSaved * 100)}%
        </Text>
        <ProgressChart
          data={[percentageSaved]}
          hideLegend={true}
          width={90}
          height={90}
          strokeWidth={8}
          chartConfig={{
            backgroundColor: "red",
            backgroundGradientFrom: Theme.colors.secondary,
            backgroundGradientTo: Theme.colors.secondary,
            color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
            style: {
              borderRadius: 16,
            },
          }}
        />
      </View>
      <View style={styles.text}>
        <Text
          variant="bodyLarge"
          style={{ color: "white", fontWeight: "bold" }}
        >
          {saving.name}
        </Text>
        <Text
          variant="bodyLarge"
          style={{ color: "white", fontWeight: "bold", fontSize: 20 }}
        >
          {formatCurrency(saving.saved || 0, user.currency)} /{" "}
          {formatCurrency(saving.amount, user.currency)}
        </Text>
      </View>
      <AddSaving
        saving={saving}
        modalIsVisible={modalIsVisible}
        setModalIsVisible={setModalIsVisible}
      />
    </TouchableOpacity>
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
    gap: 10,
    alignItems: "center",
    position: "relative",
    marginBottom: 10,
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
});
