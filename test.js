const DATA_URL = 'https://p.eagate.573.jp/game/sdvx/v/p/playdata/musicdata/index.html';

alert('プレースコアを取得します。\n※公式サイトのプロフィール画面から起動させてください。');

const toolBg = $('<div>').addClass('toolBg').attr('style','position: fixed; top: 0; z-index: 10; width: 100%; height:100%; background-color: rgba(0,0,0,0.6);');
const infoArea = $('<div>').addClass('infoArea').attr('style', 'width: 100%; padding: 5px; background-color: #f82374; color: #fcfcfc;');
const infoSpan = $('<span>').addClass('infoSpan').text('スコアを取得します。');
infoArea.append(infoSpan);
toolBg.append(infoArea);
$('body').append(toolBg);