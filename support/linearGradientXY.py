import matplotlib.pyplot as plt
from shapely.geometry import LineString, Point
import math



def executePlot(cX,cY,r,amount,offset_deg):
    # Calculate polygon points
    def get_polygon_points(cx, cy, r, amount, offset_deg=0):
        points = []
        for i in range(amount):
            theta = math.radians(offset_deg + i * (360 / amount))
            x = cx + r * math.cos(theta)
            y = cy + r * math.sin(theta)
            points.append((x, y))
        return points

    # Generate hexagon and edges
    polygon_points = get_polygon_points(cX, cY, r, amount, offset_deg)
    hexagon_edges = [LineString([polygon_points[i], polygon_points[(i+1)%amount]]) for i in range(amount)]

    # Generate rays from center
    rays = []
    for i in range(amount):
        theta = math.radians(i * (360 / amount))
        x = cX + r * 2 * math.cos(theta)
        y = cY + r * 2 * math.sin(theta)
        rays.append(LineString([(cX, cY), (x, y)]))

    # Find intersections
    intersections = []
    for ray in rays:
        for edge in hexagon_edges:
            inter = ray.intersection(edge)
            if inter.is_empty:
                continue
            elif isinstance(inter, Point):
                intersections.append(inter)
                break
            elif isinstance(inter, LineString):
                mid = inter.interpolate(0.5, normalized=True)
                intersections.append(mid)
                break

    # Plotting
    fig, ax = plt.subplots(figsize=(6, 6))
    # Draw hexagon
    hx, hy = zip(*polygon_points + [polygon_points[0]])
    ax.plot(hx, hy, color='cyan', linewidth=2)

    # Draw rays
    for ray in rays:
        x, y = ray.xy
        ax.plot(x, y, color='red', linestyle='--')

    # Draw center
    ax.plot(cX, cY, 'ro')

    # Draw intersection points
    for pt in intersections:
        print((round(pt.x, 1), round(pt.y, 1)))
        ax.plot(pt.x, pt.y, 'bo')

    # Draw circle
    circle = plt.Circle((cX, cY), r, color='gray', fill=False, linestyle=':')
    ax.add_patch(circle)

    ax.set_aspect('equal')
    ax.set_title("Preseci crvenih linija i stranica šestougla (offset 30°) + kružnica")
    plt.grid(True)
    plt.show()
    print('\n')

executePlot(50,50,50,6,30)
executePlot(50,50,50,4,45)