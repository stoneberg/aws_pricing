from flask import Flask, request, jsonify
import boto3
from botocore.exceptions import BotoCoreError, ClientError
from dotenv import load_dotenv
from flask_cors import CORS
import os

# Load environment variables from .env file
load_dotenv()

app = Flask(__name__)
CORS(app)  # Enable CORS for all routes

# 리전 목록을 가져오는 API
@app.route('/aws-regions')
def list_aws_regions():
    region = request.args.get('region', 'us-east-1')
    
    try:
        client = boto3.client('ec2',
                              region_name=region,
                              aws_access_key_id=os.getenv('AWS_ACCESS_KEY_ID'),
                              aws_secret_access_key=os.getenv('AWS_SECRET_ACCESS_KEY'))
        response = client.describe_regions()
        regions = response['Regions']
        return jsonify(regions)
    except (BotoCoreError, ClientError) as e:
        return jsonify({"error": str(e)}), 500

# AWS 서비스 목록을 가져오는 API
@app.route('/aws-services')
def list_aws_services():
    region = request.args.get('region', 'us-east-1')
    
    try:
        client = boto3.client('pricing',
                              region_name=region,
                              aws_access_key_id=os.getenv('AWS_ACCESS_KEY_ID'),
                              aws_secret_access_key=os.getenv('AWS_SECRET_ACCESS_KEY'))
        response = client.describe_services()
        services = response['Services']
        return jsonify(services)
    except (BotoCoreError, ClientError) as e:
        return jsonify({"error": str(e)}), 500


# AWS 서비스의 속성 목록을 가져오는 API
@app.route('/aws-service-attributes')
def list_service_attributes():
    service_code = request.args.get('service_code', 'AmazonEC2')
    # service_code = 'AmazonEC2'
    region = request.args.get('region', 'us-east-1')
    
    if not service_code:
        return jsonify({"error": "service_code is required"}), 400
    
    try:
        client = boto3.client('pricing', region_name=region,
                              aws_access_key_id=os.getenv('AWS_ACCESS_KEY_ID'),
                              aws_secret_access_key=os.getenv('AWS_SECRET_ACCESS_KEY'))
        
        response = client.describe_services(ServiceCode=service_code)
        attributes = response['Services'][0]['AttributeNames']
        return jsonify(attributes)
    except (BotoCoreError, ClientError) as e:
        return jsonify({"error": str(e)}), 500

# AWS 서비스의 속성 값 목록을 가져오는 API
@app.route('/aws-attribute-values')
def list_attribute_values():
    service_code = request.args.get('service_code')
    attribute_name = request.args.get('attribute_name')
    region = request.args.get('region', 'us-east-1')
    
    if not service_code or not attribute_name:
        return jsonify({"error": "service_code and attribute_name are required"}), 400
    
    try:
        client = boto3.client('pricing', region_name=region,
                              aws_access_key_id=os.getenv('AWS_ACCESS_KEY_ID'),
                              aws_secret_access_key=os.getenv('AWS_SECRET_ACCESS_KEY'))
        
        response = client.get_attribute_values(ServiceCode=service_code, AttributeName=attribute_name)
        values = [v['Value'] for v in response['AttributeValues']]
        return jsonify(values)
    except (BotoCoreError, ClientError) as e:
        return jsonify({"error": str(e)}), 500

# AWS 서비스의 가격 정보를 가져오는 API
@app.route('/search', methods=['POST'])
def search():
    data = request.json
    service_code = data.get('serviceCode')
    filters = data.get('filters', [])
    region = data.get('region', 'us-east-1')

    if not service_code or not region:
        return jsonify({"error": "serviceCode and region are required"}), 400

    try:
        client = boto3.client('pricing', region_name=region,
                              aws_access_key_id=os.getenv('AWS_ACCESS_KEY_ID'),
                              aws_secret_access_key=os.getenv('AWS_SECRET_ACCESS_KEY'))

        response = client.get_products(
            ServiceCode=service_code,
            Filters=[{'Type': f['Type'], 'Field': f['Field'], 'Value': f['Value']} for f in filters],
            MaxResults=100
        )
        
        # Extract PriceList and NextToken
        price_list = response.get('PriceList', [])
        next_token = response.get('NextToken', None)
        
        result = {
            "PriceList": price_list,
            "NextToken": next_token
        }

        return jsonify(result), 200

    except (BotoCoreError, ClientError) as e:
        return jsonify({"error": str(e)}), 500

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=3000)
