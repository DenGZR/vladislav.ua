$( function() {

  var minCost = 0,
      maxCost = 1000,
      clientUnit = 200,
      selCategory = [];

  var sorter = new SortGift();
// plugins

  $(".gift-items-wrap").mCustomScrollbar({
    alwaysShowScrollbar: 1
  });
  $("#slider").slider({
  	min: 0,
  	max: 1000,
  	values: [minCost,maxCost],
  	range: true,
  	stop: function(event, ui) {

      minCost = $("#slider").slider("values",0);
      maxCost = $("#slider").slider("values",1);

      $("input#minCost").val(minCost);
    	$("input#maxCost").val(maxCost);

      sorter.byRange(minCost,maxCost);

    },
    slide: function(event, ui){
    		$("input#minCost").val($("#slider").slider("values",0));
    		$("input#maxCost").val($("#slider").slider("values",1));
    }
  });




// events

  //  Change gift view list or blocks
  $('#gift .gift-header').on('click', changeViewHandler );
  // sort by cost
  $('#gift .gift-header').on('click', sortByCostHandler );
  // sort by range after input value change
  $('#gift .gift-header .cost-slider input').on('change', sortByRangeInputHandler );
  // available gift
  $('#gift .gift-header .available').on('click', availableBtnHandler );

  $(document).on('click', categoryFilterHandler );


  // events haldler function
    // toggle view between list or blocks
    function changeViewHandler(event) {
      var target = $(event.target);
      var lastActive = $('.gift .gift-header .toggle-view.active');
      var giftBoxView = $('.gift .gift-body .items');

      if( target.hasClass('toggle-view') && !target.hasClass('active') ) {
        lastActive.removeClass('active');
        target.addClass('active');
        giftBoxView.removeClass('blocks').removeClass('list');

        if(target.hasClass('list-view')) {
          giftBoxView.addClass('list');
        }
        if(target.hasClass('blocks-view')) {
          giftBoxView.addClass('blocks');
        }

      }
  }

    //  sort gifts by cost
    function sortByCostHandler(event) {
      var target,
          sortBtn,
          isDecsSort;

      target = $(event.target);

      if( target.parents().hasClass('cost-filter') ) {
         sortBtn = $('.gift .gift-header .cost-filter');
         isDecsSort  = sortBtn.hasClass('desc');

         if(isDecsSort) {
           sorter.asc();
           sortBtn.removeClass('desc').addClass('asc');
         } else {
          sorter.desc();
          sortBtn.removeClass('asc').addClass('desc');
         }
      }

    }

    // input change handler
    function sortByRangeInputHandler(event) {
      var min,
          max;

      min = parseFloat($("input#minCost").val());
      max = parseFloat($("input#maxCost").val());

      min = isNaN(min) ? 0 : min;
      max = isNaN(max) ? 1000 : max;

      if(min > max){
        minCost = max;
        $("input#minCost").val(minCost);
      } else if (max > 1000) {
        maxCost = 1000;
        $("input#maxCost").val(maxCost);
      } else if(min > max){
        maxCost = min;
        $("input#maxCost").val(maxCost);
    	} else {
        minCost = min;
        maxCost = max;
        $("input#minCost").val(minCost);
        $("input#maxCost").val(maxCost);
      }

      $("#slider").slider("values",0,minCost);
    	$("#slider").slider("values",1,maxCost);

      sorter.byRange(minCost,maxCost);

    }

    // handler click -->  Доступные товары
    function availableBtnHandler(event) {
      var target,
          isAvailable;

      target = $(event.target);
      isAvailable = target.parents().hasClass('available');
      console.log("clientUnit --> ", clientUnit );

      if(isAvailable) {
        $("input#minCost").val(0);
        $("input#maxCost").val(clientUnit);

        $("#slider").slider("values",0,0);
        $("#slider").slider("values",1,clientUnit);

        sorter.byRange(0,clientUnit);
      }

    }

    // category Filter Handler
    function categoryFilterHandler(event) {
      var target,
          isClosed,
          isMainList,
          isSubList,
          isChecked,
          targetInput,
          inputId,
          isClear,
          inputs,
          ul, li,
          clearBtn,
          isDeleteBtn;

      target = $(event.target);
      isClosed = target.hasClass('closed');
      isMainList = target.hasClass('title');
      isSubList = target.hasClass('category-name');
      isClear = target.hasClass('clear-btn');
      isApply = target.hasClass('apply-btn');
      clearBtn = $('#gift .gift-header .selected-category .clear-btn');
      isDeleteBtn = target.hasClass('del-btn');

      if( !target.parents('.filter-by-category').length && !$('#gift .gift-header .filter-by-category p.title').hasClass('closed')) {
        $('#gift .gift-header .filter-by-category p.title').toggleClass('closed');
      }

      // toggle Main List or Sub List
      if( isMainList || isSubList ) {
        target.toggleClass('closed');
        return;
      }
      // toggle inputs checkbox
      if(  target.hasClass('txt') ) {
        targetInput = target.parent('li').find('input');
        isChecked = targetInput.is(':checked');

          if( isChecked ) {
            targetInput.prop( "checked", false );
          } else {
            targetInput.prop( "checked", true );
          }
        return;
      }
      // clear all input in filter-by-category
      if( isClear ) {
        console.log('clear');
        $('#gift .gift-header .filter-by-category input:checkbox').prop( "checked", false );
        ul = $('#gift .gift-header .selected-category ul').remove();
        // clearBtn hide
        if( ul.length ) {
          clearBtn.toggleClass('hide');
        }
        return;
      }

      // isApply
      if( isApply ) {
        selCategory = $('#gift .gift-header .filter-by-category input:checked').parent('li');
        if( !selCategory.length ) {
          return;
        }
        // close MainList
        $('#gift .gift-header .filter-by-category .title').toggleClass('closed');
        // remove old selected list
        ul = $('#gift .gift-header .selected-category ul').remove();
        // clearBtn hide
        if( ul.length ) {
          clearBtn.toggleClass('hide');
        }
        ul = $("<ul>");
        selCategory.each(function() {
          var clone = $(this).clone().append('<span class="del-btn">&times;</span>');
          ul.append(clone);
        })
        $('#gift .gift-header .selected-category').prepend(ul);
        clearBtn.toggleClass('hide');

        console.log(selCategory);
        sorter.byCategory(selCategory);
      }

      // delete btn
      if( isDeleteBtn ) {

        targetInput = target.parent('li').find('input');
        inputId = targetInput.attr("id");


        $('#'+inputId).prop( "checked", false );
        target.parent('li').remove();
        li = $('#gift .gift-header .selected-category ul li');

        if( !li.length ) {
          clearBtn.toggleClass('hide');
          $('#gift .gift-header .selected-category ul').remove();
        }

      }





    }



    // Сортировка может проводиться по возрастанию (ASC) или по убыванию (DESC).
    // по умолчанию предполагается режим сортировки по возрастанию (ASC).

    function SortGift() {
      var itemsContainer,
          items,
          itemsArr,
          wrapContainer;

      wrapContainer = $('#gift-items-wrap');
      itemsContainer = $('.gift .gift-body .items');
      items = $('.gift .gift-body .items .item');

      init();
      this.asc = asc;
      this.desc = desc;
      this.byRange = byRange;
      this.byCategory = byCategory;

      function init() {
        console.log('init');

        byRange(minCost,maxCost);
        items.sort(dirASC);
        render(items);

      };

      function asc() {
        console.log('asc');
        items.sort(dirASC);
        render(items);

        return this;
      };

      function desc() {
        console.log('desc');
        items.sort(dirDESC);
        render(items);

        return this;
      };

      function byRange(min, max) {
        var currentCost, self;
        console.log('byRange', min, max);

        $.each( items, function(){
          self = $(this);
          isRange(self, min, max);

        });

      };

      function isRange(item, min, max) {

        var itemCost = item.attr('_val');
        console.log('itemCost', min, max, itemCost );

        if( min <= itemCost && itemCost <= max ) {
          item.removeClass('hide');
          return true;
        } else {
          item.addClass('hide');
          return false;
        }

      };

      // compare function
      function dirASC(itemA, itemB) {

        itemA = $(itemA).attr('_val');
        itemB = $(itemB).attr('_val');
        return parseFloat(itemA) - parseFloat(itemB);
      };

      function dirDESC(itemA, itemB) {

        itemA = $(itemA).attr('_val');
        itemB = $(itemB).attr('_val');
        return parseFloat(itemB) - parseFloat(itemA);
      };

      function byCategory( categoryList ) {
        var resultArr,
            categoryFilter,
            itemAttr,
            li;

        items.addClass('hide');
        console.log('filter by category', categoryList);

        resultArr = [];
        giftList = [];
        categoryFilter = getCheckboxAttrArr(categoryList);
        console.log( 'categoryFilter', categoryFilter );




        // items.each(function() {
        $.each( items, function() {
          li = $(this);
          itemAttr = getGiftItemAttr( li );

          console.log('GiftAttr -- ', itemAttr);

          categoryFilter.each(function(i,filterItem) {
              console.log('FilterAttr -- ', filterItem);

              if( filterItem.attrgroup == itemAttr.attrgroup ) {
                if( itemAttr.codeattr.indexOf(filterItem.codeattr) === itemAttr.codeval.indexOf(filterItem.codeval)) {
                  console.log("filter ok -->", this);
                  if(isRange(li, minCost,maxCost)) {
                    resultArr.push(li);

                  }

                }
              }
          })


        })

        console.log('resultArr --> ', resultArr);


        // sorter.byRange(minCost,maxCost);
      };

      function getCheckboxAttrArr(items) {
        return items.map(function(i, item) {
            var input = $(item).find('input');

          return {
              attrgroup: input.attr('groupcode_'),
              codeval: input.attr('secondgroupcode_'),
              codeattr: input.attr('secondgroupsubcode_')

            }
          })
      };

      function getGiftItemAttr(li) {

        return {
          attrgroup: li.attr('attrgroup_'),
          codeval: li.attr('codeval_') ? li.attr('codeval_').split(',').filter(function(item) { return !!item}) : li.attr('codeval_'),
          codeattr: li.attr('codeattr_') ? li.attr('codeattr_').split(',').filter(function(item) { return !!item}) : li.attr('codeattr_')
        }
      };

      function checkItemByAttr(elem, attrObj) {

      }

      // render gifts list items
      function render(itemArr) {
      // remove itemsContainer
        wrapContainer.empty();

        $.each( itemArr, function( ){
          itemsContainer.append(this);
        });

        wrapContainer.append(itemsContainer);
      };

    };


})
