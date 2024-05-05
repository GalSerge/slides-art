from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker

engine = create_engine(
    'mysql+mysqldb://admin_serge:df4zRgm3fjw@localhost/admin_serge_db', echo=False, pool_recycle=280)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)


def get_db_session():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

def get_independent_db_session():
    return SessionLocal()
