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


#### LIST
1. 读取器
    - [x] 手动添加文件/目录
    - [x] 获取子文件/目录
2. 过滤器
    - [ ] 白名单
    - [ ] 黑名单
    - [ ] 正则列表
    - [ ] 过滤文件
    - [ ] 过滤目录
3. 处理器
    - [ ] 删除
    - [ ] 移动到
    - [ ] 重命名
    - [ ] 导出PDF/WORD图片
    - [ ] 批量加水印
    
#### TODO