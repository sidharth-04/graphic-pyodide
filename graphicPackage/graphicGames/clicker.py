circle_colour = "blue"

def setup():
    createCanvas(400, 400)
    noStroke()

def draw():
    background(200)
    fill(circle_colour)
    ellipse(200, 200, 100, 100)

def mousePressed():
    global circle_colour
    if dist(200, 200, mouseX, mouseY) < 50:
        try:
            new_colour = change_colour(circle_colour)
            fill(new_colour)
            circle_colour = new_colour
        except:
            pass