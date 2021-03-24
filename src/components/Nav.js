import React from 'react';
import { Link } from "react-router-dom";
import "./Nav.css";
import { AiOutlineMenu, AiOutlineClose } from "react-icons/ai";


class Nav extends React.Component {
    componentDidMount() {
        const nav = document.querySelector('.nav');
        const navToggle = document.querySelector('.nav__toggle');
        const navToggleOn = document.querySelector('.nav__toggle__on');
        const navToggleOff = document.querySelector('.nav__toggle__off');
        const navLink = document.querySelector('.nav__nav');
        let toggle = true;

        navToggle.addEventListener('click' || 'touchstart', () => {
            if (toggle) {
                navLink.style.display = 'none';
                navToggleOn.style.display = 'inline';
                navToggleOff.style.display = 'none';
                toggle = false;
            } else {
                navLink.style.display = 'flex';
                navToggleOn.style.display = 'none';
                navToggleOff.style.display = 'inline';
                toggle = true;
            }
        });
    }

    render() {
        return (
            <div className="nav">
                <div className="nav__toggle">
                    <AiOutlineMenu className="nav__toggle__on" size="24" />
                    <AiOutlineClose className="nav__toggle__off" size="24" />
                </div>
                <div className="nav__nav">
                    <Link to="/">Home</Link>
                    <Link to="/user">My Game</Link>
                </div>
            </div>
        );
    }
}


export default Nav;