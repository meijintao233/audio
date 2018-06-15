window.onload = function (){
    
   
    

    //公用
    const utils = {
       
        normalizeTime: function(time){
            var minute = (time / 60)|0;
            var sec = (time % 60)|0;
            minute = minute < 10? '0' + minute : minute;
            sec = sec < 10? '0' + sec : sec;
            return minute + ':' + sec;
        },

    }

    function Singleton(options){

        
        var defaults = {

        };

        

        this.opts = Object.assign({},defaults,options);
        
        this.player = document.getElementById('player');

        this.audio = this.player.querySelector('.audio');

        this.init();
        this.bind();
        this.ajax();
    }

    Singleton.prototype = {
        
        init(){
            this.dom = {
                v_percent: this.player.querySelector('.volume-percent'),//声音总大小
                v_line: this.player.querySelector('.volume-line'), //声音大小

                voice: this.player.querySelector('.voice'),
                player_mode: this.player.querySelector('.mode'),

                scrollbar: this.player.querySelector('.scrollbar'),
                scrollbar_wrap: this.player.querySelector('.scrollbar-wrap'),
                song_wrap: this.player.querySelector('.player-song-wrap'),
                song_list: this.player.querySelector('.player-song-list'),

                process: this.player.querySelector('.process'),

                p_update: this.player.querySelector('.process-update'),

                cur: this.player.querySelector('.cur'),
                all: this.player.querySelector('.total'),

                pic: this.player.querySelector('.player-pic'),
                menu: this.player.querySelector('.menu'),

                name: this.player.querySelector('.name'),               
                author: this.player.querySelector('.author'),

                ctrl: this.player.querySelector('.ctrl'),
            };
            
        },
        
        bind(){
            var that = this;

            var first = true;
            var isMove = false;
            var lastY = 0;
            var ratio;

            //切换暂停/播放
            this.dom.pic.addEventListener('click', this.toggle.bind(this));
            
            this.dom.process.addEventListener('click',function(e){
                var total = 270;
                var pos = e.offsetX;
                that.audio.currentTime = e.offsetX/total*duration;
                that.dom.p_update.style.width = e.offsetX/total*100+'%';
        
            });

            this.dom.menu.addEventListener('click',function(){
                that.dom.song_wrap.classList.toggle('hide');
                
                if(first){
                    ratio = (song_wrap.scrollHeight - song_wrap.offsetHeight)/(song_wrap.offsetHeight-scrollbar.offsetHeight);
                    console.log(ratio)
                    first = false;
        
                    
                }
            });


            this.dom.scrollbar_wrap.addEventListener('mousedown',function(e){
                isMove = true;
                lastY = e.pageY;
            });
            
            
            this.dom.scrollbar_wrap.addEventListener('mousemove',function(e){
                
                e.preventDefault();
                if(isMove){
                    
                    //向下滑动
                    if(that.dom.scrollbar.offsetTop > that.dom.scrollbar_wrap.offsetHeight-that.dom.scrollbar.offsetHeight){
                        that.dom.song_wrap.scrollTop = that.dom.song_wrap.scrollHeight-that.dom.song_wrap.offsetHeight;
                        that.dom.scrollbar.style.top = that.dom.scrollbar_wrap.offsetHeight-that.dom.scrollbar.offsetHeight + 'px';
                        that.dom.scrollbar_wrap.style.top = that.dom.song_wrap.scrollTop + 'px';
                        return;
                    }else if(that.dom.scrollbar.offsetTop<0){
                        
                        that.dom.scrollbar.style.top = 0 + 'px';
                        that.dom.song_wrap.scrollTop = 0;
                        return;
                    }
                    that.dom.song_wrap.scrollTop += (e.pageY-lastY) * ratio;
                    console.log(ratio)
                    that.dom.scrollbar.style.top = (+that.dom.scrollbar.style.top.replace('px','')) + (e.pageY-lastY) + 'px';
                    that.dom.scrollbar_wrap.style.top = that.dom.song_wrap.scrollTop + 'px';
                    // that.dom.scrollbar.style.top = song_wrap.scrollTop + song_wrap.scrollTop/ratio + 'px';
                    
                    
                    lastY = e.pageY; 
        
                }
        
            });
        
            this.dom.scrollbar_wrap.addEventListener('mouseup',function(e){
        
                isMove = false;
                
            });

            this.dom.v_percent.addEventListener('click',function(e){
        
                var total = 120;
        
                var percent = e.offsetX/total
                
                that.dom.v_line.style.width = percent*100+'%';
        
                that.audio.volume = percent;
        
            });


            var duration;
            var count = 0;
            
            this.audio.addEventListener('canplay',function(){
                duration = that.audio.duration|0
                that.dom.all.innerHTML = utils.normalizeTime(duration);
                
                var promise = that.audio.play();
                if(promise){
                    promise.then( () =>{
                        console.log(1)
                    }).catch( error =>{
                        
                    })
                }
                
            });
            
        
            this.audio.addEventListener('timeupdate',function(e){  
                var now = that.audio.currentTime|0;
                that.dom.cur.innerHTML = utils.normalizeTime(now)
        
                that.dom.p_update.style.width = now/duration*100+'%';
        
                // console.log(audio.currentTime|0)
        
            });
        
            this.audio.addEventListener('ended',function(){
                count++;
                console.log(count)
                if(count==data.length){
                    count = 0;
                }
                that.dom.name.innerHTML = data[count].name;
                that.dom.author.innerHTML = data[count].author;
                if(!that.audio.loop){
                    that.audio.src = data[count].music;
                }
            });


            var voice_rec;//记录声音大小
            this.dom.voice.addEventListener('click',()=>{
                this.dom.voice.classList.toggle('icon-voice-on');
                this.dom.voice.classList.toggle('icon-voice-off');

                voice_rec = audio.volume;

                if(this.dom.voice.classList.contains('icon-voice-on')){
                    //恢复原来声音大小
                    this.audio.muted = false;
                    this.audio.volume = voice_rec;
                    this.dom.v_line.style.width = voice_rec*100+'%';
                }else{
                    //把声音大小置0
                    this.audio.muted = true;
                    this.dom.v_line.style.width = 0;
                }

            });

            this.dom.player_mode.addEventListener('click',()=>{
                this.dom.player_mode.classList.toggle('icon-order');
                this.dom.player_mode.classList.toggle('icon-cycle');
                this.audio.loop = this.audio.loop?false:true;
                
            });

        },



        play(){
            
            this.audio.play();
            this.dom.ctrl.classList.toggle('player-on');
            this.dom.ctrl.classList.toggle('player-off');
        },

        pause(){
            this.audio.pause();
            this.dom.ctrl.classList.toggle('player-on');
            this.dom.ctrl.classList.toggle('player-off');
        },

        toggle(){
            
            this.audio.paused?this.play():this.pause();
        },

        ajax(){
            var data;
            var xhr = new XMLHttpRequest();
            xhr.open('get',"./music.json");
            xhr.send(null);
            xhr.onreadystatechange = ()=>{
                var DONE = 4;
                if(xhr.readyState==DONE){
                    console.log(JSON.parse(xhr.responseText))
                    data = JSON.parse(xhr.responseText).musicList;

                    this.audio.src = data[0].music;
                    this.dom.name.innerHTML = data[0].name;
                    this.dom.author.innerHTML = data[0].author;

                    var frag = document.createDocumentFragment();
                    for(var i=0;i<data.length;i++){
                        var li = document.createElement('li');
                        li.className += 'player-song line-after'; 
                        li.innerHTML = `<span class="song-index">${i+1}</span>
                        <span class="song-name">${data[i].name}</span>
                        <span class="song-author shengl">${data[i].author}</span>`
                        frag.appendChild(li);
                    }
                    this.dom.song_list.appendChild(frag);

                    
                }
            };
        }


    }


    var Audio = (function getInstance(){
        var instance;
        return function(opts){
            if(!instance){
                instance = new Singleton(opts);
 
            }   
            return instance;
        }
        
    })();


    var a = new Audio();

    
    

    

    







}