from models import User

from sqlalchemy.exc import NoResultFound
from sqlalchemy import select, delete


def get_user(email: str, session) -> User | None:
    stmt = select(User).where(User.email == email)
    try:
        return session.scalars(stmt).one()
    except NoResultFound:
        return None
    

def get_users_list(session) -> list:
    stmt = select(User).where(User.admin != 1)
    try:
        return session.scalars(stmt).all()
    except NoResultFound:
        return []


from services.auth import get_password_hash


def create_new_user(user: dict, session) -> User:
    user['password'] = get_password_hash(user['password'])
    user = User(**user)
    session.add(user)
    session.commit()

    return user


def delete_exist_user(user_id: int, session):
    stmt = delete(User).where(User.id == user_id)
    session.execute(stmt)
    session.commit()
