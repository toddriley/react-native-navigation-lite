# Navigation Lite

## The Issue

Other Navigation libraries for react native have too many features for most situations. There are two issues resulting from this approach:

1. Components on screens that are not focused are still mounted which can introduce confusing side effects. To handle these cases developers must check if a screen is focused before doing things.
2. If there are circular navigation flows in your app then the stack of screens (depending on the type of navigator that's implemented) will grow infinitely or need to be cleaned up. If the stack is cleaned up then it will re-mount every component in the app. This creates more cases for the developer to handle.
3. Animations on back transitions are not straightforward because screens are unmounted by default as soon as the back button is pressed.

## The Solution

![](/assets/demo.gif)

We only ever care about 2 screens, the one we are on and the one we are going to (or going back to). When a navigation action is triggered, render the components on the next screen and animate between the 2 screens. The components on the previous screen can then be unmounted.
