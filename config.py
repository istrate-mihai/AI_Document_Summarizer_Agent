import os

class Config:
  DEBUG = False
  TESTING = False
  DATABASE_URI = 'sqlite:///:memory:'

class ProductionConfig(Config):
  URL = os.getenv('PROD_URL', 'https://ai-document-summarizer-agent.onrender.com')

class DevelopmentConfig(Config):
  DEBUG = True
  URL = os.getenv('DEV_URL', 'http://127.0.0.1:5000')

class TestingConfig(Config):
  TESTING = True