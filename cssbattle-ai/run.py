#!/usr/bin/python
# -*- coding: UTF-8 -*-
import random
import string
import time

from flask import Flask, Response, flash, jsonify, redirect, request, url_for,render_template

from router.ai import ai
from werkzeug.exceptions import HTTPException
UPLOAD_FOLDER = 'static'
app = Flask(__name__,static_url_path='')
app.config['SECRET_KEY'] = 'tensorflow'
async_mode = None
app.register_blueprint(ai, url_prefix='/api/v1/ai')
# @app.route('/')
# @app.errorhandler(Exception)
# def handle_exception(e):
#     # pass through HTTP errors
#     if isinstance(e, HTTPException):
#         return e
#     res = {
#         'code': 500,
#         'msg': '服务端异常',
#         'data':""
#     }
#     return jsonify(res)
if __name__ == '__main__':
    app.run(host='0.0.0.0',
            debug=True,
            port='9567')

