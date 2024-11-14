import os
from abacusai import PredictionClient
from flask import Flask, request, jsonify, send_from_directory, render_template
from flask_cors import cross_origin
from config import DevelopmentConfig, ProductionConfig

flaskApp = Flask(__name__)

if os.getenv('FLASK_ENV') == 'production':
  flaskApp.config.from_object(ProductionConfig)
else:
  flaskApp.config.from_object(DevelopmentConfig)

@flaskApp.route('/', methods=['GET'])
def home():
  api_url = flaskApp.config['URL']
  # Serve the index.html file from the static directory
  return render_template('index.html', api_url=api_url)

@flaskApp.route('/execute', methods=['POST'])
@cross_origin()
def execute_agent():
  # Extract data from the request
  data = request.json
  document_content = data.get('document_content', 'default content')

  # Initialize the PredictionClient and execute the agent
  client = PredictionClient()
  result = client.execute_agent(
    deployment_token='59f424d5605c4976b8f8680269c5b175',
    deployment_id='d98cfc010',
    arguments=None,
    keyword_arguments={"document_content": document_content}
  )

  # Return the result as a JSON response
  return jsonify(result)

if __name__ == '__main__':
  flaskApp.run(debug=True)
