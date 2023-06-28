print("<< Rocking Boat game loaded >>")

noise_y = 0
noise_speed = 0.03
noise_height = 100

num_stars = 50
stars = []

angle = 0
angle_dir = 1

def setup():
  global noise_y
  createCanvas(400, 400)
  noise_y = height * 3 / 4
  for i in range(num_stars):
    xrandom = random(width)
    yrandom = random(height / 2)
    stars.append([xrandom, yrandom])
  rectMode(CENTER)

def draw():
  global angle
  global angle_dir

  background(0, 15)

  noStroke()
  fill(255)
  for i in range(num_stars):
    ellipse(stars[i][0], stars[i][1], 3, 3)
  
  push()
  translate(width/2, height*3/5)
  fill('brown')
  rotate(angle)
  angle += 0.01*angle_dir
  if change_direction(degrees(angle)):
    angle_dir *= -1
  rect(0, 0, 150, 60)
  rect(-20, -60, 10, 100)
  fill('white')
  triangle(-15, -110, 30, -85, -15, -60)
  pop()

  for j in range(3):
    offset_y = j * 100
    noFill()
    stroke(0, 0, 255, 10)
    strokeWeight(height / 2)
    beginShape();
    curveVertex(0, height / 2);
    for i in range(0, width, 50):
      y = noise(frameCount * noise_speed + i + j) * noise_height + noise_y + offset_y
      curveVertex(i, y)
    curveVertex(width, height / 2)
    endShape(LINES)