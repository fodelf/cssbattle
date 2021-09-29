#!/usr/bin/python3
import cv2     # h, w, c
import numpy as np
import os
import requests
import json
path = './imgs' #待读取文件的文件夹绝对地址
files = os.listdir(path)
def read_img(imgName):
    print(imgName)
    print("---------")
    img = cv2.imread(imgName)
    # img = cv2.resize(img, (4, 3), interpolation=cv2.INTER_LANCZOS4)
    img = cv2.cvtColor(img, cv2.COLOR_BGR2RGB)
    uniques = np.reshape(img,(-1,3))
    uniques,x2 = np.unique(uniques,axis=0,return_counts=True)
    # uniques = np.unique(uniques,axis=1)
    colors = []
    for index,RGB in enumerate(uniques):
        if x2[index] > 500:
            color = '#'
            for i in RGB:
                num = int(i)
                # 将R、G、B分别转化为16进制拼接转换并大写  hex() 函数用于将10进制整数转换成16进制，以字符串形式表示
                color += str(hex(num))[-2:].replace('x', '0').upper()
            colors.append(color)
    return colors
for f in files:
    if f.endswith("png"):
        childPath = os.path.join(path,f)
        index = f.find("@")
        id = f[0:index]
        imgUrl =  "https://cssbattle.oss-cn-beijing.aliyuncs.com/imgs/"+str(id)+"%402x.png"
        typeInt = 1
        id = int(id)
        if id in [1,2,3,4,5,6,7,8,9,10,11,12]:
            typeInt = 1
        if id in [13,14,15,16,17,18]:
            typeInt = 2
        if id >=19 and id<= 20:
            typeInt = 3
        if id >= 21 and id<= 28:
            typeInt = 4
        if id >= 29 and id<= 30:
            typeInt = 5
        if id >= 31 and id<= 32:
            typeInt = 6
        if id >= 33 and id<= 41:
            typeInt = 7
        if id >= 43 and id<= 44:
            typeInt = 8
        if id >= 45 and id<= 46:
            typeInt = 9
        if id >= 47 and id<= 52:
            typeInt = 10
        if id >= 53 and id<= 60:
            typeInt = 11
        if id >= 61 and id<= 68:
            typeInt = 12
        if id >= 69 and id<= 76:
            typeInt = 13
        if id >= 77 and id<= 80:
            typeInt = 14
        colors = read_img(childPath)
        url = 'http://localhost:9527/api/v1/img/addIMG'
        s = {'imgUrl': imgUrl, 'id': id,'colors':colors,"type":typeInt}
        print(s)
        r = requests.post(url, json=s)
        print(r.text)

