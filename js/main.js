$(document).ready(function(){
  //on page load

  //get our content
  $.get('https://newsapi.org/v2/top-headlines?country=gb&apiKey=39b350bf37884544adc01a04c8aeae73', function(data, status){

    setTitle('<strong>Latest Headlines</strong>')
    //for each of the articles append them to the view
    $.each(data.articles, function(index, element){
      $('.container').append(toArticle(element));
    });
  });

  //toggle the short text
  $('.container').on('click','.card-header', function(){
    event.preventDefault();
    $(this).parent().find('#content').slideToggle('fast');
  });

  //close the article
  $('.container').on('click','.close', function(){
    event.preventDefault();
    $(this).parent().slideToggle('fast');
  });

  //search button
  $('#btn-search').on('click', function(){
    event.preventDefault();
    let value = $('#search-box').val();
    $('#search-box').val('');

    getNews(value);

  });
});


function setTitle(title){
  let headHTML = '<div>';
  headHTML +=    '<h3> '+ title +'</h3>';
  headHTML +=    '</div>';
  $('.container').append(headHTML);
}

function getNews(query){
  $('.container').empty();
  $.getJSON('https://newsapi.org/v2/everything?q='+ query +'&apiKey=39b350bf37884544adc01a04c8aeae73', function(data){
    var html = "";

    setTitle('Showing news results for <strong>' + query + '</strong>');
    //custom sort the articles since they come in a random order
    let sortedArticles = data.articles.sort(function(a,b){
      let datea = moment();
      datea = moment(a.publishedAt);

      let dateb = moment();
      dateb = moment(b.publishedAt);

      return datea < dateb ? 1 : -1;
    });

    let headHTML = '<div>';
    headHTML +=    '<h3> Showing news results for <strong>' + query + '</strong></h3>';
    headHTML +=    '</div>';
    $('.container').append(headHTML);
    //for each of the articles, show to screen
    $.each(sortedArticles, function(index, element){
      $('.container').append(toArticle(element));
    });
  });
}

//create an article from JSON string
function toArticle(element){
  let date = moment();
  date = moment(element.publishedAt);
  let html = "";

  html += '<article class="card shadow p-3 mb-5 bg-white rounded">';
  html += ' <div class="card-img-top" id="img_container">';
  if(element.urlToImage !== null){
    html += ' <img src="'+ element.urlToImage +'" class="card-img-top">';
  }

  html += '</div>'

  html += '<a href="#" class="close button btn btn-danger active" role="button">x</a>';
  html += ' <header class="card-header">';
  html += '   <h5 class="card-title">' + element.title + '</h2>';
  html += '   <author><pre>by ' + element.author + ' at ' +  date.format("h:mm a DD/MM/YY") + '</pre> </author>';
  html += ' </header>';
  html += ' <div class="card-body" id="content">';
  html += ' <p class="card-text">';
  html += element.content;
  html += ' </p>';
  html += ' <p class="card-text">';
  html += '<a href="'+ element.url +' "target="_blank" rel="noopener noreferrer" class="btn btn-info btn-sm active" role="button" aria-pressed="true">Read More >></a>';
  html += ' </p>';
  html += ' </div>';
  html += '</article>';
  return html;
}
