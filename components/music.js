export default {
    addMusic() {
        let music = document.getElementById('music');
        let toggle = document.getElementById('switch');
        toggle.addEventListener('change', (e) => {
            if (e.target.checked) {
                music.play();
            }
            else {
                music.pause();
            }
        })
        
    }
}
