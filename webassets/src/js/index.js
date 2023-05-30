import hljs from "highlight.js";
import MarkdownIt from "markdown-it";
import MarkdownItTaskLists from 'markdown-it-task-lists';
import MarkdownItMultimdTable from 'markdown-it-multimd-table';
import katex from '@iktakahiro/markdown-it-katex';
import * as IncrementalDOM from 'incremental-dom';
import MarkdownItIncrementalDOM from 'markdown-it-incremental-dom';

import "./../css/gist.css";
import "./../css/monokai-sublime.css";
import "./../css/index.css";
import "./../css/copycode.css";
import "./../css/table.css";

let markdown = new MarkdownIt({
html: true,
breaks: true,
linkify: true
});

const postDocumentHeight = () => {
    var _body = document.body;
    var _html = document.documentElement;
//    var height = Math.max(
//                          _body.scrollHeight,
//                          _body.offsetHeight,
//                          _html.clientHeight,
//                          _html.scrollHeight,
//                          _html.offsetHeight
//                          );
    var height = _html.offsetHeight;
    console.log(height)
    window?.webkit?.messageHandlers?.updateHeight?.postMessage(height);
};

markdown
.use(MarkdownItTaskLists)
.use(katex)
.use(MarkdownItMultimdTable,{
multiline:  false,
rowspan:    false,
headerless: true,
multibody:  true,
aotolabel:  true,
})
.use(MarkdownItIncrementalDOM, IncrementalDOM);

function getLocalizedString(key) {
    const translations = {
    en: {
    copy: 'Copy',
    copied: 'Copied!',
    },
    zh: {
    copy: '复制',
    copied: '已经复制到剪贴板!',
    },
        // Add more languages and translations here
    };
    
    // Set the language you want to use (you can use navigator.language to get the user's language)
    const language = navigator.language.substring(0, 2) || 'en';
    
    // Return the translated string or fallback to English if the translation is not available
    return translations[language]?.[key] || translations.en[key];
}

function createCopyButton() {
    const button = document.createElement('button');
    button.classList.add('copy-btn');
    button.textContent = getLocalizedString('copy');
    button.addEventListener('click', (event) => {
        const pre = event.target.parentElement;
        const code = pre.querySelector('code');
        const textarea = document.createElement('textarea');
        textarea.value = code.textContent;
        document.body.appendChild(textarea);
        textarea.select();
        const successfulCopy = document.execCommand('copy');
        document.body.removeChild(textarea);
        
        if (successfulCopy) {
            const copiedMessage = pre.querySelector('.copied-msg');
            copiedMessage.style.display = 'block';
            setTimeout(() => {
                copiedMessage.style.display = 'none';
            }, 1500);
        }
    });
    return button;
}

function createCopiedMessage() {
    const copiedMessage = document.createElement('div');
    copiedMessage.classList.add('copied-msg');
    copiedMessage.textContent = getLocalizedString('copied');
    return copiedMessage;
}

function addCopyButtonsToPreElements() {
    const preElements = document.querySelectorAll('pre');
    preElements.forEach((pre) => {
        const button = createCopyButton();
        const copiedMessage = createCopiedMessage();
        pre.style.position = 'relative';
        pre.appendChild(button);
        pre.appendChild(copiedMessage);
    });
}


window.usePlugin = (plugin) => markdown.use(plugin);

window.showMarkdown = (percentEncodedMarkdown, enableImage = true, incremental = true) => {
    if (!percentEncodedMarkdown) {
        return;
    }
    
    const markdownText = decodeURIComponent(percentEncodedMarkdown);
    
    if (!enableImage) {
        markdown = markdown.disable("image");
    }
    
    if (!incremental) {
        let html = markdown.render(markdownText);
        document.getElementById("contents").innerHTML = html;
    } else {
        IncrementalDOM.patch(document.getElementById('contents'),
                             markdown.renderToIncrementalDOM(markdownText));
    }
    
    
    var imgs = document.querySelectorAll("img");
    
    imgs.forEach((img) => {
        img.loading = "lazy";
        img.onload = () => {
            postDocumentHeight();
        };
    });
    
    window.imgs = imgs;
    
    let tables = document.querySelectorAll("table");
    
    tables.forEach((table) => {
        table.classList.add("table");
    });
    
    let codes = document.querySelectorAll("pre code");
    
    codes.forEach((code) => {
        hljs.highlightBlock(code);
    });
    
    addCopyButtonsToPreElements();
    
    
    postDocumentHeight();
};
