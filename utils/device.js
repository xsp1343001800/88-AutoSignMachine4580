const os = require('os')
const path = require('path')
const fs = require('fs-extra')

// 530000000126002
function generateMixed(n) {
    var chars = ['1', '2', '3', '4', '5', '6', '7', '8', '9'];
    let res = "";
    for (var i = 0; i < n; i++) {
        var id = Math.floor(Math.random() * 9);
        res += chars[id];
    }
    return res;
}


var appInfo = {
    version: 9.0400,
    unicom_version: 'android@9.0400',
    app_name: '中国联通',
    package_name: 'com.sinovatech.unicom.ui'
}
var devices = [{
    android_version: '10',
    deviceBrand: 'HONOR',
    deviceModel: 'PCT-AL10',
    buildSn: 'MVLDU19119002362',
    deviceId: generateMixed(15) + ''

}, {
    android_version: '11',
    deviceBrand: 'Xiaomi',
    deviceModel: 'Redmi K20 Pro',
    buildSn: 'b7701075',
    deviceId: generateMixed(15) + ''

}]
var device = devices[Math.floor(Math.random() * devices.length)]
var userAgentTpl = {
    'p': 'Mozilla/5.0 (Linux; Android {android_version}; {deviceModel} Build/{buildSn}; wv) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/75.0.3770.143 Mobile Safari/537.36; unicom{version:{unicom_version},desmobile:{desmobile}};devicetype{deviceBrand:{deviceBrand},deviceModel:{deviceModel}};{yw_code:}'
}

let file = path.join(process.env.asm_save_data_dir, `taskFile_${process.env.taskKey}.json`)
if (fs.existsSync(file)) {
    let taskJson = fs.readFileSync(file).toString('utf-8')
    taskJson = JSON.parse(taskJson)
    let update = false
    if ('device' in taskJson && taskJson.device) {
        device = taskJson.device
    } else {
        update = true
    }
    if ('appInfo' in taskJson && taskJson.appInfo) {
        appInfo = taskJson.appInfo
    } else {
        update = true
    }
    if (update) {
        fs.writeFileSync(file, JSON.stringify({
            ...taskJson,
            device,
            appInfo
        }))
    }
}

module.exports = {
    device,
    appInfo,
    buildUnicomUserAgent: (options, tplname) => {
        let rdm = {
            ...device,
            ...appInfo,
            desmobile: options.user
        }
        var fmt = (str, params) => {
            for (let key in params) {
                str = str.replace(new RegExp("\\{" + key + "\\}", "g"), params[key]);
            }
            return str
        }
        return fmt(userAgentTpl[tplname], Object.assign(rdm, options))
    }
}