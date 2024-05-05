import datetime
from typing import List
from sqlalchemy import ForeignKey, Table, Column
from sqlalchemy import String, Boolean
from sqlalchemy.orm import DeclarativeBase
from sqlalchemy.orm import Mapped
from sqlalchemy.orm import mapped_column
from sqlalchemy.orm import relationship

from sqlalchemy.types import JSON
from typing import Any


class Base(DeclarativeBase):
    type_annotation_map = {
        list[str, Any]: JSON
    }


# presentation_user = Table(
#     'presentation_user',
#     Base.metadata,
#     Column('presentation_id', ForeignKey('presentations.id')),
#     Column('user_id', ForeignKey('users.id')),
# )


class User(Base):
    __tablename__ = 'users'
    id: Mapped[int] = mapped_column(primary_key=True)
    admin: Mapped[bool] = mapped_column(Boolean(), default=False)
    email: Mapped[str] = mapped_column(String(255), index=True, unique=True)
    password: Mapped[str] = mapped_column(String(255))
    fname: Mapped[str] = mapped_column(String(255))
    lname: Mapped[str] = mapped_column(String(255))

    presentations: Mapped[List['Presentation']] = relationship(back_populates='user', cascade='all')

    def __repr__(self) -> str:
        return f'User(id={self.id!r}, email={self.email!r})'


class Presentation(Base):
    __tablename__ = 'presentations'
    id: Mapped[int] = mapped_column(primary_key=True)
    uuid: Mapped[str] = mapped_column(String(255), unique=True)
    clicker_token: Mapped[str] = mapped_column(String(255), unique=True)
    name: Mapped[str] = mapped_column(String(255))
    slides: Mapped[list] = mapped_column(JSON)
    default_styles: Mapped[dict] = mapped_column(JSON)

    # users: Mapped[List['User']] = relationship(
    #     secondary=presentation_user, back_populates='presentations', cascade='all')
    
    user_id: Mapped[int] = mapped_column(ForeignKey('users.id'))

    user: Mapped['User'] = relationship(back_populates='presentations', cascade='all')

    def __repr__(self) -> str:
        return f'Presentation(id={self.id!r}, uuid={self.uuid!r})'
