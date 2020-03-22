# wr_marker
获取微信读书笔记的小工具。
A node.js tool to get bookmarks from weread。

## About
参考 [arry-lee/wereader](https://github.com/arry-lee/wereader) 的微信读书爬虫实现的 node.js 版本的小工具，可直接在命令行执行。

想从微信读书复制笔记到印象笔记，结果受剪贴板长度限制每次都失败，耐着性子一点点粘贴结果格式又乱套了 : )   后来搜到了 arry-lee/wereader，因为刚好在学 node.js 就对着文档＋各种谷歌写了这个小工具。 至今还没搞明白 commander 是怎么用的。 

好奇微信读书的 api 是在哪里找到的，欢迎告知。以及欢迎提issue～

## 如何使用
### 安装
```shell
# 克隆项目
git clone git@github.com:yixin-zzz/wr_marker.git

# 安装依赖
npm install
```

### 配置文件 config.json

| 属性 | 类型 | 默认值 | 是否必填 |
|:---- |:----:|:-------:|:--------:|
| cookie | String | `-` | 是 |
| bestBookMarkFolder | 热门划线读书笔记文件的文件夹 | `./sample/bestbookmark` | 否 |
| bookMarkFolder | 个人划线读书笔记文件的文件夹 | `./sample/bookmark` | 否 |
| chapterPrefix | 章节的前缀 | `◆ ` | 否 |
| markPrefix | 单条笔记的前缀 | `>> ` | 否 |
| showMarkCreatedTime | 是否展示笔记记录的时间，以章为单位，取最后一条笔记的时间，个人划线有效 | `true` | 否 |

获取 cookie 的方法：
1. 浏览器打开 https://x.weread.qq.com
2. 微信扫码登录 确认，提示没有权限忽略即可
3. F12 获取 cookie 字符串拷贝到 config.json 中 cookie 对应的位置
4. cookie 一段时间就会失效 必须重新登录获取


### 功能介绍
配置完成并保存之后在根目录（wr_marker）下执行：
```shell
# 运行工具
npm run marker
```

就可以看到如下界面，目前主要是三个功能：
```shell
? 选择操作:  (Use arrow keys)
❯ 获取书架列表 
  获取书本个人划线 
  获取书本热门划线 
```

#### 获取书架列表 
获取书架列表会直接获取当前用户（cookie中获取）书架上的书，以列表形式列出：id, 书名及作者。

#### 获取书本个人划线
```shell
? 选择操作:  获取书本个人划线
? 请输入书本的id:  
```
需要继续输入书籍的 id （也就是书架列表的第一列的数据），目前不支持批量操作。
相关内容会按格式写入到 config.json 中 `${bookMarkFolder}\${bookTitle}.txt` 中。

#### 获取书本热门划线 
```shell
? 选择操作:  获取书本热门划线
? 请输入书本的id:  
```
同理，需要继续输入书籍的 id ，目前不支持批量操作。
相关内容会按格式写入到 config.json 中 `${bestBookMarkFolder}\${bookTitle}.txt` 中。

如果操作成功会提示，可以选择继续操作(y) 或者退出(N): 
```shell
读书笔记已存入: ./sample/bookmark/xxxx.txt
? 是否继续操作:  (y/N)  
```

### 输出格式
按默认设置的话是会生成这样的一个文本（实在是懒得截图：
```
古龙文集：楚留香新传（3）桃花传奇 - 古龙
◆ 月下水，水中月 --2019.3.12 18:51

>> 若没有经过考验和比较，又怎么知道什么才是真正的快乐？”

◆ 玉人何处 --2019.3.12 19:30

>> 因为人生本已如此短促，相聚又能有多长？别离又能有多长？ 既然来也匆匆，既然去也匆匆，又何必看得那么严重？ 但现在，他已知道错了。

>> 有的人与人之间，就像是流星一般，纵然是一瞬间的相遇，也会迸发出令人炫目的火花。 火花虽然有熄灭的时候，但在蓦然间造成的影响和震动，却是永远难以忘记的，有时那甚至可以令你终生痛苦。 有时那甚至可以毁了你。
```

也可以自己实现markdown类型的生成。文件的生成的相关方法见 lib/parse.js 中的 `writeToString` 等等。

## 后续
计划是想写一个简单的搜索但是实在是找不到相关api。
接下来打算写一个 [markdown to XMind](https://github.com/yixin-zzz/md-to-xmind) 的小工具顺便学习使用一下 SDK。