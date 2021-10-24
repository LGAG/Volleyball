import sys
from PyQt5.QtWidgets import *
import VideoWindow
from VideoDisplay import Display

if __name__ == '__main__':
    app = QApplication(sys.argv)
    MainWindow = QMainWindow()
    ui = VideoWindow.Ui_MainWindow()
    ui.setupUi(MainWindow)
    display = Display(ui, MainWindow)
    MainWindow.show()
    sys.exit(app.exec_())
