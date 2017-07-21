const http = require('http');
const fs = require('fs');

let request = require('request');
let cheerio = require('cheerio');
let schedule = require('node-schedule');

let ipModel = require('./db/models_ip');

let ipListURL = 'http://www.xicidaili.com/nn/';
let pageSize = 0;
let ipListArray = [];

function startRequest(ipListURL) {
    http.get(ipListURL, function (res) {
        let html = '';

        res.setEncoding('utf-8');

        res.on('data', function (chunk) {
            html += chunk;
        });

        res.on('end', function () {
            ipModel.remove({}, function(err){
                if(err) return console.error(err);
                console.log('清空数据');
            });

            pageSize++;
            $ = cheerio.load(html);

            let tr = $('#ip_list tr');

            for (let i = 1; i < tr.length; i++) {
                let td = $(tr[i]).children('td');
                let proxy = 'http://' + td.eq(1).text() + ':' + td.eq(2).text();
                // console.log(proxy);
                try {
                    let testip = request.defaults({ 'proxy': proxy }).get('http://ip.chinaz.com/getip.aspx', { timeout: 3000 }, function (err, response, body) {
                        if (body && body.substring(0, 4) == '{ip:') {
                            proxy = proxy + '\n';

                            let ipOne = new ipModel({
                                country: td.eq(0).find('img').attr('alt'),
                                ip: td.eq(1).text(),
                                port: td.eq(2).text(),
                                area: td.eq(3).find('a').text(),
                                types: td.eq(4).text(),
                                protocol: td.eq(5).text(),
                                speed: td.eq(6).find('.bar').attr('title'),
                                time: td.eq(7).find('.bar').attr('title'),
                            });

                            ipOne.save(function(err){
                                if(err) return console.error(err);
                                console.log('写入成功！');

                                ipModel.find(function(err, docs){
                                    if(err) return console.error(err);
                                    console.log(docs);
                                });
                            });


                            // fs.appendFile('./data/' + 'ipList' + '.txt', proxy, 'utf-8', function (err) {
                            //     if (err) {
                            //         console.log(err);
                            //     }
                            // });
                        }

                        // console.log(body);
                        // if(err){
                        //     console.log(err);
                        // }
                        // if(testip.statusCode == 200 && testip.text.substring(0,4) == '{ip:' ){ 
                        //存入数据库
                        // await $Ip.addIp({proxy: proxy});
                        // }


                    });
                } catch (e) {
                    console.log(e);
                }
            }

            // console.log(ipListArray);

            // let ipListString = ipListArray.join('') + '\n';

            // fs.appendFile('./data/' + 'ipList' + '.txt', ipListArray, 'utf-8', function (err) {
            //     if (err) {
            //         console.log(err);
            //     }
            // });

            let nextIpListURL = ipListURL + pageSize;
            if (pageSize <= 1) {
                startRequest(nextIpListURL);
            }
        });
    });
}
var everyDay = schedule.scheduleJob('0 0 0 * * ?', function(){
    console.log('everyDay 0:00:00');
    startRequest(ipListURL);
});

module.exports = ipListArray;