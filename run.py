from flask import Flask, send_from_directory
app = Flask(__name__, static_folder='static', static_url_path='/')

@app.after_request
def add_headers(response):
    response.headers['Cross-Origin-Embedder-Policy'] = 'require-corp'
    response.headers['Cross-Origin-Opener-Policy'] = 'same-origin'
    return response

@app.route('/<path:filename>')  
def send_file(filename):  
    return send_from_directory(app.static_folder, filename)

@app.route('/')
def hello_world():
    return send_from_directory(app.static_folder, 'index.html')

if __name__ == '__main__':
	app.run(debug=True)