import React from "react";
import Board from "../board/Board";
import "./style.css";
import { ColorInput, Slider, IconButton } from "@telegram-apps/telegram-ui";
import { IconCircleFilled, IconPointFilled, IconEraser, IconBrush, IconTrash, IconTrashX } from "@tabler/icons-react";

class Container extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            color: localStorage.getItem('color') || "#000000",
            size: parseInt(localStorage.getItem('size')) || 5,
            isEraser: JSON.parse(localStorage.getItem('isEraser')) || false,
            isHovered: false,
        };

        this.boardRef = React.createRef();
    }

    componentDidUpdate(prevProps, prevState) {
        // Save state to localStorage whenever it changes
        if (prevState.color !== this.state.color) {
            localStorage.setItem('color', this.state.color);
        }
        if (prevState.size !== this.state.size) {
            localStorage.setItem('size', this.state.size);
        }
        if (prevState.isEraser !== this.state.isEraser) {
            localStorage.setItem('isEraser', this.state.isEraser);
        }
    }

    changeColor(params) {
        this.setState({
            color: params.target.value,
            isEraser: false,
        });
    }

    changeSize(value) {
        this.setState({
            size: value,
        });
    }

    selectBrush() {
        this.setState({
            isEraser: false,
        });
    }

    selectEraser() {
        this.setState({
            isEraser: true,
        });
    }

    clearCanvas() {
        if (this.boardRef.current) {
            this.boardRef.current.clearCanvas();
        }
    }

    handleMouseEnter = () => {
        this.setState({ isHovered: true });
    }

    handleMouseLeave = () => {
        this.setState({ isHovered: false });
    }

    render() {
        return (
            <div className="container">
                <div className="tools-container">
                    <ColorInput
                        header="Color"
                        placeholder="Select color"
                        value={this.state.color}
                        onChange={this.changeColor.bind(this)}
                    />
                    <Slider
                        header="Size"
                        min={1}
                        max={60}
                        step={1}
                        value={this.state.size}
                        onChange={this.changeSize.bind(this)}
                        before={
                            <div style={{ color: 'var(--tgui--secondary_hint_color)' }}>
                                <IconPointFilled size={15} />
                            </div>
                        }
                        after={
                            <div style={{ color: 'var(--tgui--secondary_hint_color)' }}>
                                <IconCircleFilled />
                            </div>
                        }
                    />
                    <div className="sub-tools-container">
                        <IconButton
                            onClick={this.selectBrush.bind(this)}
                            size="l"
                            mode={!this.state.isEraser ? 'bezeled' : 'plain'}
                        >
                            <IconBrush size={24} />
                        </IconButton>
                        <IconButton
                            onClick={this.selectEraser.bind(this)}
                            size="l"
                            mode={this.state.isEraser ? 'bezeled' : 'plain'}
                        >
                            <IconEraser size={24} />
                        </IconButton>
                        <IconButton
                            onClick={this.clearCanvas.bind(this)}
                            size="l"
                            mode="plain"
                            onMouseEnter={this.handleMouseEnter}
                            onMouseLeave={this.handleMouseLeave}
                        >
                            {this.state.isHovered ? (
                                <IconTrashX size={24} color="#ff5c5c" style={{ transform: 'rotate(10deg)' }} />
                            ) : (
                                <IconTrash size={24} color="#ff5c5c" style={{ transform: 'rotate(0deg)' }} />
                            )}
                        </IconButton>
                    </div>
                </div>
                <div className="board-container">
                    <Board
                        ref={this.boardRef}
                        color={this.state.isEraser ? '#FFFFFF' : this.state.color}
                        size={this.state.size}
                        isEraser={this.state.isEraser}
                    />
                </div>
            </div>
        );
    }
}

export default Container;