from fastapi import WebSocket
from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from redis.asyncio import Redis, ConnectionPool
from jose import jwt

from managers import PresentationManager, RedisPubSubManager, WebSocketManager
from models import User
from services.files import check_pdf
from services.users import get_user
from services.presentations import get_presentation as get_presentation_from_db
from services.database import get_db_session
from config import SECRET_KEY, ALGORITHM

import json

oauth2_scheme = OAuth2PasswordBearer(tokenUrl='login', auto_error=False)
redis_connection_pool = ConnectionPool(decode_responses=True)


def get_current_active_user(token: str | None = Depends(oauth2_scheme), session=Depends(get_db_session)) -> User | None:
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail='Could not validate credentials',
        headers={'WWW-Authenticate': 'Bearer'},
    )

    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        username: str = payload.get('sub')
        if username is None:
            raise credentials_exception
    except Exception:
        raise credentials_exception
    user = get_user(username, session)
    if user is None:
        raise HTTPException(status_code=404, detail='User not found')
    return user


def get_redis_connection() -> Redis:
    return Redis(connection_pool=redis_connection_pool, decode_responses=True)


async def check_current_slide(uuid: str, r: Redis = Depends(get_redis_connection)):
    slide = await r.get(f'{uuid}:slide')
    return int(slide) if slide is not None else -1


def get_presentation(uuid: str, session=Depends(get_db_session)):
    return get_presentation_from_db(uuid, session)


def get_presentation_manager(uuid: str, r: Redis = Depends(get_redis_connection), p=Depends(get_presentation)) -> PresentationManager:
    if p is None:
        raise HTTPException(status_code=404, detail='Presentation not found')
    return PresentationManager(p, r)


def get_pubsub_manager(uuid: str,
                       websocket: WebSocket,
                       r: Redis = Depends(get_redis_connection),
                       p: PresentationManager = Depends(get_presentation_manager)):
    return RedisPubSubManager(websocket, r, p, uuid)


def get_websocket_manager(uuid: str,
                          websocket: WebSocket,
                          r: Redis = Depends(get_redis_connection),
                          p: PresentationManager = Depends(get_presentation_manager)):
    return WebSocketManager(websocket, r, p, uuid)


async def get_slide_redis_data(uuid: str, r: Redis = Depends(get_redis_connection)) -> list | None:
    type_data = await r.type(f'{uuid}:data')
    if type_data == 'list':
        data = await r.lrange(f'{uuid}:data', 0, -2)
        for i in range(len(data)):
            data[i] = json.loads(data[i])
        return data
    elif type_data == 'hash':
        return await r.hgetall(f'{uuid}:data')
    else:
        return None


async def get_viewers(uuid: str, r: Redis = Depends(get_redis_connection)):
    viewers = await r.hget(f'{uuid}:viewers', 'num')
    return int(viewers) if viewers is not None else 0
