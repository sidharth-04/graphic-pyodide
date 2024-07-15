# This script builds the boilerplate.js file
import_code = '''
import traceback
import signal
from js import p5, window, log_error_to_console, initiate_worker_timer, cancel_worker_timer
'''
define_namespace_code = '''
# Define the default namespace
default_ns = globals().copy()
'''
wrapper_code = '''
class PythonFunctions: pass

setattr(PythonFunctions, 'map', map)
setattr(PythonFunctions, 'filter', filter)
setattr(PythonFunctions, 'set', set)


_P5_INSTANCE = None

_CTX_MIDDLE = None
_DEFAULT_FILL = None
_DEFAULT_LEADMULT = None
_DEFAULT_STROKE = None
_DEFAULT_TEXT_FILL = None

ADD = None
ALT = None
ARROW = None
AUDIO = None
AUTO = None
AXES = None
BACKSPACE = None
BASELINE = None
BEVEL = None
BEZIER = None
BLEND = None
BLUR = None
BOLD = None
BOLDITALIC = None
BOTTOM = None
BURN = None
CENTER = None
CHORD = None
CLAMP = None
CLOSE = None
CONTROL = None
CORNER = None
CORNERS = None
CROSS = None
CURVE = None
DARKEST = None
DEG_TO_RAD = None
DEGREES = None
DELETE = None
DIFFERENCE = None
DILATE = None
DODGE = None
DOWN_ARROW = None
ENTER = None
ERODE = None
ESCAPE = None
EXCLUSION = None
FILL = None
GRAY = None
GRID = None
HALF_PI = None
HAND = None
HARD_LIGHT = None
HSB = None
HSL = None
IMAGE = None
IMMEDIATE = None
INVERT = None
ITALIC = None
LANDSCAPE = None
LEFT = None
LEFT_ARROW = None
LIGHTEST = None
LINE_LOOP = None
LINE_STRIP = None
LINEAR = None
LINES = None
MIRROR = None
MITER = None
MOVE = None
MULTIPLY = None
NEAREST = None
NORMAL = None
OPAQUE = None
OPEN = None
OPTION = None
OVERLAY = None
PI = None
PIE = None
POINTS = None
PORTRAIT = None
POSTERIZE = None
PROJECT = None
QUAD_STRIP = None
QUADRATIC = None
QUADS = None
QUARTER_PI = None
RAD_TO_DEG = None
RADIANS = None
RADIUS = None
REPEAT = None
REPLACE = None
RETURN = None
RGB = None
RIGHT = None
RIGHT_ARROW = None
ROUND = None
SCREEN = None
SHIFT = None
SOFT_LIGHT = None
SQUARE = None
STROKE = None
SUBTRACT = None
TAB = None
TAU = None
TEXT = None
TEXTURE = None
THRESHOLD = None
TOP = None
TRIANGLE_FAN = None
TRIANGLE_STRIP = None
TRIANGLES = None
TWO_PI = None
UP_ARROW = None
VIDEO = None
WAIT = None
WEBGL = None
P2D = None
PI = None

frameCount = None
focused = None
displayWidth = None
displayHeight = None
windowWidth = None
windowHeight = None
width = None
height = None
deviceOrientation = None
accelerationX = None
accelerationY = None
accelerationZ = None
pAccelerationX = None
pAccelerationY = None
pAccelerationZ = None
rotationX = None
rotationY = None
rotationZ = None
pRotationX = None
pRotationY = None
pRotationZ = None
turnAxis = None
keyIsPressed = None
key = None
keyCode = None
mouseX = None
mouseY = None
pmouseX = None
pmouseY = None
winMouseX = None
winMouseY = None
pwinMouseX = None
pwinMouseY = None
mouseButton = None
mouseIsPressed = None
touches = None
pixels = None


def alpha(*args):
    return _P5_INSTANCE.alpha(*args)

def blue(*args):
    return _P5_INSTANCE.blue(*args)

def brightness(*args):
    return _P5_INSTANCE.brightness(*args)

def color(*args):
    return _P5_INSTANCE.color(*args)

def green(*args):
    return _P5_INSTANCE.green(*args)

def hue(*args):
    return _P5_INSTANCE.hue(*args)

def lerpColor(*args):
    return _P5_INSTANCE.lerpColor(*args)

def lightness(*args):
    return _P5_INSTANCE.lightness(*args)

def red(*args):
    return _P5_INSTANCE.red(*args)

def saturation(*args):
    return _P5_INSTANCE.saturation(*args)

def background(*args):
    return _P5_INSTANCE.background(*args)

def clear(*args):
    p5_clear = _P5_INSTANCE.clear(*args)
    return p5_clear

def erase(*args):
    return _P5_INSTANCE.erase(*args)

def noErase(*args):
    return _P5_INSTANCE.noErase(*args)

def colorMode(*args):
    return _P5_INSTANCE.colorMode(*args)

def fill(*args):
    return _P5_INSTANCE.fill(*args)

def noFill(*args):
    return _P5_INSTANCE.noFill(*args)

def noStroke(*args):
    return _P5_INSTANCE.noStroke(*args)

def stroke(*args):
    return _P5_INSTANCE.stroke(*args)

def arc(*args):
    return _P5_INSTANCE.arc(*args)

def ellipse(*args):
    return _P5_INSTANCE.ellipse(*args)

def circle(*args):
    return _P5_INSTANCE.circle(*args)

def line(*args):
    return _P5_INSTANCE.line(*args)

def point(*args):
    return _P5_INSTANCE.point(*args)

def quad(*args):
    return _P5_INSTANCE.quad(*args)

def rect(*args):
    return _P5_INSTANCE.rect(*args)

def square(*args):
    return _P5_INSTANCE.square(*args)

def triangle(*args):
    return _P5_INSTANCE.triangle(*args)

def plane(*args):
    return _P5_INSTANCE.plane(*args)

def box(*args):
    return _P5_INSTANCE.box(*args)

def sphere(*args):
    return _P5_INSTANCE.sphere(*args)

def cylinder(*args):
    return _P5_INSTANCE.cylinder(*args)

def cone(*args):
    return _P5_INSTANCE.cone(*args)

def ellipsoid(*args):
    return _P5_INSTANCE.ellipsoid(*args)

def torus(*args):
    return _P5_INSTANCE.torus(*args)

def loadModel(*args):
    return _P5_INSTANCE.loadModel(*args)

def model(*args):
    return _P5_INSTANCE.model(*args)

def ellipseMode(*args):
    return _P5_INSTANCE.ellipseMode(*args)

def noSmooth(*args):
    return _P5_INSTANCE.noSmooth(*args)

def rectMode(*args):
    return _P5_INSTANCE.rectMode(*args)

def smooth(*args):
    return _P5_INSTANCE.smooth(*args)

def strokeCap(*args):
    return _P5_INSTANCE.strokeCap(*args)

def strokeJoin(*args):
    return _P5_INSTANCE.strokeJoin(*args)

def strokeWeight(*args):
    return _P5_INSTANCE.strokeWeight(*args)

def bezier(*args):
    return _P5_INSTANCE.bezier(*args)

def bezierDetail(*args):
    return _P5_INSTANCE.bezierDetail(*args)

def bezierPoint(*args):
    return _P5_INSTANCE.bezierPoint(*args)

def bezierTangent(*args):
    return _P5_INSTANCE.bezierTangent(*args)

def curve(*args):
    return _P5_INSTANCE.curve(*args)

def curveDetail(*args):
    return _P5_INSTANCE.curveDetail(*args)

def curveTightness(*args):
    return _P5_INSTANCE.curveTightness(*args)

def curvePoint(*args):
    return _P5_INSTANCE.curvePoint(*args)

def curveTangent(*args):
    return _P5_INSTANCE.curveTangent(*args)

def beginContour(*args):
    return _P5_INSTANCE.beginContour(*args)

def beginShape(*args):
    return _P5_INSTANCE.beginShape(*args)

def bezierVertex(*args):
    return _P5_INSTANCE.bezierVertex(*args)

def curveVertex(*args):
    return _P5_INSTANCE.curveVertex(*args)

def endContour(*args):
    return _P5_INSTANCE.endContour(*args)

def endShape(*args):
    return _P5_INSTANCE.endShape(*args)

def quadraticVertex(*args):
    return _P5_INSTANCE.quadraticVertex(*args)

def vertex(*args):
    return _P5_INSTANCE.vertex(*args)

def cursor(*args):
    return _P5_INSTANCE.cursor(*args)

def frameRate(*args):
    return _P5_INSTANCE.frameRate(*args)

def noCursor(*args):
    return _P5_INSTANCE.noCursor(*args)

def fullscreen(*args):
    return _P5_INSTANCE.fullscreen(*args)

def pixelDensity(*args):
    return _P5_INSTANCE.pixelDensity(*args)

def displayDensity(*args):
    return _P5_INSTANCE.displayDensity(*args)

def getURL(*args):
    return _P5_INSTANCE.getURL(*args)

def getURLPath(*args):
    return _P5_INSTANCE.getURLPath(*args)

def getURLParams(*args):
    return _P5_INSTANCE.getURLParams(*args)

def remove(*args):
    return _P5_INSTANCE.remove(*args)

def noLoop(*args):
    return _P5_INSTANCE.noLoop(*args)

def loop(*args):
    return _P5_INSTANCE.loop(*args)

def push(*args):
    return _P5_INSTANCE.push(*args)

def redraw(*args):
    return _P5_INSTANCE.redraw(*args)

def resizeCanvas(*args):
    return _P5_INSTANCE.resizeCanvas(*args)

def noCanvas(*args):
    return _P5_INSTANCE.noCanvas(*args)

def createGraphics(*args):
    return _P5_INSTANCE.createGraphics(*args)

def blendMode(*args):
    return _P5_INSTANCE.blendMode(*args)

def setAttributes(*args):
    return _P5_INSTANCE.setAttributes(*args)

def applyMatrix(*args):
    return _P5_INSTANCE.applyMatrix(*args)

def resetMatrix(*args):
    return _P5_INSTANCE.resetMatrix(*args)

def rotate(*args):
    return _P5_INSTANCE.rotate(*args)

def rotateX(*args):
    return _P5_INSTANCE.rotateX(*args)

def rotateY(*args):
    return _P5_INSTANCE.rotateY(*args)

def rotateZ(*args):
    return _P5_INSTANCE.rotateZ(*args)

def scale(*args):
    return _P5_INSTANCE.scale(*args)

def shearX(*args):
    return _P5_INSTANCE.shearX(*args)

def shearY(*args):
    return _P5_INSTANCE.shearY(*args)

def translate(*args):
    return _P5_INSTANCE.translate(*args)

def createStringDict(*args):
    return _P5_INSTANCE.createStringDict(*args)

def createNumberDict(*args):
    return _P5_INSTANCE.createNumberDict(*args)

def append(*args):
    return _P5_INSTANCE.append(*args)

def arrayCopy(*args):
    return _P5_INSTANCE.arrayCopy(*args)

def concat(*args):
    return _P5_INSTANCE.concat(*args)

def reverse(*args):
    return _P5_INSTANCE.reverse(*args)

def shorten(*args):
    return _P5_INSTANCE.shorten(*args)

def shuffle(*args):
    return _P5_INSTANCE.shuffle(*args)

def sort(*args):
    return _P5_INSTANCE.sort(*args)

def splice(*args):
    return _P5_INSTANCE.splice(*args)

def subset(*args):
    return _P5_INSTANCE.subset(*args)

def boolean(*args):
    return _P5_INSTANCE.boolean(*args)

def byte(*args):
    return _P5_INSTANCE.byte(*args)

def char(*args):
    return _P5_INSTANCE.char(*args)

def unchar(*args):
    return _P5_INSTANCE.unchar(*args)

def hex(*args):
    return _P5_INSTANCE.hex(*args)

def unhex(*args):
    return _P5_INSTANCE.unhex(*args)

def join(*args):
    return _P5_INSTANCE.join(*args)

def match(*args):
    return _P5_INSTANCE.match(*args)

def matchAll(*args):
    return _P5_INSTANCE.matchAll(*args)

def nf(*args):
    return _P5_INSTANCE.nf(*args)

def nfc(*args):
    return _P5_INSTANCE.nfc(*args)

def nfp(*args):
    return _P5_INSTANCE.nfp(*args)

def nfs(*args):
    return _P5_INSTANCE.nfs(*args)

def split(*args):
    return _P5_INSTANCE.split(*args)

def splitTokens(*args):
    return _P5_INSTANCE.splitTokens(*args)

def trim(*args):
    return _P5_INSTANCE.trim(*args)

def setMoveThreshold(*args):
    return _P5_INSTANCE.setMoveThreshold(*args)

def setShakeThreshold(*args):
    return _P5_INSTANCE.setShakeThreshold(*args)

def keyIsDown(*args):
    return _P5_INSTANCE.keyIsDown(*args)

def createImage(*args):
    return _P5_INSTANCE.createImage(*args)

def saveCanvas(*args):
    return _P5_INSTANCE.saveCanvas(*args)

def saveFrames(*args):
    return _P5_INSTANCE.saveFrames(*args)

def loadImage(*args):
    return _P5_INSTANCE.loadImage(*args)

def image(*args):
    return _P5_INSTANCE.image(*args)

def tint(*args):
    return _P5_INSTANCE.tint(*args)

def noTint(*args):
    return _P5_INSTANCE.noTint(*args)

def imageMode(*args):
    return _P5_INSTANCE.imageMode(*args)

def blend(*args):
    return _P5_INSTANCE.blend(*args)

def copy(*args):
    return _P5_INSTANCE.copy(*args)

def filter(*args):
    if len(args) > 1 and (args[0] is None or callable(args[0])):
        return PythonFunctions.filter(*args)
    else:
        return _P5_INSTANCE.filter(*args)

def get(*args):
    return _P5_INSTANCE.get(*args)

def loadPixels(*args):
    return _P5_INSTANCE.loadPixels(*args)

def set(*args):
    if len(args) <= 1:
        return PythonFunctions.set(*args)
    else:
        return _P5_INSTANCE.set(*args)

def updatePixels(*args):
    return _P5_INSTANCE.updatePixels(*args)

def loadJSON(*args):
    return _P5_INSTANCE.loadJSON(*args)

def loadStrings(*args):
    return _P5_INSTANCE.loadStrings(*args)

def loadTable(*args):
    return _P5_INSTANCE.loadTable(*args)

def loadXML(*args):
    return _P5_INSTANCE.loadXML(*args)

def loadBytes(*args):
    return _P5_INSTANCE.loadBytes(*args)

def httpGet(*args):
    return _P5_INSTANCE.httpGet(*args)

def httpPost(*args):
    return _P5_INSTANCE.httpPost(*args)

def httpDo(*args):
    return _P5_INSTANCE.httpDo(*args)

def createWriter(*args):
    return _P5_INSTANCE.createWriter(*args)

def save(*args):
    return _P5_INSTANCE.save(*args)

def saveJSON(*args):
    return _P5_INSTANCE.saveJSON(*args)

def saveStrings(*args):
    return _P5_INSTANCE.saveStrings(*args)

def saveTable(*args):
    return _P5_INSTANCE.saveTable(*args)

def day(*args):
    return _P5_INSTANCE.day(*args)

def hour(*args):
    return _P5_INSTANCE.hour(*args)

def minute(*args):
    return _P5_INSTANCE.minute(*args)

def millis(*args):
    return _P5_INSTANCE.millis(*args)

def month(*args):
    return _P5_INSTANCE.month(*args)

def second(*args):
    return _P5_INSTANCE.second(*args)

def year(*args):
    return _P5_INSTANCE.year(*args)

def createVector(*args):
    return _P5_INSTANCE.createVector(*args)

def abs(*args):
    return _P5_INSTANCE.abs(*args)

def ceil(*args):
    return _P5_INSTANCE.ceil(*args)

def constrain(*args):
    return _P5_INSTANCE.constrain(*args)

def dist(*args):
    return _P5_INSTANCE.dist(*args)

def exp(*args):
    return _P5_INSTANCE.exp(*args)

def floor(*args):
    return _P5_INSTANCE.floor(*args)

def lerp(*args):
    return _P5_INSTANCE.lerp(*args)

def log(*args):
    return _P5_INSTANCE.log(*args)

def mag(*args):
    return _P5_INSTANCE.mag(*args)

def map(*args):
    if len(args) > 1 and callable(args[0]):
        return PythonFunctions.map(*args)
    else:
        return _P5_INSTANCE.map(*args)

def norm(*args):
    return _P5_INSTANCE.norm(*args)

def pow(*args):
    return _P5_INSTANCE.pow(*args)

def round(*args):
    return _P5_INSTANCE.round(*args)

def sq(*args):
    return _P5_INSTANCE.sq(*args)

def sqrt(*args):
    return _P5_INSTANCE.sqrt(*args)

def noise(*args):
    return _P5_INSTANCE.noise(*args)

def noiseDetail(*args):
    return _P5_INSTANCE.noiseDetail(*args)

def noiseSeed(*args):
    return _P5_INSTANCE.noiseSeed(*args)

def randomSeed(*args):
    return _P5_INSTANCE.randomSeed(*args)

def random(*args):
    return _P5_INSTANCE.random(*args)

def randomGaussian(*args):
    return _P5_INSTANCE.randomGaussian(*args)

def acos(*args):
    return _P5_INSTANCE.acos(*args)

def asin(*args):
    return _P5_INSTANCE.asin(*args)

def atan(*args):
    return _P5_INSTANCE.atan(*args)

def atan2(*args):
    return _P5_INSTANCE.atan2(*args)

def cos(*args):
    return _P5_INSTANCE.cos(*args)

def sin(*args):
    return _P5_INSTANCE.sin(*args)

def tan(*args):
    return _P5_INSTANCE.tan(*args)

def degrees(*args):
    return _P5_INSTANCE.degrees(*args)

def radians(*args):
    return _P5_INSTANCE.radians(*args)

def angleMode(*args):
    return _P5_INSTANCE.angleMode(*args)

def textAlign(*args):
    return _P5_INSTANCE.textAlign(*args)

def textLeading(*args):
    return _P5_INSTANCE.textLeading(*args)

def textSize(*args):
    return _P5_INSTANCE.textSize(*args)

def textStyle(*args):
    return _P5_INSTANCE.textStyle(*args)

def textWidth(*args):
    return _P5_INSTANCE.textWidth(*args)

def textAscent(*args):
    return _P5_INSTANCE.textAscent(*args)

def textDescent(*args):
    return _P5_INSTANCE.textDescent(*args)

def loadFont(*args):
    return _P5_INSTANCE.loadFont(*args)

def text(*args):
    return _P5_INSTANCE.text(*args)

def textFont(*args):
    return _P5_INSTANCE.textFont(*args)

def orbitControl(*args):
    return _P5_INSTANCE.orbitControl(*args)

def debugMode(*args):
    return _P5_INSTANCE.debugMode(*args)

def noDebugMode(*args):
    return _P5_INSTANCE.noDebugMode(*args)

def ambientLight(*args):
    return _P5_INSTANCE.ambientLight(*args)

def directionalLight(*args):
    return _P5_INSTANCE.directionalLight(*args)

def pointLight(*args):
    return _P5_INSTANCE.pointLight(*args)

def lights(*args):
    return _P5_INSTANCE.lights(*args)

def loadShader(*args):
    return _P5_INSTANCE.loadShader(*args)

def createShader(*args):
    return _P5_INSTANCE.createShader(*args)

def shader(*args):
    return _P5_INSTANCE.shader(*args)

def resetShader(*args):
    return _P5_INSTANCE.resetShader(*args)

def normalMaterial(*args):
    return _P5_INSTANCE.normalMaterial(*args)

def texture(*args):
    return _P5_INSTANCE.texture(*args)

def textureMode(*args):
    return _P5_INSTANCE.textureMode(*args)

def textureWrap(*args):
    return _P5_INSTANCE.textureWrap(*args)

def ambientMaterial(*args):
    return _P5_INSTANCE.ambientMaterial(*args)

def specularMaterial(*args):
    return _P5_INSTANCE.specularMaterial(*args)

def shininess(*args):
    return _P5_INSTANCE.shininess(*args)

def camera(*args):
    return _P5_INSTANCE.camera(*args)

def perspective(*args):
    return _P5_INSTANCE.perspective(*args)

def ortho(*args):
    return _P5_INSTANCE.ortho(*args)

def createCamera(*args):
    return _P5_INSTANCE.createCamera(*args)

def setCamera(*args):
    return _P5_INSTANCE.setCamera(*args)

def select(*args):
    return _P5_INSTANCE.select(*args)

def selectAll(*args):
    return _P5_INSTANCE.selectAll(*args)

def removeElements(*args):
    return _P5_INSTANCE.removeElements(*args)

def changed(*args):
    return _P5_INSTANCE.changed(*args)

def createDiv(*args):
    return _P5_INSTANCE.createDiv(*args)

def createP(*args):
    return _P5_INSTANCE.createP(*args)

def createSpan(*args):
    return _P5_INSTANCE.createSpan(*args)

def createImg(*args):
    return _P5_INSTANCE.createImg(*args)

def createA(*args):
    return _P5_INSTANCE.createA(*args)

def createSlider(*args):
    return _P5_INSTANCE.createSlider(*args)

def createButton(*args):
    return _P5_INSTANCE.createButton(*args)

def createCheckbox(*args):
    return _P5_INSTANCE.createCheckbox(*args)

def createSelect(*args):
    return _P5_INSTANCE.createSelect(*args)

def createRadio(*args):
    return _P5_INSTANCE.createRadio(*args)

def createColorPicker(*args):
    return _P5_INSTANCE.createColorPicker(*args)

def createInput(*args):
    return _P5_INSTANCE.createInput(*args)

def createFileInput(*args):
    return _P5_INSTANCE.createFileInput(*args)

def createVideo(*args):
    return _P5_INSTANCE.createVideo(*args)

def createAudio(*args):
    return _P5_INSTANCE.createAudio(*args)

def createCapture(*args):
    return _P5_INSTANCE.createCapture(*args)

def createElement(*args):
    return _P5_INSTANCE.createElement(*args)

def createCanvas(*args):
    canvas = _P5_INSTANCE.createCanvas(*args)

    global width, height
    width = _P5_INSTANCE.width
    height = _P5_INSTANCE.height

    return canvas

def pop(*args):
    p5_pop = _P5_INSTANCE.pop(*args)
    return p5_pop


# Processing Python or Java mode compatibility aliases
size = createCanvas
popMatrix = pop
popStyle = pop
pushMatrix = push
pushStyle = push

# PVector is a wrapper/helper class for p5.Vector objets
# providing names similar to Processing Python or Java modes
# but mostly keeping p5js functionality

from numbers import Number

class PVector:

    def __init__(self, x=0, y=0, z=0):
        self.__vector = createVector(x, y, z)
        self.add = self.__instance_add__
        self.sub = self.__instance_sub__
        self.mult = self.__instance_mult__
        self.div = self.__instance_div__
        self.cross = self.__instance_cross__
        self.dist = self.__instance_dist__
        self.dot = self.__instance_dot__
        self.lerp = self.__instance_lerp__

    @property
    def x(self):
        return self.__vector.x

    @x.setter
    def x(self, x):
        self.__vector.x = x

    @property
    def y(self):
        return self.__vector.y

    @y.setter
    def y(self, y):
        self.__vector.y = y

    @property
    def z(self):
        return self.__vector.z

    @z.setter
    def z(self, z):
        self.__vector.z = z

    def mag(self):
        return self.__vector.mag()

    def magSq(self):
        return self.__vector.magSq()

    def setMag(self, mag):
        self.__vector.setMag(mag)
        return self

    def normalize(self):
        self.__vector.normalize()
        return self

    def limit(self, max):
        self.__vector.limit(max)
        return self

    def heading(self):
        return self.__vector.heading()

    def rotate(self, angle):
        self.__vector.rotate(angle)
        return self

    def __instance_add__(self, *args):
        if len(args) == 1:
            return PVector.add(self, args[0], self)
        else:
            return PVector.add(self, PVector(*args), self)

    def __instance_sub__(self, *args):
        if len(args) == 1:
            return PVector.sub(self, args[0], self)
        else:
            return PVector.sub(self, PVector(*args), self)

    def __instance_mult__(self, o):
        return PVector.mult(self, o, self)

    def __instance_div__(self, f):
        return PVector.div(self, f, self)

    def __instance_cross__(self, o):
        return PVector.cross(self, o, self)

    def __instance_dist__(self, o):
        return PVector.dist(self, o)

    def __instance_dot__(self, *args):
        if len(args) == 1:
            v = args[0]
        else:
            v = args
        return self.x * v[0] + self.y * v[1] + self.z * v[2]

    def __instance_lerp__(self, *args):
        if len(args) == 2:
            return PVector.lerp(self, args[0], args[1], self)
        else:
            vx, vy, vz, f = args
            return PVector.lerp(self, PVector(vx, vy, vz), f, self)

    def get(self):
        return PVector(self.x, self.y, self.z)

    def copy(self):
        return PVector(self.x, self.y, self.z)

    def __getitem__(self, k):
        return getattr(self, ('x', 'y', 'z')[k])

    def __setitem__(self, k, v):
        setattr(self, ('x', 'y', 'z')[k], v)

    def __copy__(self):
        return PVector(self.x, self.y, self.z)

    def __deepcopy__(self, memo):
        return PVector(self.x, self.y, self.z)

    def __repr__(self):  # PROVISÓRIO
        return f'PVector({self.x}, {self.y}, {self.z})'

    def set(self, *args):
        """
        Sets the x, y, and z component of the vector using two or three separate
        variables, the data from a p5.Vector, or the values from a float array.
        """
        self.__vector.set(*args)

    @classmethod
    def add(cls, a, b, dest=None):
        if dest is None:
            return PVector(a.x + b[0], a.y + b[1], a.z + b[2])
        dest.__vector.set(a.x + b[0], a.y + b[1], a.z + b[2])
        return dest

    @classmethod
    def sub(cls, a, b, dest=None):
        if dest is None:
            return PVector(a.x - b[0], a.y - b[1], a.z - b[2])
        dest.__vector.set(a.x - b[0], a.y - b[1], a.z - b[2])
        return dest

    @classmethod
    def mult(cls, a, b, dest=None):
        if dest is None:
            return PVector(a.x * b, a.y * b, a.z * b)
        dest.__vector.set(a.x * b, a.y * b, a.z * b)
        return dest

    @classmethod
    def div(cls, a, b, dest=None):
        if dest is None:
            return PVector(a.x / b, a.y / b, a.z / b)
        dest.__vector.set(a.x / b, a.y / b, a.z / b)
        return dest

    @classmethod
    def dist(cls, a, b):
        return a.__vector.dist(b.__vector)

    @classmethod
    def dot(cls, a, b):
        return a.__vector.dot(b.__vector)

    def __add__(a, b):
        return PVector.add(a, b, None)

    def __sub__(a, b):
        return PVector.sub(a, b, None)

    def __isub__(a, b):
        a.sub(b)
        return a

    def __iadd__(a, b):
        a.add(b)
        return a

    def __mul__(a, b):
        if not isinstance(b, Number):
            raise TypeError(
                "The * operator can only be used to multiply a PVector by a number")
        return PVector.mult(a, float(b), None)

    def __rmul__(a, b):
        if not isinstance(b, Number):
            raise TypeError(
                "The * operator can only be used to multiply a PVector by a number")
        return PVector.mult(a, float(b), None)

    def __imul__(a, b):
        if not isinstance(b, Number):
            raise TypeError(
                "The *= operator can only be used to multiply a PVector by a number")
        a.__vector.mult(float(b))
        return a

    def __truediv__(a, b):
        if not isinstance(b, Number):
            raise TypeError(
                "The * operator can only be used to multiply a PVector by a number")
        return PVector(a.x / float(b), a.y / float(b), a.z / float(b))

    def __itruediv__(a, b):
        if not isinstance(b, Number):
            raise TypeError(
                "The /= operator can only be used to multiply a PVector by a number")
        a.__vector.set(a.x / float(b), a.y / float(b), a.z / float(b))
        return a

    def __eq__(a, b):
        return a.x == b[0] and a.y == b[1] and a.z == b[2]

    def __lt__(a, b):
        return a.magSq() < b.magSq()

    def __le__(a, b):
        return a.magSq() <= b.magSq()

    def __gt__(a, b):
        return a.magSq() > b.magSq()

    def __ge__(a, b):
        return a.magSq() >= b.magSq()

    # Problematic class methods, we would rather use p5.Vector when possible...

    @classmethod
    def lerp(cls, a, b, f, dest=None):
        v = createVector(a.x, a.y, a.z)
        v.lerp(b.__vector, f)
        if dest is None:
            return PVector(v.x, v.y, v.z)
        dest.set(v.x, v.y, v.z)
        return dest

    @classmethod
    def cross(cls, a, b, dest=None):
        x = a.y * b[2] - b[1] * a.z
        y = a.z * b[0] - b[2] * a.x
        z = a.x * b[1] - b[0] * a.y
        if dest is None:
            return PVector(x, y, z)
        dest.set(x, y, z)
        return dest

    @classmethod
    def fromAngle(cls, angle, length=1):
        # https://github.com/processing/p5.js/blob/3f0b2f0fe575dc81c724474154f5b23a517b7233/src/math/p5.Vector.js
        return PVector(length * cos(angle), length * sin(angle), 0)

    @classmethod
    def fromAngles(theta, phi, length=1):
        # https://github.com/processing/p5.js/blob/3f0b2f0fe575dc81c724474154f5b23a517b7233/src/math/p5.Vector.js
        cosPhi = cos(phi)
        sinPhi = sin(phi)
        cosTheta = cos(theta)
        sinTheta = sin(theta)
        return PVector(length * sinTheta * sinPhi,
                       -length * cosTheta,
                       length * sinTheta * cosPhi)

    @classmethod
    def random2D(cls):
        return PVector.fromAngle(random(TWO_PI))

    @classmethod
    def random3D(cls, dest=None):
        angle = random(TWO_PI)
        vz = random(2) - 1
        mult = sqrt(1 - vz * vz)
        vx = mult * cos(angle)
        vy = mult * sin(angle)
        if dest is None:
            return PVector(vx, vy, vz)
        dest.set(vx, vy, vz)
        return dest

    @classmethod
    def angleBetween(cls, a, b):
        return acos(a.dot(b) / sqrt(a.magSq() * b.magSq()))

    # Other harmless p5js methods

    def equals(self, v):
        return self == v

    def heading2D(self):
        return self.__vector.heading()

    def reflect(self, *args):
        # Reflect the incoming vector about a normal to a line in 2D, or about
        # a normal to a plane in 3D This method acts on the vector directly
        r = self.__vector.reflect(*args)
        return r

    def array(self):
        # Return a representation of this vector as a float array. This is only
        # for temporary use. If used in any w fashion, the contents should be
        # copied by using the p5.Vector.copy() method to copy into your own
        # array.
        return self.__vector.array()

    def toString(self):
        # Returns a string representation of a vector v by calling String(v) or v.toString().
        # return self.__vector.toString() would be something like "p5.vector
        # Object […, …, …]"
        return str(self)

    def rem(self, *args):
        # Gives remainder of a vector when it is divided by anw vector. See
        # examples for more context.
        self.__vector.rem(*args)
        return self


def pre_draw(p5_instance, draw_func, *args, **kwargs):
    """
    We need to run this before the actual draw to insert and update p5 env variables
    """
    global _CTX_MIDDLE, _DEFAULT_FILL, _DEFAULT_LEADMULT, _DEFAULT_STROKE, _DEFAULT_TEXT_FILL

    global ADD, ALT, ARROW, AUTO, AUDIO, AXES, BACKSPACE, BASELINE, BEVEL, BEZIER, BLEND, BLUR, BOLD, BOLDITALIC
    global BOTTOM, BURN, CENTER, CHORD, CLAMP, CLOSE, CONTROL, CORNER, CORNERS, CROSS, CURVE, DARKEST
    global DEG_TO_RAD, DEGREES, DELETE, DIFFERENCE, DILATE, DODGE, DOWN_ARROW, ENTER, ERODE, ESCAPE, EXCLUSION
    global FILL, GRAY, GRID, HALF_PI, HAND, HARD_LIGHT, HSB, HSL, IMAGE, IMMEDIATE, INVERT, ITALIC, LANDSCAPE
    global LEFT, LEFT_ARROW, LIGHTEST, LINE_LOOP, LINE_STRIP, LINEAR, LINES, MIRROR, MITER, MOVE, MULTIPLY, NEAREST
    global NORMAL, OPAQUE, OPEN, OPTION, OVERLAY, P2D, P3D, PI, PIE, POINTS, PORTRAIT, POSTERIZE, PROJECT, QUAD_STRIP
    global QUADRATIC, QUADS, QUARTER_PI, RAD_TO_DEG, RADIANS, RADIUS, REPEAT, REPLACE, RETURN, RGB, RIGHT, RIGHT_ARROW
    global ROUND, SCREEN, SHIFT, SOFT_LIGHT, SQUARE, STROKE, SUBTRACT, TAB, TAU, TEXT, TEXTURE, THRESHOLD, TOP
    global TRIANGLE_FAN, TRIANGLE_STRIP, TRIANGLES, TWO_PI, UP_ARROW, VIDEO, WAIT, WEBGL

    global frameCount, focused, displayWidth, displayHeight, windowWidth, windowHeight, width, height
    global deviceOrientation, accelerationX, accelerationY, accelerationZ
    global pAccelerationX, pAccelerationY, pAccelerationZ, rotationX, rotationY, rotationZ
    global pRotationX, pRotationY, pRotationZ, turnAxis, keyIsPressed, key, keyCode, mouseX, mouseY, pmouseX, pmouseY
    global winMouseX, winMouseY, pwinMouseX, pwinMouseY, mouseButton, mouseIsPressed, touches, pixels

    _CTX_MIDDLE = p5_instance._CTX_MIDDLE
    _DEFAULT_FILL = p5_instance._DEFAULT_FILL
    _DEFAULT_LEADMULT = p5_instance._DEFAULT_LEADMULT
    _DEFAULT_STROKE = p5_instance._DEFAULT_STROKE
    _DEFAULT_TEXT_FILL = p5_instance._DEFAULT_TEXT_FILL

    ADD = p5_instance.ADD
    ALT = p5_instance.ALT
    ARROW = p5_instance.ARROW
    AUDIO = p5_instance.AUDIO
    AUTO = p5_instance.AUTO
    AXES = p5_instance.AXES
    BACKSPACE = p5_instance.BACKSPACE
    BASELINE = p5_instance.BASELINE
    BEVEL = p5_instance.BEVEL
    BEZIER = p5_instance.BEZIER
    BLEND = p5_instance.BLEND
    BLUR = p5_instance.BLUR
    BOLD = p5_instance.BOLD
    BOLDITALIC = p5_instance.BOLDITALIC
    BOTTOM = p5_instance.BOTTOM
    BURN = p5_instance.BURN
    CENTER = p5_instance.CENTER
    CHORD = p5_instance.CHORD
    CLAMP = p5_instance.CLAMP
    CLOSE = p5_instance.CLOSE
    CONTROL = p5_instance.CONTROL
    CORNER = p5_instance.CORNER
    CORNERS = p5_instance.CORNERS
    CROSS = p5_instance.CROSS
    CURVE = p5_instance.CURVE
    DARKEST = p5_instance.DARKEST
    DEG_TO_RAD = p5_instance.DEG_TO_RAD
    DEGREES = p5_instance.DEGREES
    DELETE = p5_instance.DELETE
    DIFFERENCE = p5_instance.DIFFERENCE
    DILATE = p5_instance.DILATE
    DODGE = p5_instance.DODGE
    DOWN_ARROW = p5_instance.DOWN_ARROW
    ENTER = p5_instance.ENTER
    ERODE = p5_instance.ERODE
    ESCAPE = p5_instance.ESCAPE
    EXCLUSION = p5_instance.EXCLUSION
    FILL = p5_instance.FILL
    GRAY = p5_instance.GRAY
    GRID = p5_instance.GRID
    HALF_PI = p5_instance.HALF_PI
    HAND = p5_instance.HAND
    HARD_LIGHT = p5_instance.HARD_LIGHT
    HSB = p5_instance.HSB
    HSL = p5_instance.HSL
    IMAGE = p5_instance.IMAGE
    IMMEDIATE = p5_instance.IMMEDIATE
    INVERT = p5_instance.INVERT
    ITALIC = p5_instance.ITALIC
    LANDSCAPE = p5_instance.LANDSCAPE
    LEFT = p5_instance.LEFT
    LEFT_ARROW = p5_instance.LEFT_ARROW
    LIGHTEST = p5_instance.LIGHTEST
    LINE_LOOP = p5_instance.LINE_LOOP
    LINE_STRIP = p5_instance.LINE_STRIP
    LINEAR = p5_instance.LINEAR
    LINES = p5_instance.LINES
    MIRROR = p5_instance.MIRROR
    MITER = p5_instance.MITER
    MOVE = p5_instance.MOVE
    MULTIPLY = p5_instance.MULTIPLY
    NEAREST = p5_instance.NEAREST
    NORMAL = p5_instance.NORMAL
    OPAQUE = p5_instance.OPAQUE
    OPEN = p5_instance.OPEN
    OPTION = p5_instance.OPTION
    OVERLAY = p5_instance.OVERLAY
    P2D = p5_instance.P2D
    P3D = p5_instance.WEBGL
    PI = p5_instance.PI
    PIE = p5_instance.PIE
    POINTS = p5_instance.POINTS
    PORTRAIT = p5_instance.PORTRAIT
    POSTERIZE = p5_instance.POSTERIZE
    PROJECT = p5_instance.PROJECT
    QUAD_STRIP = p5_instance.QUAD_STRIP
    QUADRATIC = p5_instance.QUADRATIC
    QUADS = p5_instance.QUADS
    QUARTER_PI = p5_instance.QUARTER_PI
    RAD_TO_DEG = p5_instance.RAD_TO_DEG
    RADIANS = p5_instance.RADIANS
    RADIUS = p5_instance.RADIUS
    REPEAT = p5_instance.REPEAT
    REPLACE = p5_instance.REPLACE
    RETURN = p5_instance.RETURN
    RGB = p5_instance.RGB
    RIGHT = p5_instance.RIGHT
    RIGHT_ARROW = p5_instance.RIGHT_ARROW
    ROUND = p5_instance.ROUND
    SCREEN = p5_instance.SCREEN
    SHIFT = p5_instance.SHIFT
    SOFT_LIGHT = p5_instance.SOFT_LIGHT
    SQUARE = p5_instance.SQUARE
    STROKE = p5_instance.STROKE
    SUBTRACT = p5_instance.SUBTRACT
    TAB = p5_instance.TAB
    TAU = p5_instance.TAU
    TEXT = p5_instance.TEXT
    TEXTURE = p5_instance.TEXTURE
    THRESHOLD = p5_instance.THRESHOLD
    TOP = p5_instance.TOP
    TRIANGLE_FAN = p5_instance.TRIANGLE_FAN
    TRIANGLE_STRIP = p5_instance.TRIANGLE_STRIP
    TRIANGLES = p5_instance.TRIANGLES
    TWO_PI = p5_instance.TWO_PI
    UP_ARROW = p5_instance.UP_ARROW
    VIDEO = p5_instance.VIDEO
    WAIT = p5_instance.WAIT
    WEBGL = p5_instance.WEBGL

    frameCount = p5_instance.frameCount
    focused = p5_instance.focused
    displayWidth = p5_instance.displayWidth
    displayHeight = p5_instance.displayHeight
    windowWidth = p5_instance.windowWidth
    windowHeight = p5_instance.windowHeight
    width = p5_instance.width
    height = p5_instance.height
    deviceOrientation = p5_instance.deviceOrientation
    accelerationX = p5_instance.accelerationX
    accelerationY = p5_instance.accelerationY
    accelerationZ = p5_instance.accelerationZ
    pAccelerationX = p5_instance.pAccelerationX
    pAccelerationY = p5_instance.pAccelerationY
    pAccelerationZ = p5_instance.pAccelerationZ
    rotationX = p5_instance.rotationX
    rotationY = p5_instance.rotationY
    rotationZ = p5_instance.rotationZ
    pRotationX = p5_instance.pRotationX
    pRotationY = p5_instance.pRotationY
    pRotationZ = p5_instance.pRotationZ
    turnAxis = p5_instance.turnAxis
    keyIsPressed = p5_instance.keyIsPressed
    key = p5_instance.key
    keyCode = p5_instance.keyCode
    mouseX = p5_instance.mouseX
    mouseY = p5_instance.mouseY
    pmouseX = p5_instance.pmouseX
    pmouseY = p5_instance.pmouseY
    winMouseX = p5_instance.winMouseX
    winMouseY = p5_instance.winMouseY
    pwinMouseX = p5_instance.pwinMouseX
    pwinMouseY = p5_instance.pwinMouseY
    mouseButton = p5_instance.mouseButton
    mouseIsPressed = p5_instance.mouseIsPressed
    touches = p5_instance.touches
    pixels = p5_instance.pixels

    return draw_func(*args, **kwargs)


def global_p5_injection(p5_sketch):
    """
    Injects the p5js's skecth instance as a global variable to setup and draw functions
    """

    def decorator(f, event_function=False):
        def wrapper(*args, **kwargs):
            global _P5_INSTANCE
            _P5_INSTANCE = p5_sketch
            try:
                initiate_worker_timer()
                temp_output = pre_draw(_P5_INSTANCE, f, *args, **kwargs)
                cancel_worker_timer()
                return temp_output
            except:
                cancel_worker_timer()
                traceback_str = traceback.format_exc()
                log_error_to_console(traceback_str)
        
        def event_wrapper(event):
            wrapper()

        if event_function:
            return event_wrapper
        return wrapper

    return decorator


def start_p5(preload_func, setup_func, draw_func, event_functions):
    """
    This is the entrypoint function. It accepts 4 parameters:

    - preload_func: A Python preload callable
    - setup_func: a Python setup callable
    - draw_func: a Python draw callable
    - event_functions: a config dict for the event functions in the format:
                       {"eventFunctionName": python_event_function}

    This method gets the p5js's sketch instance and injects them
    """

    def sketch_setup(p5_sketch):
        """
        Callback function called to configure new p5 instance
        """
        p5_sketch.preload = global_p5_injection(p5_sketch)(preload_func)
        p5_sketch.setup = global_p5_injection(p5_sketch)(setup_func)
        p5_sketch.draw = global_p5_injection(p5_sketch)(draw_func)


    window.instance = p5.new(sketch_setup, 'sketch-holder')

    # Register event functions
    event_function_names = (
        "deviceMoved", "deviceTurned", "deviceShaken", "windowResized",
        "keyPressed", "keyReleased", "keyTyped",
        "mousePressed", "mouseReleased", "mouseClicked", "doubleClicked",
        "mouseMoved", "mouseDragged", "mouseWheel",
        "touchStarted", "touchMoved", "touchEnded", "keyIsDown",
    )
    for f_name in [f for f in event_function_names if event_functions.get(f, None)]:
        func = event_functions[f_name]
        event_func = global_p5_injection(window.instance)(func, True)
        setattr(window.instance, f_name, event_func)
'''
placeholder_code = '''
def preload():
    pass

def setup():
    pass

def draw():
    pass

deviceMoved = None
deviceTurned = None
deviceShaken = None
keyPressed = None
keyReleased = None
keyTyped = None
mouseMoved = None
mouseDragged = None
mousePressed = None
mouseReleased = None
mouseClicked = None
doubleClicked = None
mouseWheel = None
touchStarted = None
touchMoved = None
touchEnded = None
windowResized = None
'''
start_code = '''
event_functions = {
    "deviceMoved": deviceMoved,
    "deviceTurned": deviceTurned,
    "deviceShaken": deviceShaken,
    "keyPressed": keyPressed,
    "keyReleased": keyReleased,
    "keyTyped": keyTyped,
    "mouseMoved": mouseMoved,
    "mouseDragged": mouseDragged,
    "mousePressed": mousePressed,
    "mouseReleased": mouseReleased,
    "mouseClicked": mouseClicked,
    "doubleClicked": doubleClicked,
    "mouseWheel": mouseWheel,
    "touchStarted": touchStarted,
    "touchMoved": touchMoved,
    "touchEnded": touchEnded,
    "windowResized": windowResized,
}

start_p5(preload, setup, draw, event_functions)
'''
clear_namespace_code = '''
# Reset variables in global namespace
globals_copy = globals().copy()
for var in globals_copy:
    if var in ['default_ns', '_P5_INSTANCE']:
        continue
    if var not in default_ns:
        del globals()[var]
del var
del globals_copy
'''

