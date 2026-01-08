from flask import Flask, request, jsonify
from flask_cors import CORS
from werkzeug.security import generate_password_hash, check_password_hash
from db_client import supabase

app = Flask(__name__)
CORS(app)

# [API] Register
@app.route('/api/register', methods=['POST'])
def register():
    data = request.get_json()
    user_id = data.get("userid") # id from frontend
    user_pw = data.get("userpw") # pw from frontend
    
    if not user_id or not user_pw:
        return jsonify({"msg": "Please Enter your ID or Password"})
    
    hashed_pw = generate_password_hash(user_pw)
    
    try:
        response = supabase.table('Users').insert({
            "username": user_id,
            "password": hashed_pw
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
    
    try:
        # Search to username column in User table
        response = supabase.table('Users').select("*").eq("username", input_id).execute()

        if not response.data:
            return jsonify({"msg": "This ID is not exist.", "result": "fail"}),401
        
        user = response.data[0]
        
    # Compare userpassword with password column in DB
        if check_password_hash(user['password'], input_pw):
            return jsonify({"msg":f"welcome, {input_id}.","result": "success"}), 200
        else:
            return jsonify({"msg": "Wrong password.","result": ":fail"}), 401       
    
    except Exception as e:
        print(f"Login Error: {e}")
        return jsonify({"msg": "Server Error"}), 500

        
if __name__ == '__main__':
    app.run(debug=True,port=5000)