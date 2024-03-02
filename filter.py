import json

def remove_null_attributes(geojson):
    if isinstance(geojson, dict):
        for key, value in list(geojson.items()):
            if value is None:
                del geojson[key]
            elif isinstance(value, (dict, list)):
                remove_null_attributes(value)
    elif isinstance(geojson, list):
        for item in geojson:
            remove_null_attributes(item)

def filter_objects(geojson):
    if isinstance(geojson, list):
        return [item for item in geojson if not is_administrative_boundary(item) and not is_parking(item) and not is_road(item) and not is_underground(item) and not is_misc(item)]
    elif isinstance(geojson, dict):
        for key, value in geojson.items():
            geojson[key] = filter_objects(value)
    return geojson

def is_residential_building(feature):
    if 'properties' in feature and 'building' in feature['properties']:
        return (feature['properties']['building'] == 'residential')
    return False

def is_parking(feature):
    if 'properties' in feature and 'amenity' in feature['properties']:
        return (feature['properties']['amenity'] == 'parking')
    return False


def is_misc(feature):
    if 'properties' in feature and 'landuse' in feature['properties']:
        return ((feature['properties']['landuse'] == 'military'))
    return False

def is_administrative_boundary(feature):
    if 'properties' in feature and 'boundary' in feature['properties']:
        return feature['properties']['boundary'] == 'administrative'
    return False

def is_highway_pedestrian(feature):
    if 'properties' in feature and 'other_tags' in feature['properties']:
        return ('pedestrian' in feature['properties']['other_tags'])
    return False

def is_square(feature):
    if 'properties' in feature and "place" in feature['properties']:
        return (feature['properties']["place"] == 'square')
    return False

def is_attraction(feature):
    if 'properties' in feature and 'tourism' in feature['properties']:
        return (feature['properties']['tourism'] == 'attraction')
    return False

def is_road(feature):
    return is_highway_pedestrian(feature) and not is_square(feature) and not is_attraction(feature)

def is_underground(feature):
    if 'properties' in feature and 'other_tags' in feature['properties']:
        return ('\"tunnel\"=>\"yes\"' in feature['properties']['other_tags']) or ('underground' in feature['properties']['other_tags'])
    return False


def is_residential_landuse(feature):
    if 'properties' in feature and 'landuse' in feature['properties']:
        return feature['properties']['landuse'] == 'residential'
    return False

def main(input_file, output_file):
    with open(input_file, 'r', encoding='utf-8') as f:
        geojson_data = json.load(f)

    remove_null_attributes(geojson_data)
    filtered_geojson = filter_objects(geojson_data)

    with open(output_file, 'w', encoding='utf-8') as f:
        json.dump(filtered_geojson, f, indent=2)

if __name__ == "__main__":
    import argparse

    parser = argparse.ArgumentParser(description="Remove objects with properties \"building\": \"residential\", \"boundary\": \"administrative\", and \"landuse\": \"residential\" from GeoJSON file.")
    parser.add_argument("input_file", help="Input GeoJSON file path")
    parser.add_argument("output_file", help="Output GeoJSON file path")

    args = parser.parse_args()

    main(args.input_file, args.output_file)
