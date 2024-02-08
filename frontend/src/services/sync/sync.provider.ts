/** Copyright (c) 2024, Tegon, all rights reserved. **/

import { createContext } from 'react';
import { io, Socket } from 'socket.io-client';

export const socket = io('http://localhost:3001');
export const WebsocketContext = createContext<Socket>(socket);
export const WebsocketProvider = WebsocketContext.Provider;
