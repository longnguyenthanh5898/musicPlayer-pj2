const $ = document.querySelector.bind(document)
const $$ = document.querySelectorAll.bind(document)
const cd = $('.db__cd')
const playlist = $('.playlist')
const heading = $('.db__header h2')
const cdTumble = $('.db__cd-tumble')
const audio = $('#audio')
const playBtn = $('.db__control-toggle')
const progress = $('#progress')
const prevBtn = $('.db__control-prev')
const nextBtn = $('.db__control-next')
const randomBtn = $('.db__control-random')
const replayBtn = $('.db__control-replay')

const app = {
    currentIndex: 0,
    isPlaying: false,
    isRandom: false,
    isReplay: false,

    songs: [
        {
          name: "Boi vi em thay nho anh",
          singer: "Juky San",
          path: "./assets/music/bai1.mp3",
          image: "https://i.ytimg.com/vi/jTLhQf5KJSc/maxresdefault.jpg"
        },
        {
          name: "De vuong",
          singer: "Dinh Dung",
          path: "./assets/music/bai2.mp3",
          image:
            "https://1.bp.blogspot.com/-kX21dGUuTdM/X85ij1SBeEI/AAAAAAAAKK4/feboCtDKkls19cZw3glZWRdJ6J8alCm-gCNcBGAsYHQ/s16000/Tu%2BAana%2BPhir%2BSe%2BRap%2BSong%2BLyrics%2BBy%2BRaftaar.jpg"
        },
        {
          name: "Sai gon dau long qua",
          singer: "My Duyen",
          path:
            "./assets/music/bai3.mp3",
          image: "https://i.ytimg.com/vi/QvswgfLDuPg/maxresdefault.jpg"
        },
        {
          name: "Thuc giac",
          singer: "DA Lab",
          path: "./assets/music/bai4.mp3",
          image:
            "https://a10.gaanacdn.com/images/song/39/24225939/crop_480x480_1536749130.jpg"
        },
        {
          name: "Muon roi ma sao con",
          singer: "Tung nui",
          path: "./assets/music/bai5.mp3",
          image:
            "https://a10.gaanacdn.com/images/albums/72/3019572/crop_480x480_3019572.jpg"
        },
        {
          name: "Tren tinh ban, duoi tinh yeu",
          singer: "Min X 16 Typh",
          path: "./assets/music/bai6.mp3",
          image:
            "https://i.scdn.co/image/ab67616d0000b273c7a101d54f57aed7b650b74c"
        },
        {
          name: "Phai chang em da yeu",
          singer: "Juki San",
          path: "./assets/music/bai7.mp3",
          image:
            "https://a10.gaanacdn.com/gn_img/albums/YoEWlabzXB/oEWlj5gYKz/size_xxl_1586752323.webp"
        }
    ],
    render: function(){
       const htmls = this.songs.map((song, index) =>{
           return `
           <div class="pl__item ${index === this.currentIndex ? 'active' : ''}" index="${index}" >
                <div class="pl__img" 
                    style="background-image: url('${song.image}')">
                    
                </div>
                <div class="pl__song">
                    <h3 class="pl__name">${song.name}</h3>
                    <p class="pl__author">${song.singer}</p>
                </div>
                <div class="pl__option">
                    <i class="fa-solid fa-circle-ellipsis"></i>
                </div>
            </div>
           `
       })
       playlist.innerHTML = htmls.join('')
    },
    defineProperties: function(){
        Object.defineProperty(this, 'currentSong', {
          get: function(){
            return this.songs[this.currentIndex]
          }
        })
    },
    loadCurrentSong: function(){
  
      heading.textContent = this.currentSong.name
      cdTumble.style.backgroundImage = `url('${this.currentSong.image}')`
      audio.src = this.currentSong.path

    },
    handleEvents: function(){
        const _this = this
        const cdWidth = cd.offsetWidth
        //scroll screen
        document.onscroll = function(){
            const scrollTop = window.scrollY
            const newCdWidth = cdWidth - scrollTop
            cd.style.width = newCdWidth > 0 ? newCdWidth + 'px' : 0
            cd.style.opacity = newCdWidth / cdWidth
        }
        // click button play 
        playBtn.onclick = function(){
          if(_this.isPlaying){
            audio.pause()
          } else{
            audio.play()
          }
        }
        // audio play
        audio.onplay = function(){
          _this.isPlaying = true
          playBtn.classList.add('playing')
          cdAnimateTumble.play()
        }
        // audio pause
        audio.onpause = function(){
          _this.isPlaying = false
          playBtn.classList.remove('playing')
          cdAnimateTumble.pause()
        }
        //
        audio.ontimeupdate = function(){
          if(audio.duration){
            const progressPercent = Math.floor(audio.currentTime / audio.duration * 100)
            progress.value = progressPercent
          }
        }
        // seek song
        progress.onchange = function(e){
         const seekTime = e.target.value * (audio.duration) / 100
         audio.currentTime = seekTime
        }
        // cd tumble 
        const cdAnimateTumble = cd.animate(
          [{
            transform: 'rotate(360deg)'
          }],
          {
            duration: 18000,
            iterations: Infinity
          }
        )
        cdAnimateTumble.pause()
        // next song
        nextBtn.onclick = function(){
          if(_this.isRandom){
            _this.randomSong()
          }else{
            _this.nextSong()
          }
          audio.play()
          _this.render()
          _this.scrollActiveSong()
        }
        //prev song
        prevBtn.onclick = function(){
          if(_this.isRandom){
            _this.randomSong()
          } else{
            _this.prevSong()
          }
          audio.play()
          _this.render()
          _this.scrollActiveSong()
        }
        // random song
        randomBtn.onclick = function(){
          _this.isRandom = ! _this.isRandom
          randomBtn.classList.toggle('active', _this.isRandom)
        }
        // replay song
        replayBtn.onclick = function(){
          _this.isReplay = ! _this.isReplay
          replayBtn.classList.toggle('active', _this.isReplay)
        }
        //audio ended
        audio.onended = function(){
          if(_this.isReplay){
            audio.play()
          }
          else{
            nextBtn.click()
          }
        }
        // click song
        playlist.onclick = function(e){
          const songIndex = e.target.closest('.pl__item')
          if(songIndex){
            _this.currentIndex = Number(songIndex.getAttribute('index'))
          }
          _this.loadCurrentSong()
          audio.play()
          _this.render()
        }
        
      
    },
    nextSong: function() {
      this.currentIndex++
      if(this.currentIndex >= this.songs.length){
        this.currentIndex = 0
      }
      this.loadCurrentSong()
      
    },
    prevSong: function(){
      this.currentIndex--
      if(this.currentIndex < 0){
        this.currentIndex = this.songs.length -1
      }
      this.loadCurrentSong()
    },
    randomSong: function(){
      this.currentIndex = Math.floor(Math.random() * this.songs.length)
       
      this.loadCurrentSong()
    },
    scrollActiveSong: function(){
      setTimeout(()=>{
        $('.pl__item.active').scrollIntoView({
          behavior: 'smooth',
          block: 'nearest',
        })
      }, 300)
    },
    start: function(){
        this.defineProperties()
        this.handleEvents()
        this.loadCurrentSong()
        this.render()
        
    }
}

app.start()