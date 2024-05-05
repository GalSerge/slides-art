from fastapi import Depends, APIRouter, HTTPException

from dependences import get_current_active_user, get_db_session
from models import User
from sqlalchemy.orm import Session
from services.files import remove_user_dir, make_user_dir
from services.users import get_users_list, create_new_user, delete_exist_user
from validation import User as UserSchema


router = APIRouter(prefix='/users')


@router.get('/')
def get_users(current_user: User = Depends(get_current_active_user), session: Session = Depends(get_db_session)):
    if not current_user.admin:
        raise HTTPException(status_code=403)

    return get_users_list(session)


@router.post('/create')
def create_user(user: UserSchema, current_user: User = Depends(get_current_active_user), session: Session = Depends(get_db_session)):
    if not current_user.admin:
        raise HTTPException(status_code=403)

    user = create_new_user(user.__dict__, session)
    make_user_dir(user.id)

    user = user.__dict__
    del user['password']

    return user


@router.delete('/{user_id}')
def delete_user(user_id: str, current_user: User = Depends(get_current_active_user)):
    if not current_user.admin:
        raise HTTPException(status_code=403)

    delete_exist_user(user_id)
    remove_user_dir(user_id)
