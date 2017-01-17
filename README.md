# Installation
conan是一个UI自动化测试工具，是浏览器的一个插件，由于没有进入浏览器的应用商店，
所以安装起来，步骤想对来说要多一些；下文将阐述如何安装Conan。

1.安装node。先确认自己的机子是否安装了node，如果安装了可以跳过这一步骤；若没有，就需要先安装，可以直接从官网上下载，网址：https://nodejs.org/en/，
或者直接使用brew安装：
> brew install node

2.安装浏览器驱动。可以安装多个浏览器驱动。下面是几个常用的：
chromedriver 安装方式： 直接解压后将chromedriver执行文件放到/usr/local/bin目录下
>[https://attachments.tower.im/tower/0b7e2fa4b2ef43de9afecb4cd050049b?download=true&filename=chromedriver\_mac64.zip](https://attachments.tower.im/tower/0b7e2fa4b2ef43de9afecb4cd050049b?download=true&filename=chromedriver_mac64.zip)

safaridriver 安装方式： 直接执行SafariDriver.safariextz
>[https://attachments.tower.im/tower/4712449284444a36a389ebeeabf6c923?download=true&filename=SafariDriver.safariextz](https://attachments.tower.im/tower/4712449284444a36a389ebeeabf6c923?download=true&filename=SafariDriver.safariextz)

operadriver 安装方式：直接解压后将operadriver执行文件放到/usr/local/bin目录下
>[https://attachments.tower.im/tower/cdebd994ba0e4943b359c8dd48d20135?download=true&filename=operadriver\_mac64.zip](https://attachments.tower.im/tower/cdebd994ba0e4943b359c8dd48d20135?download=true&filename=operadriver_mac64.zip)

phatomjs 安装方式： 直接解压后将bin下的phantomjs执行文件放到/usr/local/bin目录下
>[https://attachments.tower.im/tower/c7267e0a831a4c25970a7f8b907ca435?download=true&filename=phantomjs-2.1.1-macosx.zip](https://attachments.tower.im/tower/c7267e0a831a4c25970a7f8b907ca435?download=true&filename=phantomjs-2.1.1-macosx.zip)

3.从git上clone conan 的项目，git地址：git@git.terminus.io:production/conan.git
>git clone git@git.terminus.io:production/conan.git

若没有安装git，先安装git：
>brew install git

4.打开clone下来的项目，将conan/extension/build.crx 文件拖到chrome的管理界面chrome://extensions/ ，
确认打开了develop mode，勾选该插件后的enable，添加成功之后，在浏览器的右上角会有一个插件的图标，如下图所示。
最后复制该插件的ID。
![Alt text](/Users/sherry/terminus/gitbook/Import/conan-readme/assets/extension.png)


5.修改conan/com.conan.client.json.example文件名称为com.conan.client.json，打开该文件，用从插件中复制过来的ID，替换该文件中allowed_origins下chrome-extension 后的内容，如图所示：



6.修改conan/client/config/default.json.example的文件名为default.json，打开该文件，检查各个参数配置是否正确，如下图所示；查看/var/log/conan 这个目录是否存在，若不存在，新建一个：

sudo mkdir -p /var/log/conan


7.在conan目录下，执行如下命令，该动作可能会持续较长时间，因为需要下载很多的依赖；

sudo npm run conan
正常情况下，执行完之后，会在/usr/local/bin/生成对应的conanClient.

至此为止，conan已经安装结束。