from flask import Flask, request, jsonify, send_from_directory
from abacusai import PredictionClient
import os

app = Flask(__name__)

@app.route('/', methods=['GET'])
def home():
  # Serve the index.html file from the static directory
  return send_from_directory('static', 'index.html')

@app.route('/execute', methods=['POST'])
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
  app.run(debug=True)
