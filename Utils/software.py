from collections import defaultdict

def software_all_mentions(software,structure, db):
    list_file_hal_id = []
    if structure is None:
        query = f"""
        FOR software IN softwares
          FILTER software.software_name.normalizedForm == "{software}"
          LET max_field = (
            FOR field IN ['used', 'created', 'shared']
              LET score = software.mentionContextAttributes[field].score
              SORT score DESC
              LIMIT 1
              RETURN field
          )[0]
          FOR edge IN edge_software
            FILTER edge._to == software._id
            LET doc_id = edge._from
            LET doc = DOCUMENT(doc_id)
            RETURN DISTINCT {{'file_hal_id': doc.file_hal_id, max_field: max_field, 'date': doc.date, 'author': doc.author, 'structure': doc.structures}}
        """
    else:
        query = f"""
                FOR software IN softwares
                  FILTER software.software_name.normalizedForm == "{software}"
                  LET max_field = (
                    FOR field IN ['used', 'created', 'shared']
                      LET score = software.mentionContextAttributes[field].score
                      SORT score DESC
                      LIMIT 1
                      RETURN field
                  )[0]
                  FOR edge IN edge_software
                    FILTER edge._to == software._id
                    LET doc_id = edge._from
                    LET doc = DOCUMENT(doc_id)
                    FILTER '{structure}' IN doc.structures 
                    RETURN DISTINCT {{'file_hal_id': doc.file_hal_id, max_field: max_field, 'date': doc.date, 'author': doc.author, 'structure': doc.structures}}
                """
    try:
        list_attr_halid = db.AQLQuery(query, rawResults=True)
    except Exception as e:
        print(f'Error executing query: {e}')
        return None, None, None, None  # Returning None in case of query failure
    result_dict = {}
    min_year = float('inf')
    max_year = float('-inf')
    max_occurrences = 0
    structure_dict = defaultdict(list)

    for item in list_attr_halid:
        max_field = item['max_field']
        year = item['date'].split('-')[0]  # Assuming 'date' is in 'YYYY-MM-DD' format
        file_hal_id = item['file_hal_id']

        file_hal_id = item['file_hal_id']
        for structure in item['structure']:
            if file_hal_id in structure_dict:
                if structure not in structure_dict[file_hal_id]:
                    structure_dict[file_hal_id].append(structure)
            else:
                structure_dict[file_hal_id] = [
                    structure]  # If the key doesn't exist, create a new list with the structure


        if max_field not in result_dict:
            result_dict[max_field] = {}

        if year not in result_dict[max_field]:
            result_dict[max_field][year] = [0, []]

        result_dict[max_field][year][0] += 1
        result_dict[max_field][year][1].append(file_hal_id)
        list_file_hal_id.append(file_hal_id)

        # Update min and max year
        year_int = int(year)
        if year_int < min_year:
            min_year = year_int
        if year_int > max_year:
            max_year = year_int

        # Update max occurrences
        if result_dict[max_field][year][0] > max_occurrences:
            max_occurrences = result_dict[max_field][year][0]

    if min_year == float('inf'):
        min_year = None
    if max_year == float('-inf'):
        max_year = None
    return result_dict, min_year, max_year, max_occurrences, list_file_hal_id


def find_duplicate_positions(data_list):
    position_counts = {}

    for item in data_list:
        for data_point in item['data']:
            position = (data_point['x'], data_point['y'])
            if position in position_counts:
                position_counts[position] += [item['label']]
            else:
                position_counts[position] = [item['label']]
    position_counts_cleaned = {}
    for key, value in position_counts.items():
        if len(value) > 1:
            position_counts_cleaned[key] = value
    return position_counts_cleaned


def dataset_creator(raw_dictionnary):
    dataset = []
    dataset_label = {}

    #boucle for sur les clés et valeurs de la data
    for label, values in raw_dictionnary.items():
        # parsing each dictionnary for every possible labels and creating variables
        if label == 'created':
            new_dataset = {"label": label, "backgroundColor": "#363949", "borderColor": "#363949", "data": [],
                           "order": 0}
        elif label == 'used':
            new_dataset = {"label": label, "backgroundColor": "#6C9BCF", "borderColor": "#6C9BCF", "data": [],
                           "order": 1}
        elif label == 'shared':
            new_dataset = {"label": label, "backgroundColor": "#677483", "borderColor": "#677483", "data": [],
                           "order": 2}
        #parsing each doctionnary with all the files and the information
        for item, data in values.items():
            # for each entries we create a new bubble with its coordinates
            new_data = {"x": int(item), "y": data[0], "v": data[0], "label": data[1]}
            # we append the value of each data in the dataset we created above
            new_dataset['data'].append(new_data)
        # for each types of labels we create a new dataset and new bubbles for the graph, using the raw_dictionnary
        dataset.append(new_dataset)

    # this function returns a dictionnary of bubble's coordinates that are the same and overlap
    position_counts = find_duplicate_positions(dataset)
    print(position_counts)
    # check if there is any overlapping bubble
    if position_counts:
        # parsing every overlapping bubble
        for date,label_list in position_counts.items():
            # check if there is more than two labels
            if len(label_list) >= 2:
               # parsing the full original dataset with every bubble
               for data in dataset:
                   # looking for every bubbles that has the label of an overlapping bubble
                   if data['label'] == label_list[0]:
                       # checking the coordinates of every bubble
                      for data_point in data['data']:
                          # check inside the originale dataset if the bubble is one of the overlapping ones
                          if data_point['x'] == date[0] and data_point['v'] == date[1]:
                            data_point['display_custom'] = 'off'
                            padding = (data_point['v']*4)*0.01
                            data_point['x'] -= padding

                   elif data['label'] == label_list[1]:
                      for data_point in data['data']:
                          if data_point['x'] == date[0] and data_point['v'] == date[1]:
                            padding = (data_point['v']*4) * 0.01
                            data_point['x'] += padding
                            data_point['display_custom'] = 'off'

        dataset_label = {"label": "label", "backgroundColor": "transparent", "borderColor": "transparent",
                         "data": [],
                         "order": 3}

        for blank_data_point in position_counts.keys():
            new_point = {"x": blank_data_point[0], "y": blank_data_point[1], "v": blank_data_point[1], "label": "", "display_custom" : "on"}
            dataset_label['data'].append(new_point)
        dataset.append(dataset_label)
    return dataset

