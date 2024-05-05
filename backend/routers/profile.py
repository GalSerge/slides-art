from datetime import timedelta

from fastapi import APIRouter, Depends, HTTPException, status

from config import ACCESS_TOKEN_EXPIRE_MINUTES
from dependences import get_current_active_user

from models import User
from services.auth import authenticate_user, create_access_token


router = APIRouter()


@router.post('/login')
async def login_for_access_token(user: User | bool = Depends(authenticate_user)):
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail='Incorrect username or password',
            headers={'WWW-Authenticate': 'Bearer'},
        )
    access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(
        data={'sub': user.email}, expires_delta=access_token_expires
    )
    return {'access_token': access_token, 'token_type': 'Bearer'}


@router.get('/user')
async def auth_user(current_user: User = Depends(get_current_active_user)):
    if current_user != None:
        current_user = current_user.__dict__
        del current_user['password']

    return current_user


@router.get('/user/presentations')
async def auth_user(current_user: User = Depends(get_current_active_user)):
    presentations = []
    if current_user != None:
        for p in current_user.presentations:
            presentations.append({'name': p.name, 'uuid': p.uuid})

    return presentations
