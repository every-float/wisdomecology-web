export default () => {
    // const baseWidth = 1920;
    const baseHeight = 1080;
    const baseHtmlFontSize = 100;

    setHtmlFontSize();
    window.addEventListener('resize', () => {
        setHtmlFontSize();
    });

    function setHtmlFontSize() {
        const heightScale = Math.min(baseHeight, window.innerHeight) / baseHeight;
        const fontSize = heightScale * baseHtmlFontSize;
        document.documentElement.style.fontSize = `${fontSize}px`;
    }
}