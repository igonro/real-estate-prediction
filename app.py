import json

import joblib
import numpy as np
from flask import Flask, jsonify, redirect, render_template, request

app = Flask(__name__)

DIST_NEIGH = None
COLS = None
BUY_MODEL = None
RENT_MODEL = None


@app.before_first_request
def init():
    global DIST_NEIGH, COLS, BUY_MODEL, RENT_MODEL
    with open("data/dist_neigh.json", "r") as f:
        DIST_NEIGH = json.load(f)
    with open("data/cols.json", "r") as f:
        COLS = json.load(f)
    BUY_MODEL = joblib.load("data/reg_buy_price.joblib")
    RENT_MODEL = joblib.load("data/reg_rent_price.joblib")


@app.route("/", methods=["GET", "POST"])
def index():
    return render_template(
        "index.html", dist_neigh=DIST_NEIGH, enumerate=enumerate
    )


@app.route("/dist-neigh")
def get_dist_neigh():
    return json.dumps(DIST_NEIGH)


@app.route("/predict", methods=["GET", "POST"])
def predict():
    if request.method == "GET":
        redirect("/")
    else:
        X = np.zeros(len(COLS), dtype=np.uint16)
        X[0] = int(request.form["area"])
        X[1] = int(request.form["rooms"])
        X[2] = int(request.form["bathrooms"])
        X[3] = int(request.form["lift"] == "true")
        X[4] = int(request.form["parking"] == "true")
        X[5] = int(request.form["exterior"] == "true")
        if request.form["floor"] != "other":
            X[COLS.index(request.form["floor"])] = 1
        if request.form["energy"] != "unknown":
            X[COLS.index(request.form["energy"])] = 1
        if request.form["type"] != "attic":
            X[COLS.index(request.form["type"])] = 1
        if request.form["neighborhood"] != "Abrantes":
            X[COLS.index(f"nbhood_{request.form['neighborhood']}")] = 1

        predictions = {
            "buy": round(BUY_MODEL.predict([X])[0]),
            "rent": round(RENT_MODEL.predict([X])[0]),
        }
        return jsonify(predictions)


if __name__ == "__main__":
    app.run(debug=True)
