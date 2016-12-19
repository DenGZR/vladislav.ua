$( function() {

    var currentSorterType =  null;


    // plugins
    $( document ).tooltip();

    var from = $( "#popup-datepicker-from" ).datepicker({
      language: 'ru',
      format: 'dd/mm/yy',
      todayHighlight: true,
      orientation: "bottom ",
      multidateSeparator: "/",
      autoclose: true
    })
    .on('show', function(e) {
      console.log('show');
      setTimeout(function(){
        $('#popup-datepicker-from .input-img').addClass('active');
      }, 100);
    })
    .on('hide', function(e) {
      console.log('hide');
      setTimeout(function(){
        $('#popup-datepicker-from .input-img').removeClass('active');
      }, 100);
    });

    var to =  $( "#popup-datepicker-to" ).datepicker({
      language: 'ru',
      format: 'dd/mm/yy',
      todayHighlight: true,
      orientation: "bottom",
      multidateSeparator: "/",
      autoclose: true
    })
    .on('show', function(e) {
      console.log('show');
      setTimeout(function(){
        $('#popup-datepicker-to .input-img').addClass('active');
      }, 100);
    })
    .on('hide', function(e) {
      console.log('hide');
      setTimeout(function(){
        $('#popup-datepicker-to .input-img').removeClass('active');
      }, 100);
    });

    $( "#search-tree-tabs, #info-tabs" ).tabs();
    $( "#warranty-accordion" ).accordion({
      collapsible: true,
      heightStyle: "content"
    });
    $( '#search-table' ).tooltip({
      items: "[title]",
      content: function() {
        var element = $( this );
        if ( element.is( "[title]" ) ) {
          var titleVal = element.attr('title').split('/');

          return '<div class="cost-tooltip">' +
            '<p class="title">След., грн</p>' +
            '<p>' + titleVal[0] + '</p>' +
            '<p class="title">unit</p>' +
            '<p>' + titleVal[1] + '</p>' +
          '</div>';
        }
      }
    });

    $("#tabs-1, #search-body, #order-table-body-wrap, #order-unit-table-body-wrap, #list-category").mCustomScrollbar({
      alwaysShowScrollbar: 1
    });

    $("#table-sort").selectmenu({
      change: function( event, ui ) {
        var selectVal = ui.item.value;
        console.log(selectVal);
        currentSorterType = selectVal;
        sortGrid(currentSorterType);
      }
    });

    // events
    $(document).on('click', userDataPopupHandler );
    $('.search-result').on('click', searchHandler );
    $('#search-table .quantity-input input ').change(changeInputStatus);
    $('#order').on('click', orderHandler);
    $('#popup-search-tree').on('click', popupSearchTreeHandler);
    $('#popup-calendar').on('click', popupСalendarHandler);
    // close popup
    $(document).on('keydown', closePopupHandler );

    // only for test
      $('.main-header').on('click', function (event) {
        var target = $(event.target);
        var sectionAll = $('.main-content section');

        if(target.hasClass('magnifier')) {
          sectionAll.addClass('hide');
          $('.order').removeClass('hide');
          $('.search-result').removeClass('hide');
        }

        if(target.hasClass('info')) {
          sectionAll.addClass('hide');
          $('.info').removeClass('hide');

        }

        if(target.hasClass('gifts')) {
          sectionAll.addClass('hide');

          $('.order').removeClass('hide').addClass('unit');
          $('.gift').removeClass('hide');
        }


      });



    // events haldler function

    function changeInputStatus(event) {
      var target = $(event.target);
      var parent = target.parent('.quantity-input');

      if( parent.hasClass('pink') ) {
        return;
      }
      parent.removeClass('green')
            .addClass('pink');
    };

    // close popup
    function closePopupHandler(event) {

      if(event.keyCode == 27) {
        $('.popup-box').addClass('hide');
      }
    }

    function userDataPopupHandler(event) { // user-data-popup
      var target = $(event.target);
      var checkDataPopup = $('.user-data-btn').hasClass('active');
      console.log('click to -->',target );

      // show-hide user-data-popup in header
      if(target.hasClass('user-data-btn')) {
        target.toggleClass('active');
        $('.user-data-popup').toggleClass('hide');
        return;
      }
      if(checkDataPopup){
        $('.user-data-btn').toggleClass('active');
        $('.user-data-popup').toggleClass('hide');
      }

      if(target.hasClass('magnifier-search-all')) {
        $('#popup-search-tree').toggleClass('hide');
      }

    };



    function searchHandler(event) { // search result container
      var target = $(event.target);
      // debugger;

      if(target.hasClass('analogues')) {
        var rowId = target.parents('tr.table-row').attr('id');
        var subRowArr = $('#search-table').find($('[data = ' + rowId + ']'));

        if(subRowArr.length) {
          target.toggleClass('fadeIn');
          $('.sub-table-row').toggleClass('hide');
        }
        return;
      }
      // close btn -> close section id="search-result"
      if(target.hasClass('close')||target.parent().hasClass('close')) {
        $('#search-result').toggleClass('hide');
        return;
      }
      // change cost -> retail or wholesale
      if(target.hasClass('show-retail')||target.hasClass('show-wholesale')) {
        $('.wholesale').toggleClass('hide');
        $('.retail').toggleClass('hide');
        return;
      }
    };

    function popupSearchTreeHandler(event) {
      var target = $(event.target);

      // btn close
      if(target.hasClass('close')||target.parent().hasClass('close')) {
        $('#popup-search-tree').toggleClass('hide');
        return;
      }

      if(target.hasClass('sub-list')) {
        target.toggleClass('closed');
        return;
      } else if (target.parent().hasClass('sub-list')) {
        target.parent().toggleClass('closed');
      }

    }

    function popupСalendarHandler(event) {
      var target = $(event.target);

      // btn close
      if(target.hasClass('close')||target.parent().hasClass('close')) {
        $('#popup-calendar').toggleClass('hide');
        return;
      }

      if(target.hasClass('input-img') && target.hasClass('active')) {
        //
        // to.datepicker('hide');
        // from.datepicker('hide');
        return;
      }
    }

    function sortGrid( filterType ) {
        var table,
            tableRow,
            rowsArr,
            resultTable = [],
            tbody;


          // fun sorter
        var compare = function(rowA, rowB) {
          // var rowA, rowB;

          if( filterType === 'name' ) {
            rowA = $(rowA).find('.col-discription .title').text();
            rowB = $(rowB).find('.col-discription .title').text();
          } else {
            rowA = $(rowA).find('.cost:not(.hide)').text();
            rowB = $(rowB).find('.cost:not(.hide)').text();
          }

          // console.log(parseFloat(rowACost) - parseFloat(rowBCost));

          switch (filterType) {
            case 'asc':
              return parseFloat(rowA) - parseFloat(rowB);
              break;
            case 'decs':
            return parseFloat(rowB) - parseFloat(rowA);
              break;
            case 'name':
            return rowA  >  rowB ? 1 : -1 ;
              break;
          }
        };

        table = $('#search-table');
        tbody = table.find('tbody')[0];
        // Составить массив из table-row
        tableRow = table.find('.table-row');
        rowsArr = [].slice.call(tableRow);
        // сортировать
        rowsArr.sort(compare);
        // console.log(rowsArr);

        // найдем вложеные таблицы по атрибуту data и отсортируем их запихнем в resultTable
        for (var i = 0; i < rowsArr.length; i++) {

          resultTable.push(rowsArr[i]);
          var id = $(rowsArr[i]).attr('id');
          var subRow = $('[data = ' + id + ']');
          // Составить массив из вложеных таблиц
          var subRowArr = [].slice.call(subRow);

          if(subRowArr.length) {
            // сортировать
            subRowArr.sort(compare);

            for (var j = 0; j < subRowArr.length; j++) {
              resultTable.push(subRowArr[j]);
            }
          }
        }
          // debugger;
        // Убрать table из большого DOM документа для лучшей производительности

        // $(tbody).remove();
        $(tbody).empty();
        // добавить результат в нужном порядке в TBODY
        // они автоматически будут убраны со старых мест и вставлены в правильном порядке
        for (var i = 0; i < resultTable.length; i++) {
          $(tbody).append(resultTable[i]);
        }
        table.append(tbody);
      };

      function orderHandler(event) {
        var target = $(event.target);

        // order order-select-all btn
        if(target.hasClass('order-select-all')) {
          var selectAll = $('#order-select-all');
          var checkboxs = $('#order-table-boby input[type="checkbox"]');

          if (selectAll.is(':checked')) {
              checkboxs.prop('checked', false);
              selectAll.prop('checked', false);
          } else {
              checkboxs.prop('checked', true);
              selectAll.prop('checked', true);
          }
          return;
        }
      };




  } );
