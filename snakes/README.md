# Snakes
A lightweight implementation for the browser

## Screenshot
<img src="https://github.com/16point7/one-offs/blob/snakes/snakes/snakes.png?raw=true" width="200px">

## Installation
Clone the repository and run index.html in a web browser, or play [here](https://cdn.rawgit.com/16point7/one-offs/snakes/snakes/index.html).

## How to Play
* **left:** ArrowLeft
* **right:** ArrowRight
* **down:** ArrownDown
* **up:** ArrowUp
* **faster:** KeyF
* **slower:** KeyS

## Implementation Details
The physical board is 100 x 50 and is backed by a a single integer array of length 5,000.

On every update cycle, the head pointer advances to the next cell based on user input and the tail pointer advances to the next cell by chasing the subsequent segment of the body.

A queue-like data structure can be used to store the coordinates of each body segment such that the tail pointer can simply find the next cell by dequeuing. However, the chosen implementation only uses the board array to represent all game entities.

The value of the snake's body increase sequentially from tail to head. As the head moves forward, the new head's value is greater than the previous by 1. The tail pointer knows where to go next by searching its immediate neighbors for the next sequential value.

On a 100 x 50 board, the snake can be at most 5,000 cells long. Therefore, a minimum of 5,002 numbers are needed to represent the entire game (a value for the empty cells and another for the fruit cell). A 16-bit integer array is the most efficient choice.

For this implementation, a <code>Uint16Array</code> was used. The fruit cell has a designated value of <code>0xFFFF</code> and empty cells have a value of <code>0xFFFF-1</code>. 

Colission detection is simply:
```javascript
if (grid[next] < 0xFFFF-1)
    // collision!
```
The method to advance the head value without using an <code>if</code> statement to handle the edge case ( <code>0xFFFF-2</code> is to loop back to <code>0</code> ) is:
```javascript
grid[next] = (grid[head]+1) % 0xFFFF-1;
head = next;
```
The tail pointer advances by searching its neighbors:
```javascript
var target = grid[tail]+1;
var left, right, up, next;
if (grid[left = getLeft(tail)] == target)
    next = left;
else if (grid[right = getRight(tail)] == target)
    next = right;
else if (grid[up = getUp(tail)] == target)
    next = up;
else
    next = getDown(tail);
    
grid[tail] = 0xFFFF-1;
tail = next;
```
Using a 1-D array to represent a 2-D board while allowing the snake to wrap around when it crosses a boundary was slightly tricky.

```javascript
// var width = 100;

// Left-most index of the "top row" gets special treatment
function getLeft(ptr) {
    return ptr == 0 ? width-1 : ((ptr-1)%width)+getDepth(ptr);
}

// Like going left, first move laterally, then teleport to top row, and finally come back to current row
function getRight(ptr) {
    return ((ptr+1)%width)+getDepth(ptr);
}

// Top row gets special treatment
function getUp(ptr) {
    return ptr < width ? grid.length-(width-ptr) : ptr - width;
}

// Bottom row gets special treatment
// Like going up, moving laterally is just - or + the width, respectively
function getDown(ptr) {
    return ptr >= grid.length-width ? ptr%width : ptr + width;
}

// Number of "widths" needed to move a ptr on the top row back to the current row
function getDepth(ptr) {
    return ((ptr/width)|0)*width;
}
```

When the head consumes a fruit, the tail must wait for a number of update cycles before it can resume advancing. The default wait period is 5 updates cycles, and the total wait duration is kept track by an accumulator. Each update cycle reduces the accumulator by 1. The tail pointer will only advance if the accumulator is 0.

On every update cycle, only the new head and erased tail are re-rendered. 

## Runtime Performance
* **CPU:** i5 6200U 2.3 GHz
* **RAM:** 16 GB
* **OS:** Ubuntu 16.04 
* **Browser:** Chromium v58.0.3029.110 (64-bit)
* **Test duration:** ~ 60s

<img src="https://github.com/16point7/one-offs/blob/snakes/snakes/snakes-performance1.png?raw=true" width="200px">

<img src="https://github.com/16point7/one-offs/blob/snakes/snakes/snakes-performance2.png?raw=true" width="200px">