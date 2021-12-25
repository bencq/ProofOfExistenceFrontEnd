# FrontEnd

#
```bash
# 设置淘宝源
npm config set registry https://registry.npmmirror.com
npm config set sass_binary_site https://npmmirror.com/mirrors/node-sass
# 安装 angular
sudo npm install -g @angular/cli@12
npm i

# 开发环境下可能需要修改/etc/sysctl.conf文件
# 增加以下行:
# fs.inotify.max_user_watches=524288
# 然后通过sudo sysctl -p启用该配置


# 启动
npm start
```

