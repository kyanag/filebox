# 文件批量操作工具 #

文件批量操作分解开就是`读取` `筛选` 然后`处理`, 函数原型如下:

1. 读取器
    ```c#
    List<string> Reader(string file)
    ```
2. 过滤器
    ```c#
    bool Filter(string file)
    ```
3. 处理器
    ```c#
    bool Handler(string file)
    ```

- [x] 基本成型
- [ ] 界面优化
- [ ] 功能新增