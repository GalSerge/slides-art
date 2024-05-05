import asyncio

from fastapi import Depends, APIRouter

from dependences import get_websocket_manager, get_current_active_user, get_pubsub_manager, get_db_session
from managers.pubsub import RedisPubSubManager
from managers.websocket import WebSocketManager

from sqlalchemy.orm import Session

router = APIRouter()


@router.websocket('/api/ws/{uuid}')
async def ws_endpoint_for_speaker(ps_manager: RedisPubSubManager = Depends(get_pubsub_manager),
                                  ws_manager: WebSocketManager = Depends(get_websocket_manager),
                                  session: Session = Depends(get_db_session)):
    token = await ws_manager.connect()
    if token['access_token'] != '':
        user = get_current_active_user(token['access_token'], session)
        if user is not None:
            await ws_manager.set_user(user)
    elif token['clicker_token'] != '':
        await ws_manager.set_user(clicker_token=token['clicker_token'])

    session.close()
    await ps_manager.subscribe()

    await asyncio.wait([ps_manager.listen(), ws_manager.listen()], return_when=asyncio.FIRST_COMPLETED)

    await ps_manager.disconnect()

    print('Close connection from Serge')
