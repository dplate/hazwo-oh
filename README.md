# Hazwo Oh!

A future game that blends elements of **"World of Goo"** and **"Lemmings"** into a unique physics-based puzzle experience.

## Links

The current development version can be tested here:\
https://dplate.github.io/hazwo-oh/

## Concept

The goal is to guide individual **water particles** through a **2D level**, overcoming obstacles by changing their **state of matter**—switching between **liquid, solid (ice), and gas (steam)**. By strategically altering their form, players can navigate various challenges and solve puzzles.

## Physics & Gameplay

The game's core challenge lies in its **realistic physics simulation**, accurately modeling the behavior of water particles in different states. This includes factors such as:

- **Density** (e.g., ice is solid, steam is light and rises)
- **Elasticity & Binding Power** (how droplets stick together or break apart)
- **Air Resistance & Friction** (affecting movement and interaction with the environment)

Fortunately, only a limited number of particles (**< 100**) need to be simulated at once, keeping performance smooth.

## Technology & Design

- **Built with pure JavaScript**, the game will rely on **event-driven mechanics** rather than a traditional game loop.
- **CSS transitions** will power smooth animations, ensuring a fluid experience.
- Each **autonomous water particle** will operate on its own event interval, making them feel independent and reactive.

The game will feature a **simple, charming comic-style design**, using **SVG graphics**. Each water particle will have a **living appearance**, complete with an expressive **eye** that follows the cursor and reacts to its surroundings. This will help convey emotions—showing excitement when moving fast or distress when compressed by other particles.

## Controls & Accessibility

- **Minimalist one-touch controls** make the game accessible to all ages.
- Tapping a particle **pauses/slows the game**, allowing players to **drag up** to **heat** (change from **ice → water → steam**) or **drag down** to **cool** (change from **steam → water → ice**).
- Designed to be **playable on any screen size**, with levels larger than the screen that can be **dragged and explored** freely.
- **No text-based instructions**, making it intuitive and suitable for young children.

## Level Design

A **simple level editor** will allow for easy level creation. The exact nature of obstacles is still being explored, depending on how the first playable version turns out. Potential level mechanics could range from **basic elevation challenges** to **complex steam-powered machines** requiring precise particle manipulation.  


