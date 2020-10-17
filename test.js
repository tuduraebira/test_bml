const DATA_URL = 'https://p.eagate.573.jp/game/sdvx/v/p/playdata/musicdata/index.html';

alert('プレースコアを取得します。\n※公式サイトのプロフィール画面から起動させてください。');

const bg_tool = $('<div>').addClass('bg_tool').attr('style', 'position:fixed; top:0; z-index:10; width:100%; height:100%; background-color:rgba(0,0,0,0.6);');
const box_info = $('<div>').addClass('box_info').attr('style', 'width:500px; height:300px; position:fixed; top:35%; left:38%; background-color:lightgray;');
const txt_getScore = $('<span>').addClass('txt_getScore').attr('style', 'font-size:32pt; font-weight:bold; position:fixed; top:43%; left:43%').text('スコア取得中');
box_info.append(txt_getScore);
bg_tool.append(box_info);
$('body').append(bg_tool);