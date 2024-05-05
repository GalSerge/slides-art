from pydantic import ValidationError

from schemas.messages import *
from schemas.other import *

def validate(Validator, data: str) -> dict | None:
    try:
        return Validator.model_validate_json(data).__dict__
    except (KeyError, ValidationError):
        return None
