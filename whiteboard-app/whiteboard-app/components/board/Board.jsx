import React from "react";
import io from "socket.io-client";
import "./style.css";

class Board extends React.Component {
    timeout;
    socket = io.connect("http://localhost:8080");

    constructor(props) {
        super(props);

        this.socket.on("canvas-data", function(data){
            const image = new Image();
            const canvas = document.querySelector("#board");
            const ctx = canvas.getContext("2d");
            image.onload = function() {
                ctx.drawImage(image, 0, 0);
            };
            image.src = data;
        })
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

        canvas.addEventListener('mousedown', function() {
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
                root.socket.emit('canvas-data', base64ImageData);
            }, 200);
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