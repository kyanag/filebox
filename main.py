# coding=utf-8

from ui import *
from Config import config



class Storage:
    config: dict
    _files: list

    def __init__(self, files):
        self._files = files


class App:
    DEBUG=False
    ui: UI
    storage: Storage
    share: Share
    config: dict

    def setconf(self, key, value):
        self.config[key] = value

    def getconf(self, item):
        return self.config[item]

    def init(self):
        self.config = config
        self.share = Share()
        self.storage = Storage(self)
        self.ui = UI(app)

    def setup(self):
        self.ui.setup()
        self.share.setup(self)

    def run(self):
        self.ui.window.mainloop()


if __name__ == '__main__':
    app = App()
    app.DEBUG = True
    app.init()
    app.setup()
    app.run()
