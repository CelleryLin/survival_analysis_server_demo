# docker run --name test_container -p 80:80 -v ${PWD}:/code test
# docker start test_container -a

from flask import Flask, render_template, request, jsonify
import time
from Online_XGBoost_V2 import SURVIVAL_PREDICTOR
from flask_cors import CORS

app = Flask(__name__, template_folder='../build', static_folder='../build/static')
cors = CORS(app, resources={r"/api/*": {"origins": "*"}})
survival_predictor = SURVIVAL_PREDICTOR()


@app.route('/')
def index():
    return render_template('index.html')

@app.route('/api/v1/survival_predction', methods=['POST'])
def handle_json():
    if request.is_json:
        data = request.json
        res = survival_predictor.predict(data)
    print(res)
    return jsonify(res), 200


if (__name__ == "__main__"):
    # app.run(debug=True, port=5000)
    app.run(host='0.0.0.0', port=80)