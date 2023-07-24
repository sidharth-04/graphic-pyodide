circleX = 50
vel = 2

def setup():
    createCanvas(400, 400)
    noStroke()

def draw():
    global circleX
    global vel
    
    background(200)
    fill("red")
    ellipse(circleX, 200, 100, 100)
    
    # Update circle's x position
    circleX += vel
    if at_edge(circleX):
        vel *= -1