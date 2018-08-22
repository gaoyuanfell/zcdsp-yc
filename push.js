const os = require('os');
const path = require('path');
const fs = require('fs');
const dst = os.homedir() + '\\worksvn\\zc\\static';

function deleteFolder(path, config = {'ignore': []}, number = 0) {
    let files = [];
    number++;
    if (fs.existsSync(path)) {
        files = fs.readdirSync(path);
        files.forEach((file) => {
            if (config && config.ignore instanceof Array && !!~config.ignore.indexOf(file)) {
                return;
            }
            let curPath = path + "/" + file;
            if (fs.statSync(curPath).isDirectory()) {
                deleteFolder(curPath, null, number);
            } else {
                fs.unlinkSync(curPath);
            }
        });
        number !== 1 && fs.rmdirSync(path);
    }
}

function copyFolder(src, dst) {
    !fs.existsSync(dst) && fs.mkdirSync(dst);
    let paths = fs.readdirSync(src);
    paths.forEach((_path) => {
        let _src = path.join(src, _path);
        let _dst = path.join(dst, _path);
        let st = fs.statSync(_src);
        if (st.isFile()) {
            let readable = fs.createReadStream(_src);
            let writable = fs.createWriteStream(_dst);
            readable.pipe(writable);
        } else if (st.isDirectory()) {
            copyFolder(_src, _dst)
        }
    });
}

deleteFolder(dst);

copyFolder(path.join(__dirname, 'dist'), dst);
