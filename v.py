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

        self.viewframe = LabelFrame(window, text="预览区", height=HEIGHT)
        _frame = Frame(self.viewframe)
        _frame.pack(side="bottom", expand='yes', fill='y', pady=10)
        # 数据表格
        tv = Treeview(_frame, height=20, columns=("basename", "filename"), show="headings")
        tv.column('basename', anchor='center')
        tv.column('filename', anchor='center')
        tv.heading("basename", text="文件名")
        tv.heading("filename", text="文件路径")
        # 数据滚动条
        vbar = Scrollbar(_frame, orient=VERTICAL, command=tv.yview)
        tv.configure(yscrollcommand=vbar.set)
        tv.pack(side='left', fill=BOTH)
        vbar.pack(side='right', expand='yes', fill='y')
        self.tv = tv
        self.viewframe.pack(side='right', expand='yes', fill=BOTH, padx=10, pady=10)

        # 左边边工具区
        self.toolframe = LabelFrame(window, text="操作区", width=400, height=HEIGHT)
        self.toolframe.pack(side='left', expand='yes', fill=BOTH, ipadx=10, ipady=10, padx=10, pady=10)

        self.tv.bind("<Delete>", treeview_deletesel)
        self.tv.bind("<Control-a>", treeview_selectall)

        self.add_reader_tools()
        self.add_filter_tools()
        self.add_process_tools()

    def setup(self):
        pass

    def add_reader_tools(self):
        reader_frame = LabelFrame(self.toolframe, text="选取", height=200, width=400)
        reader_frame.propagate(0)
        self.reader_frame = reader_frame

        def onclick(evt):
            file = filedialog.askdirectory(title="添加文件目录")
            if file is not None or file != "":
                self.c.addfile(file)

        # 直接添加文件
        button_add_files = Button(reader_frame, text="添加文件")
        button_add_files.pack(anchor=N, side=LEFT, padx=10, pady=10)
        button_add_files.bind("<Button-1>", onclick)
        # 获取子文件夹
        button_get_child = Button(reader_frame, text="获取子目录以及文件夹")
        button_get_child.pack(anchor=N, side=LEFT, padx=10, pady=10)
        button_get_child.bind("<Button-1>", lambda evt: self.c.reader(Children()))
        # 获取后代文件夹
        button_get_posterity = Button(reader_frame, text="获取后代目录以及文件夹")
        button_get_posterity.bind("<Button-1>", lambda evt: self.c.reader(Posterity()))
        button_get_posterity.pack(anchor=N, side=LEFT, padx=10, pady=10)
        reader_frame.pack(side=TOP, expand='yes', fill=BOTH, ipadx=10, ipady=10, padx=10, pady=10)

        def onresize(evt):
            width = evt.width
            height = evt.height
            for index in evt.widget.children:
                widget = evt.widget.children[index]
                print(widget.winfo_rootx())
        reader_frame.bind("<Configure>", onresize)

    def add_filter_tools(self):
        filter_frame = LabelFrame(self.toolframe, text="筛选", height=200, width=400)
        filter_frame.propagate(0)
        filter_frame.pack(expand='yes', fill="x", ipadx=10, ipady=10, padx=10, pady=10)
        self.filter_frame = filter_frame

        btn_file = Button(filter_frame, text="保留文件")
        btn_file.pack(padx=10, pady=10)
        btn_file.bind("<Button-1>", lambda evt: self.c.filter(File()))

        btn_dir = Button(filter_frame, text="保留目录")
        btn_dir.pack(padx=10, pady=10)
        btn_dir.bind("<Button-1>", lambda evt: self.c.filter(Dir()))

        btn_whitelist = Button(filter_frame, text="白名单")
        btn_whitelist.pack(padx=10, pady=10)
        btn_whitelist.bind("<Button-1>", lambda evt: self.c.filter(Whitelist(self.c.getparam("whitelist"))))

        btn_blacklist = Button(filter_frame, text="黑名单")
        btn_blacklist.pack(padx=10, pady=10)
        btn_blacklist.bind("<Button-1>", lambda evt: self.c.filter(Blacklist(self.c.getparam("blacklist"))))

        btn_blacklist = Button(filter_frame, text="匹配项")
        btn_blacklist.pack(padx=10, pady=10)
        btn_blacklist.bind("<Button-1>", lambda evt: self.c.filter(Reglist(self.c.getparam("reglist"))))



    def add_process_tools(self):
        action_frame = LabelFrame(self.toolframe, text="操作", height=50, width=400)
        action_frame.propagate(0)
        action_frame.pack(expand='yes', fill="x", ipadx=10, ipady=10, padx=10, pady=10)

        btn_remove = Button(action_frame, text="删除")
        btn_remove.pack(side=LEFT, padx=10)
        btn_remove.bind("<Button-1>", lambda evt: self.c.process(Remove()))


        _temp_frame = Frame(action_frame)
        _input=Entry(_temp_frame)
        _input.bind("<KeyRelease>", lambda evt, x=_input : self.c.setparam("v.process.move_to.path", x.get()))
        _input.pack(side=LEFT)
        btn_move = Button(_temp_frame, text="移动到", width=5)
        btn_move.bind("<Button-1>", lambda evt: self.c.process(Move(self.c.getparam("v.process.move_to.path"))))
        btn_move.pack(side=LEFT)
        _temp_frame.pack(side=LEFT, padx=10)

        def _(evt):
            dir = filedialog.askdirectory()
            if dir is None or dir == '':
                messagebox.showinfo("提示", "请选择文件夹")
            else:
                self.c.process(Move(dir))

        btn_move.bind("<Button-1>", _)

    def add_debug_tools(self):
        config_button = Button(self.toolframe, text="弹出config")
        config_button.bind("<Button-1>", lambda evt: messagebox.showinfo("v.process.move_to.path", self.c.getparam("v.process.move_to.path")))
        config_button.pack()