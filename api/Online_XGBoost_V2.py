import numpy as np
import xgboost as xgb
import pandas as pd

class SURVIVAL_PREDICTOR():
    def __init__(self):
        # 20240306 - 莊 - 模型有更新至第二版
        self.model_path = './api/model/XGBoost_Online_Model_V2.json'
        
        # 20240306 - 莊 - 有調整過特徵順序
        self.cat_feats = ['Ascites', 'PS', 'ChildPugh_class', 'Sex', 'HBV', 'HCV', 'Tumor_number', 'Tumor_distribution',
                          'Lymphonodules', 'EHS', 'MVI', 'Cirrhosis', 'DM', 'HTN', 'ESRD', 'CKD']
        
        self.treatments = ['Liver_transplantation', 'Surgical_resection', 'Radiofrequency', 'TACE', 'Target_therapy', 'Immunotherapy',
                           'HAIC', 'Radiotherapy', 'Best_support_care', 'S_T', 'R_T']
        
        self.num_feats = ['Age', 'BMI', 'Maximal_tumor_size', 'Total_bilirubin', 'GPT', 'AFP', 'INR', 'Hemoglobin',
                          'Albumin', 'Creatine', 'Platelet_count', 'ChildPugh_score']
           
        # load model
        self.model = xgb.Booster()
        self.model.load_model(self.model_path)

    # 20240306 - 莊 - 調整組合方式
    def load_my_data(self, data):

        # 將JSON數據轉換為DataFrame
        data = pd.json_normalize(data)
        
        # 提取標籤和特徵
        data[self.cat_feats] = data[self.cat_feats].astype(int)
        data[self.treatments] = int(0)
        data[self.num_feats] = data[self.num_feats].astype(float)
        features = data[self.cat_feats + self.treatments + self.num_feats]
        
        return features

    # 20240306 - 莊 - 生成所有可能的治療組合
    def generate_treatment_combinations(self, features):
        all_combinations = pd.DataFrame()
        
        for treatment in self.treatments:
            features_copy = features.copy()
            features_copy[self.treatments] = 0
            features_copy[treatment] = 1
            all_combinations = pd.concat([all_combinations, features_copy], ignore_index=True)
        
        # print(all_combinations)
        return all_combinations


    def predict_with_model(self, features):
        # 使用模型進行預測
        dtest = xgb.DMatrix(features)
        predictions = self.model.predict(dtest)
        
        return predictions

    def predict(self, data):
        features = self.load_my_data(data)
        all_combinations = self.generate_treatment_combinations(features)
        predictions = self.predict_with_model(all_combinations)

        # 20240306 - 莊 - 將每種治療的預測結果併到同一個陣列
        results = pd.DataFrame({
            'Treatment': np.repeat(self.treatments, len(features)),
            'Predicted_Time': predictions
        })
       
        # 轉換為 JSON Array 格式
        results_list = []
        
        for index, row in results.iterrows():
            results_list.append({
                'Treatment': row['Treatment'],
                'Predicted_Time': row['Predicted_Time']
            })

        print(f"Done.")
        return results_list

# if __name__ == '__main__':
#     main()

#=========================================測試=========================================#

# data = {
#     "Age": 58,
#     "BMI": 26.5625,
#     "Maximal_tumor_size": 10.1,
#     "Total_bilirubin": 1.1,
#     "GPT": 30,
#     "AFP": 196,
#     "INR": 1,
#     "Hemoglobin": 18.8,
#     "Albumin": 3.4,
#     "Creatine": 1.2,
#     "Platelet_count": 368,
#     "ChildPugh_score": 6,
#     "Ascites": 0,
#     "PS": 0,
#     "ChildPugh_class": 0,
#     "Sex": 0,
#     "HBV": 1,
#     "HCV": 0,
#     "Tumor_number": 1,
#     "Tumor_distribution": 0,
#     "Lymphonodules": 0,
#     "EHS": 0,
#     "MVI": 0,
#     "Cirrhosis": 0,
#     "DM": 0,
#     "HTN": 0,
#     "ESRD": 0,
#     "CKD": 0,
#     "Liver_transplantation": 0,
#     "Surgical_resection": 0,
#     "Radiofrequency": 0,
#     "TACE": 1,
#     "Target_therapy": 0,
#     "Immunotherapy": 0,
#     "HAIC": 0,
#     "Radiotherapy": 1,
#     "Best_support_care": 0,
#     "S_T": 0,
#     "R_T": 0
# }

# predictor = SURVIVAL_PREDICTOR()
# results = predictor.predict(data)

# print(results)

#=========================================測試=========================================#