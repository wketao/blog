# git flow 工作流程

## 前言

虽然平时我在工作和学习当中，一直都是使用 `git flow` 规范，但是始终没有形成文档，最近在参与制订公司前端部门的一些开发规范，就把这次的工作和总结形成文档，方便日后复盘。

业界用的比较多的流程主要是：git flow、github flow、和 gitlab flow 这三种，可能有一些公司内部会有自己的 workflow 流程，比如：阿里的**[Aone Flow](https://developer.aliyun.com/article/573549)**、字节跳动的[多种工作流](https://juejin.cn/post/6875874533228838925#heading-5)。

这篇文章，主要是介绍 git flow 工作流，虽然它有一定的缺点，但是也足够满足大部分的中小厂的开发。

关于 github flow 和 gitlab flow 的介绍，请查看参考资料中的第一点和第二点。

先看看一张比较经典的图，下面是 git flow 工作流程图

![git flow](https://img-blog.csdnimg.cn/20210406150232152.png)



## 分支功能

**master**

master 主分支的代码主要是生产环境运行的代码，这分支的代码不能在任何时间任何人修改，要保持 master 分支的稳定性

**develop**

develop 分支的代码始终是项目最新的代码分支，包含了完成新功能的开发和 bug 的修改

**feature**

feature 分支的代码主要是新功能的开发，feature分支都以 develop 分支为基础创建的，分支的命名一般以feature/开头，例如：feature/module、feature/content。

**release**

release 分支的代码主要是预发布环境的代码，提交测试阶段，会以 release 分支代码为基准提测。该分支是由 develop 分支为基准进行创建，分支的命名一般以release/版本号，例如：release/1.0.0、release/1.1.0、release/1.1.1。关于版本号如何定义，请查看[版本号定义](### 开发步骤)

**hotfix**

这个分支的代码主要是解决线上的紧急 bug 的，以 master 分支为基础创建的，命名的规则可以和 feature 一样。当解决完 bug 后，需要合拼到 master 分支和 develop 分支。

## 使用场景设想（开发步骤）

1、老大安排了新的需求，需要做一个用户系统，要求一周内完成并且需要部署上线。你看看当前有没有新需求的分支（多人协作，有可能你的同事已经创建了），如果没有那就创建一个feature分支，命名为"feature/user_module"。如果有当前分支了，那不用创建直接拉取当前这个代码的分支。

```shell
git checkout -b feature/user_module develop
```

2、三天过去了，你做完了这个新的需求，自己也自测通过了，需要提交测试了。首先，先把 feature/user_module 合拼到 develop 分支。合拼完后，删除此 feature/user_module ，在以 develop 分支为基础创建 release 分支，命名为 release/1.0.0 ，最后提交测试。

```shell
# 检出 develop 分支
git checkout develop
# 使用 develop 分支合并功能分支
git merge feature/user_module
# 删除 feature/user_module 功能分支
git branch -d feature/user_module
# 推送远程仓库
git push origin develop
# 创建 release/1.0.0 分支
git checkout -b release/1.0.0 develop
# 推送 release/1.0.0 分支到远程仓库
git push origin release/1.0.0
```

3、测试人员提出了好几个bug，然后在 release/1.0.0 分支上修改，修改完后在此提测。如果还有bug那么也在这个分支上修改提测。一直到没有bug了。

4、一周来到了最后一天晚上了，老大说准备部署生产环境了。这个时候就可以把 release/10.0. 分支合拼到 develop 和 master 分支上了。部署之前，打一个 tag 标签，以便对当前版本的代码存档。

```shell
# 切换到 develop 分支
git checkout develop
# 与远程同步
git pull
# develop 分支合并 release 分支
git merge release/1.0.0
git push origin develop

# 切换到 master 分支
git checkout master
# 与远程同步
git pull
# master 分支合并 release 分支
git merge release/1.0.0
git push origin master

# 在 master 分支上打 tag
git tag -a 1.0.0
# 推送 tag 到远程
git push origin 1.0.0
```

5、做完了这个需求，下面或许还有很多需求，那么可以继续按照上面的流程来。

6、第二天或者第n天后，客户反馈有个 bug 或者有个按钮或者数据出不来，你定位到了问题后，也与团队内的同事或者老大确认过后，需要紧急处理。这个时候以 mastr 为基础创建 hotfix 分支，命名为 hotfix/user_module 分支。修改完这个 bug 后，以 hotfix/user_module 分支为基准，创建 release/1.0.1 分支，创建完后删除 release/1.0.1 分支。并且提交进行测试，如果还是有问题，那么继续在 release/1.0.1  分支上修改，直到没问题后，按照上面的发包流程，进行发包。

## 版本号定义

项目代码release包括三类：

- 大版本(x.0.0)
- 小版本(x.x.0)
- 补丁(x.x.x)

## git flow 的优缺点

**优点：**

- 各分支各司其职，基本上可以覆盖大部分的场景。
- 严格按照流程执行，出现重大事故的情况会大大降低。

**缺点：**

- 过于繁琐，按照这个流程严格执行对团队成员来说按照有难度。
- git flow违反了“短命”分支规则
- git flow也无法在 monorepo中 使用。
- 关于更多的说明，请查看参考资料第四点。

## 参考资料

[Understanding the GitHub flow](https://guides.github.com/introduction/flow/index.html)

[Introduction to GitLab Flow](https://docs.gitlab.com/ee/topics/gitlab_flow.html)

[一文弄懂 Gitflow、Github flow、Gitlab flow 的工作流](https://cloud.tencent.com/developer/article/1646937)

[Please stop recommending Git Flow!](https://georgestocker.com/2020/03/04/please-stop-recommending-git-flow/)

[在阿里，我们如何管理代码分支？](https://developer.aliyun.com/article/573549)

[字节研发设施下的 Git 工作流](https://juejin.cn/post/6875874533228838925#heading-5)