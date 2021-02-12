import os
import unittest

from app import create_app


app = create_app(os.getenv('BOILERPLATE_ENV') or 'dev')

if __name__ == '__main__':
    app.run(port="8080", host="localhost")
