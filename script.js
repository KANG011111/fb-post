class FacebookTextConverter {
    constructor() {
        this.inputText = document.getElementById('input-text');
        this.outputText = document.getElementById('output-text');
        this.copyBtn = document.getElementById('copy-btn');
        this.inputCount = document.getElementById('input-count');
        this.outputCount = document.getElementById('output-count');
        this.emojiButtons = document.querySelectorAll('.emoji-btn');

        this.debounceTimer = null;
        this.debounceDelay = 300;

        this.init();
    }

    init() {
        this.bindEvents();
        this.updateUI();
    }

    bindEvents() {
        this.inputText.addEventListener('input', () => this.handleInput());
        this.inputText.addEventListener('paste', () => {
            setTimeout(() => this.handleInput(), 10);
        });

        this.copyBtn.addEventListener('click', () => this.copyToClipboard());

        this.emojiButtons.forEach(btn => {
            btn.addEventListener('click', (e) => this.insertEmoji(e.target.dataset.emoji, e.target));
        });

        document.addEventListener('DOMContentLoaded', () => {
            document.body.classList.add('fade-in');
        });
    }

    handleInput() {
        clearTimeout(this.debounceTimer);
        this.debounceTimer = setTimeout(() => {
            this.convertText();
            this.updateCharCounts();
            this.updateCopyButton();
        }, this.debounceDelay);
    }

    convertText() {
        const inputValue = this.inputText.value;

        if (!inputValue.trim()) {
            this.outputText.textContent = '轉換後的文字將在這裡顯示...';
            return;
        }

        const convertedText = this.insertZeroWidthSpaces(inputValue);

        // Use innerHTML to properly render emojis
        this.outputText.innerHTML = '';
        this.outputText.textContent = convertedText;
    }

    insertZeroWidthSpaces(text) {
        const zeroWidthSpace = '\u200B';

        // Replace spaces with "Space + Zero Width Space" to preserve multiple spaces
        let result = text.replace(/ /g, ' ' + zeroWidthSpace);

        // Replace newlines with "Newline + Zero Width Space" to preserve empty lines
        result = result.replace(/\n/g, '\n' + zeroWidthSpace);

        return result;
    }


    updateCharCounts() {
        const inputLength = this.inputText.value.length;
        const outputLength = this.outputText.textContent === '轉換後的文字將在這裡顯示...'
            ? 0
            : this.outputText.textContent.length;

        this.inputCount.textContent = inputLength;
        this.outputCount.textContent = outputLength;
    }

    updateCopyButton() {
        const hasContent = this.inputText.value.trim() &&
            this.outputText.textContent !== '轉換後的文字將在這裡顯示...';
        this.copyBtn.disabled = !hasContent;
    }

    async copyToClipboard() {
        try {
            const textToCopy = this.outputText.textContent;

            if (navigator.clipboard && window.isSecureContext) {
                await navigator.clipboard.writeText(textToCopy);
            } else {
                this.fallbackCopy(textToCopy);
            }

            this.showCopySuccess();
        } catch (error) {
            console.error('複製失敗:', error);
            this.fallbackCopy(this.outputText.textContent);
        }
    }

    fallbackCopy(text) {
        const textArea = document.createElement('textarea');
        textArea.value = text;
        textArea.style.position = 'fixed';
        textArea.style.opacity = '0';
        document.body.appendChild(textArea);
        textArea.focus();
        textArea.select();

        try {
            document.execCommand('copy');
            this.showCopySuccess();
        } catch (error) {
            console.error('備用複製方法也失敗:', error);
            alert('複製失敗，請手動選取文字複製');
        }

        document.body.removeChild(textArea);
    }

    showCopySuccess() {
        const originalText = this.copyBtn.textContent;
        this.copyBtn.textContent = '✅ 已複製！';
        this.copyBtn.classList.add('success');

        setTimeout(() => {
            this.copyBtn.textContent = originalText;
            this.copyBtn.classList.remove('success');
        }, 2000);
    }

    insertEmoji(emoji, button) {
        const cursorPosition = this.inputText.selectionStart;
        const textBefore = this.inputText.value.substring(0, cursorPosition);
        const textAfter = this.inputText.value.substring(this.inputText.selectionEnd);

        this.inputText.value = textBefore + emoji + textAfter;

        const newCursorPosition = cursorPosition + emoji.length;
        this.inputText.setSelectionRange(newCursorPosition, newCursorPosition);

        this.inputText.focus();

        this.handleInput();

        this.animateEmojiButton(button);
    }

    animateEmojiButton(button) {
        button.style.transform = 'scale(0.9)';
        setTimeout(() => {
            button.style.transform = '';
        }, 150);
    }

    updateUI() {
        this.updateCharCounts();
        this.updateCopyButton();
    }
}

document.addEventListener('DOMContentLoaded', () => {
    new FacebookTextConverter();
});

window.addEventListener('load', () => {
    const elements = document.querySelectorAll('.container > *');
    elements.forEach((el, index) => {
        setTimeout(() => {
            el.classList.add('fade-in');
        }, index * 100);
    });
});