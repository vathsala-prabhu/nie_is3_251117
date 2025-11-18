import { StatusBar } from 'expo-status-bar';
import { useState } from 'react';
import { StyleSheet, Text, View, TextInput, Button } from 'react-native';



export default function App() {
  const [calcData, setCalcData] = useState({num: 20.0, result: null});
  const doCalc = () => {
    if(isNaN(calcData.num)){
      setCalcData({...calcData,result:'Invalid Number'})
      return;
    }
    const num = calcData.num;
    const sqr = num*num;
    setCalcData({...calcData,result:`Result of  ${num} is ${sqr}`})
  }
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Square Calc Application</Text>
      <TextInput value={calcData.num} keyboardType='numeric'
        placeholder='Enter number'
        onChangeText={(data) => setCalcData({...calcData,num: data})}/> 
        <Button title = 'Find Square' onPress={doCalc}/>
        <Text>{calcData.result}</Text>
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f4b0bdff',
    alignItems: 'center',
    justifyContent: 'center',
  }, title :{
    fontSize : 22,
    fontWeight : 'bold',
  },
});