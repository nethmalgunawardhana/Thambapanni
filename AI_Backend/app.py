from flask import Flask, request
import google.generativeai as genai
import json


def read_json_file(file_path):
    try:
        with open(file_path, 'r') as file:
            data = json.load(file)
            return data
    except FileNotFoundError:
        print(f"Error: File {file_path} not found")
        return None
    except json.JSONDecodeError:
        print(f"Error: Invalid JSON format in {file_path}")
        return None


file_path = "API.json"
data = read_json_file(file_path)
if data:
    API_KEY = data["API_KEY"]

if not API_KEY:
    print("Error: API_KEY not found in API.json")
    exit(1)

genai.configure(api_key=API_KEY)
model = genai.GenerativeModel("gemini-1.5-flash")

app = Flask(__name__)


@app.route('/')
def hello_world():  # put application's code here
    return "Server is active"


@app.route('/api', methods=["POST"])
def api():
    start = str(request.args.get("start"))
    end = str(request.args.get("end"))
    days = str(request.args.get("days"))

    promptStart = f"""Plan a trip from {start} to {end} in {days} days."""
    promptEnd = """
    Use this JSON schema:

    tripPlan = {'day 1' : {'places_List'}, 'day 2' : {'places_List'}, ...}
    Return: list[tripPlan]"""

    prompt = promptStart + "\n" + promptEnd
    result = str(model.generate_content(prompt))
    return result





if __name__ == '__main__':
    app.run()
