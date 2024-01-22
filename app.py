from flask import Flask, render_template, jsonify
import pandas as pd

app = Flask(__name__)
df = pd.read_csv('static/data_csv.csv')  # Load the CSV data
current_index = 0

@app.route('/')
def index():
    return render_template('index.html')

# Route to share the csv data onto Javascript in a JSON package
@app.route('/data')
def data():
    global current_index
    latest_data = df.iloc[current_index % len(df)].to_dict()
    current_index += 1
    return jsonify(latest_data)

if __name__ == '__main__':
    app.run(debug=True)