/**
 * Pomodoro Focus Engine
 */
export class PomodoroTimer {
    constructor(displayElement, onComplete) {
        this.display = displayElement;
        this.onComplete = onComplete;
        this.timeLeft = 25 * 60;
        this.timerId = null;
    }

    start() {
        if (this.timerId) return;
        this.timerId = setInterval(() => {
            this.timeLeft--;
            this.render();
            if (this.timeLeft <= 0) {
                this.pause();
                this.onComplete();
            }
        }, 1000);
    }

    pause() {
        clearInterval(this.timerId);
        this.timerId = null;
    }

    reset(minutes = 25) {
        this.pause();
        this.timeLeft = minutes * 60;
        this.render();
    }

    render() {
        const mins = Math.floor(this.timeLeft / 60).toString().padStart(2, '0');
        const secs = (this.timeLeft % 60).toString().padStart(2, '0');
        this.display.innerText = `${mins}:${secs}`;
    }
}