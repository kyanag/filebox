import shutil
import os
from pathlib import Path
try:
    import fitz
except:
    fitz = None



class Remove:
    def __call__(self, file: str) -> bool:
        path = Path(file)
        self._remove(path)
        return True

    def _remove(self, path: Path) -> bool:
        if path.is_dir():
            for f in path.iterdir():
                self._remove(f)
            path.rmdir()
        else:
            path.unlink()
        return True



class Move:
    dir: str

    def __init__(self, dir_path: str):
        if not os.path.isdir(dir_path):
            raise IOError("请输入文件夹")
        self.dir = dir_path

    def __call__(self, file: str) -> bool:
        if os.path.exists(file):
            shutil.move(file, self.dir)
        else:
            raise IOError("移动失败!")
        return True



class Rename:
    tpl: str
    index = 0

    def __init__(self, tpl: str):
        self.tpl = tpl

    def __call__(self, file: str) -> bool:
        newname = self._format(file)

        try:
            print("rename {} to {}".format(file, newname))
            os.rename(file, newname)
            self.index += 1
        except Exception:
            return False
        return True

    def _format(self, file) -> str:
        basename = self.tpl\
            .replace("{index}", str(self.index))\
            .replace("{ext}", os.path.splitext(file)[1])
        _ = os.path.join(os.path.dirname(file), basename)
        i = 0
        while(os.path.exists(_)):
            _ = os.path.join(os.path.dirname(file), "[{}]".format(i) + basename)
            i += 1
        return _



class PdfExportImage:

    def __init__(self):
        pass
