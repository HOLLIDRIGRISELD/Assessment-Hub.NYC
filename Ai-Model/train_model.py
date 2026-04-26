import pandas as pd
import numpy as np
from sklearn.ensemble import RandomForestClassifier
from sklearn.model_selection import train_test_split
from sklearn.metrics import accuracy_score
import joblib
import requests
from faker import Faker

# GENERATES REALISTIC MOCK DATA AND TRAINS AI MODEL
print("1: Generating 1,000 mock financial records.")

# INITIALIZES FAKER FOR REALISTIC NAME GENERATION
fake = Faker()

# CREATES RANDOM NUMERICAL FEATURES
np.random.seed(42)
incomes = np.random.randint(30000, 150000, 1000)
credit_scores = np.random.randint(300, 850, 1000)
loan_amounts = np.random.randint(5000, 50000, 1000)

# GENERATES REALISTIC APPLICANT NAMES
names = [fake.name() for _ in range(1000)]

# ASSIGNS APPROVAL STATUS USING BUSINESS LOGIC
status_binary = []
status_text = []

for i in range(1000):
    if credit_scores[i] > 650 and (incomes[i] / loan_amounts[i] > 3):
        status_binary.append(1)
        status_text.append("Approved")
    else:
        status_binary.append(0)
        status_text.append("Denied")

# BUILDS DATAFRAME WITH ALL FEATURES AND LABELS
df = pd.DataFrame({
    'name': names,
    'annual_income': incomes,
    'credit_score': credit_scores,
    'loan_amount': loan_amounts,
    'ai_classification': status_text,
    'approved_binary': status_binary
})

# SAVES DATASET TO CSV FOR REPORT USAGE
print("2: Saving dataset for Assessment report.")
df.to_csv('assessment_2_mock_dataset.csv', index=False)
print("   -> Saved as 'assessment_2_mock_dataset.csv'")

# TRAINS RANDOM FOREST MODEL ON NUMERICAL DATA
print("3: Training the Random Forest AI.")
X = df[['annual_income', 'credit_score', 'loan_amount']]
y = df['approved_binary']

# SPLITS DATA INTO TRAIN AND TEST SETS
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

# BUILDS AND FITS MODEL
model = RandomForestClassifier(n_estimators=100, random_state=42)
model.fit(X_train, y_train)

# EVALUATES MODEL PERFORMANCE
accuracy = accuracy_score(y_test, model.predict(X_test))
print(f"Success! AI trained with an Accuracy of: {accuracy * 100:.2f}%")

# SAVES TRAINED MODEL TO FILE
joblib.dump(model, 'loan_model.pkl')
print(" AI Model saved successfully as 'loan_model.pkl'")

# SENDS MULTIPLE SAMPLE RECORDS TO BACKEND API
print("4: Injecting sample data into the Java/React Database.")

for i in range(100):
    applicant_data = {
        "name": str(df.iloc[i]['name']),
        "annualIncome": float(df.iloc[i]['annual_income']),
        "creditScore": int(df.iloc[i]['credit_score']),
        "loanAmount": float(df.iloc[i]['loan_amount']),
        "aiClassification": str(df.iloc[i]['ai_classification']),
        "status": "Historical Data"
    }

    try:
        response = requests.post('http://localhost:8080/api/applicants', json=applicant_data)

        # CONFIRMS SUCCESSFUL INSERTION INTO DATABASE
        if response.status_code == 200:
            print(f"   -> Injected: {applicant_data['name']}")

    except Exception as e:
        # HANDLES CONNECTION ERRORS WITH BACKEND SERVICE
        print(" Error: Could not reach Java API. Is Spring Boot running?")

# FINAL STATUS MESSAGE AFTER COMPLETION
print("\nAll tasks completed successfully!")