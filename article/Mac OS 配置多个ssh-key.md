之前用 github 推送和拉取都很正常，最近公司团队内部搭建了一个 gitlab ，就重新配置了 ssh-key ，导致了 github 的 ssh-key 失效。可以配置多个 ssh-key 来解决这个问题，不同的git（github、gitlab）对应不同的 key 文件。

### 1、创建 对应的 ssh-key

在创建 ssh-key 的时候，我们可以指定一个别名来标识当前的 ssh-key 对应的是什么模块

```shell
ssh-keygen -t rsa -f ~/.ssh/id_rsa.别名 -C "邮箱地址" # 创建 ssh-key
# 示例：
ssh-keygen -t rsa -f ~/.ssh/id_rsa.github -C "xxx@xxx.com" # 对应的 github
ssh-keygen -t rsa -f ~/.ssh/id_rsa.gitlab -C "xxx@xxx.com" # 对应的 gitlab
```

接着，输入完命令后，会问你几个问题，一直回车即可。

回车完后，如图，会生成相对应模块的密钥（id_rsa.xxx）和公钥（id_rsa.xxx.pub）

![相对应模块的密钥（id_rsa.xxx）和公钥（id_rsa.xxx.pub）列表](https://img-blog.csdnimg.cn/2021040317580667.png)

还有一个步骤，需要把对应的公钥（id_rsa.xxx.pub）配置到 对应的平台上去，这里就不做太多的讲解了，可以查看下面对应的文章：

[GitHub如何配置SSH Key](https://blog.csdn.net/u013778905/article/details/83501204)

[windows/mac下给Gitlab配置SSH Keys](https://blog.csdn.net/weixin_44137575/article/details/108667734)

### 2、创建 config 文件

打开命令行终端，进入 .ssh 文件夹：

```shell
cd .ssh
```

查看当前文件夹下是否存在 config 文件，如果没有，创建一个。

```shell
touch config # 创建 config 文件
```

### 3、配置 config

将以下配置写入到 config 中，配置如下：

```shell
# github
Host github.com
HostName github.com
User git
IdentityFile ~/.ssh/id_rsa.github

# gitlab
Host gitlab.xxx.com
HostName gitlab.xxx.com
User git
IdentityFile ~/.ssh/id_rsa.gitlab

# 配置文件参数
# Host : Host可以看作是一个你要识别的模式，对识别的模式，进行配置对应的的主机名和ssh文件
# HostName : 要登录主机的主机名
# Port : 密钥
# User : 登录名
# IdentityFile : 密钥路径
```

Host 是别名。如果只是为了区分 github、gitlab 等，为了方便使用，建议和 HostName 一致，这样在 clone git 的时候不用考虑修改 hostname。

### 4、测试使用

配置好后，我们可以通过以下命令来测试是否配置成功：

```shell
ssh -T github.com
```

第一次会出现以下的提示，输入 yes

![ssh -T github 提示](https://img-blog.csdnimg.cn/20210403182437957.png)

如果出现以下提示，那就证明是配置成功了：

![github ssh-key 配置成功](https://img-blog.csdnimg.cn/20210403185241549.png)

但是，我在测试 gitlab 的时候，按照上面同样的方法去测试，发现不行，会一直卡在命令中，如下：

![gitlab 的 ssh -T 问题](https://img-blog.csdnimg.cn/20210403195138648.png)

然后，我试了一下拉取一个项目，发现是可以的，并且拉取也是成功的。

![gitlab 拉取成功](https://img-blog.csdnimg.cn/20210403195304687.png)



### 5、mac ssh 免密远程登录 linux

#### 5.1、mac 本地生成 rsa

输入以下命令生成本地 rsa 密钥

```shell
ssh-keygen -t rsa
```

接着，输入完命令后，会问你几个问题，一直回车即可。

#### 5.2、添加 mac 本地 ssh 配置规则

进入 .ssh 目录，添加 config 配置规则   

```shell
cd ~/.ssh
vim config
```

将以下配置写入 config 中：

```shell
# aliyun
Host						# 别名 
HostName				# 地址
Port						# 端口
User						# 用户
IdentityFile		# 秘钥
```

#### 5.3、linux 修改

复制本地生成好的公钥（id_rsa.pub），可以使用 cat 命令查看公钥内容，然后手动复制：

```shell
cat id_rsa.pub
```

![公钥内容](https://img-blog.csdnimg.cn/20210403203642954.png)

粘贴到服务器认证密钥文件中，多个公钥需要换行：

注意：需要先登录 linux 服务器

```shell
vim ~/.ssh/authorized_keys
```

#### 5.4、测试是否成功

输入一下命令，测试是否添加成功：

```shell
ssh YourHost # YourHost 别名，config 中的 Host
```



![ssh 测试成功](https://img-blog.csdnimg.cn/20210403204047360.png)

如果没有成功，提示无效或者无权限，请查看参考文档中的第二条。

### 6、参考：

https://www.jianshu.com/p/d58cc72fd674

https://zhuanlan.zhihu.com/p/112549154