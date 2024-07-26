document.getElementById('changeColorButton').addEventListener('click', function() {

    const boxes = document.querySelectorAll('.box');
    const colors = ['lightcoral', 'lightgreen', 'lightblue', 'lightpink', 'lightgoldenrodyellow', 'lightblue'];
    boxes.forEach(box => {
        const randomColor = colors[Math.floor(Math.random() * colors.length)];
        box.style.backgroundColor = randomColor;
    });
});
