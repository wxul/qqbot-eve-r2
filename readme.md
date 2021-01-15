### 机器人！

本项目基于 [mirai](https://github.com/mamoe/mirai) 开源库, 使用了 [Mirai Console Loader](https://github.com/iTXTech/mirai-console-loader) 启动机器人服务, 通过加载 [mirai-api-http](https://github.com/project-mirai/mirai-api-http) 插件实现http协议交互, 然后通过 [mirai-ts](https://github.com/YunYouJun/mirai-ts) SDK实现基于node的逻辑业务处理

#### Usage

1. 配置jdk环境(>=11)
2. 安装MCL, 从github的[release](https://github.com/iTXTech/mirai-console-loader/releases)下载并解压, 运行命令执行安装, 如有报错可以运行 `.\mcl --update-package net.mamoe:mirai-core-all --channel nightly`
3. 安装mirai-api-http, 可以从github下载解压, 也可以运行命令 `.\mcl --update-package net.mamoe:mirai-api-http --channel stable --type plugin`
4. 修改项目配置 `mcl/config/Console/AutoLogin.yml`
5. 修改mirai-api-http配置 `mcl/config/net.mamoe.mirai-api-http/setting.yml`
6. 启动 `./mcl -x`