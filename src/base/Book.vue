<template>
    <div class="vue-booklet">
        <div class="select-page-wrapper-mobile" v-show="enableSelectPage && enableControl">
            <label for="select-page">{{translateText.selectPage}}: </label>
            <select id="select-page-mobile" v-on:change="selectPageMobile">
                <option v-for="pageNumber in totolPages" :key="pageNumber" :value="pageNumber">
                {{pageNumber}}
                </option>
            </select>
        </div>

        <div class="book closed" ref="book">
            <div class="pages" ref="pages">
                <div class="control-page control-page-left" v-show="enableControl" v-on:click="prevPage">
                    <div class="control-page-icon control-page-text-left">
                        <img class="img-responsive" src="../assets/arrow_left.png" />
                    </div>
                </div>
                <div class="control-page control-page-right" v-show="enableControl" v-on:click="nextPage">
                    <div class="control-page-icon control-page-text-right">
                        <img class="img-responsive" src="../assets/arrow_right.png" />
                    </div>
                </div>
                <slot></slot>
            </div>
        </div>

        <div class="select-page-wrapper" v-show="enableSelectPage && enableControl">
            <label for="select-page">{{translateText.selectPage}}: </label>
            <select id="select-page" v-on:change="selectPage">
                <option v-for="pageNumber in totolPages" :key="`toll${pageNumber}`" :ref="'page' + pageNumber" :value="pageNumber">
                {{pageNumber}}
                </option>
            </select>
        </div>

        <div class="page-number" v-show="displayPageNumber">
            {{translateText.pages}} : {{currentPageNum}} / {{totolPages}}
        </div>
        <div class="book-control-buttons" v-show="displayButton && enableControl">
            <button tabindex="0" class="book-control-button prev" v-show="!front" v-on:keyup.enter="prevPage" v-on:click="prevPage">
                {{translateText.prev}}
            </button>
            <button tabindex="0" class="book-control-button next" v-show="!back" v-on:keyup.enter="nextPage" v-on:click="nextPage">
                {{translateText.next}}
            </button>
        </div>
    </div>
</template>

