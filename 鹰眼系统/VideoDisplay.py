import cv2
import threading
from PyQt5.QtCore import QFile
from PyQt5.QtWidgets import QFileDialog, QMessageBox
from PyQt5.QtGui import QImage, QPixmap
import time
import os


class Display:
    def __init__(self, ui, mainWnd):
        self.ui = ui
        self.mainWnd = mainWnd
        # 默认视频源为相机
        self.ui.radioButtonCam.setChecked(True)
        self.isCamera = True
        self.a = 0
        self.b = 0
        # 信号槽设置
        ui.Open.clicked.connect(self.Open)
        ui.Close.clicked.connect(self.Close)
        ui.radioButtonCam.clicked.connect(self.radioButtonCam)
        ui.radioButtonFile.clicked.connect(self.radioButtonFile)
        ui.First.clicked.connect(self.suspend_continue)

        # 创建一个关闭事件并设为未触发
        self.continueEvent1 = threading.Event()
        self.continueEvent1.clear()

        self.stopEvent = threading.Event()
        self.stopEvent.clear()

    def radioButtonCam(self):
        if self.a == 0:
            self.isCamera = True

    def suspend_continue(self):
        self.continueEvent1.set()

    def radioButtonFile(self):
        if self.a == 0:
            self.isCamera = False

    # def pause(self):
    #     self.__flag.clear()  # 设置为False, 让线程阻塞
    #     print("pause")
    #
    # def resume(self):
    #     self.__flag.set()  # 设置为True, 让线程停止阻塞
    #     print("resume")

    def Open(self):
        self.fileName = ""
        if not self.isCamera:
            self.fileName, self.fileType = QFileDialog.getOpenFileName(self.mainWnd, 'Choose file', '',
                                                                       "MP4Files(*.mp4);;AVI Files(*.avi)")
            self.cap = cv2.VideoCapture(self.fileName)
            self.frameRate = self.cap.get(cv2.CAP_PROP_FPS)
        else:
            # 下面两种rtsp格式都是支持的
            #  cap = cv2.VideoCapture("rtsp://admin:Supcon1304@172.20.1.126/main/Channels/1")
            self.a = 1
            self.cap = cv2.VideoCapture(0)

        # 创建视频显示线程
        if (self.fileName != "") or (self.a == 1):
            th = threading.Thread(target=self.Display)
            th.start()

    def Close(self):
        # 关闭事件设为触发，关闭视频播放
        self.a = 0
        self.stopEvent.set()

    def Display(self):
        self.ui.Open.setEnabled(False)
        self.ui.Close.setEnabled(True)
        self.ui.First.setEnabled(True)

        while self.cap.isOpened() and True:
            success, frame = self.cap.read()
            # RGB转BGR
            print(success)
            if success == False:
                print("play finished")  # 判断本地文件播放完毕
                break
            frame = cv2.cvtColor(frame, cv2.COLOR_RGB2BGR)

            img = QImage(frame.data, frame.shape[1], frame.shape[0], QImage.Format_RGB888)
            self.ui.DispalyLabel.setPixmap(QPixmap.fromImage(img))
            self.ui.DispalyLabel.setScaledContents(True)

            if self.isCamera:
                cv2.waitKey(1)
            else:
                cv2.waitKey(int(1000 / self.frameRate))
            # 判断关闭事件是否已触发

            if True == self.continueEvent1.is_set():
                self.continueEvent1.clear()
                self.b = 1
                while self.b == 1:
                    if True == self.continueEvent1.is_set():
                        self.continueEvent1.clear()
                        self.b = 0
            if True == self.stopEvent.is_set():
                # 关闭事件置为未触发，清空显示label
                break
        self.cap.release()
        self.stopEvent.clear()
        self.ui.DispalyLabel.clear()
        self.ui.Close.setEnabled(False)
        self.ui.Open.setEnabled(True)
        self.ui.DispalyLabel.setText("LGAG")
