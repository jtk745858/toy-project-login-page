from flask import Flask, request, jsonify
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

# [APT] Processing login requests
@app.route('/api/login', methods=['POST'])
def login():
    
    data = request.get_json()
    print(f"[Debug] Received data: {data}") # Debugging line to print received data

    user_id = data.get('userid')
    user_pw = data.get('userpw')
    
    if user_id == 'admin' and user_pw == 'admin':
        return jsonify({"result": "success", "message": "Login successful! welcome!"}), 200
    else:
        return jsonify({"result": "fail"," message": "Invalid credentials."}), 401
if __name__ == '__main__':
    app.run(debug=True,port=5000)