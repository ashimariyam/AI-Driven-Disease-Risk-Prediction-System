import pandas as pd
import numpy as np
import os
import logging
from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestClassifier
from sklearn.metrics import accuracy_score, classification_report, confusion_matrix
import joblib
import matplotlib.pyplot as plt
import seaborn as sns

# Set up logging (so that output is printed to the console)
logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)

# (1) Load the diabetes dataset (enhanced_diabetes_dataset.xlsx) (using pandas)
dataset_path = os.path.join(os.path.dirname(os.path.dirname(__file__)), "enhanced_diabetes_dataset.xlsx")
if not os.path.isfile(dataset_path):
    logger.error("Dataset (enhanced_diabetes_dataset.xlsx) not found.")
    exit(1)
df = pd.read_excel(dataset_path)
logger.info("Dataset (enhanced_diabetes_dataset.xlsx) loaded. Shape: {0}".format(df.shape))

# (2) Preprocess the data (handle missing values if any) (using pandas fillna) (numeric columns filled with mean, non-numeric (categorical) columns one-hot encoded)
df_numeric = df.select_dtypes(include=[np.number])
df_non_numeric = df.select_dtypes(exclude=[np.number])
df_numeric = df_numeric.fillna(df_numeric.mean())
df_non_numeric_encoded = pd.get_dummies(df_non_numeric, drop_first=False)
df = pd.concat([df_numeric, df_non_numeric_encoded], axis=1)
logger.info("Preprocessing (missing values filled (numeric columns filled with mean) and non-numeric (categorical) columns one-hot encoded) completed.")

# (3) Split the data into features (X) and labels (y) (label is 'Outcome')
X = df.drop("Outcome", axis=1)
y = df["Outcome"]
logger.info("Data split into features (X) and labels (y) (label is 'Outcome').")

# (4) Train a RandomForestClassifier (using sklearn)
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)
model = RandomForestClassifier(n_estimators=100, random_state=42)
model.fit(X_train, y_train)
logger.info("Model (RandomForestClassifier) trained.")

# (5) Save the trained model (model.pkl) (using joblib)
model_path = os.path.join(os.path.dirname(__file__), "model.pkl")
joblib.dump(model, model_path)
logger.info("Model saved as 'model.pkl'.")

# (6) Evaluate the model (accuracy score and classification report)
y_pred = model.predict(X_test)
accuracy = accuracy_score(y_test, y_pred)
logger.info("Accuracy (on test set): {0:.4f}".format(accuracy))
logger.info("\nClassification Report (on test set):\n{0}".format(classification_report(y_test, y_pred)))

# Compute and print confusion matrix (on test set)
cm = confusion_matrix(y_test, y_pred)
logger.info("\nConfusion Matrix (on test set):\n{0}".format(cm))

# (Optional) Plot the confusion matrix (using matplotlib and seaborn)
plt.figure(figsize=(6, 5))
sns.heatmap(cm, annot=True, fmt='d', cmap='Blues', xticklabels=['No Diabetes', 'Diabetes'], yticklabels=['No Diabetes', 'Diabetes'])
plt.xlabel('Predicted')
plt.ylabel('Actual')
plt.title('Confusion Matrix - Diabetes Model (Test Set)')
plt.tight_layout()
plt.show()

# (7) Load the model (model.pkl) (using joblib) and predict using one random sample row
loaded_model = joblib.load(model_path)
sample_row = df.sample(n=1, random_state=42).drop("Outcome", axis=1)
logger.info("Random sample (input) (from enhanced_diabetes_dataset.xlsx) (excluding Outcome):\n{0}".format(sample_row))

# (8) Print the sample input, actual output, and predicted output in the console
actual = df.loc[sample_row.index, "Outcome"].values[0]
predicted = loaded_model.predict(sample_row)[0]
logger.info("Actual (from dataset) (Outcome (0=no diabetes, 1=diabetes)): {0}".format(actual))
logger.info("Prediction (using model) (predicted (0=no diabetes, 1=diabetes)): {0}".format(predicted))


logger.info("✅ Model training and prediction test completed.") 