import pandas as pd
import joblib
import os
import logging
from sklearn.metrics import confusion_matrix
import matplotlib.pyplot as plt
import seaborn as sns

# Set up logging (so that output is printed to the console)
logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)

# (1) Load the trained heart disease model (model.pkl) (using joblib)
model_path = os.path.join(os.path.dirname(__file__), "model.pkl")
if not os.path.isfile(model_path):
    logger.error("Model file (model.pkl) not found. Please train the model first (e.g. run train_heart_model.py).")
    exit(1)
pipeline = joblib.load(model_path)
logger.info("Heart disease model (pipeline) loaded from model.pkl.")

# (2) Load the dataset (heart.xlsx) (using pandas)
dataset_path = os.path.join(os.path.dirname(os.path.dirname(__file__)), "heart.xlsx")
if not os.path.isfile(dataset_path):
    logger.error("Dataset (heart.xlsx) not found.")
    exit(1)
df = pd.read_excel(dataset_path)
logger.info("Dataset (heart.xlsx) loaded. Shape: {0}".format(df.shape))

# (3) Take a random row (or sample input) (using pandas sample)
sample_row = df.sample(n=1, random_state=42).drop("target", axis=1)
logger.info("Random sample (input) (from heart.xlsx) (excluding target):\n{0}".format(sample_row))

# (4) Run a prediction using the model (pipeline) (using predict_proba)
prediction_proba = pipeline.predict_proba(sample_row)[0]
predicted_class = pipeline.predict(sample_row)[0]
logger.info("Prediction (using model) (predicted class (0=no disease, 1=disease)): {0}".format(predicted_class))
logger.info("Prediction (using model) (prediction probability (for class 1)): {0:.2f}".format(prediction_proba[1]))

# (5) Print (actual and predicted) result (using the random row's "target" value)
actual = df.loc[sample_row.index, "target"].values[0]
logger.info("Actual (from dataset) (target (0=no disease, 1=disease)): {0}".format(actual))
logger.info("Prediction (using model) (predicted (0=no disease, 1=disease)): {0}".format(predicted_class))

# (NEW) Compute and print confusion matrix for the entire dataset
X_all = df.drop("target", axis=1)
y_true = df["target"]
y_pred = pipeline.predict(X_all)
cm = confusion_matrix(y_true, y_pred)
logger.info("\nConfusion Matrix (on entire dataset):\n{0}".format(cm))

# Plot the confusion matrix
plt.figure(figsize=(6, 5))
sns.heatmap(cm, annot=True, fmt='d', cmap='Blues', xticklabels=['No Disease', 'Disease'], yticklabels=['No Disease', 'Disease'])
plt.xlabel('Predicted')
plt.ylabel('Actual')
plt.title('Confusion Matrix - Heart Disease Model')
plt.tight_layout()
plt.show()

# (6) (Ensure all required libraries are imported (pandas, joblib, os, logging) (already done above))

# (7) (Display results in the output console (using logging (already done above)))

# (8) (Print "Model training and prediction test completed" at the end)
logger.info("Model training and prediction test completed.") 