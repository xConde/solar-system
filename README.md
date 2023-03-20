# Solar System

![](https://drive.google.com/uc?id=1w5IqtUZLqyFcpOFc-zassKPMJQaXw9rF)

This project is a simple web application that visualizes the Solar System using JavaScript, HTML, and CSS. It displays the Sun, planets, and some of their moons in a dynamic and interactive way.

## Features
- Displays the Sun, planets, and some moons
- Planets and moons are animated, orbiting around their respective centers
- Planets can be clicked to highlight their orbit
- Resizes and repositions elements on window resize
- Background stars with twinkling effect

## Files
- app.js: The main JavaScript file containing the logic for creating and animating the solar system elements
- index.html: The HTML file providing the structure for the solar system visualization
- styles.css: The CSS file containing styles for the solar system elements and animations

## Usage
1. Clone the repository or download the source files.
2. Open the index.html file in your web browser.

## Code Overview
- getPlanetData(): Returns an array of objects containing information about planets and their moons.
- createSun(), createPlanet(), createMoons(): Functions for creating DOM elements for the Sun, planets, and moons.
- spawnStars(): Generates background stars with random sizes and positions.
- calculateScalingFactor(), positionElement(): Functions for calculating the scaling factor and positioning elements.
- applyScalingAndReposition(): Adjusts the positions and scales of planets, moons, and stars based on the current window size.
- throttle(): Throttles a function, ensuring it's only called once every specified time interval.
- handlePlanetClick(), checkPlanetsOffScreen(), scheduleCheck(): Event handlers for click events and checking if planets are off-screen.
