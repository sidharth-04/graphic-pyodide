print("<< Growing Sun game loaded >>")

curr_size = 80

def setup():
    createCanvas(400, 400)
    noStroke()

def draw():
    background(116, 212, 247)
    fill(255, 200, 0)
    ellipse(200, 300, curr_size, curr_size)
    fill(31, 161, 29)
    rect(0, 300, 400, 100)

def mousePressed(arg):
    global curr_size
    x, y = mouseX, mouseY
    if dist(200, 300, x, y) < curr_size/2:
        curr_size = get_new_size(curr_size)