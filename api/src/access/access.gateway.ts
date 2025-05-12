/* eslint-disable @typescript-eslint/no-unsafe-call */
import {
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server } from 'socket.io';
import { OnModuleInit } from '@nestjs/common';

@WebSocketGateway({
  cors: {
    origin: '*', // front
    credentials: true,
  },
})
export class AccessGateway implements OnModuleInit {
  @WebSocketServer() server!: Server;

  // Se llama desde el service cuando hay nuevo acceso
  broadcastAccess(data: any) {
    this.server.emit('access', data); // canal público
  }

  // Para debug: cliente puede pedir ping
  @SubscribeMessage('ping')
  ping(client: any) {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    client.emit('pong', Date.now());
  }

  onModuleInit() {
    console.log('✅ WebSocket gateway listo');
  }
}
