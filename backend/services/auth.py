from datetime import datetime, timedelta, timezone

from fastapi import Depends
from fastapi.security import OAuth2PasswordRequestForm

from jose import jwt
from passlib.context import CryptContext

from services.database import get_db_session
from services.users import get_user
from config import SECRET_KEY, ALGORITHM

pwd_context = CryptContext(schemes=['sha256_crypt'], deprecated='auto')


def verify_password(plain_password, hashed_password):
    return pwd_context.verify(plain_password, hashed_password)


def get_password_hash(password):
    return pwd_context.hash(password)


def authenticate_user(form_data: OAuth2PasswordRequestForm = Depends(), session = Depends(get_db_session)):
    user = get_user(form_data.username, session)
    if not user:
        return False
    if not verify_password(form_data.password, user.password):
        return False
    return user


def create_access_token(data: dict, expires_delta: timedelta | None = None):
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.now(timezone.utc) + expires_delta
    else:
        expire = datetime.now(timezone.utc) + timedelta(minutes=15)
    to_encode.update({'exp': expire})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt
