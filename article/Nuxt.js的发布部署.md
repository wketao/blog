最近在玩 nuxt 重构了一下之前写的 blog，最后到部署阶段，踩了一些坑，所以来记录一下。

### 1、最简单的部署

最简单的部署就是，在本地把 nuxt.js 进行打包，运行`npm run build`，然后把打包生成后的`.nuxt`文件夹、还有 `static nuxt.config.js package.json package-lock.json` 这几个文件，丢到服务器上，然后在安装一下依赖，最后执行 `npm run start` 就好了。

### 2、使用 pm2 启动 node 服务

也可以使用 pm2 来启动应用，要使用 pm2 前要先全局安装。大体的流程和第一步是一样的，上传到服务器后，使用 pm2 的命令来启动服务。

pm2 是这样启动的: `pm2 start npm -- start`

可以这么理解，还是使用 npm 启动服务，但是这个服务交给了 pm2 来管理了。

还有一种方式，可以在项目根目录下，新建一个 json 文件，我一般都是以 `pm2.config.json` 来命名，在这个文件中写入的配置，然后把这个文件丢到服务器上，运行 `pm2 reload pm2.config.json` 这样也能启动服务。

### 3、持续集成、持续部署

上面的两种方式，其实都不是最好的。想想，每更新一次都要去手动打包、构建、传输到服务器、解压、安装依赖，重启服务。手工的事情太多了，事多了容易误事，不难但低效麻烦。

那，有没有工具可以帮我们去做这些东西啊？

答案是有的。可以使用 CI/CD 持续集成、持续部署这样的工具和服务来帮助我们做这些工作，可以提升工作效率。

上网一搜，这些工具还挺多的，比如：`Jenkins、Travis CI、Circle CI、GitLab CI、Github Actions` 等等之类的。

#### 先简单的来说说，什么是 CI/CD

CI 可以理解成，持续集成开发人员提交的代码，然后进行构建、测试。根据测试的反馈结果，来确定新旧代码是否能集成在一起。CI 的重点是：**新旧代码的测试是否可以集成在一起**

CD 可以理解成，在 CI 的基础上，将集成后的代码部署到服务器上，不需要人工参与。

这篇文章描述的还挺简单易懂的：[3 分钟了解清楚持续集成、持续交付、持续部署](https://www.cnblogs.com/jinjiangongzuoshi/p/13053972.html)

我在工作中用的比较多的还是 CD，公司里用的是 jenkins 来自动化部署的。

#### 使用 Github Actions

我这里使用了 Github Actions，使用它的目的呢好像还挺方便的，除了在国内网速比较慢，好像也没有其他不好的地方了（其实是不想去了解其他的）。

大致的流程主要是下面这样的：

![CI_CD](https://user-images.githubusercontent.com/19791710/92674550-2ad8b580-f350-11ea-81b6-7be1f54d10d0.jpg)

要是用 Github Actions 还要去申请一个 github 的 token，只需要把 repo 仓库方面的权限勾上就可以了

![image](https://user-images.githubusercontent.com/19791710/92675274-8f484480-f351-11ea-928c-460340315782.png)

然后啊，要去仓库 Settings->Secrets 模块加几个常量，分别如下：

- TOKEN 你的 github token
- HOST 服务器地址
- PORT 服务器端口
- USERNAME 服务器用户名
- PASSWORD 服务器密码

![image](https://user-images.githubusercontent.com/19791710/92676508-447bfc00-f354-11ea-8766-b02711b14204.png)

为啥要加这几个东西啊？

因为自动部署的时候会用到的，它会登录你的服务器，然后去执行一些安装、编译、打包、重启服务的一些操作。

常量加好了之后，还要在项目根目录下新建一个 `.github` 的文件夹，并且在 `.github` 文件夹里面新建一个 `workflows` 文件夹，然后新建一个 `main.yml` 的文件。

这个文件主要是用来写 github actions 工作流的，主要是以下的代码，有点多：

```yml
name: Publish And Deploy # CI/CD的名称
on:
  push:
    tags: # 主要是捕获到标签tags的推送，并且是以v开头的，就开始执行下面的任务
      - "v*"

jobs: # 工作流
  build-and-deploy:
    runs-on: ubuntu-latest
    steps: # 步骤
      # 下载源码
      - name: Checkout
        uses: actions/checkout@master

      # 打包构建
      - name: Build
        uses: actions/setup-node@master
      - run: npm install
      - run: npm run build
      - run: tar -zcvf release.tgz .nuxt static utils config.js nuxt.config.js package.json package-lock.json pm2.config.json

      # 发布 Release
      - name: Create Release
        id: create_release
        uses: actions/create-release@master
        env:
          GITHUB_TOKEN: ${{ secrets.TOKEN }} # github token
        with:
          tag_name: ${{ github.ref }}
          release_name: Release ${{ github.ref }}
          draft: false
          prerelease: false

      # 上传构建结果到 Release
      - name: Upload Release Asset
        id: upload-release-asset
        uses: actions/upload-release-asset@master
        env:
          GITHUB_TOKEN: ${{ secrets.TOKEN }}
        with:
          upload_url: ${{ steps.create_release.outputs.upload_url }}
          asset_path: ./release.tgz
          asset_name: release.tgz
          asset_content_type: application/x-tgz

      # 部署到服务器
      - name: Deploy
        uses: appleboy/ssh-action@master
        with:
          host: ${{ secrets.HOST }} # 服务器ip
          username: ${{ secrets.USERNAME }} # 服务器用户名
          password: ${{ secrets.PASSWORD }} # 服务器密码
          port: ${{ secrets.PORT }} # 服务器端口
          # 下面的 script 就是在服务器上运行的脚本
          # 1、首先先进入到一个你指定的文件夹下
          # cd /xxx/xxx
          # 2、下载github指定仓库里面最新的release包到当前文件夹
          # wget https://github.com/:username/:repos/releases/latest/download/release.tgz -O release.tgz
          # 3、解压
          # 4、安装依赖
          # 5、启动服务
          script: |
            cd /webapp/diary
            wget https://github.com/Aisen60/diary/releases/latest/download/release.tgz -O release.tgz
            tar zxvf release.tgz
            npm install --production
            pm2 reload pm2.config.json
```

代码太多了，我上传到了 gits 上了，有需要自取哈：https://gist.github.com/Aisen60/add6d4d8df20ad4d94a082995c4bcda9

然后，当需要发版的时候，打一个以“v”开头的标签 tag 推送到远程就可以了，github actions 就会检测到，就会开始工作了。

当下面的出现都变成绿色了，就表示部署成功了

![image](https://user-images.githubusercontent.com/19791710/92678014-a1c57c80-f357-11ea-9d0a-052339d7ef0b.png)

然后啊，链接你的服务器，或者，直接在浏览器输入你的项目地址，看看页面有没有出来。

但是我这里遇到一个小坑啊，我的 github actions 已经构建成功了，然后我链接我的我服务器，输入 `pm2 list`,项目也是有运行起来的，可是就是访问不了，于是我重新构建了好多次也没解决。

然后，我链接服务器，输入 curl + ip 提示拒绝访问

![image](https://user-images.githubusercontent.com/19791710/92716210-1832a080-f391-11ea-9475-3f3d4dd765f7.png)

证明，我的程序可能没起来

然后，我进入到服务器项目的路径，输入 `npm run start` 发现报错了

![image](https://user-images.githubusercontent.com/19791710/92716400-562fc480-f391-11ea-956e-bb6055d4c100.png)

提示：找不到 config 文件

突然恍然大悟，我有一些自己添加的文件没有写入到 yml 构建配置里面 然后重新部署一下，就可以了
