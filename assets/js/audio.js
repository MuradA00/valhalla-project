class AudioPlayer {

    events = {
        onPlayStart: [],
        onPlayEnd: [],
        onPause: [],
        onMuteOn: [],
        onMuteOff: [],
    };

    constructor(player) {
        this.audio = new Audio(player.getAttribute('src'));
        this.player = player;

        const playButtons = document.createElement('div');
        playButtons.classList.add('audio-player__play');
        this.player.appendChild(playButtons);

        this.playButton = document.createElement('div');
        this.playButton.classList.add('audio-player__play-start');
        this.playButton.classList.add('active');
        playButtons.appendChild(this.playButton);

        this.pauseButton = document.createElement('div');
        this.pauseButton.classList.add('audio-player__play-pause');
        playButtons.appendChild(this.pauseButton);

        this.seconds = document.createElement('div');
        this.seconds.classList.add('audio-player__seconds');
        this.seconds.innerText = this.formatSeconds(0, 0)
        this.player.appendChild(this.seconds);

        this.progressContainer = document.createElement('div');
        this.progressContainer.classList.add('audio-player__container');
        this.player.appendChild(this.progressContainer);

        this.progress = document.createElement('div');
        this.progress.classList.add('audio-player__progress');
        this.progressContainer.appendChild(this.progress);

        const muteButtons = document.createElement('div');
        muteButtons.classList.add('audio-player__mute');
        this.player.appendChild(muteButtons);

        this.muteButton = document.createElement('div');
        this.muteButton.classList.add('audio-player__mute-on');
        this.muteButton.classList.add('active');
        muteButtons.appendChild(this.muteButton);

        this.unmuteButton = document.createElement('div');
        this.unmuteButton.classList.add('audio-player__mute-off');
        muteButtons.appendChild(this.unmuteButton);

        this.playButton.addEventListener('click', event => {
            this.play();
        });

        this.pauseButton.addEventListener('click', event => {
            this.pause();
        });

        this.audio.addEventListener("timeupdate", event => {
            this.seconds.innerText = this.formatSeconds(this.audio.currentTime, this.audio.duration);
            this.progress.style.width = this.progressWidth(this.audio.currentTime, this.audio.duration) + '%';
        });

        this.audio.addEventListener('canplaythrough', event => {
            if (this.audio.currentTime <= 0 || this.audio.ended)
                this.seconds.innerText = this.formatSeconds(0, this.audio.duration);
        });

        this.audio.addEventListener('ended', event => {
            this.playButton.classList.add('active');
            this.pauseButton.classList.remove('active');
            this.seconds.innerText = this.formatSeconds(0, this.audio.duration);
            this.progress.style.width = this.progressWidth(0, this.audio.duration) + '%';
            this.dispatchEvents(this.events.onPlayEnd, {
                target: this,
            });
        });

        this.muteButton.addEventListener('click', event => {
            this.mute();
        });

        this.unmuteButton.addEventListener('click', event => {
            this.unmute();
        });

        this.progressContainer.addEventListener('click', event => {
            let x = event.layerX;
            let width = this.progressContainer.getBoundingClientRect().width;
            let seconds = x / width * this.audio.duration;
            this.audio.currentTime = seconds;
            this.progress.style.width = this.progressWidth(this.audio.currentTime, this.audio.duration) + '%';
            this.seconds.innerText = this.formatSeconds(this.audio.currentTime, this.audio.duration);
        });
    }

    formatSeconds(currentTime, duration) {
        return this.formatTime(currentTime) + ' / ' + this.formatTime(duration);
    }

    progressWidth(currentTime, duration) {
        return currentTime / duration * 100;
    }

    formatTime(time) {
        time = parseInt(time, 10);
        var hours = Math.floor(time / 3600);
        var minutes = Math.floor(time / 60) % 60;
        var seconds = time % 60;
        seconds = seconds < 10 ? "0" + seconds : seconds;
        if (hours > 0)
            return [hours, minutes, seconds].join(":")
        else
            return [minutes, seconds].join(":")
    }

    play() {
        this.audio.play();
        this.playButton.classList.remove('active');
        this.pauseButton.classList.add('active');

        this.dispatchEvents(this.events.onPlayStart, {
            target: this,
        });
    }

    pause() {
        this.audio.pause();
        this.playButton.classList.add('active');
        this.pauseButton.classList.remove('active');
        this.dispatchEvents(this.events.onPause, {
            target: this,
        });
    }

    mute() {
        this.audio.muted = true;
        this.muteButton.classList.remove('active');
        this.unmuteButton.classList.add('active');
        this.dispatchEvents(this.events.onMuteOn, {
            target: this,
        });
    }

    unmute() {
        this.audio.muted = false;
        this.muteButton.classList.add('active');
        this.unmuteButton.classList.remove('active');
        this.dispatchEvents(this.events.onMuteOff, {
            target: this,
        });
    }

    onPlayStart(func) {
        this.events.onPlayStart.push(func);
    }

    onPlayEnd(func) {
        this.events.onPlayEnd.push(func);
    }

    onPause(func) {
        this.events.onPause.push(func);
    }

    onMuteOn(func) {
        this.events.onMuteOn.push(func);
    }

    onMuteOff(func) {
        this.events.onMuteOff.push(func);
    }

    dispatchEvents(events, context) {
        Array.prototype.forEach.call(events, (event) => {
            event(context);
        });
    }
}