import {writeLog} from './LogService';
import {config} from '../utils/config';
import TcpSocket from 'react-native-tcp-socket';

class TCPService {
  socket(setLog) {
    setTimeout(() => {
      const server = TcpSocket.createServer((socket) => {
        console.log('server connected on ' + JSON.stringify(socket.address()));

        socket.on('data', (data) => {
          const logData = data.toString();
          console.log('Server Received: ' + data);
          setLog((old) => `$ ${logData} \n ${old}`);
          writeLog(logData);
        });

        socket.on('error', (error) => {
          console.log('An error ocurred with client socket ', error);
        });

        socket.on('close', (error) => {
          console.log('Closed connection with ', socket.address());
        });

        socket.destroy();
      }).listen(
        {port: config.serverPort, host: config.serverHost},
        (address) => {
          console.log('opened server on ' + JSON.stringify(address));
        },
      );

      server.on('error', (error) => {
        console.log('An error ocurred with the server', error);
      });

      server.on('close', () => {
        console.log('Server closed connection');
      });
    }, 1000);
  }
}

export default new TCPService();
