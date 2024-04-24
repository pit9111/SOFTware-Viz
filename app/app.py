from flask import Flask, render_template
from pyArango.connection import Connection
from Utils.insert_json_db import insert_json_db

app = Flask(__name__,template_folder='templates',static_folder='static')

app.config['ARANGO_HOST'] = 'localhost'
app.config['ARANGO_PORT'] = 8529
app.config['ARANGO_DB'] = 'SOF-viz'
app.config['ARANGO_USERNAME'] = 'root'
app.config['ARANGO_PASSWORD'] = 'root'

def init_db():
    global db
    db = Connection(
        arangoURL='http://{host}:{port}'.format(
            host=app.config['ARANGO_HOST'],
            port=app.config['ARANGO_PORT']
        ),
        username=app.config['ARANGO_USERNAME'],
        password=app.config['ARANGO_PASSWORD']
    )[app.config['ARANGO_DB']]

init_db()  # Call the init_db function to initialize the db variable
insert_json_db('./app/static/json_files/from_xml', db)

from app.routes import doc, dashboard_route,reset_db,software_count_route

@app.route('/')
def hello_world():
    return render_template('partials/conteneur.html')
