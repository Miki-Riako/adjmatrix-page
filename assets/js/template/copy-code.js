document.addEventListener('DOMContentLoaded', (event) => {
    // Find all code blocks
    const codeBlocks = document.querySelectorAll('.highlighter-rouge');

    codeBlocks.forEach((codeBlock) => {
        const code = codeBlock.querySelector('pre.highlight, pre > code');
        if (code) {
            const copyButton = document.createElement('button');
            copyButton.className = 'copy-code-button';
            copyButton.textContent = 'Copy';
            codeBlock.style.position = 'relative';
            codeBlock.appendChild(copyButton);
            copyButton.addEventListener('click', () => {
                const codeText = code.innerText || code.textContent;
                navigator.clipboard.writeText(codeText).then(() => {
                    copyButton.textContent = 'Copied!';
                    setTimeout(() => {
                        copyButton.textContent = 'Copy';
                    }, 2000);
                }).catch(err => {
                    // Error feedback
                    copyButton.textContent = 'Failed!';
                    console.error('Failed to copy text: ', err);
                });
            });
        }
    });
}); 