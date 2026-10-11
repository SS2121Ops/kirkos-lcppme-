import os


class Config:
    SECRET_KEY = os.environ.get("SECRET_KEY")

    SQLALCHEMY_DATABASE_URI = os.environ.get(
        "DATABASE_URL",
        "sqlite:///kirkos_lcppme.db"
    )

    SQLALCHEMY_TRACK_MODIFICATIONS = False