# aliyun-static-upload(此方法适用于react,如果需要运用于vue，根据webpack的plugin配置即可)
build之后的静态文件上传到阿里云OSS

## 安装所需插件
1、执行命令 `npm install customize-cra -D`

2、安装完成后，在项目根目录创建`config-overrides.js`
## config-overrides.js  代码内容
```
const UploadStrictAliOss = require('uploadStrictAliOss')  // 文件所在路径

const { override, addWebpackPlugin, addBabelPlugins } = require('customize-cra');
 module.exports = override(
    // 打包后代码上传到OSS
    addWebpackPlugin(new UploadStrictAliOss()),
    // 删除console， 线上环境不显示console
    process.env.NODE_ENV === 'development' ? null : addBabelPlugins(['transform-remove-console'])
);
```

