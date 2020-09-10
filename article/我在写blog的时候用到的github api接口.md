受到了朋友的启发，用在 github issues 来写博客，在翻阅了一下朋友的 blog 看到了一些 api 接口。于是上 google 查了一下，github 官方确实有相关的 api。

### 申请 token

如果没有任何授权直接访问的话，单 IP 每小时只能有 60 次的请求。如果授权了的话，每小时可达到 5000 次的请求。

文档还介绍了，在响应头 response headers 中返回了**X-RateLimit-Limit**和**X-RateLimit-Remaining**。这 2 个字段分别代表着当前剩余的访问次数和当前每小时限次。
![image](https://user-images.githubusercontent.com/19791710/78806173-eccc1400-79f4-11ea-8fa8-b1ac5dd90921.png)

如果想要获得更多的访问次数以及更大的限次，可以申请 token 来解决。下面是我在做 blog 的时候用到的授权方式，**OAuth2 token**。

**申请 token 步骤**

1. 进入 github，个人设置页面，Personal settings。
   ![image](https://user-images.githubusercontent.com/19791710/78801670-8d1f3a00-79ef-11ea-9469-56236ced7a73.png)

2. 点击左侧菜单栏最下方，Developer settings。
   ![image](https://user-images.githubusercontent.com/19791710/78801788-ad4ef900-79ef-11ea-9495-a90ef728ccb0.png)

3. 点击个人 token，Personal access tokens
   ![image](https://user-images.githubusercontent.com/19791710/78802016-e71fff80-79ef-11ea-9522-dd0859b4ae1c.png)

4. 点击创建一个新的 toekn，Generate new token
   ![image](https://user-images.githubusercontent.com/19791710/78802123-04ed6480-79f0-11ea-96df-831f30678aa9.png)

5. 输入 github 密码，进入到创建 token 页面，输入 token 名称，勾选权限。（如果只是做 blog 的话，个人建议还是只勾选读取的权限。）
   ![image](https://user-images.githubusercontent.com/19791710/78802544-86dd8d80-79f0-11ea-8654-6115dba41725.png)

输入完 token 名称、勾选完权限后，点击 Generate token 就可以了，这样 token 就创建好了。创建成功后，一定要保存这个 token，github 默认只会给你看一次这个 token，下次打开页面或者刷新页面这个 token 就不见了。如果忘记了可以重新生成一个新的 token。

**token 的注意事项**

1. token 的权限，如果只是做 blog 的话，像我这样，建议只设置读取的权限。在勾选权限的时候会有可选的，如果你全部都勾选了，一旦这个 token 暴露了，被别人知道了，别人就可以拿这个 token 调用相关的 api 把你的所有东西都修改或者直接删掉 repo 了。

2. token 字符串不能提交到 github 仓库里面，如果你提交了，github 会把你这个 token 删掉。我试过几次，把 token 提交到 github 的 repo 上，github 就给我邮箱发了邮件，那个邮件的意思大概说是不能暴露这个 token。那请求 github api 的时候要用到这个 token，怎么办？**我的做法是，把这个 token 拆分成数组，然后使用过的时候直接拼接起来**。当然了有很多方法，主要不完全暴露就行。

**使用 token**
请求 github api 接口的时候，放在请求头上就可以了。官网是这样介绍的

![image](https://user-images.githubusercontent.com/19791710/78804313-9231b880-79f2-11ea-9c86-ed78d39a635c.png)

![image](https://user-images.githubusercontent.com/19791710/78804455-bab9b280-79f2-11ea-9aad-6e9c0f8b3a15.png)

### 我使用到的 api

1. `GET https://api.github.com/users/:username` 获取个人用户信息
2. `GET https://api.github.com/users/:username/repos` 获取当前用户所有的仓库
3. `GET https://api.github.com/repos/:username/:repos/labels` 获取某个仓库下的所有标签
4. `GET https://api.github.com/repos/:username/:repos/issues` 获取某个仓库下的所有 issues
   - `GET https://api.github.com/repos/:username/:repos/issues?state=状态` 获取 issues 状态，open 打开，close 关闭。
   - `GET https://api.github.com/repos/:username/:repos/issues?labels=标签名`获取指定标签的所有 issues。
   - `GET https://api.github.com/repos/:username/:repos/issues?page=页数&per_page=每页包含数量` 分页功能，获取指定的 issues 数量。
5. `GET https://api.github.com/repos/:username/:repos/issues/: issue_number`根据 issues 的 number 获取详情
6. `GET https://api.github.com/repos/:username/:repos/contents/:path` 获取一个原始文件的内容。我的 blog 主要是获取 md 文件的，在请求头 Request Headers 上我加上了这一句`Accept:application/vnd.github.VERSION.html`就能返回可直接渲染的 html 文本了。如果不加这句话，会返回以下的格式

```
{
    "name": "timeline.md",
    "path": "timeline.md",
    "sha": "1f45c2bf90e5362fb11c7f069ea995a398412a04",
    "size": 1709,
    "url": "https://api.github.com/repos/Aisen60/blog/contents/timeline.md?ref=master",
    "html_url": "https://github.com/Aisen60/blog/blob/master/timeline.md",
    "git_url": "https://api.github.com/repos/Aisen60/blog/git/blobs/1f45c2bf90e5362fb11c7f069ea995a398412a04",
    "download_url": "https://raw.githubusercontent.com/Aisen60/blog/master/timeline.md",
    "type": "file",
    "content": "IyDwn5K76YeM56iL56KRCgojIyMjIyAyMDIwLTA0LTA5IDAwOjAwOjAxCi0g\n5re75Yqg5LqGIFvmiJHlnKjlhplibG9n55qE5pe25YCZ55So5Yiw55qEZ2l0\naHViIGFwaeaOpeWPo++8iOayoeWGmeWujO+8iV0oaHR0cHM6Ly9naXRodWIu\nY29tL0Fpc2VuNjAvYmxvZy9pc3N1ZXMvNCkKCiMjIyMjIDIwMjAtMDQtMDcg\nMjI6NTI6MDAKCi0g5LuK5aSp5oqKdGltZWxpbmXpobXpnaLlgZrkuobvvIzl\ngZrov5nkuKp0aW1lbGluZeeahOaXtuWAme+8jOiwg+eUqGdpdGh1YueahOaO\npeWPo+S8muaKpei3qOWfn+mXrumimOeahOmUmeivr++8jOWQjuadpeWPkeeO\nsOiwg+eUqOmUmeaOpeWPo+S6hu+8jOeEtuWQjuWcqOiKseWcqOino+Wvhuea\nhOaXtumXtOS4iuavlOi+g+Wkmu+8jOWGjeWQjuadpeagueacrOWwseS4jeeU\nqOino+Wvhu+8jOWumOaWueacieaWh+aho+OAggoKLSDnlLHkuo7miJHnmoTp\nmL/ph4zkupHmnI3liqHlmajmmK/lm73lhoXnmoTvvIzorr/pl65naXRodWLl\nvojkuI3nqLPlrprvvIznhLblkI7miJHlsLHnlKjkuoZub3cuc2jmnaXpg6jn\nvbLvvIzpgJ/luqbnm7jlr7nmnaXor7Tov5jov4flvpfljrvjgIJibG9nLXZ1\nZeWcsOWdgO+8mltodHRwczovL2Fpc2VuNjAubm93LnNoXShodHRwczovL2Fp\nc2VuNjAubm93LnNoKQoKIyMjIyMgMjAyMC0wNC0wNCAyMjoxMzowMAoKLSBi\nbG9nLXZ1ZSDlgZrlrozkuobvvIzlnKjmuIXmmI7lgYfmnJ/mlL7lgYfnrKzk\nuIDlpKnvvIzmiopibG9n5Ymp5LiL55qE5Lic6KW/6YO95YGa5LqG77yM5YyF\n5ousbmdpbnjnmoTvvIzlnKjlronoo4VuZ2lueOeahOaXtuWAme+8jOi4qeS6\nhuS4gOS6m+Wdke+8jOiKseS6huWkp+amgjLkuKrlsI/ml7bnoJTnqbbkuobk\nuIvvvIznrpfmmK/op6PlhrPkuobvvIzljp/mnaXmmK/ot6/lirLnmoTpl67p\nopjvvIzlrrPmiJHph43oo4XkuoYy5qyh57O757uf44CC6L+Y6ZyA6KaB6Iqx\n5pe26Ze06Kej5Yaz5LiA5LiL77yM6LCD5LyY6Zeu6aKY77yM6L+Y5pyJYWJv\ndXQgbWXjgIF0aW1lbGluZeebruW9leayoeWBmuOAguOAgn5+YmxvZy12dWXl\nnLDlnYDvvJpbaHR0cDovL2Jsb2cuY2FpeHVzaGVuZy5jb21dKGh0dHA6Ly9i\nbG9nLmNhaXh1c2hlbmcuY29tKeOAgn5+CgojIyMjIyAyMDIwLTAzLTIzIDIz\nOjU4OjAwCgotIOWIm+W7uuS6hmJsb2ctdnVl6L+Z5Liq5LuT5bqT77yM5bm2\n5LiU5Yid5aeL5YyW5LqG6aG555uu44CC55yL5LqG5LiA5LiLZ2l0aHViIGFw\naeeahOaOpeWPo++8jOacieW/heimgeS6huino+S4gOS4i++8jOS8muWGmeS4\nquWmguS9leS9v+eUqGdpdGh1YiBhcGnnmoTlrabkuaDnrJTorrAg44CCCgoj\nIyMjIyAyMDIwLTAzLTIyIDIyOjMwOjAwCgotIOS7k+W6k+WIm+W7uuWlveS6\nhizkuYvliY3mmK/lnKhbaHR0cHM6Ly9naXRodWIuY29tL0Fpc2VuNjAvYWlz\nZW42MC5naXRodWIuaW9dKGh0dHBzOi8vZ2l0aHViLmNvbS9BaXNlbjYwL2Fp\nc2VuNjAuZ2l0aHViLmlvKeWGmeS4gOS6m+aWh+eroOaIluiAheWtpuS5oOes\nlOiusOeahO+8jOWQjuadpeWPiOWIsOS6huiHquW3seWOu+WcqOaciemBk+S6\nkeeslOiusOS4iuWGmeeslOiusO+8jOmDveaYr+S4gOS6m+mbtumbtueijuei\njueahOS4nOilv++8jOi/meWHoOWkqeS8muaAu+e7k+S4gOS6m+i/geenu+i/\nh+adpe+8jOS8sOiuoei/meS4quaciOaciOW6leS8muWHuuS4quWNmuWuoumm\nlumhte+8jOesrOS4gOeJiOaJk+eul+WFiOeUqHZ1ZeadpeWunueOsOOAggo=\n",
    "encoding": "base64",
    "_links": {
        "self": "https://api.github.com/repos/Aisen60/blog/contents/timeline.md?ref=master",
        "git": "https://api.github.com/repos/Aisen60/blog/git/blobs/1f45c2bf90e5362fb11c7f069ea995a398412a04",
        "html": "https://github.com/Aisen60/blog/blob/master/timeline.md"
    }
}
```

我一开始就是用这种`decodeURIComponent(escape(window.atob(content)));`来解密的拿到原始内容，这个 content 是通过 base64 加密的，后来查阅了一些资料和官方文档，直接在 request headers 上加上这句话`Accept:application/vnd.github.VERSION.html`就能返回可渲染的 html 内容。

7. `GET https://api.github.com/repos/:owner/:repo/issues/:number/comments` 获取指定的 issues 下的所有的评论

**还有很多 api，如果以后使用到了，会继续补充哈。**
