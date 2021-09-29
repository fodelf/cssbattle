#!/usr/bin/python3
import cv2     # h, w, c
import numpy as np
import os
import requests
import json
path = './imgs' #待读取文件的文件夹绝对地址
pngpath = './pngs' #待读取文件的文件夹绝对地址
from html2image import Html2Image
hti = Html2Image()
hti.screenshot(other_file='80@2x.png',save_as="3.png",size=(400, 300))
# files = os.listdir(path)
# for f in files:
#     if f.endswith("png"):
#         childPath = os.path.join(pngpath,f)
#         index = f.find("@")
#         id = f[0:index]
#         imgUrl =  "https://cssbattle.oss-cn-beijing.aliyuncs.com/imgs/"+str(id)+"%402x.png"
#         hti = Html2Image()
#         htmlTmp= """
#         <!DOCTYPE html>
#         <html lang="en">
#         <head>
#             <meta charset="UTF-8" />
#             <style>
#             * {
#                 margin: 0px;
#                 }
#             </style>
#         </head>
#         <body>
#             <img src="{content}" width="400" height="300">
#         </body>
#         </html>
#         """
#         htmlTmp = htmlTmp.format(content=imgUrl)
#         hti.screenshot(html_str=htmlTmp, save_as=childPath,size=(400, 300))