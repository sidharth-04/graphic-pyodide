colours = [color(52, 35, 166), color(0, 148, 198), color(46, 23, 96), color(80, 133, 139), color(91, 200, 175), color(255, 255, 255)]
rect_colour = -1

def setup():
    createCanvas(400, 400)
    noStroke()

def draw():
    background(204, 201, 231)
    fill(colours[rect_colour])
    rect(150, 150, 100, 100)
    
def mouseClicked():
    if check_clicked(150, 150, 100, 100):
        switch()

def switch():
    global rect_colour
    if len(colours) > 5:
        colours.pop()
    last_rect_colour = rect_colour
    rect_colour = int(random(len(colours)))
    while rect_colour == last_rect_colour:
        rect_colour = int(random(len(colours)))