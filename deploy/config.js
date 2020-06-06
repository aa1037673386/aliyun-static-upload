const OSS = require('ali-oss')

const DEPLOYaLICLOUD = new OSS({
    region: 'XXX',
    accessKeyId: 'XXX',
    accessKeySecret: 'XXX',
    bucket: 'XXX',
    ossurl:'XXX'
});

module.exports = {
    DEPLOYaLICLOUD,
}