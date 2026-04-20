import math

def get_svg_arc_center(x1, y1, rx, ry, phi, fA, fS, x2, y2):
    # From SVG 1.1 spec, section F.6.5
    # Step 1: Compute (x1', y1')
    dx = (x1 - x2) / 2.0
    dy = (y1 - y2) / 2.0
    x1p = math.cos(phi) * dx + math.sin(phi) * dy
    y1p = -math.sin(phi) * dx + math.cos(phi) * dy

    # Ensure radii are large enough
    Lambda = (x1p**2) / (rx**2) + (y1p**2) / (ry**2)
    if Lambda > 1:
        rx = math.sqrt(Lambda) * rx
        ry = math.sqrt(Lambda) * ry

    # Step 2: Compute (cx', cy')
    sign = 1 if fA != fS else -1
    num = (rx**2)*(ry**2) - (rx**2)*(y1p**2) - (ry**2)*(x1p**2)
    den = (rx**2)*(y1p**2) + (ry**2)*(x1p**2)
    if num < 0: num = 0
    coef = sign * math.sqrt(num / den)
    cxp = coef * ((rx * y1p) / ry)
    cyp = coef * (-(ry * x1p) / rx)

    # Step 3: Compute (cx, cy) from (cx', cy')
    sx = (x1 + x2) / 2.0
    sy = (y1 + y2) / 2.0
    cx = math.cos(phi) * cxp - math.sin(phi) * cyp + sx
    cy = math.sin(phi) * cxp + math.cos(phi) * cyp + sy

    return cx, cy

R = 40
theta = 8
x1 = 0
y1 = R
x2 = R * math.sin(math.radians(theta))
y2 = R * math.cos(math.radians(theta))

print("Theta=8")
print("sweep=0, large=0:", get_svg_arc_center(x1, y1, R, R, 0, 0, 0, x2, y2))
print("sweep=1, large=0:", get_svg_arc_center(x1, y1, R, R, 0, 0, 1, x2, y2))
print("sweep=0, large=1:", get_svg_arc_center(x1, y1, R, R, 0, 1, 0, x2, y2))
print("sweep=1, large=1:", get_svg_arc_center(x1, y1, R, R, 0, 1, 1, x2, y2))

theta = 150
x2 = R * math.sin(math.radians(theta))
y2 = R * math.cos(math.radians(theta))

print("\nTheta=150")
print("sweep=0, large=0:", get_svg_arc_center(x1, y1, R, R, 0, 0, 0, x2, y2))
print("sweep=1, large=0:", get_svg_arc_center(x1, y1, R, R, 0, 0, 1, x2, y2))
print("sweep=0, large=1:", get_svg_arc_center(x1, y1, R, R, 0, 1, 0, x2, y2))
print("sweep=1, large=1:", get_svg_arc_center(x1, y1, R, R, 0, 1, 1, x2, y2))
