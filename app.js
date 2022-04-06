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
          name: "Bởi vì yêu",
          singer: "Juky San",
          path: "./assets/music/bai1.mp3",
          image: "https://i.scdn.co/image/ab67616d0000b2732e4caaa908f3499465fdb45c"
        },
        {
          name: "Đế Vương",
          singer: "Đình Dũng",
          path: "./assets/music/bai2.mp3",
          image:
            "https://i.ytimg.com/vi/dD0-npKN6hs/maxresdefault.jpg"
        },
        {
          name: "Sài Gòn đau lòng quá",
          singer: "Mỹ Duyên",
          path:
            "./assets/music/bai3.mp3",
          image: "https://i.ytimg.com/vi/BdPk9ipvczM/maxresdefault.jpg"
        },
        {
          name: "Thức giấc",
          singer: "DA Lab",
          path: "./assets/music/bai4.mp3",
          image:
            "https://i.ytimg.com/vi/mjS1biSPKZw/maxresdefault.jpg"
        },
        {
          name: "Muộn rồi mà sao còn",
          singer: "Sơn Tùng M-TP",
          path: "./assets/music/bai5.mp3",
          image:
            "https://i.ytimg.com/vi/xypzmu5mMPY/maxresdefault.jpg"
        },
        {
          name: "Trên tình bạn, dưới tình yêu",
          singer: "Min X 16 Typh",
          path: "./assets/music/bai6.mp3",
          image:
            "https://i.scdn.co/image/ab67616d0000b273c7a101d54f57aed7b650b74c"
        },
        {
          name: "Phải chăng em đã yêu",
          singer: "Juki San",
          path: "./assets/music/bai7.mp3",
          image:
            "https://i.ytimg.com/vi/O81_4VAson4/maxresdefault.jpg"
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