#!/usr/bin/env node
const program = require('commander');
const appInfo = require('./../package.json');
const fs = require('fs-extra')
const chalk = require('chalk')
const path = require("path")
const rootPath = path.dirname(__dirname)//跟目录节点
const appjson = path.join(rootPath, '/src/app.json')
program
    .version(appInfo.version,'-v, --version')
    .description('基于mpvue创建删除页面或组件')

//像git风格一样的子命令
program
    //子命令
    .command('page [name]')
    //短命令 - 简写方式
    .alias('p')
    //说明
    .description('页面命令')
    // 子命令 
    .option('-a --add <name>', 'add page|添加页面')
    .option('-d --delete <name>', 'delete page|删除页面')
    //注册一个callback函数
    .action(function(cmd, options){
        if (options.add) {
            addPage(options.add)
        }
        if (options.delete) {
            delPage(options.delete)
        }
    })
    .on('--help',function(){
        console.log('');
        console.log('Examples');
        console.log('page|p -i pagename');
        
        
    })


program.parse(process.argv);

function addPage(optionName) {
    fs.pathExists(appjson).then(exists => {
        if (exists == true) {
            fs.readJSON(appjson).then(appObj => {
                let pageUrl = "pages/" + optionName + "/main"
                if (appObj.pages.indexOf(pageUrl) < 0) {
                    let newdir = path.join(rootPath, "/src/pages/" + optionName)
                    fs.copy(path.join(rootPath, '/node_modules/mpvue-page/template/page'), newdir, function (err) {
                        if (err) return console.error(err)
                        appObj.pages.push(pageUrl)
                        fs.writeJson(appjson, appObj, { spaces: 4 })
                            .then(() => {
                                console.log(chalk.green('创建', optionName, '页面成功'))
                            })
                    })
                }
                else {
                    console.log(chalk.red("创建失败，文件已经存在"))
                }
            })
        }
        else {
            console.log(chalk.red('抱歉，找不到/src/app.json'))
        }
    })
}
function delPage(optionName) {
    fs.pathExists(appjson).then(exists => {
        if (exists == true) {
            fs.readJSON(appjson).then(appObj => {
                let pageUrl = "pages/" + optionName + "/main"
                let pageIndex = appObj.pages.indexOf(pageUrl)
                if (pageIndex >= 0) {
                    let newdir = path.join(rootPath, "/src/pages/" + optionName)
                    fs.remove(newdir, err => {
                        if (err) return console.log(err);
                        appObj.pages.splice(pageIndex,1)
                        fs.writeJson(appjson, appObj, { spaces: 4 })
                            .then(() => {
                                console.log(chalk.green('删除', optionName, '页面成功'))
                            })                        
                    })

                }
                else {
                    console.log(chalk.red("删除失败，文件不存在"))
                }
            })
        }
        else {
            console.log(chalk.red('抱歉，找不到/src/app.json'))
        }
    })
}