import json

def remove_duplicates(input_file):
    with open(input_file, 'r', encoding='utf-8') as f:
        geojson_data = json.load(f)

    unique_osm_ids = set()  # Set to store unique osm_ids and osm_way_ids
    unique_osm_way_ids = set()
    duplicates_removed = 0  # Counter for the number of duplicates removed

    # Iterate through features
    new_features = []
    i=0
    
    for feature in geojson_data["features"]:
        properties = feature.get("properties", {})
        osm_id = properties.get("osm_id")
        osm_way_id = properties.get("osm_way_id")
        
        if osm_id:
            if osm_id in unique_osm_ids:
                duplicates_removed += 1
            else:
                unique_osm_ids.add(osm_id)
                new_features.append(feature)
        elif osm_way_id:
            if osm_way_id in unique_osm_way_ids:
                duplicates_removed += 1
            else:
                unique_osm_way_ids.add(osm_way_id)
                new_features.append(feature)

        # Check if osm_id or osm_way_id is already encountered
        

    # Update the features in the GeoJSON data
    geojson_data["features"] = new_features

    # Write the updated GeoJSON data to a new file
    output_file = input_file.replace('.geojson', '_no_duplicates.geojson')
    with open(output_file, 'w', encoding='utf-8') as f:
        json.dump(geojson_data, f, indent=2)

    print("Duplicates removed:", duplicates_removed)
    print("Unique features remaining:", len(new_features))
    print("Updated GeoJSON saved to:", output_file)

# Example usage:
input_file = "buildings2.geojson"  # Replace with your input GeoJSON file path
remove_duplicates(input_file)
