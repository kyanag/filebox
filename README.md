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
    - [x] 获取后裔文件/目录
2. 过滤器
    - [x] 白名单
    - [x] 黑名单
    - [x] 正则列表
    - [x] 过滤文件
    - [x] 过滤目录
3. 处理器
    - [x] 删除
    - [x] 移动到
    - [ ] 重命名
    - [ ] 导出PDF/WORD图片
    - [ ] 批量加水印
    
#### TODO