document.addEventListener('DOMContentLoaded', (event) => {
    // Find all code blocks
    const codeBlocks = document.querySelectorAll('.highlighter-rouge');

    codeBlocks.forEach((codeBlock) => {
        // Create a button
        const copyButton = document.createElement('button');
        copyButton.className = 'copy-code-button';
        copyButton.textContent = 'Copy';

        // Get the container of the code block to append the button
        codeBlock.style.position = 'relative';
        codeBlock.appendChild(copyButton);

        // Add click event listener
        copyButton.addEventListener('click', () => {
            const code = codeBlock.querySelector('pre.highlight, pre > code');
            if (code) {
                const codeText = code.innerText || code.textContent;
                navigator.clipboard.writeText(codeText).then(() => {
                    // Success feedback
                    copyButton.textContent = 'Copyied!';
                    setTimeout(() => {
                        copyButton.textContent = 'Copy';
                    }, 2000);
                }).catch(err => {
                    // Error feedback
                    copyButton.textContent = 'Failed!';
                    console.error('Failed to copy text: ', err);
                });
            }
        });
    });
}); 