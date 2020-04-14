# coding=utf-8

import tkinter.messagebox as messagebox
import tkinter.filedialog as filedialog
from tkinter.dialog import *
from tkinter.ttk import *
from src.processors import *
from src.filters import *
from src.readers import *

HEIGHT = 400


def treeview_selectall(evt):
    items = evt.widget.get_children()
    evt.widget.selection_add(items)


def treeview_deletesel(evt):
    items = evt.widget.selection()
    for item in items:
        evt.widget.delete(item)


class V:
    def init(self, c):
        self.c = c

        window = Tk()
        window.title("文件批量操作工具")
        self.window = window

        # 读取栏目
        self.render_reader(window)
        self.render_filter(window)
        self.render_view(window)

        # 左边边工具区
        self.render_tools(window)

    def render_reader(self, master):
        reader_frame = LabelFrame(master, text="选取")
        self.reader_frame = reader_frame

        def onclick(evt):
            file = filedialog.askdirectory(title="添加文件目录")
            if file is not None or file != "":
                self.c.addfile(file)

        # 直接添加文件
        button_add_files = Button(reader_frame, text="添加文件")
        button_add_files.pack(side=LEFT, padx=10)
        button_add_files.bind("<Button-1>", onclick)
        # 获取子文件夹
        button_get_child = Button(reader_frame, text="获取子目录以及文件夹")
        button_get_child.pack(side=LEFT, padx=10)
        button_get_child.bind("<Button-1>", lambda evt: self.c.reader(Children()))
        # 获取后代文件夹
        button_get_posterity = Button(reader_frame, text="获取后代目录以及文件夹")
        button_get_posterity.bind("<Button-1>", lambda evt: self.c.reader(Posterity()))
        button_get_posterity.pack(side=LEFT, padx=10)
        reader_frame.pack(side=TOP, expand='yes', fill=BOTH, ipadx=10, ipady=10, padx=10, pady=10)

        def onresize(evt):
            width = evt.width
            height = evt.height
            for index in evt.widget.children:
                widget = evt.widget.children[index]

        reader_frame.bind("<Configure>", onresize)

    def render_view(self, master):
        self.viewframe = Frame(master, height=HEIGHT)
        _frame = Frame(self.viewframe)
        _frame.pack(expand='yes', fill=BOTH)
        # 数据表格
        tv = Treeview(_frame, height=10, columns=("basename", "filename", "msg"), show="headings")
        tv.column('basename', anchor=NW, width=40)
        tv.column('filename', anchor=NW, width=140)
        tv.column('msg', anchor=NW, width=140)
        tv.heading("basename", text="文件名")
        tv.heading("filename", text="文件路径")
        tv.heading("msg", text="结果")
        # 数据滚动条
        vbar = Scrollbar(_frame, orient=VERTICAL, command=tv.yview)
        tv.configure(yscrollcommand=vbar.set)
        tv.pack(side='left', expand='yes', fill=BOTH)
        vbar.pack(side='right', fill=BOTH)

        self.treeview_label = Label(self.viewframe, text="共")
        self.treeview_label.pack(side="left", fill="x")

        self.tv = tv
        self.viewframe.pack(side=TOP, expand='yes', fill=BOTH, padx=10, pady=10)

        def _(evt):
            items = evt.widget.selection()
            files = [self.tv.item(item)['values'][1] for item in items]
            self.c.removefiles(files)

        self.tv.bind("<Delete>", _)
        self.tv.bind("<Control-a>", treeview_selectall)

    def setup(self):
        # 回填文件
        # 回填其他参数
        pass

    def render_filter(self, window):
        filter_frame = LabelFrame(window, text="筛选", height=200, width=400)

        self.filter_frame = filter_frame

        btn_file = Button(filter_frame, text="保留文件")
        btn_file.pack(side=LEFT, padx=10)
        btn_file.bind("<Button-1>", lambda evt: self.c.filter(File()))

        btn_dir = Button(filter_frame, text="保留目录")
        btn_dir.pack(side=LEFT, padx=10)
        btn_dir.bind("<Button-1>", lambda evt: self.c.filter(Dir()))

        btn_whitelist = Button(filter_frame, text="白名单")
        btn_whitelist.pack(side=LEFT, padx=10)
        btn_whitelist.bind("<Button-1>", lambda evt: self.c.filter(Whitelist(self.c.getparam("whitelist"))))

        btn_blacklist = Button(filter_frame, text="黑名单")
        btn_blacklist.pack(side=LEFT, padx=10)
        btn_blacklist.bind("<Button-1>", lambda evt: self.c.filter(Blacklist(self.c.getparam("blacklist"))))

        btn_blacklist = Button(filter_frame, text="匹配项")
        btn_blacklist.pack(side=LEFT, padx=10)
        btn_blacklist.bind("<Button-1>", lambda evt: self.c.filter(Reglist(self.c.getparam("reglist"))))

        filter_frame.pack(expand='yes', fill="x", ipadx=10, ipady=10, padx=10, pady=10)

    def render_tools(self, master):
        action_frame = LabelFrame(master, text="操作", height=50, width=400)
        action_frame.pack(expand='yes', fill="x", ipadx=10, ipady=10, padx=10, pady=10)

        btn_remove = Button(action_frame, text="删除")
        btn_remove.pack(side=LEFT, padx=10)
        btn_remove.bind("<Button-1>", lambda evt: self.c.process(Remove()))


        _temp_frame = Frame(action_frame)
        _input=Entry(_temp_frame)
        _input.bind("<KeyRelease>", lambda evt, x=_input : self.c.setparam("v.process.move_to.path", x.get()))
        btn_move = Button(_temp_frame, text="移动到", width=5)
        btn_move.bind("<Button-1>", lambda evt: self.c.process(Move(self.c.getparam("v.process.move_to.path"))))
        btn_move.pack(side=LEFT)
        _input.pack(side=LEFT)
        _temp_frame.pack(side=LEFT, padx=10)

        def _(evt):
            dir = filedialog.askdirectory()
            if dir is None or dir == '':
                messagebox.showinfo("提示", "请选择文件夹")
            else:
                self.c.process(Move(dir))
        btn_move.bind("<Button-1>", _)



    def add_debug_tools(self, master):
        config_button = Button(master, text="弹出config")
        config_button.bind("<Button-1>", lambda evt: messagebox.showinfo("v.process.move_to.path", self.c.getparam("v.process.move_to.path")))
        config_button.pack()