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

    return filter(__, files)


class M:
    v: V
    params: dict
    def init(self, v):
        self.v = v

    def setup(self, files: list, params: dict):
        self.files = files
        self.params = params

    def merge(self, files):
        for file in files:
            _ = [os.path.basename(file), file]
            self.v.tv.insert("", "end", values=_)

    @property
    def files(self):
        items = self.v.tv.get_children()
        return [self.v.tv.item(item)['values'][1] for item in items]

    @files.setter
    def files(self, files):
        self.clear()
        files = list_unique(files)
        for file in files:
            _ = [os.path.basename(file), os.path.normcase(file)]
            self.v.tv.insert("", "end", values=_)

    def clear(self):
        for item in self.v.tv.get_children():
            self.v.tv.delete(item)

class C:
    m: M
    def init(self, m):
        self.m = m

    def setup(self):
        pass

    def addfile(self, file: str):
        self.m.merge([file])

    def setparam(self, name, value):
        self.m.params[name] = value

    def getparam(self, name):
        return self.m.params[name]

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
