import json

from models import Presentation, User
from redis.asyncio import Redis

from services.presentations import update_slides


class PresentationManager:
    def __init__(self, p: Presentation, r: Redis):
        self.user = None
        self.p = p
        self.votes = [0] * len(p.slides)
        self.r = r

    def set_user(self, user: User, clicker_token: str) -> str:
        if user is not None and user.id == self.p.user_id:
            self.user = user
            return 'speaker'
        elif clicker_token == self.p.clicker_token:
            self.user = self.p.user
            return 'clicker'
        else:
            return 'viewer'

    async def action(self, action: str, data: dict = {}):
        match action:
            case 'start':
                return await self.start_broadcast()
            case 'switch':
                return await self.switch_slide(data['slide'])
            case 'vote':
                if self.p.slides[data['slide']]['type'] == 'voting':
                    return await self.vote(data['option'])
            case 'comment':
                if self.p.slides[data['slide']]['type'] == 'comments':
                    return await self.comment(data)
            case 'stop':
                return await self.stop_broadcast()
            case 'joined':
                return await self.join_user()
            case 'left':
                return await self.leave_user()
            
        return False

    async def switch_slide(self, slide: int):
        if self.is_speaker() and slide < self.len_presentation():
            await self.save_redis_data()
            await self.r.delete(f'{self.p.uuid}:data')

            await self.r.set(f'{self.p.uuid}:slide', slide)
            await self.r.expire(f'{self.p.uuid}:slide', 60*60*12)

            await self.init_redis_data(slide)
            return True
        else:
            return False

    async def vote(self, option: int):
        try:
            await self.r.hincrby(f'{self.p.uuid}:data', option, 1)
            return True
        except Exception:
            return False

    async def comment(self, comment: dict):
        try:
            comment['slide']
            await self.r.lpush(f'{self.p.uuid}:data', json.dumps(comment))
            return True
        except Exception:
            return False

    async def start_broadcast(self):
        if self.is_speaker():
            await self.r.set(f'{self.p.uuid}:slide', 0)
            await self.r.expire(f'{self.p.uuid}:slide', 60*60*12)

            await self.init_redis_data(0)
            
            return True
        else:
            return False
    
    async def stop_broadcast(self):
        await self.save_redis_data()
        
        await self.r.delete(f'{self.p.uuid}:slide')
        await self.r.delete(f'{self.p.uuid}:data')
        await self.r.delete(f'{self.p.uuid}:viewers')
        return True

    async def join_user(self):
        num = await self.r.hincrby(f'{self.p.uuid}:viewers', 'num', 1)

        if num == 1:
            await self.r.expire(f'{self.p.uuid}:viewers', 60*60*6)
            
        return True
    
    async def leave_user(self):
        await self.r.hincrby(f'{self.p.uuid}:viewers', 'num', -1)
        return True

    def is_speaker(self):
        if self.user is not None:
            return True
        else:
            return False

    def len_presentation(self):
        return len(self.p.slides)

    async def init_redis_data(self, slide: int):
        match self.p.slides[slide]['type']:
            case 'voting':
                await self.r.hset(f'{self.p.uuid}:data', 0, 0)
            case 'comments':
                await self.r.lpush(f'{self.p.uuid}:data', '')
        await self.r.expire(f'{self.p.uuid}:data', 60*60*12)

    async def save_redis_data(self):
        slide = int(await self.r.get(f'{self.p.uuid}:slide'))

        match self.p.slides[slide]['type']:
            case 'voting':
                votes = await self.r.hgetall(f'{self.p.uuid}:data')
                for key, value in votes.items():
                    self.p.slides[slide]['data']['options'][int(key)]['votes'] += int(value)
                update_slides(self.p.uuid, self.p.slides)
            case 'comments':
                comments = await self.r.lrange(f'{self.p.uuid}:data', 0, -2)
                self.p.slides[slide]['data']['list'] += [json.loads(comment) for comment in comments]
                update_slides(self.p.uuid, self.p.slides)
        
        if isinstance(self.p.slides, str):
            self.p.slides = json.loads(self.p.slides)
