
export function setBackgroundColor(color: string) {
    document.body.style.backgroundColor = color;
    return Promise.resolve();
}

export function setFontSize(size: 'large'|'medium'|'small') {
    document.body.style.fontSize = size === 'large' ? '30px'
      : size === 'medium' ? '16px'
      : '10px';
    
    return Promise.resolve()
}