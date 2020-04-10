import os
import unittest
import src.filters as ft
import src.readers as rd
import src.processors as pc
import tempfile




class FilterTestCase(unittest.TestCase):

    def testFile(self):
        file = tempfile.NamedTemporaryFile(delete=True)
        self.assertTrue(ft.File().__call__(file.name))

        dir = tempfile.TemporaryDirectory()
        self.assertTrue(ft.File().__call__(dir.name) == False)

        self.assertTrue(ft.File().__call__("") == False)


    def testDir(self):
        file = tempfile.NamedTemporaryFile(delete=True)
        self.assertTrue(ft.Dir().__call__(file.name) == False)

        dir = tempfile.TemporaryDirectory()
        self.assertTrue(ft.Dir().__call__(dir.name))

        self.assertTrue(ft.Dir().__call__("") == False)


    def testWhitelist(self):
        file = tempfile.NamedTemporaryFile(delete=True)
        whitelist = set((os.path.basename(file.name), ))
        self.assertTrue(ft.Whitelist(whitelist).__call__(file.name) == True)
        self.assertTrue(ft.Whitelist(whitelist).__call__("1.log") == False)

        dir = tempfile.TemporaryDirectory()
        whitelist = set((os.path.basename(dir.name),))
        self.assertTrue(ft.Whitelist(whitelist).__call__(dir.name) == True)
        self.assertTrue(ft.Whitelist(whitelist).__call__("src") == False)

        mock_whitelist = {'filename1.log', "test.log", "text."}
        self.assertTrue(ft.Whitelist(mock_whitelist).__call__("test.log") == True)
        self.assertTrue(ft.Whitelist(mock_whitelist).__call__("text.") == True)
        self.assertTrue(ft.Whitelist(mock_whitelist).__call__("myname.") == False)
        self.assertTrue(ft.Whitelist(mock_whitelist).__call__("myname.src") == False)


    def testBlacklist(self):
        mock_blacklist = {'1.log', '2.exe', '3.', '.4', '1 2.log', '1 2'}
        self.assertTrue(ft.Blacklist(mock_blacklist).__call__("1.log") == False)
        self.assertTrue(ft.Blacklist(mock_blacklist).__call__("3.") == False)
        self.assertTrue(ft.Blacklist(mock_blacklist).__call__(".4") == False)
        self.assertTrue(ft.Blacklist(mock_blacklist).__call__("1 2.log") == False)
        self.assertTrue(ft.Blacklist(mock_blacklist).__call__("1 2") == False)

        self.assertTrue(ft.Blacklist(mock_blacklist).__call__("1 3") == True)
        self.assertTrue(ft.Blacklist(mock_blacklist).__call__("1 3.log") == True)


    def testReglist(self):
        pass




class ReaderTestCase(unittest.TestCase):

    def testChildren(self):
        pass

    def testPosterity(self):
        pass




class ProcessorTestCase(unittest.TestCase):

    def testRemove(self):
        pass

    def testMove(self):
        pass

    def testRename(self):
        rename = pc.Rename("测试重命名{index}.txt")
        newname = rename._format("D:\\tools\\1 2.txt")
        self.assertTrue(newname == "D:\\tools\\测试重命名0.txt")
        print(newname)



if __name__ == '__main__':
    runner = unittest.TextTestRunner()

    suite = unittest.makeSuite(FilterTestCase, "test")
    runner.run(suite)

    suite = unittest.makeSuite(ReaderTestCase, "test")
    runner.run(suite)

    suite = unittest.makeSuite(ProcessorTestCase, "test")
    runner.run(suite)