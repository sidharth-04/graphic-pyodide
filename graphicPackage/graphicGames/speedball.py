print("<< Speed Ball game loaded >>")

speed = 1
posVec = createVector(200, 200)
dirVec = PVector().random2D()
ball_size = 65

def setup():
	noStroke()
	createCanvas(400, 400)

def draw():
	global posVec
	global dirVec
	background(85, 139, 118)
	fill(139, 228, 210)
	ellipse(posVec.x, posVec.y, ball_size, ball_size)
	posVec.x += speed*dirVec.x
	posVec.y += speed*dirVec.y

	if posVec.x > 400-ball_size/2 or posVec.x < ball_size/2:
		dirVec.x *= -1
	if posVec.y > 400-ball_size/2 or posVec.y < ball_size/2:
		dirVec.y *= -1

def mousePressed():
	global speed
	if dist(posVec.x, posVec.y, mouseX, mouseY) < ball_size/2:
		speed = get_new_speed(speed)
		print("You clicked me! My new speed is "+str(speed))