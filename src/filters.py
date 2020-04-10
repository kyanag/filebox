import os
import re


class Whitelist:
    """
    白名单
    """
    whitelist: set

    def __init__(self, whitelist: set):
        self.whitelist = whitelist

    def __call__(self, file: str) -> bool:
        return os.path.basename(file) in self.whitelist


class File:
    """
    是否是文件
    """

    def __call__(self, file: str) -> bool:
        return os.path.isfile(file)


class Dir:
    """
    是否是目录
    """

    def __call__(self, file: str) -> bool:
        return os.path.isdir(file)


class Blacklist:
    """
    黑名单
    """
    blacklist: set

    def __init__(self, blacklist: set):
        self.blacklist = blacklist

    def __call__(self, file: str) -> bool:
        return os.path.basename(file) not in self.blacklist


class Reglist:
    """
    正则规则列表
    """
    patterns: list

    def __init__(self, reglist: list):
        self.patterns = [re.compile(i) for i in reglist]

    def __call__(self, file: str) -> bool:
        for reg in self.patterns:
            if reg.match(file) is not None:
                return True
        return False
