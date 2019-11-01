const xlsx = require('node-xlsx');
const fs = require('fs');

function getExcel(path)
{
    var sheets = xlsx.parse(path);
    var arrTotal = [];
    var flag = 0;
    sheets.forEach(function(sheet) {
        var arr = [];
        if (flag === 0) {
            for(var i = 1; i < sheet["data"].length; i++) {
                var row = sheet['data'][i];
                if(row && row.length > 0){
                    arr.push({
                        key: row[0],
                        url: row[1],
                        selector: row[2],
                        element_name: row[3],
                    });
                }
            }
            arrTotal.push(arr);
        }
        if (flag === 1) {
            for(var i = 1; i < sheet["data"].length; i++) {
                var row = sheet['data'][i];
                if(row && row.length > 0){
                    arr.push({
                        key: row[0],
                        url: row[1],
                        telInput: row[2],
                        getCode: row[3],
                        submit: row[4],
                        loginPosition: row[5],
                    });
                }
            }
            arrTotal.push(arr);
        }
        flag++;  
    });
    return arrTotal;
}

module.exports = {
    getExcel,
}