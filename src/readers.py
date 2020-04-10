from pathlib import Path



class Children:
    def __call__(self, file: str) -> list:
        path = Path(file)
        if path.is_dir():
            return [str(r) for r in path.iterdir()]
        else:
            return []



class Posterity:
    def __call__(self, file: str) -> list:
        path = Path(file)
        return self._posterity(path)

    def _posterity(self, path: Path) -> list:
        _ = []
        if path.is_dir():
            for f in path.iterdir():
                _.extend(self._posterity(f))
        _.append(str(path))
        return _
