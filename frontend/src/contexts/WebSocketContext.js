import { createContext } from 'react';

import { useParams } from 'react-router-dom';

import useWebSocket from 'react-use-websocket';

import { WS_SERVER } from '@constants';

export const WebSocketContext = createContext(0);


export const WebSocketContextProvider = ({ children }) => {
    const { uuid } = useParams();

    const { sendJsonMessage, lastJsonMessage, readyState } = useWebSocket(
        WS_SERVER + `/ws/${uuid}`,
        {
            share: true,
            shouldReconnect: () => true
        },
    )

    const ret = [sendJsonMessage, lastJsonMessage, readyState];

    return (
        <WebSocketContext.Provider value={ret}>
            {children}
        </WebSocketContext.Provider>
    )
}