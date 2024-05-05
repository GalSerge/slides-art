from enum import Enum
from typing import Optional

from pydantic import BaseModel, Field, field_validator


class RoleEnum(str, Enum):
    speaker = 'speaker'
    viewer = 'viewer'
    clicker = 'clicker'


class Switch(BaseModel):
    slide: int


class Vote(BaseModel):
    slide: int
    option: int


class Comment(BaseModel):
    slide: int
    role: str = RoleEnum
    nick: str = Field(..., max_length=50),
    text: str = Field(..., max_length=250),

    class Config:
        use_enum_values = True


class Msg(BaseModel):
    action: str
    source: Optional[str] = None
    params: dict

    @field_validator('params')
    def select(cls, data, values) -> dict:
        match values.data['action']:
            case 'start': return dict()
            case 'stop': return dict()
            case 'switch': return Switch(**data).__dict__
            case 'vote': return Vote(**data).__dict__
            case 'comment': return Comment(**data).__dict__
            case 'joined': return dict()
            case 'left': return dict()
