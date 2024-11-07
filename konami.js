const konamiCode = [38, 38, 40, 40, 37, 39, 37, 39, 66, 65]; // Konami Code sequence (Up, Up, Down, Down, Left, Right, Left, Right, B, A)
let konamiPosition = 0;
let lastKeyTime = Date.now();

document.addEventListener('keydown', function(event) {
    const currentTime = Date.now();
    const key = event.keyCode;
    
    // Reset if more than 200ms passed since the last key
    if (currentTime - lastKeyTime > 350) {
        konamiPosition = 0;
    }
    
    // Check if the key is the next in the Konami Code sequence
    if (key === konamiCode[konamiPosition]) {
        konamiPosition++;
        
        // Check if the entire Konami Code was entered successfully
        if (konamiPosition === konamiCode.length) {
            window.location.href = "bibliogame/index.html"; // Replace 'anotherpage.html' with your desired file path

            konamiPosition = 0; // Reset for future use
        }
    } else {
        konamiPosition = 0; // Reset if a wrong key is pressed
    }
    
    lastKeyTime = currentTime; // Update the last key press time
});
