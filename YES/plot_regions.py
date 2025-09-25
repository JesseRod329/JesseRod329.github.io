
import matplotlib.pyplot as plt
from mpl_toolkits.mplot3d import Axes3D
import sys

def plot_regions():
    # Data from the REGIONS object in the HTML file
    regions = {
        'Auditory Cortex': (-0.8, 0.6, -0.2),
        "Wernicke's Area": (-0.5, 0.65, -0.05),
        'Ventral Tegmental Area': (-0.1, 0.4, 0.0),
        'Nucleus Accumbens': (0.2, 0.5, 0.1),
        'Prefrontal Cortex': (0.7, 0.75, 0.2),
        'Amygdala': (0.1, 0.35, -0.3),
    }

    # Extract coordinates
    labels = list(regions.keys())
    coords = list(regions.values())
    x = [c[0] for c in coords]
    y = [c[1] for c in coords]
    z = [c[2] for c in coords]

    # Create 3D plot
    fig = plt.figure(figsize=(12, 9))
    ax = fig.add_subplot(111, projection='3d')

    # Scatter plot
    scatter = ax.scatter(x, y, z, c=range(len(labels)), cmap='viridis', s=100, marker='o')

    # Add labels
    for i, label in enumerate(labels):
        ax.text(x[i] + 0.02, y[i] + 0.02, z[i], f'  {label}', size=10, zorder=1, color='k')

    # Set labels for axes and title
    ax.set_xlabel('X Coordinate (Left/Right)')
    ax.set_ylabel('Y Coordinate (Up/Down)')
    ax.set_zlabel('Z Coordinate (Forward/Backward)')
    ax.set_title('3D Plot of Brain Region Coordinates', size=16)
    
    # Improve layout
    fig.tight_layout()

    # Save the plot to a file
    output_filename = 'brain_regions_plot.png'
    plt.savefig(output_filename)

    print(f"Plot successfully saved to {output_filename}")

if __name__ == "__main__":
    try:
        plot_regions()
    except ImportError:
        print("Error: matplotlib is not installed. Please install it using 'pip install matplotlib'", file=sys.stderr)
        sys.exit(1)
    except Exception as e:
        print(f"An error occurred: {e}", file=sys.stderr)
        sys.exit(1)