import os

def build_code_dict():
    code_dict = {
        "importCode": import_code,
        "defineNamespaceCode": define_namespace_code,
        "wrapperCode": wrapper_code,
        "placeholderCode": placeholder_code,
        "startCode": start_code,
        "clearNamespaceCode": clear_namespace_code
    }

    package_file = read_package_file()
    code_dict[package_file["name"]] = package_file["code"]

    testing_file = read_testing_file()
    code_dict[testing_file["name"]] = testing_file["code"]

    game_files = read_game_files()
    for game_file in game_files:
        code_dict[game_file["name"]] = game_file["code"]
    
    return code_dict
    
def read_package_file():
    file_code = ''
    with open("./graphicPackage/package.py", "r") as package_file:
        file_code = package_file.read()
    return {"name": "graphicPackageCode", "code": file_code}

def read_testing_file():
    file_code = ''
    with open("./testing/testing_script.py", "r") as testing_file:
        file_code = testing_file.read()
    return {"name": "testingCode", "code": file_code}

def read_game_files():
    game_files = []
    games_dir = "./graphicPackage/graphicGames/"
    game_file_names = os.listdir(games_dir)
    for game_file_name in game_file_names:
        file_code = ''
        with open(os.path.join(games_dir, game_file_name), "r") as game_file:
            file_code = game_file.read()
        game_files.append({"name": get_game_name(game_file_name), "code": file_code})
    return game_files

def get_game_name(file_name):
    return "graphic" + file_name.split('.')[0].capitalize() + "Code"

def build_definitions(code_dict):
    result = ''
    for const_name in list(code_dict.keys()):
        result += f"const {const_name} = `\n"
        result += code_dict[const_name]
        result += "\n`;\n\n"
    return result

def build_exporter(code_dict):
    result = ''
    result += 'const preBuiltCode = {\n'
    for const_name in list(code_dict.keys()):
        result += f'\t"{const_name}": {const_name},\n'
    result += '};\n\n'
    result += 'export default preBuiltCode;'
    return result

output = ''
code_dict = build_code_dict()
output += build_definitions(code_dict)
output += build_exporter(code_dict)
boilerplate_file = open("./static/pyodideCore/boilerplate.js", "w")
boilerplate_file.write('')
boilerplate_file.write(output)
boilerplate_file.close()
