def function_test_software(db):
    query = f"""
                FOR doc IN documents
                for struc in doc.structures
                RETURN DISTINCT struc
            """
    list_software = db.AQLQuery(query, rawResults=True)
    return list_software