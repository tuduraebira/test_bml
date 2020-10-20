const BASE_URL = 'https://p.eagate.573.jp';
const MUSIC_URL = '/game/sdvx/v/p/playdata/musicdata/index.html';
const TEMP_URL = 'https://p.eagate.573.jp/game/sdvx/v/p/playdata/musicdata/data_detail.html?music_id=4Lqg3tk92_Q8PidqUfpU2Q';

let url_part = [];
let chart_data = [];
let max_page = -1;

alert('プレースコアを取得します。\n※公式サイトのプロフィール画面から起動させてください。');

const bg_tool = $('<div>').addClass('bg_tool').attr('style', 'position:fixed; top:0; z-index:10; width:100%; height:100%; background-color:rgba(0,0,0,0.6);');
const box_info = $('<div>').addClass('box_info').attr('style', 'width:500px; height:300px; position:fixed; top:35%; left:38%; background-color:lightgray;');
const txt_getScore = $('<span>').addClass('txt_getScore').attr('style', 'font-size:32pt; font-weight:bold; position:fixed; top:43%; left:44%').text('スコア取得中');
box_info.append(txt_getScore);
bg_tool.append(box_info);
$('body').append(bg_tool);

function getMaxPage(){
    return new Promise((resolve, reject) => {
        try{
            $.ajax({
                type: 'GET',
                url: BASE_URL + MUSIC_URL,
                timeout: 5000,
                error: function(xhr, textStatus, errorThrown){
                    if(textStatus == 'timeout'){
                        throw new Error('cannot connected');
                    }
                }
            }).done(function(data_num){
                max_page = Number($(data_num).find('.page_num').last().text());
                if(max_page == 0){
                    alert('スコアを取得できませんでした。');
                    throw new Error('failed to get score');
                }

                resolve('ページ数取得完了');
            });
        }catch(err){
            reject(err);
        }
    });
}

function getURLPartData(page){
    return new Promise((resolve, reject) => {
        try{
            $.ajax({
                type: 'GET',
                url: BASE_URL + MUSIC_URL + '?page=' + String(page) + '&sort=0',
                timeout: (max_page + 20) * 1000,
                error: function(xhr, textStatus, errThrown){
                    if(textStatus == 'timeout'){
                        throw new Error('cannot connected');
                    }
                }
            }).done(function(data_url){
                if($(data_url).find('.data_col').length <= 0){
                    resolve('URLデータ取得完了');
                }

                $(data_url).find('.data_col').each(function(){
                    let url_music = $(this).find('.music .title a').attr('href');

                    if(url_music != null){
                        url_part.push(url_music);
                    }else{
                        throw new Error('cannot get URL data');
                    }
                });

                resolve('URLデータ取得完了');
            });
        }catch(err){
            reject(err);
        }
    });
}

function getScoreData(url_m){
    return new Promise((resolve, reject) => {
        try{
            $.ajax({
                type: 'GET',
                url: BASE_URL + url_m,
                timeout: (max_page + 30) * 1000,
                error: function(xhr, textStatus, errThrown){
                    if(textStatus == 'timeout'){
                        throw new Error('cannot connected');
                    }
                }
            }).done(function(data_score){
                let chart_part = [];
                let title = $(data_score).find('#music_title').text();
                let diff;
                let score;

                title = title.replace(/\(EXIT TUNES\)/, '').replace(/,/, '，');

                $(data_score).find('.music_box').each(function(){
                    if($(this).find('.jacket_area .diff .level').text() == 18){
                        diff = $(this).find('.jacket_area .diff .level').text();
                        score = $(this).find('.cnt').first().text();

                        chart_part.push(title);
                        chart_part.push(diff);
                        chart_part.push(score);

                        chart_data.push(chart_part);
                    }
                })

                resolve('難易度取得完了');
            })
        }catch(err){
            reject(err);
        }
    });
}

function exportCSVFile(){
    return new Promise((resolve, reject) => {
        try{
            const bom = new Uint8Array([0xEF, 0xBB, 0xBF]);
            const blob = new Blob([ bom, chart_data.join('\r\n') ], { type : 'text/csv' });
            const element = document.createElement('a');
            const objectUrl = window.URL.createObjectURL(blob);

            element.href = objectUrl;
            element.setAttribute('download', 'score_data.csv'); 
            document.body.appendChild(element);
            element.click();
            window.URL.revokeObjectURL(objectUrl);
            document.body.removeChild(element);

            resolve('CSV出力完了');
            console.log('CSV出力完了');
        }catch(err){
            reject(err);
        }
    });
}

async function processAll(){
    try{
        await getMaxPage();
        for(let i = 1; i <= max_page; i++){
            await getURLPartData(i);
        }
        for(let i = 0; i < url_part.length; i++){
            await getScoreData(url_part[i]);
        }
        await exportCSVFile();
    }catch(err){
        throw err;
    }
}

processAll().then(() => {
    console.log('end');
    console.log(url_part);
    console.log(chart_data);
    alert('スコアデータ出力が完了しました。');
    window.location.href = BASE_URL + MUSIC_URL;
}).catch((err) => {
    console.log(err);
})