from typing import Optional
from pydantic import BaseModel


class Token(BaseModel):
    access_token: Optional[str] = ''
    clicker_token: Optional[str] = ''


class Presentation(BaseModel):
    name: str
    uuid: str
    slides: list[dict]
    default_styles: dict


class User(BaseModel):
    fname: str
    lname: str
    email: str
    password: str
