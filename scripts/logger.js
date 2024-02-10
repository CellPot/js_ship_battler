class Logger {
    constructor() {
    }

    log(text) {
        throw new Error('log method should be implemented in extension');
    }

    clearLog() {
        throw new Error('clearLog method should be implemented in extension');
    }
}

class ConsoleLogger extends Logger {
    constructor() {
        super();
    }

    log(text) {
        console.log(text);
    }

    clearLog() {
        console.clear();
    }
}

class TextFieldConsoleLogger extends ConsoleLogger {
    constructor(logArea) {
        super();
        this.logArea = logArea;
        this.logArea.value = 'This is log console';
        this.logArea.style.color = "white";
        this.logArea.style.backgroundColor = "black";
        this.logArea.style.lineHeight = "1.5";
    }

    log(text) {
        super.log(text);
        let cachedScrollAdherence = this.isScrollAtBottom();
        this.logArea.value += this.getFormattedTime() + ': ' + text + '\n';
        if (cachedScrollAdherence) {
            this.moveScrollToBottom();
        }
    }

    moveScrollToBottom() {
        this.logArea.scrollTop = this.logArea.scrollHeight;
    }

    isScrollAtBottom() {
        return this.logArea.scrollTop + this.logArea.clientHeight >= this.logArea.scrollHeight;
    }

    getFormattedTime() {
        let now = new Date();
        return `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}:${now.getSeconds().toString().padStart(2, '0')}`;
    }

    clearLog() {
        super.clearLog();
        this.logArea.value = '';
    }
}