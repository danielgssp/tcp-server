import TCPService from './service/TCPService';
import KeepAwake from 'react-native-keep-awake';
import React, {useEffect, useState} from 'react';
import AccessPointService from './service/AccessPointService';
import {useNetInfo} from '@react-native-community/netinfo';

import {StyleSheet, Text, View, ScrollView, Platform} from 'react-native';

function App() {
  const [log, setLog] = useState('');
  const details = useNetInfo().details;
  const [passWifi, setPassWifi] = useState('');
  const [addressWifi, setAddressWifi] = useState('');

  useEffect(() => {
    AccessPointService.initialize();
    AccessPointService.onListenerConnectionInfo(setAddressWifi);
    AccessPointService.onCreateGroup(setPassWifi).then(() =>
      TCPService.socket(setLog),
    );

    return () => {
      AccessPointService.onUnsubscribeConnectionInfo();
      AccessPointService.onRemoveGroup();
    };
  }, []);

  return (
    <View style={styles.container}>
      <KeepAwake />
      <View style={styles.containerNetInfo}>
        <Text style={styles.titNetInfo}>Network Information</Text>
        <View style={styles.row}>
          <Text>Port: </Text>
          <Text style={styles.txtNetInfo}>5000</Text>
        </View>
        <View style={styles.row}>
          <Text>Address: </Text>
          <Text style={styles.txtNetInfo}>{addressWifi}</Text>
        </View>
        <View style={styles.row}>
          <Text>Host: </Text>
          <Text style={styles.txtNetInfo}>{details?.ipAddress}</Text>
        </View>
        <View style={styles.row}>
          <Text>Password: </Text>
          <Text style={styles.txtNetInfo}>{passWifi} </Text>
        </View>
      </View>
      <Text style={styles.titTerminal}>Terminal Log</Text>

      <ScrollView>
        <View style={styles.containerTerminal}>
          <Text style={styles.txtTerminal}>{log}</Text>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    ...Platform.select({
      ios: {
        paddingVertical: 50,
      },
      android: {
        paddingVertical: 15,
      },
    }),
  },
  containerNetInfo: {
    marginHorizontal: 20,
    marginVertical: 20,
  },
  txtNetInfo: {
    color: '#30C0FA',
  },
  row: {
    flexDirection: 'row',
  },
  containerTerminal: {
    flex: 1,
    marginHorizontal: 20,
  },
  titNetInfo: {
    color: '#626262',
    fontWeight: '500',
  },
  txtTerminal: {
    color: '#32CD32',
    fontSize: 18,
  },
  titTerminal: {
    fontSize: 24,
    color: '#626262',
    textAlign: 'center',
  },
});

export default App;
