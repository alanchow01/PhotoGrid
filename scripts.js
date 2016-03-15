$(function () {
  'use strict';
  var instaImage = ''; // Empty variable to hold HTML statements that will be built
  var $instaPhotos = $('.insta-photos'); // Targets HTML DOM element that will be appended
  var searchStr = ''; // Variable to hold the search term
  var hashtag = ''; // Variable to hold the serch term if it's modified
  var pagination = ''; // Variable to hold next set of images. Finds next_url property in API

  var buildHTML = function (keyVal) {
    instaImage += '<li class="photo-wrapper">';
    instaImage +=   '<a href=' + keyVal.link + ' target="_blank"><img src=' + keyVal.images.standard_resolution.url + '></a>';
    instaImage +=     '<div class="meta-wrapper">';
    instaImage +=       '<div class="usr-img"><img src=' + keyVal.user.profile_picture + '></div>';
    instaImage +=       '<div class="usr-meta">';
    instaImage +=       '<div class="usr-name">' + keyVal.user.username + '</div>';
    instaImage +=       '<div class="usr-comms-likes"><i class="fa fa-comments"></i> ' + keyVal.comments.count + ' <i class="fa fa-heart"></i> ' + keyVal.likes.count + '</div>';
    instaImage +=     '</div><!--end usr-meta--></div><!--end meta-wrapper-->';
    instaImage += '</li>';
  };

  var buildFail = function () {
    $instaPhotos.empty();
    instaImage += '<li class="photo-wrapper">Something went wrong, please search again.</li>';
    $instaPhotos.append(instaImage);
    instaImage = '';
    $('.loading-gif').css('display', 'none');
    $('.load-more').css('display', 'none');
  };

  $('#button').on('click', function (event) {
    event.preventDefault();
    $('.loading-gif').css('display', 'block');
    searchStr = $('.search-box').val();
    hashtag = searchStr.toLowerCase().replace(' ', ''); // replaces any spaces entered to conform to hashtag formatting

    $.ajax({
      dataType: 'jsonp',
      method: 'GET',
      url: 'https://api.instagram.com/v1/tags/' + hashtag + '/media/recent?count=12&client_id=b8586475183a4ad89a5a0ebd4a36fbc2',
    })

    .done(function (instaResponse) {
      $instaPhotos.empty();
      pagination = instaResponse.pagination.next_url;
      if (instaResponse.data.length === 0) {
        $instaPhotos.append('<div class="photo-wrapper"><li>No images found. Please search again.</li></div>');
        $('.load-more').css('display', 'none');
      } else {
        $.each(instaResponse.data, function (index, value) {
          buildHTML(value);
        });
        $('.load-more').css('display', 'block');
      }
      // Appends built HTML; clears the instaImage variable //
      $instaPhotos.append(instaImage);
      $('.loading-gif').css('display', 'none');
      $('.header').addClass('header-position');
      $('.header-inner-wrap').css('margin', '2rem 0');
      $('.photo-grid').fadeIn(1000);
      instaImage = '';
    })
  .fail(buildFail);
  });

  // Load 12 more pictures
  $('.load-more').on('click', function (event) {
    $('.loading-gif').css('display', 'block');
    event.preventDefault();

    $.ajax({
      dataType: 'jsonp',
      method: 'GET',
      url: pagination,
    })
    .done(function (instaResponse) {
      pagination = instaResponse.pagination.next_url;
      $.each(instaResponse.data, function (index, value) {
        buildHTML(value);
      });

      // Appends built HTML; clears the instaImage variable //
      $instaPhotos.append(instaImage);
      $('.loading-gif').css('display', 'none');
      instaImage = '';
    })
    .fail(buildFail);
  });
  // end document ready
});
