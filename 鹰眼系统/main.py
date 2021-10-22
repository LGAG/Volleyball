# Create a window to show the image from camera
# Also consider add some control gadget
# -*- coding: utf-8 -*-
"""
Created on Thu Sep  2 15:54:25 2021

@author: 羽
"""

import cv2
import PIL.Image as Image
import os
import numpy
# 参数为0表示打开内置摄像头，参数是视频文件路径则打开视频
# 使用IP摄像头时需要保证在同一个局域网中，校园网貌似不可以使用
capture =cv2.VideoCapture(0)

# 建个窗口并命名
cv2.namedWindow("camera",1)

# 用于循环显示图片，达到显示视频的效果

pre_frame = capture.read()

while True:
    ret, frame = capture.read()
    
    cv2.imshow('camera',frame)
    
    pre_frame = frame
    
    # 不加waitkey（） 则会图片显示后窗口直接关掉
    key = cv2.waitKey(3)
    if key == 27:
        #esc键退出
        print("esc break...")
        capture.release()
        break
