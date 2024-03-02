import json

def remove_osm_way_id(features):
    """
    Removes features from the list if their "osm_way_id" matches any ID in the ids_to_remove list.
    """
    # Define the list of IDs to remove
    ids_to_remove = [631641082]  # Add your IDs here

    filtered_features = []
    for feature in features:
        if "properties" in feature and "osm_way_id" in feature["properties"]:
            osm_way_id = feature["properties"]["osm_way_id"]
            if osm_way_id not in ids_to_remove:
                filtered_features.append(feature)
        else:
            filtered_features.append(feature)
    return filtered_features

def main():
    """
    Reads GeoJSON data from the input file, removes features with "osm_way_id" present in ids_to_remove,
    and writes the filtered data to the output file.
    """
    input_file = "cleaned6.geojson"  # Input GeoJSON file path
    output_file = "cleaned7.geojson"  # Output GeoJSON file path

    with open(input_file, 'r', encoding='utf-8') as f:
        geojson_data = json.load(f)

    if "features" in geojson_data and isinstance(geojson_data["features"], list):
        filtered_features = remove_osm_way_id(geojson_data["features"])
        geojson_data["features"] = filtered_features

        with open(output_file, 'w', encoding='utf-8') as f:
            json.dump(geojson_data, f, indent=2)
        print("Filtered GeoJSON data saved to:", output_file)
    else:
        print("Input GeoJSON data is invalid or does not contain features.")

if __name__ == "__main__":
    main()
