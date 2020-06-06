const path = require('path')
const fs = require('fs')
const { DEPLOYaLICLOUD } = require('../config')


class UploadStrictAliOss {
    apply(compiler) {
        const self = this;
        // done编译完成后
        compiler.plugin('done', async function() {
            // 获取阿里OSS的所有文件路径
            const result = await DEPLOYaLICLOUD.list({
                'max-keys': 500
            });
            // 循环阿里OSS的文件
            if (result.objects && result.objects.length) {
                for (let i = 0; i < result.objects.length; i++) {
                    let name = result.objects[i].name
                    if (process.env.npm_lifecycle_event === "build:deploy") {
                        await DEPLOYaLICLOUD.delete(name);
                    }
                }
            }
            
            // 获取需要上传的的所有js文件
            const filePath =  path.join(__dirname,'../../','/build')
            // 执行上传
            if (process.env.npm_lifecycle_event === "build:deploy") {
                self.fileDisplay(filePath)
            }
        })
    } 
    
    fileDisplay (filePath) {
        const self = this
        fs.readdir(filePath, function(err,files){
            if(err){
                console.warn(err)
            } else {
                // 遍历读取js文件
                files.forEach(function(filename) {
                    //获取当前文件的绝对路径
                    let filedir = path.join(filePath, filename);
                    //根据文件路径获取文件信息，返回一个fs.Stats对象
                    fs.stat(filedir, async function(eror, stats){
                        if(eror){
                            console.warn('获取文件stats失败');
                        }else{
                            let isFile = stats.isFile();//是文件
                            let isDir = stats.isDirectory();//是文件夹
                            if(isFile) {
                                // 输入正确的上传路径 name
                                let index = filedir.lastIndexOf("build\\") != -1 ? filedir.lastIndexOf("build\\") : filedir.lastIndexOf("build/")
                                let name = (filedir.substr(index+6)).replace(/\\/g,'/')
                                // 开始上传 
                                let file = await fs.createReadStream(filedir)
                                if (name.substr(-4) != '.map') {
                                    if (name.substr(-2) === 'js') {
                                        // 上传js指定参数
                                        let result = await DEPLOYaLICLOUD.put('/'+name, file, {headers:{'Content-Type': 'application/javascript'}});
                                    } else {
                                        // 不传 为默认参数
                                        let result = await DEPLOYaLICLOUD.put('/'+name, file);
                                    }
                                }
                            }
                            if(isDir){
                                self.fileDisplay(filedir);//递归，如果是文件夹，就继续遍历该文件夹下面的文件
                            }
                        }
                    })
                });
            }
        })
    }
}

module.exports = UploadStrictAliOss