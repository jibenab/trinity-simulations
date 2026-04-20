import cairo
import math

def render_capillary(theta, filename, sweep_flag):
    W, H = 200, 200
    cx, cy = 100, 100
    R = 40
    refL = 54
    
    surface = cairo.ImageSurface(cairo.FORMAT_ARGB32, W, H)
    ctx = cairo.Context(surface)
    
    # Fill background
    ctx.set_source_rgb(0.9, 0.9, 0.9)
    ctx.paint()
    
    # Left wall
    ctx.set_source_rgb(0, 0, 0)
    ctx.set_line_width(2)
    ctx.move_to(cx, 0)
    ctx.line_to(cx, 200)
    ctx.stroke()
    
    # Meniscus tangent (just to visualize)
    ctx.set_source_rgb(0, 0, 1)
    # The downward wall line
    ctx.set_dash([4, 4])
    ctx.move_to(cx, cy)
    ctx.line_to(cx, cy + refL)
    ctx.stroke()
    
    # The tangent line
    thetaRad = math.radians(theta)
    tX = cx + refL * math.sin(thetaRad)
    tY = cy + refL * math.cos(thetaRad)
    ctx.move_to(cx, cy)
    ctx.line_to(tX, tY)
    ctx.stroke()
    
    # To draw the arc mathematically the way SVG does it:
    # Since we know the center is cx, cy, we can just draw the arc natively.
    # But wait, SVG sweep=0 means decreasing angle (CCW).
    # Downward in cairo is PI/2.
    # Tangent is PI/2 - theta (since it goes towards negative y as theta increases? Wait. \sin is positive, \cos is positive for small theta).
    # let's just make the image so we can think.

render_capillary(150, "test1.png", 0)
