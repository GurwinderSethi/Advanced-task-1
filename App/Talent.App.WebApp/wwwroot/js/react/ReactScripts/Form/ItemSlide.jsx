import React from 'react';
import PropTypes from 'prop-types';

// Provides an easier way to have child components slide into view on the screen.
// Duration must be greater than zero. Example: '1s' or '100ms'.
export class ItemSlide extends React.Component {
    constructor(props) {
        super(props);

        let startingOpen = false;
        if (this.props.isOpen && !this.props.slideIn) {
            // We want to start open without animating.
            startingOpen = true;
        }

        this.state = {
            isOpen: startingOpen
        };

        this.animatedElement = React.createRef();
        this.containerElement = React.createRef();
    }

    componentDidMount() {
        this.animatedElement.current.addEventListener('transitionend', (event) => {
            if (event.target === this.animatedElement.current && !this.state.isOpen)
            {
                this.props.onClose();
            }
        });

        if (this.props.slideIn && this.props.isOpen) {
            // We want to slide open immediately.
            this.setState({
                isOpen: true
            });
        }
    }

    componentDidUpdate(prevProps) {
        if (prevProps.isOpen !== this.props.isOpen) {
            // We've had our controlled state changed.
            this.setState({
                isOpen: this.props.isOpen
            });
        }
    }

    render() {
        let classes = ['item-slider'];
        let height = this.props.emptyHeight || 0;

        if (this.state.isOpen) {
            classes.push('visible');

            // We're open so lets found out how large we should be.
            height = this.containerElement.current ? this.containerElement.current.getBoundingClientRect().height : height;
        }

        const classNames = classes.join(' ');

        const itemSliderStyling = { transitionDuration: this.props.duration, height: height };
        const childContainerStyling = { transitionDuration: this.props.duration };

        return (
            <div className={classNames} style={itemSliderStyling} ref={this.animatedElement}>
                <div style={childContainerStyling} ref={this.containerElement}>
                    {this.props.children}
                </div>
            </div>
        );
    }
}

ItemSlide.propTypes = {
    duration: PropTypes.string,
    children: PropTypes.oneOfType([
        PropTypes.element,
        PropTypes.node,
        PropTypes.arrayOf(PropTypes.element),
        PropTypes.arrayOf(PropTypes.node)
    ]).isRequired
};

ItemSlide.defaultProps = {
    duration: '1s'
};