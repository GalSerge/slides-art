import shortuuid

from sqlalchemy.exc import NoResultFound
from sqlalchemy import select, update, delete

from .database import get_independent_db_session

from models import Presentation, User

from random import randint


def get_presentation(uuid: str, session) -> Presentation | None:
    stmt = select(Presentation).where(Presentation.uuid == uuid)
    try:
        return session.scalars(stmt).one()
    except NoResultFound:
        return None


def update_slides(uuid: str, slides: list):
    session = get_independent_db_session()

    stmt = (update(Presentation).where(
        Presentation.uuid == uuid).values(slides=slides))
    session.execute(stmt)
    session.commit()
    
    session.close()


def update_presentation(uuid: str, p, session):
    stmt = (update(Presentation).where(
        Presentation.uuid == uuid).values(name=p.name, slides=p.slides, default_styles=p.default_styles))
    session.execute(stmt)
    session.commit()


def generate_uuid(name: str) -> str:
    return shortuuid.uuid(name=f'{name}_{randint(0, 100)}')[:6]


def generate_clicker_token(name):
    return shortuuid.uuid(name=f'{name}_{randint(0, 100)}')[:10]


def create_new_presentation(name: str, user: User, session) -> Presentation:
    uuid = generate_uuid(name)
    clicker_token = generate_clicker_token(name)

    presentation = Presentation(
        uuid=uuid, clicker_token=clicker_token, name=name, slides=[], default_styles={}, user_id=user.id)
    session.add(presentation)

    session.commit()

    return presentation


def delete_exist_presentation(uuid: str, session):
    stmt = delete(Presentation).where(Presentation.uuid == uuid)
    session.execute(stmt)
    session.commit()

