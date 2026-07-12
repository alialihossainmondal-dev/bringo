// Disable Right Click
document.addEventListener('contextmenu', event => event.preventDefault());

// Disable Text Selection (Fallback for CSS)
document.addEventListener('selectstart', event => event.preventDefault());

// Disable Zoom (Ctrl + Wheel)
document.addEventListener('wheel', function(e) {
    if (e.ctrlKey) { e.preventDefault(); }
}, { passive: false });
