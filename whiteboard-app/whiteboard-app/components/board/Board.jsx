import React from "react";
import io from "socket.io-client";
import "./style.css";

class Board extends React.Component {
    timeout;
    socket = io.connect("http://localhost:8080");

    ctx;
    isDrawing = false;

    constructor(props) {
        super(props);

        this.socket.on("canvas-data", (data) => {
            const root = this;
            const interval = setInterval(function() {
                if (root.isDrawing) return;
                root.isDrawing = true;
                clearInterval(interval);

                const image = new Image();
                const canvas = document.querySelector("#board");
                const ctx = canvas.getContext("2d");
                image.onload = function() {
                    ctx.drawImage(image, 0, 0);
                    root.isDrawing = false;
                };
                image.src = data;
            }, 200);
        });

        this.socket.on("clear-canvas", () => {
            this.clearCanvas(true);
        });
    }

    componentDidMount() {
        this.drawOnCanvas();
        this.loadCanvas();
        window.addEventListener('resize', this.updateCanvasSize.bind(this));
    }

    componentWillUnmount() {
        window.removeEventListener('resize', this.updateCanvasSize.bind(this));
    }

    componentWillReceiveProps(newProps) {
        this.ctx.strokeStyle = newProps.color;
        this.ctx.lineWidth = newProps.size;
    }

    updateCanvasSize() {
        const canvas = document.querySelector('#board');
        const sketch = document.querySelector('#sketch');
        const sketch_style = getComputedStyle(sketch);
        const imageData = this.ctx.getImageData(0, 0, canvas.width, canvas.height);

        canvas.width = parseInt(sketch_style.getPropertyValue('width'));
        canvas.height = parseInt(sketch_style.getPropertyValue('height'));

        this.ctx.putImageData(imageData, 0, 0);
    }

    drawOnCanvas() {
        const canvas = document.querySelector('#board');
        this.ctx = canvas.getContext('2d');

        this.updateCanvasSize();

        const mouse = { x: 0, y: 0 };
        const last_mouse = { x: 0, y: 0 };

        canvas.addEventListener('mousemove', function(event) {
            last_mouse.x = mouse.x;
            last_mouse.y = mouse.y;

            mouse.x = event.pageX - this.offsetLeft;
            mouse.y = event.pageY - this.offsetTop;
        }, false);

        this.ctx.lineJoin = 'round';
        this.ctx.lineCap = 'round';

        canvas.addEventListener('mousedown', () => {
            canvas.addEventListener('mousemove', onPaint, false);
        }, false);

        canvas.addEventListener('mouseup', () => {
            canvas.removeEventListener('mousemove', onPaint, false);
        }, false);

        const root = this;
        const onPaint = function() {
            root.ctx.beginPath();
            root.ctx.moveTo(last_mouse.x, last_mouse.y);
            root.ctx.lineTo(mouse.x, mouse.y);
            root.ctx.closePath();
            root.ctx.stroke();

            if (root.timeout !== undefined) clearTimeout(root.timeout);
            root.timeout = setTimeout(function() {
                const base64ImageData = canvas.toDataURL('image/png');
                root.socket.emit('canvas-data', base64ImageData);
                root.saveCanvas(base64ImageData);
            }, 200);
        };
    }

    saveCanvas(imageData) {
        localStorage.setItem('canvasImage', imageData);
    }

    loadCanvas() {
        const canvas = document.querySelector('#board');
        const ctx = canvas.getContext('2d');
        const imageData = localStorage.getItem('canvasImage');
        if (imageData) {
            const image = new Image();
            image.src = imageData;
            image.onload = () => {
                ctx.drawImage(image, 0, 0);
            };
        }
    }

    clearCanvas(skipEmit = false) {
        const canvas = document.querySelector('#board');
        this.ctx.clearRect(0, 0, canvas.width, canvas.height);
        localStorage.removeItem('canvasImage');
        if (!skipEmit) {
            this.socket.emit('clear-canvas');
        }
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