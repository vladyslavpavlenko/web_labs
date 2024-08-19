import React from "react";
import "./style.css";

class Board extends React.Component {
    timeout;

    constructor(props) {
        super(props);
    }

    componentDidMount() {
        this.drawOnCanvas();
    }

    drawOnCanvas() {
        const canvas = document.querySelector('#board');
        const ctx = canvas.getContext('2d');

        const sketch = document.querySelector('#sketch');
        const sketch_style = getComputedStyle(sketch);
        canvas.width = parseInt(sketch_style.getPropertyValue('width'));
        canvas.height = parseInt(sketch_style.getPropertyValue('height'));

        const mouse = {x: 0, y: 0};
        const last_mouse = {x: 0, y: 0};

        canvas.addEventListener('mousemove', function(event) {
            last_mouse.x = mouse.x;
            last_mouse.y = mouse.y;

            mouse.x = event.pageX - this.offsetLeft;
            mouse.y = event.pageY - this.offsetTop;
        }, false);


        ctx.lineWidth = 5;
        ctx.lineJoin = 'round';
        ctx.lineCap = 'round';
        ctx.strokeStyle = 'blue';

        canvas.addEventListener('mousedown', function(e) {
            canvas.addEventListener('mousemove', onPaint, false);
        }, false);

        canvas.addEventListener('mouseup', function() {
            canvas.removeEventListener('mousemove', onPaint, false);
        }, false);

        const root = this;
        const onPaint = function() {
            ctx.beginPath();
            ctx.moveTo(last_mouse.x, last_mouse.y);
            ctx.lineTo(mouse.x, mouse.y);
            ctx.closePath();
            ctx.stroke();

            if (root.timeout !== undefined) clearTimeout(root.timeout);
            root.timeout = setTimeout(function (){
                const base64ImageData = canvas.toDataURL('image/png');
            }, 1000);
        };
    }

    render() {
        return (
            <div className="sketch" id="sketch">
                <canvas id="board" className="board"></canvas>
            </div>
        )
    }
}

export default Board;