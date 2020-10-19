const BASE_URL = 'https://p.eagate.573.jp';
const MUSIC_URL = '/game/sdvx/v/p/playdata/musicdata/index.html';
const TEMP_URL = 'https://p.eagate.573.jp/game/sdvx/v/p/playdata/musicdata/data_detail.html?music_id=4Lqg3tk92_Q8PidqUfpU2Q';

let txt;
let url_part = [];
let chart_data = [];
let max_page = -1;

$.wait = (function(msec){
    let d = $.Deferred();
    setTimeout(function(){
        d.resolve();
    }, msec);
    return d.promise();
});

/*const getURLData = (function(page){
    $.wait(5000).done(function(){
        $.ajax({
            type: 'GET',
            url: BASE_URL + MUSIC_URL + '?page=' + String(page) + '&sort=0'
        }).done(function(data_url){
            if($(data_url).find('.data_col').length <= 0){
                setTimeout(function(){
                    $.ajax(this);
                }, 500);
            }

            $(data_url).find('.data_col').each(function(){
                let url_music = $(this).find('.music .title a').attr('href');

                if(url_music != null){
                    //getScoreData(url_music);
                    url_part.push(url_music);
                }else{
                    alert('取得失敗');
                    return false;
                }

                console.log(url_part);
            });
        }).fail(function(){
            setTimeout(function(){
                $.ajax(this);
            }, 500);
        });
    });
});*/

/*const getScoreData = (function(url_m){
    txt = url_m;
    $.ajax({
        type: 'GET',
        url: BASE_URL + url_m
    }).done(function(data_score){
        txt = 'success';
        console.log(txt);
        $(data_score).find('.level').each(function(){
            txt = $(this).text();
        });
        return;
    }).fail(function(){
        txt = 'failed';
        console.log(txt);
        setTimeout(function(){
            $.ajax(this);
        }, 500);
    });
    console.log('end');
});*/

alert('プレースコアを取得します。\n※公式サイトのプロフィール画面から起動させてください。');

const bg_tool = $('<div>').addClass('bg_tool').attr('style', 'position:fixed; top:0; z-index:10; width:100%; height:100%; background-color:rgba(0,0,0,0.6);');
const box_info = $('<div>').addClass('box_info').attr('style', 'width:500px; height:300px; position:fixed; top:35%; left:38%; background-color:lightgray;');
const txt_getScore = $('<span>').addClass('txt_getScore').attr('style', 'font-size:32pt; font-weight:bold; position:fixed; top:43%; left:44%').text('スコア取得中');
box_info.append(txt_getScore);
bg_tool.append(box_info);
$('body').append(bg_tool);

/*$.ajax({
    type: 'GET',
    url: BASE_URL + MUSIC_URL
}).done(function(data_num){
    max_page = Number($(data_num).find('.page_num').last().text());
    if(max_page == 0){
        alert('スコアを取得できませんでした。');
        return;
    }

    for(let i = 1; i <= max_page; i++){
        getURLData(i);
    }
    console.log('show the text');

    //alert('接続成功です。');
    //return;

    $.wait((max_page + 20) * 1000).done(function(){
        alert('通信品質が悪いです。');
        return;
    })
})*/

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
        
                /*$.wait((max_page + 20) * 1000).done(function(){
                    alert('通信品質が悪いです。');
                    throw new Error('cannot connected');
                });*/

                console.log('1:' + max_page);
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
                    throw new Error('cannot find data column');
                }

                $(data_url).find('.data_col').each(function(){
                    let url_music = $(this).find('.music .title a').attr('href');

                    if(url_music != null){
                        url_part.push(url_music);
                    }else{
                        throw new Error('cannot get URL data');
                    }
                });

                console.log(url_part);
                resolve('URLデータ取得完了');
            });
        }catch(err){
            reject(err);
        }
    })
}

async function processAll(){
    try{
        await getMaxPage();
        for(let i = 1; i <= max_page; i++){
            await getURLPartData(i);
        }
    }catch(err){
        throw err;
    }
}

getMaxPage().then(() => {
    console.log('end');
    console.log(url_part);
}).catch((err) => {
    console.log(err);
})