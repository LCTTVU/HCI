import json
from scipy.spatial import ConvexHull


def extract_coordinates(feature):
    """
    Extract the first set of coordinates from the feature.
    """
    if "geometry" in feature and "coordinates" in feature["geometry"]:
        coordinates = feature["geometry"]["coordinates"]
        
        # Check if the feature represents a building
        if "properties" in feature and "building" in feature["properties"] and feature["properties"]["building"] == "yes":
            points = coordinates[0][0]
            hull = ConvexHull(points)

            hull_points = [points[vertex] for vertex in hull.vertices]
            res = [[hull_points]]
            return res
    return None

def main(input_file):
    """
    Load GeoJSON data, extract the first set of coordinates from each building feature, and write to a new GeoJSON file.
    """
    with open(input_file, 'r', encoding='utf-8') as f:
        geojson_data = json.load(f)

    for feature in geojson_data["features"]:
        if "properties" in feature and "building" in feature["properties"] and feature["properties"]["building"] == "yes":
            first_set = extract_coordinates(feature)
            if first_set:
                feature["geometry"]["coordinates"] = first_set

    output_file = input_file.replace('.geojson', '_convex.geojson')
    with open(output_file, 'w', encoding='utf-8') as f:
        json.dump(geojson_data, f, indent=2)
    print("Modified building features and saved to '{}'.".format(output_file))

if __name__ == "__main__":
    input_file = "cleaned3.geojson"  # Provide the input GeoJSON file path here
    main(input_file)
