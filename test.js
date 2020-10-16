$(function(){
    //.sampleをクリックしてajax通信を行う
    $('.sample_btn').click(function(){
        $.ajax({
            url: '/ajax/test.html',
            /* 自サイトのドメインであれば、https://kinocolog.com/ajax/test.html というURL指定も可 */
            type: 'GET',
            dataType: 'html'
        }).done(function(data){
            /* 通信成功時 */
            $('.result').html(data); //取得したHTMLを.resultに反映
            
        }).fail(function(data){
            /* 通信失敗時 */
            alert('通信失敗！');
                    
        });
    });
});