<script>
export default {
  name: 'Book',
  data() {
    return {
      opened: false,
      front: true,
      back: false,
      clickable: true,
      totolPages: 0,
      currentPageNum: 1,
    };
  },
  props: {
    langcode: {
      type: String,
      default: 'en',
    },
    displayPageNumber: {
      type: Boolean,
      default : true,
    },
    displayButton: {
      type: Boolean,
      default: true,
    },
    enableControl: {
      type: Boolean,
      default: true,
    },
    enableSelectPage: {
      type: Boolean,
      default : true,
    },
    translation: {
      default: () =>{
        return JSON.stringify({
          'en': {
            'selectPage': 'Select page',
            'pages': 'Pages',
            'prev': 'Prev',
            'next': 'Next',
          },
          'zh-hant': {
            'selectPage': '跳至指定頁數',
            'pages': '頁數',
            'prev': '上一頁',
            'next': '下一頁',
          },
          'zh-hans': {
            'selectPage': '跳至指定页数',
            'pages': '页数',
            'prev': '上一页',
            'next': '下一页',
          },
        });
      }
    },
    pageTransitionTime: {
      type: Number,
      default: 0.8,
    },
    onOpened:{
      type: Function,
      default: () => {},
    },
    onFlipStart: {
      type: Function,
      default: () => {},
    },
    onFlipEnd: {
      type: Function,
      default: () => {},
    },
    onClosed: {
      type: Function,
      default: () => {},
    },
  },
  computed: {
    translateText: function() {
      const langcode = this.langcode;
      try{
        var translation = JSON.parse(this.translation);
      }catch(ex){
        var translation = this.translation;
      }
      return translation[langcode];
    }
  },
  mounted() {
    const book = this.$refs.book;
    const pages = this.$refs.pages;
    const initPage = this.initPage;
    const selectPage = this.selectPage;
    const selectPageMobile = this.selectPageMobile;
    const currentPageNum = this.currentPageNum;
    initPage();

    //Detect screen size and make all page visible on mobile on start
    if(window.innerWidth < 768){
      const pages = document.getElementsByClassName('page');
      for(let i = 0; i < pages.length; i++){
        const page = pages[i];
        page.style.visibility = 'visible';
      }
    }

    //Detect screen size and make all page visible on mobile on resize
    window.onresize = function(e){
      if(window.innerWidth < 768){
        const pages = document.getElementsByClassName('page');
        for(let i = 0; i < pages.length; i++){
          const page = pages[i];
          page.style.visibility = 'visible';
        }
      }else{
        selectPage();
      }
    }

    // Book opened event
    this.$on('onOpened', (position) => {
      this.opened = true;
      book.classList.add('opened');
      book.classList.remove('closed');
      book.classList.remove('closed-back');
      this.onOpened(book, position);
    });

    // Book page fliped event
    this.$on('onFlipStart', (direction) => {
      const currentPage = document.getElementsByClassName('currentPage')[0];
      const nextPages = this.getAllNextPage(currentPage);
      const prevPages = this.getAllPrevPage(currentPage);

      if(direction === 'prev'){
        //Hidden page for performance(Not inculde first previous page)
        prevPages.forEach((page, index) => {
          if(page.previousElementSibling){
            const prevPage = page.previousElementSibling;
            if(!prevPage.classList.contains('lastPage') && !prevPage.classList.contains('control-page')){
              page.previousElementSibling.style.visibility = 'hidden';
              page.previousElementSibling.style.zIndex = '-1';
            }else{
              page.previousElementSibling.style.visibility = 'hidden';
              page.previousElementSibling.style.zIndex = '-3';
            }
          }
        });
      }else{
        prevPages.forEach((page, index) => {
          if(page.previousElementSibling){
            const prevPage = page.previousElementSibling;
            //Will not hidden first and second previous page to make animation smooth
            if(!prevPage.classList.contains('control-page')){
              if(index !== 0){
                prevPage.style.visibility = 'hidden';
              }
              if(!prevPage.classList.contains('lastPage')){
                prevPage.style.zIndex = '-1';
              }else{
                prevPage.style.zIndex = '-3';
              }
            }
          }
        });
      }

      nextPages.forEach((page, index) => {
        //Will not hidden next page of current page to make animation smooth
        if(index !== 0){
          if(!page.classList.contains('lastPage')){
            page.style.visibility = 'hidden';
            page.style.zIndex = '-1';
          }else{
            page.style.visibility = 'hidden';
            page.style.zIndex = '-3';
          }
        }else{
          page.style.zIndex = '-1';
        }
      });

      this.onFlipStart(currentPage, direction);
    });

    this.$on('onFlipEnd', (direction) => {
      const currentPage = document.getElementsByClassName('currentPage')[0];
      const selecter = document.getElementById('select-page');
      const pageNumber = parseInt(currentPage.dataset.index);

      if(currentPage.classList.contains('lastPage') && currentPage.classList.contains('fliped')){
        this.currentPageNum = pageNumber + 1;
      }else{
        this.currentPageNum = pageNumber;
      }

      selecter.value = this.currentPageNum;

      if (currentPage.classList.contains('firstPage') && !currentPage.classList.contains('fliped')){
        this.front = true;
      } else {
        this.front = false;
      }

      if (currentPage.classList.contains('lastPage') && currentPage.classList.contains('fliped')) {
        this.back = true;
      } else {
        this.back = false;
      }

      this.onFlipEnd(currentPage, direction);
    });

    // Book closed event
    this.$on('onClosed', (position) => {
      const book = this.$refs.book;
      this.opened = false;

      book.classList.remove('opened');

      if(position === 'back'){
        book.classList.remove('closed');
        book.classList.add('closed-back');
      }else{
        book.classList.remove('closed-back');
        book.classList.add('closed');
      }
      this.onClosed(book, position);
    });
  },
  methods: {
    initPage(){
      let pages = document.getElementsByClassName('page');

      const firstPage = pages[0];
      const lastPage = pages[pages.length - 1];
      const pageTransitionTime = this.pageTransitionTime;

      firstPage.classList.add('firstPage');
      firstPage.classList.add('currentPage');

      for(let i = 0; i < pages.length; i++){
        const index = i + 1;
        const page = pages[i];
        page.style.zIndex = '-1';
        page.style.visibility = 'hidden';
        page.style.transition = 'transform ' + pageTransitionTime + 's';
        page.dataset.index = index;

        if(index % 2 === 0){
          page.classList.add('oven');
        }else{
          page.classList.add('odd');
        }
      }
      firstPage.style.visibility = 'visible';
      firstPage.style.zIndex = '3';

      if(firstPage.nextElementSibling){
        firstPage.nextElementSibling.style.visibility = 'visible';
        firstPage.nextElementSibling.style.zIndex = '2';
      }

      lastPage.classList.add('lastPage');

      this.totolPages = pages.length + 1;
    },
    nextPage() {
      const currentPage = document.getElementsByClassName('currentPage')[0];
      const nextPage = currentPage.nextElementSibling;
      const timeOut = this.pageTransitionTime * 4 * 100;

      if(this.clickable){
        this.clickable = false;
        // If current page is first page and book not opened
        if (currentPage.classList.contains('firstPage') && !this.opened) {
          this.$emit('onOpened', 'front');
        }

        if (currentPage.classList.contains('lastPage') && this.opened) {
          this.$emit('onClosed', 'back');
        }

        currentPage.classList.add('fliped');
        this.$emit('onFlipStart', 'next');

        //Display next page
        if (nextPage) {
          nextPage.style.visibility = 'visible';
        }

        setTimeout(() => {
          // If this page have next page, set it to current page
          if (nextPage) {
            nextPage.style.zIndex = '3';
            currentPage.style.zIndex = '1';
            currentPage.classList.remove('currentPage');
            nextPage.classList.add('currentPage');
          }
          this.clickable = true;
          this.$emit('onFlipEnd', 'next');
        }, timeOut);
      }
    },
    prevPage() {
      const currentPage = document.getElementsByClassName('currentPage')[0];
      const prevPage = currentPage.previousElementSibling;
      const timeOut = this.pageTransitionTime * 4 * 100;

      if(this.clickable){
        this.clickable = false;
        this.$emit('onFlipStart', 'back');

        // If user click on cover and book not opened
        if (prevPage && !prevPage.classList.contains('control-page')) {
          // If last page fliped, undo flip only
          if(currentPage.classList.contains('lastPage') && currentPage.classList.contains('fliped')){
            currentPage.classList.remove('fliped');
          }else{
            currentPage.style.zIndex = '1';
            currentPage.classList.remove('currentPage');
            prevPage.style.zIndex = '3';
            prevPage.classList.remove('fliped');
            prevPage.classList.add('currentPage');
          }

          if(prevPage.previousElementSibling){
            prevPage.previousElementSibling.style.visibility = 'visible';
          }

          //If current page is last page , book not opened and it is not filped, open the book
          if (currentPage.classList.contains('lastPage') && !currentPage.classList.contains('fliped') && !this.opened) {
            this.$emit('onOpened', 'back');
          }

          //If previous page is first page and book not opened, close the book
          if (prevPage.classList.contains('firstPage') && !prevPage.classList.contains('fliped') && this.opened) {
            this.$emit('onClosed', 'front');
          }

        }else{
          if(currentPage.classList.contains('firstPage') && currentPage.classList.contains('fliped')){
            this.$emit('onClosed', 'front');
            currentPage.classList.remove('fliped');
          }
        }

        setTimeout(() => {
          this.clickable = true;
          this.$emit('onFlipEnd', 'back');
        }, timeOut);
      }
    },
    selectPage(){
      const currentPageNum = this.currentPageNum;
      const selectedPageNum = document.querySelector('#select-page').value;
      if(parseInt(selectedPageNum) > currentPageNum){
        this.movePage(selectedPageNum, 'next');
      }else{
        this.movePage(selectedPageNum, 'prev');
      }
    },
    movePage(index, direction){
      const currentPage = document.getElementsByClassName('currentPage')[0];
      var selectedPage = document.querySelector('[data-index="' + index + '"]');
      const timeOut = this.pageTransitionTime * 4 * 100;

      if(!selectedPage){
        selectedPage = document.getElementsByClassName('lastPage')[0];
        selectedPage.classList.add('fliped');
        this.$emit('onClosed', 'back');
      }else{
        //Set selected page to current page and top
        setTimeout(() => {
          selectedPage.classList.remove('fliped');
        }, 100);

        //If book is closed, opened it
        if (!this.opened) {
          this.$emit('onOpened', 'front');
        }
      }

      const prevPages = Array.from(this.getAllPrevPage(selectedPage));
      const nextPages = Array.from(this.getAllNextPage(selectedPage));

      currentPage.classList.remove('currentPage');
      selectedPage.classList.add('currentPage');
      selectedPage.style.visibility = 'visible';
      selectedPage.style.zIndex = 3;

      if(selectedPage.classList.contains('firstPage') && selectedPage.nextElementSibling){
        this.$emit('onClosed', 'front');
      }

      //Flip all of the previous page
      prevPages.forEach(function(page, index){
        if(index === 0){
          page.style.zIndex = '1';
        }
        page.style.visibility = 'visible';
        setTimeout(() => {
          page.classList.add('fliped');
        }, 50);
      });

      //Hidden other pages
      nextPages.forEach(function(page){
        page.style.visibility = 'visible';
        page.classList.remove('fliped');
      });

      this.$emit('onFlipStart', direction);

      setTimeout(() => {
        this.$emit('onFlipEnd', direction);
      }, timeOut);
    },
    selectPageMobile(){
      const selectedPageNum = document.querySelector('#select-page-mobile').value;
      const lastPageNum = parseInt(selectedPageNum) - 1;
      var selectedPage = document.querySelector('[data-index="' + selectedPageNum + '"]');
      if(!selectedPage){
        selectedPage = document.querySelector('[data-index="' + lastPageNum + '"]');
      }
      selectedPage.scrollIntoView();
    },
    getAllPrevPage(currentPage){
      const pages = [];
      let prevPage = currentPage.previousElementSibling;
      while (prevPage) {
        if(prevPage.classList.contains('control-page')){
          break;
        }
        pages.push(prevPage);
        prevPage = prevPage.previousElementSibling;
      }
      return pages;
    },
    getAllNextPage(currentPage){
      const pages = [];
      let nextPage = currentPage.nextElementSibling;
      while (nextPage) {
        if(nextPage.classList.contains('control-page')){
          break;
        }
        pages.push(nextPage);
        nextPage = nextPage.nextElementSibling;
      }
      return pages;
    },
  },
};
</script>
<style scoped lang="scss">
    .cover{
        background-color: #BCA98A;
    }

    .book-control-buttons{
        display: none;
    }

    .control-page{
        display: none;
    }

    .book{
        .page{
            .content{
                border: 1px solid #ddd;
                padding: 5%;
                margin-bottom: 0.5em;
                text-align: left;
            }
        }
    }

    .select-page-wrapper{
        display: none;
        margin-top: 1em;
        font-size: 1.2em;
        text-align: center;

        select{
            margin-left: 1em;
            width: 20%;
        }
    }

    .select-page-wrapper-mobile{
        display: block;
        text-align: center;
        font-size: 1.2em;
        margin-top: 1.2em;
        margin-bottom: 1em;

        select{
            margin-left: 1em;
            width: 20%;
        }
    }

    .page-number{
        display: none;
        margin-top: 1em;
        margin-bottom: 1em;
        font-size: 1.2em;
        text-align: center;
    }

    @media (min-width: 768px) {
        .vue-booklet{
            width: 100%;
            height: 120vh;
            max-height: 650px;
            margin: 0.5em;
            -webkit-transform-style: preserve-3d;
            -moz-transform-style: preserve-3d;
            transform-style: preserve-3d;
        }

        .book{
            font-family: Book Antiqua, Palatino, Palatino Linotype, Palatino LT STD, Georgia, serif;
            position: relative;
            width: 100%;
            height: 100%;
            -webkit-transform-style: preserve-3d;
            -moz-transform-style: preserve-3d;
            transform-style: preserve-3d;
            transition: all .8s;
        }

        .control-page{
            position: absolute;
            display: flex;
            align-items:center;
            justify-content: center;
            width: 100px;
            height: 100%;
            z-index: 99;
            transition: all .3s;
            cursor: pointer;
            opacity: 0;
            background-image: -webkit-linear-gradient(left, rgba(0, 0, 0, 0.5) 0%, rgba(0, 0, 0, 0.0001) 100%);
            background-image: -o-linear-gradient(left, rgba(0, 0, 0, 0.5) 0%, rgba(0, 0, 0, 0.0001) 100%);
            background-image: linear-gradient(to right, rgba(0, 0, 0, 0.5) 0%, rgba(0, 0, 0, 0.0001) 100%);
            background-repeat: repeat-x;

            &:hover{
                opacity: 0.5;
            }
        }

        .control-page-left{
            left: 0;
        }

        .control-page-right{
            right: 0;
            background-image: -webkit-linear-gradient(right, rgba(0, 0, 0, 0.5) 0%, rgba(0, 0, 0, 0.0001) 100%);
            background-image: -o-linear-gradient(right, rgba(0, 0, 0, 0.5) 0%, rgba(0, 0, 0, 0.0001) 100%);
            background-image: linear-gradient(to left, rgba(0, 0, 0, 0.5) 0%, rgba(0, 0, 0, 0.0001) 100%);
        }

        .book-control-buttons{
            display: block;
            text-align: center;
        }

        .book-control-button{
            width: 75px;
            height: 40px;
            border: 0;
            border-radius: 2px;
            color: #ffffff;
            background-color: #72B890;
            font-size: 16px;
            transition: all 0.3s;
            margin-top: 1em;
            margin-bottom: 1em;
            margin-right: 1em;

            &:hover, &:focus{
                color: #ffffff;
                background-color: #759C86;
                border-color: #72B890;
            }
        }

        .closed{
            -webkit-transform: translateX(-25%);
            transform: translateX(-25%);
        }

        .closed-back{
            -webkit-transform: translateX(25%);
            transform: translateX(25%);
        }

        .opened{
            -webkit-transform: translateX(-1vw);
            transform: translateX(-1vw);
        }

        .page-number{
            display: block;
        }

        .select-page-wrapper{
            display: block;
        }

        .select-page-wrapper-mobile{
            display: none;
        }

        .page{
            position: absolute;
            width: 50%;
            height: 100%;
            color: #222;
            background-color: white;
            top: 0;
            right: 0;
            transform-origin: 0 50%;
            border: 1px solid #ddd;
            background: linear-gradient(to right, #d9d9d9 0%,#f9f9f9 3%,#ffffff 8%,#ffffff 100%);
            -webkit-transform-style: preserve-3d;
            -moz-transform-style: preserve-3d;
            transform-style: preserve-3d;

            .content{
                position: absolute;
                width: 100%;
                max-width: 100%;
                height: 100%;
                padding: 5%;
                border: none;
                transform-origin: center center;
                backface-visibility: hidden;
                overflow: auto;
                -webkit-transform-style: preserve-3d;
                -moz-transform-style: preserve-3d;
                transform-style: preserve-3d;

                &:nth-child(1){
                    -webkit-transform: translateZ(1px);
                    -moz-transform: translateZ(1px);
                    transform: translateZ(1px);
                }

                &:nth-child(2){
                    -webkit-transform: rotateY(180deg) translateZ(1px);
                    -moz-transform: rotateY(180deg) translateZ(1px);
                    transform: rotateY(180deg) translateZ(1px);
                }
            }
        }

        .pages{
            position: relative;
            height: 100%;
        }

        .cover{
            background: none;
            background-color: #BCA98A;
        }

        .fliped{
            -webkit-transform: rotateY(-180deg) translateZ(1px);
            transform: rotateY(-180deg) translateZ(1px);
        }

        .progress{
            width:100%;
            height:20px;
            background-color: #ccc;
            overflow: hidden;
            cursor: pointer;
        }
        .left{
            height:100%;
            width: 30%;
            background-color: greenyellow;
            position: relative;
        }
        .ball{
            height:100%;
            width:20px;
            -webkit-border-radius:10px;
            -moz-border-radius:10px;
            border-radius:10px;
            background-color: red;
            position: absolute;
            right: -10px;
        }
    }

    .back{
        background: none;
        background-color: #BCA98A;
    }

</style>
