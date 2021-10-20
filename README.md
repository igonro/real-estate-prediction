# Real Estate Prediction in Madrid

[<img src="static/img/header.jpg">](https://www.kaggle.com/mirbektoktogaraev/madrid-real-estate-market)

In this personal project, I will explore Real Estate data from houses in Madrid in order to train a model and predict
properties prices.

I will also create a simple web interface in order to allow the user to predict house prices in an interactive way.

The data can be obtained from
[Madrid real estate market](https://www.kaggle.com/mirbektoktogaraev/madrid-real-estate-market)
([direct download link](https://www.kaggle.com/mirbektoktogaraev/madrid-real-estate-market/download)).

## Installation

```bash
git clone https://github.com/igonro/real-estate-prediction.git
cd real-estate-prediction
conda env create -f conda.yaml
conda activate real_estate
```

## Usage

You must have your conda environment activated.

### Run notebooks:

-   Execute `jupyter-lab`.
-   Access the Jupyter server on the browser.
-   Click `Run` > `Run All Cells`.

### Run website:

-   Execute `python app.py`.
-   Access the Flask server on the browser: http://localhost:5000.
