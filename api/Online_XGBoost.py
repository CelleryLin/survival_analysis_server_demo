
import numpy as np
import xgboost as xgb
import pandas as pd
import json
from sklearn.model_selection import StratifiedKFold
from sklearn.model_selection import train_test_split
from lifelines.utils import concordance_index


class SURVIVAL_PREDICTOR():
    def __init__(self):
        self.model_path = './api/model/XGBoost_Online_Model.json'
        self.cat_feats = ['Ascites', 'PS', 'ChildPugh_class', 'Sex', 'HBV', 'HCV', 'Tumor_number', 'Tumor_distribution',
                    'Lymphonodules', 'EHS', 'MVI', 'Cirrhosis',
                    'Liver_transplantation', 'Surgical_resection', 'Radiofrequency', 'TACE', 'Target_therapy', 'Immunotherapy',
                    'HAIC', 'Radiotherapy', 'Best_support_care', 'DM', 'HTN', 'ESRD', 'CKD', 'S_T', 'R_T']
        
        self.num_feats = ['Age', 'BMI', 'Maximal_tumor_size', 'Total_bilirubin', 'GPT', 'AFP', 'INR', 'Hemoglobin',
                    'Albumin', 'Creatine', 'Platelet_count', 'ChildPugh_score']
        
        # load model
        self.model = xgb.Booster()
        self.model.load_model(self.model_path)


    def load_my_data(self, data):

        # 將JSON數據轉換為DataFrame
        data = pd.json_normalize(data)
        
        # 提取標籤和特徵
        data[self.cat_feats] = data[self.cat_feats].astype(int)
        data[self.num_feats] = data[self.num_feats].astype(float)
        features = data[self.cat_feats + self.num_feats]
        
        return features

    def predict_with_model(self, features):
        
        # 使用模型進行預測
        dtest = xgb.DMatrix(features)
        predictions = self.model.predict(dtest)
        
        return predictions

    def predict(self, data):
        
        features = self.load_my_data(data)
        predictions = self.predict_with_model(features)

        # 將預測結果與真實事件時間結合
        results = {
            'Predicted_Time': float(predictions[0])
        }
        print(f"Done.")
        return results

# if __name__ == '__main__':
#     main()


