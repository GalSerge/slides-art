from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from routers import broadcast, presentation, profile, users

app = FastAPI()
v1 = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=['http://slides-art.ru', 'https://slides-art.ru', 'http://localhost'],
    allow_credentials=True,
    allow_methods=['*'],
    allow_headers=['*']
)

app.include_router(broadcast.router)
v1.include_router(presentation.router)
v1.include_router(profile.router)
v1.include_router(users.router)


@v1.get('/')
async def root():
    return {'message': 'Hello World'}


app.mount('/api/v1', v1)
