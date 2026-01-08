from flask import Flask, request, jsonify
from flask_cors import CORS
from werkzeug.security import generate_password_hash, check_password_hash
from db_client import supabase
from datetime import datetime, timedelta

app = Flask(__name__)
CORS(app)

login_attempts = {}

MAX_RETRIES = 5
BLOCK_TIME = 60 
# [API] Register
@app.route('/api/register', methods=['POST'])
def register():
    data = request.get_json()
    user_id = data.get("userid") # id from frontend
    user_pw = data.get("userpw") # pw from frontend
    user_email = data.get("email") # email from frontend
    
    if not user_id or not user_pw or not user_email:
        return jsonify({"msg": "Please Enter your ID or Password or email"}), 400
    if len(user_pw) < 8:
        return jsonify({"msg": "Password must be at least 8 characters long."}), 400
    hashed_pw = generate_password_hash(user_pw)
    
    try:
        response = supabase.table('Users').insert({
            "username": user_id,
            "password": hashed_pw,
            "email" : user_email
        }).execute()
        
        return jsonify({"msg": "Sign up success! Please login.", "result": "success"}), 201

    except Exception as e:
        print(f"Registor Error: {e}")
        return jsonify({"msg:":"Error: This might be an ID that has already been created.", "result": "fail"}), 409

# [API] Login
@app.route('/api/login', methods=['POST'])
def login():
    
    data = request.get_json()
    # === Debugging line to print received data ===
    # print(f"[Debug] Received data: {data}") 
    # =============================================
    input_id = data.get('userid') # id from frontend
    input_pw = data.get('userpw') # pw from frontend
    if input_id in login_attempts:
        attempt_info = login_attempts[input_id]
        
        if attempt_info['lock_until'] and datetime.now() < attempt_info['lock_until']:
            remaining_time = (attempt_info['lock_until'] - datetime.now()).seconds
            return jsonify({
                "msg":f"Account locked due to too many failed attempts. Try again in {remaining_time} seconds.","result" : "fail"
            }), 429
        if attempt_info['lock_until'] and datetime.now() >= attempt_info['lock_until']:
            login_attempts[input_id] = {"attempts":0,"lock_until": None}
    try:
        # Search to username column in User table
        response = supabase.table('Users').select("*").eq("username", input_id).execute()

        if not response.data:
            return jsonify({"msg": "This ID is not exist.", "result": "fail"}),401
        
        user = response.data[0]
        
    # Compare userpassword with password column in DB
        if check_password_hash(user['password'], input_pw):
            if input_id in login_attempts:
                del login_attempts[input_id]
            return jsonify({"msg":f"welcome, {input_id}.","result": "success"}), 200
        else:
            if input_id not in login_attempts:
                login_attempts[input_id] = {"attempts": 0,"lock_until": None}
            login_attempts[input_id]["attempts"] += 1
            
            if login_attempts[input_id]["attempts"] >= MAX_RETRIES:
                login_attempts[input_id]["lock_until"] = datetime.now() + timedelta(seconds=BLOCK_TIME)
                remaining_time = BLOCK_TIME
                return jsonify({
                    "msg": f"Too many failed attempts. Locked for {BLOCK_TIME} seconds.",
                    "result": "fail"
                }), 429
            return jsonify({"msg": "Wrong password.","result": ":fail"}), 401       
    
    except Exception as e:
        print(f"Login Error: {e}")
        return jsonify({"msg": "Server Error"}), 500

        
if __name__ == '__main__':
    app.run(debug=True,port=5000)