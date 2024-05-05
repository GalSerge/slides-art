import json
import validation

import redis.asyncio as aioredis

from fastapi import WebSocket, WebSocketDisconnect
from redis.exceptions import ConnectionError

from managers.presentation import PresentationManager


class RedisPubSubManager:
    def __init__(self, ws: WebSocket, r: aioredis.Redis, p: PresentationManager, room_id: str):
        self.ws = ws
        self.id = str(id(ws))
        self.r = r
        self.pubsub = self.r.pubsub()
        self.p = p
        self.room_id = room_id

    async def subscribe(self):
        await self.pubsub.psubscribe(self.room_id)

    async def listen(self):
        print('ps')
        while True:
            try:
                msg = await self.pubsub.get_message(ignore_subscribe_messages=True, timeout=False)
                if msg is None:
                    continue
                msg = validation.validate(validation.Msg, msg['data'])
                print('ps:', msg)
                print('ps id: ', self.id)
                if msg is not None and msg['source'] != self.id:
                    await self.publish(json.dumps(msg))
            except ConnectionError:
                return
        print('ps closed')

    async def publish(self, msg: str):
        try:
            await self.ws.send_text(msg)
            return True
        except Exception:
            return False

    # async def unsubscribe(self):
    #     await self.pubsub.unsubscribe(self.room_id)

    async def disconnect(self):
        await self.pubsub.unsubscribe(self.room_id)
        await self.r.close()

