const http = require('http');
const fs = require('fs');
let request = require('request');
let cheerio = require('cheerio');

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
                            fs.appendFile('./data/' + 'ipList' + '.txt', proxy, 'utf-8', function (err) {
                                if (err) {
                                    console.log(err);
                                }
                            });
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
startRequest(ipListURL);

module.exports = ipListArray;