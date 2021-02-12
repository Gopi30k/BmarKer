import os
from dotenv import load_dotenv
load_dotenv()


class Config:
    SECRET_KEY = os.getenv('SECRET_KEY', 'my_precious_secret_key')
    DB_NAME = os.environ.get("DB_NAME")


class DevelopmentConfig(Config):
    DEBUG = True
    print(os.environ.get("MONGO_DB_URI"))
    MONGO_URI = os.environ.get("MONGO_DB_URI")


class TestingConfig(Config):
    DEBUG = True
    TESTING = True
    MONGO_URI = os.environ.get("MONGO_DB_URI")


class ProductionConfig(Config):
    DEBUG = False
    MONGO_URI = os.environ.get("MONGO_DB_URI")


config_by_name = dict(
    dev=DevelopmentConfig,
    test=TestingConfig,
    prod=ProductionConfig
)

key = Config.SECRET_KEY
