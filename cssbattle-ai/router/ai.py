'''
Description: 
version: 1.0.0
Author: 吴文周
Date: 2021-09-06 11:45:04
LastEditors: 吴文周
LastEditTime: 2021-09-28 13:03:24
'''
'''
Description: 
version: 1.0.0
Author: 吴文周
Date: 2021-09-05 15:33:29
LastEditors: 吴文周
LastEditTime: 2021-09-06 11:44:42
'''
#!/usr/bin/python3
from typing import Match
# import imgkit
from string import Template
import time
import os
import random
from router.common import *
from router.image import *
ai = Blueprint('ai', __name__)
import sys
from html2image import Html2Image
# import cv2     # h, w, c
import numpy as np
sys.path.append('..')
def getColor(img):
    uniques = np.reshape(img,(-1,3))
    uniques,x2 = np.unique(uniques,axis=0,return_counts=True)
    print(uniques)
    # uniques = np.unique(uniques,axis=1)
    # colors = []
    # for index,RGB in enumerate(uniques):
    #     if x2[index] > 500:
    #         color = '#'
    #         for i in RGB:
    #             num = int(i)
    #             # 将R、G、B分别转化为16进制拼接转换并大写  hex() 函数用于将10进制整数转换成16进制，以字符串形式表示
    #             color += str(hex(num))[-2:].replace('x', '0').upper()
    #         colors.append(color)
    # return colors
def runIMGCompareFun(para1, para2):
    img1 = cv2.imread(para1)
    # print(img1)
    # print("-----------")
    # img1 = cv2.cvtColor(img1, cv2.COLOR_BGR2RGB)
    img1 = cv2.resize(img1, (400, 300))
    # print(img1)
    img2 = cv2.imread(para2)
    # img2 = cv2.cvtColor(img2, cv2.COLOR_BGR2RGB)
    img2 = cv2.resize(img2, (400, 300))
    # img1 = cv2.cvtColor(img1, cv2.COLOR_BGR2RGB)
    # print(img1)
    # print("-----------")
    # getColor(img1)
    # print("-----------")
    # getColor(img2)
    # print("-----------")
    # print("-----------")
    # img2 = cv2.cvtColor(img2, cv2.COLOR_BGR2RGB)
    # print(img2)
    # arr = np.isclose(img1,img2)
    arr = img1 == img2
    # print("-----------")
    # print(arr)
    scale = np.average(arr)
    # print(scale)
    return scale
# 查询训练趋势数据
@ai.route('/compare',methods=['POST'])
def compare():
    hti = Html2Image(custom_flags=['--force-color-profile=SRGB','--disable-gpu'])
    # hti = Html2Image(custom_flags=['--force-color-profile=sRGB','--disable-gpu', '--disable-software-rasterizer'])
    # hti = Html2Image(custom_flags=['--virtual-time-budget=10000','--hide-scrollbars','--disable-gpu','--headless','--window-size=400,300'])
    # hti = Html2Image()
    data = request_parse(request)
    htmlCode = data['code']
    imgId = data['id']
    scale = data['scale']
    imgName = str(imgId) + '@2x.png'
    imgPath = os.path.join(os.path.abspath(os.path.join(os.getcwd())),"imgs",imgName)
    # print(data)
    # codeArray = htmlCode.split("<style>")
    # content = codeArray[0]
    # style = ""
    # if codeArray[1]:
    #     style = codeArray[1].split("</style>")[0]
    # imgUrl =  "https://cssbattle.oss-cn-beijing.aliyuncs.com/imgs/"+str(imgId)+"%402x.png"
    # htmlTmp= '<style>*{margin: 0px;}</style><img src="'+imgUrl + '"width="400" height="300">'
    # print(htmlTmp)
    # htmlTmp = htmlTmp.format(content=imgUrl)
    timestamp = int(time.time())
    randomStr = ''.join(random.sample('zyxwvutsrqponmlkjihgfedcba',5)) 
    # css = str(timestamp) + randomStr + ".css"
    html = str(timestamp)+ randomStr + ".html"
    png =  str(timestamp)+ randomStr + ".png"
    # imgName = str(timestamp)+ randomStr + imgName
    # html = htmlTmp
    # css = style
    # css = 'html{height:100%;};body{height:100%;}'
    htmlTmp= """
        <html style="height:100%;">
            <head>
            </head>
           <body style="height:100%;">
           {content}
           </body>
        </html>
    """
    htmlTmp = htmlTmp.format(content=htmlCode)
    print(htmlTmp)
    # if not os.path.exists(imgName):
    # img = cv2.imread(imgPath)
    # img = cv2.cvtColor(img, cv2.COLOR_RGB2BGR)
    # cv2.imwrite("5.png", img)
    hti.screenshot(html_str=htmlTmp,save_as=png,size=(400, 300))
    imgName = "./pngs/" + imgName
    if not os.path.exists(imgName):
        oriImg = cv2.imread(imgPath,cv2.COLOR_BGR2RGB) # B,G,R order
        cv2.imwrite(imgName, oriImg)
    # f = open(css,"w")
    # f.write(style)
    # f.close()
    # hf = open(html, "w")
    # hf.write(htmlTmp)
    # hf.close()
    # hti.screenshot(html_file=html,save_as=png,size=(400, 300))
    # options = {
    #     'width': 400,
    #     'height': 300,
    #     'encoding': 'UTF-8',
    # }
    # path_wk = r'/data/wkhtmltox.rpm'
    # if os.path.exists(path_wk):
    #   config = imgkit.config(wkhtmltoimage=path_wk)
    #   imgkit.from_file(html, output_path =png,options=options,css=css,config=config)
    #   print("文件存在")
    # else:
    # imgkit.from_file(html, output_path =png,options=options,css=css)
    # hti.screenshot(
    # html_file=html, css_file=css,
    # save_as=png
    # )
    print(png)
    # print("文件不存在")
    score = runIMGCompareFun(imgName,png)
    result = {
      "score":float(score)*(90 +  10* float(scale)),
      "match": float(score)
    }
    print(result)
    # os.remove(css)  
    # os.remove(html) 
    os.remove(png)
    # os.remove(imgName)
    return jsonify(result)   
