from flask import Flask, request, jsonify
from flask_cors import CORS
import pandas as pd
import joblib

# INITIALIZES FLASK APP AND ENABLES CROSS-ORIGIN REQUESTS
app = Flask(__name__)
CORS(app)

# STARTUP MESSAGE FOR AI MICROSERVICE
print("Booting up the AI Microservice...")

# LOADS TRAINED AI MODEL INTO MEMORY
try:
    model = joblib.load('loan_model.pkl')
    print("SUCCESS: AI Brain 'loan_model.pkl' loaded and ready!")
except Exception as e:
    print(f"CRITICAL ERROR: Could not load the model. Did you run train_model.py first? Error: {e}")


# Health Check Endpoint
@app.route('/', methods=['GET'])
def health_check():
    return jsonify({
        "status": "online",
    })

# DEFINES API ENDPOINT FOR LOAN PREDICTION REQUESTS
@app.route('/api/predict', methods=['POST'])
def predict_loan():
    try:
        # RECEIVES JSON INPUT FROM CLIENT REQUEST
        data = request.json
        
        # CONVERTS INPUT DATA INTO MODEL-COMPATIBLE FORMAT
        features = pd.DataFrame([{
            'annual_income': float(data['annualIncome']),
            'credit_score': int(data['creditScore']),
            'loan_amount': float(data['loanAmount'])
        }])
        
        # GENERATES PREDICTION USING LOADED MODEL
        prediction = model.predict(features)[0]
        
        # CONVERTS NUMERICAL OUTPUT TO HUMAN-READABLE RESULT
        final_status = "Approved" if prediction == 1 else "Denied"
        
        # LOGS REQUEST DETAILS AND RESULT
        print(f"Incoming Request -> Income: {data['annualIncome']}, Score: {data['creditScore']}, Loan: {data['loanAmount']} | AI Verdict: {final_status}")
        
        # RETURNS RESULT AS JSON RESPONSE
        return jsonify({
            "status": "success",
            "aiClassification": final_status
        })
        
    except Exception as e:
        # HANDLES SERVER ERRORS AND RETURNS FAILURE RESPONSE
        print(f"Server Error: {e}")
        return jsonify({"status": "error", "message": str(e)}), 400
    

# STARTS FLASK SERVER ON SPECIFIED PORT
if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True)