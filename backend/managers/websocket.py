import json
import validation

import redis.asyncio as aioredis

from fastapi import WebSocket, WebSocketDisconnect
from redis.exceptions import ConnectionError

from managers.presentation import PresentationManager
from models import User


class WebSocketManager:
    def __init__(self, ws: WebSocket, r: aioredis.Redis, p: PresentationManager, room_id: str):
        self.r = r
        self.ws = ws
        self.id = str(id(ws))
        self.room_id = room_id
        self.p = p

    async def connect(self) -> dict:
        await self.ws.accept()

        msg = await self.ws.receive_text()
        msg = validation.validate(validation.Token, msg)
        if msg is not None:
            return msg

    async def listen(self):
        await self.p.action('joined')
        await self.joined_left_publish('joined')

        print('ws')
        while True:
            try:
                msg = await self.ws.receive_text()
                print('ws raw: ', msg)
                msg = validation.validate(validation.Msg, msg)
                print('ws: ', msg)
                print('ws id: ', self.id)
                print('p id: ', id(self.p))
                if msg is not None:
                    share = await self.p.action(msg['action'], msg['params'])
                    print(share)
                    if share:
                        msg['source'] = self.id
                        ok = await self.publish(json.dumps(msg))
                        if not ok:
                            await self.disconnect()
                            break
            except WebSocketDisconnect:
                await self.p.action('left')
                await self.joined_left_publish('left')
                break
        print('ws closed')

    async def publish(self, msg: str):
        try:
            await self.r.publish(self.room_id, msg)
            return True
        except ConnectionError:
            return False

    async def disconnect(self):
        await self.ws.close()

    async def set_user(self, user: User | None = None, clicker_token: str = ''):
        try:
            role = self.p.set_user(user, clicker_token)
            await self.ws.send_text(json.dumps({'action': 'role', 'params': {'role': role}}))
        except Exception:
            return
        
    async def joined_left_publish(self, action: str):
        await self.publish(json.dumps({'action': action, 'params': {}, 'source': self.id}))
        

