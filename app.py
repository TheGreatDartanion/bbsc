#!/usr/bin/env python
# coding: utf-8

# ## Import Dependencies
#
# Dependencies are libraries that help extend the functionality of core Python.

# In[1]:


from sqlalchemy import create_engine
import pymysql
import pandas as pd
import flask
import os
import gspread
from oauth2client.service_account import ServiceAccountCredentials

from flask import Flask, render_template, jsonify
from flask_sqlalchemy import SQLAlchemy
#from flask_cors import CORS, cross_origin


pymysql.install_as_MySQLdb()


# ## Import config variables
#
# The `is_heroku` variable checks to see if this code has been deployed to Heroku. If not, then read in the credentials from the `config.py` file.

# In[2]:


# Heroku Check
is_heroku = False
if 'IS_HEROKU' in os.environ:
    is_heroku = True

if is_heroku == True:
    remote_db_host = os.environ.get('remote_db_host')
    remote_db_port = os.environ.get('remote_db_port')
    remote_db_user = os.environ.get('remote_db_user')
    remote_db_pwd = os.environ.get('remote_db_pwd')
    remote_db_name = os.environ.get('remote_db_name')
else:
    from config import remote_db_host, remote_db_port, remote_db_user, remote_db_pwd, remote_db_name


# ## Instantiate Flask
#
# Flask is the framework that helps serve up your site via the web.
#
# There is a bunch of documentation on it, but you can start here: https://flask.palletsprojects.com/en/1.1.x/

# In[3]:


app = Flask(__name__)
#cors = CORS(app)
#app.config['CORS_HEADERS'] = 'Content-Type'


# ## Create Database Connection
#
# This uses the config variables that were created earlier.

# In[4]:


engine = create_engine(f'mysql://{remote_db_user}:{remote_db_pwd}@{remote_db_host}:{remote_db_port}/{remote_db_name}')

scope = ['https://www.googleapis.com/auth/drive']
creds = ServiceAccountCredentials.from_json_keyfile_name('Prototypes-95d74ca67e5d.json',scope)
client = gspread.authorize(creds)

sheet = client.open('COVID-VA-Locality-Sheet').worksheet("Locality Decisions")
data_json = sheet.get_all_records()
data_df = pd.DataFrame(data_json)


# ## Create a Default Route
#
# The default route is defined at the root level. You will get this endpoint when you pull up your site by default.
#
# For example, on the localhost, you will get this route if you enter `http://localhost:5000'`
#
# Port `5000` is the default port for Flask.

# In[5]:

#@cross_origin()
#def helloWorld():
#  return "Hello, cross-origin-world!"

@app.route('/')
def index():
    # conn = engine.connect()

    # data_df = pd.read_sql('SELECT * FROM VA_Report_Summary', conn)

    # data_json = data_df.to_json(orient='records')

    last_update = client.open('COVID-VA-Locality-Sheet').worksheet("Last Update Message")
    last_update_message = last_update.acell('A2').value
    last_update_message

    return render_template('index.html', last_update_message = last_update_message)


# ## Create a Route for the data
#
# This one is named `api/data/ksa`. The idea here is to indicate that data will be served up through an API. Technically, routes can be named whatever you'd like.

# In[6]:


@app.route('/api/data/municipality-decision-report')
def get_data():
    # establish a connection to your database
    # conn = engine.connect()

    # query and load it into your DataFrame
    # data_df = pd.read_sql('SELECT * FROM VA_Report_Summary ORDER BY Municipality_Type,Municipality_Name,Service_Category,Service', conn)

    sheet = client.open('COVID-VA-Locality-Sheet').worksheet("Locality Decisions")
    data_json = sheet.get_all_records()
    data_df = pd.DataFrame(data_json)
    
    try:
        data_df.rename(columns={
                'Locality Type': 'Locality Type',
                'Locality Name': 'Locality Name',
                'Service Category':'Service Category',
                'Locality Decision':'Locality Decision',
        }, inplace=True)

        data_df['Population'] = data_df['Population'].apply(lambda pop : "{:,}".format(pop))

        data_df['Source'] = data_df['Source'].apply(lambda src : '<a target="_blank" href="{0}">{0}</a>'.format(src))

    except Exception as e:
        print(e)
        pass

    # convert your DataFrame into `json`
    data_json = data_df.to_json(orient='records')

    # conn.close()

    # return the json to the client
    return(data_json)


# In[7]:


@app.route('/api/data/municipalities')
def get_municipalities():
    # establish a connection to your database
    # conn = engine.connect()

    # query and load it into your DataFrame
    # data_df = pd.read_sql('SELECT DISTINCT Municipality_Name FROM Municipality ORDER BY Municipality_Name', conn)

    # municipalities_list = data_df['Municipality_Name'].to_list()

    # conn.close()

    sheet = client.open('COVID-VA-Locality-Sheet').worksheet("Locality Decisions")
    data_json = sheet.get_all_records()
    data_df = pd.DataFrame(data_json)

    locality_list = list(data_df['Locality Name'].unique())

    # return the list to the client
    return(jsonify(locality_list))


@app.route('/api/data/service_list')
def get_service_list():
    # establish a connection to your database
    # conn = engine.connect()

    # query and load it into your DataFrame
    # data_df = pd.read_sql('SELECT DISTINCT Service from Service ORDER BY Service', conn)

    # service_list = data_df['Service'].to_list()

    # conn.close()

    sheet = client.open('COVID-VA-Locality-Sheet').worksheet("Locality Decisions")
    data_json = sheet.get_all_records()
    data_df = pd.DataFrame(data_json)

    service_list = list(data_df['Service'].unique())

    # return the list to the client
    return(jsonify(service_list))


# ## Run the App
#
# This one is named `api/data/municipality-decision-report`. The idea here is to indicate that data will be served up through an API. Technically, routes can be named whatever you'd like.

# In[ ]:


if __name__ == '__main__':
    app.run()
