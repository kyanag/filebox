# coding=utf-8

from v import *
from Config import config



def list_unique(files):
    _ = set()
    def __(file):
        if file in _:
            return False
        else:
            _.add(file)
            return True

    return list(filter(__, files))


class M:
    v: V
    params: dict
    _files: list
    def init(self, v):
        self.v = v

    def setup(self, files: list, params: dict):
        self.files = files
        self.params = params
        self._filechanged()

    def merge(self, files):
        self._files.extend(files)
        self._filechanged()

    def remove(self, files):
        for file in files:
            self._files.remove(file)
        self._filechanged()


    @property
    def files(self):
        return self._files

    @files.setter
    def files(self, files: list):
        files = list_unique(files)
        self._files = files

        self._filechanged()


    def _filechanged(self):
        # 同步到 treeview

        for item in self.v.tv.get_children():
            self.v.tv.delete(item)

        for file in self._files:
            _ = [os.path.basename(file), file]
            self.v.tv.insert("", "end", values=_)

        # 同步 treeview 左下角状态
        self.v.treeview_label.config({
            "text": "共{}项 {}个文件 {}个目录".format(
                len(self._files),
                len(list(filter(os.path.isfile, self._files))),
                len(list(filter(os.path.isdir, self._files)))
            )
        })



class C:
    m: M
    def init(self, m):
        self.m = m

    def setup(self):
        pass

    def removefiles(self, files: list):
        self.m.remove(files)

    def addfile(self, file: str):
        self.m.merge([file])

    def setparam(self, name, value):
        self.m.params[name] = value

    def getparam(self, name):
        return self.m.params[name]

    def setfiles(self, files):
        self.m.files = files

    def getfiles(self, files):
        return self.m.files

    def reader(self, handle):
        files = self.m.files
        _ = []
        for file in files:
            _.extend(handle(file))
        # files.extend(_)
        files = _
        self.m.files = files

    def filter(self, handle):
        self.m.files = filter(handle, self.m.files)

    def process(self, handle):
        successes = []
        error = []

        def act(f):
            try:
                return handle(f)
            except IOError:
                return False

        for file in self.m.files:
            try:
                if act(file):
                    successes.append(file)
                else:
                    error.append(file)
            except Exception:
                break

        self.m.files = error
        return successes



class App:
    v: V
    m: M

    def init(self):
        self.m = M()
        self.v = V()
        self.c = C()

        self.m.init(self.v)
        self.v.init(self.c)
        self.c.init(self.m)


    def setup(self):
        self.m.setup([], {})
        self.v.setup()
        self.c.setup()

    def run(self):
        self.v.window.mainloop()


if __name__ == '__main__':
    app = App()
    app.init()
    app.setup()
    app.run()
