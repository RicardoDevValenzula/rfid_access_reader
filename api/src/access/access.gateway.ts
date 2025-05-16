/* eslint-disable @typescript-eslint/no-unsafe-call */
import {
  OnGatewayConnection,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { OnModuleInit } from '@nestjs/common';

@WebSocketGateway({
  cors: {
    origin: '*', // front
    credentials: true,
  },
})
export class AccessGateway implements OnModuleInit, OnGatewayConnection {
  @WebSocketServer() server!: Server;

  private kioskSocket = new Map<string, Socket>();

 
  
  handleConnection(client: Socket) {
    const kioskid = client.handshake.query.kioskid as string;
    if(kioskid){
      this.kioskSocket.set(kioskid, client);
      console.log("Kiosko Conectado:", kioskid);
    }
  }

  // // Se llama desde el service cuando hay nuevo acceso
  broadcastAccess(log: any) {
    const kioskid = log.kioskid;
    const client = this.kioskSocket.get(kioskid);
    if(client){
      client.emit("access",log)
    }else{
      console.error("Kiosko no conectado");
    }
  }

  // // Para debug: cliente puede pedir ping
  // @SubscribeMessage('ping')
  // ping(client: any) {
  //   // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
  //   client.emit('pong', Date.now());
  // }

  onModuleInit() {
    console.log('✅ WebSocket gateway listo');
  }
}
