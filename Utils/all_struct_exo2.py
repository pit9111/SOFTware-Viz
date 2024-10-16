def function_doc_software(db):
    query = '''
        FOR doc IN documents
        LET softwares = (
            FOR edge IN edge_software
            FILTER edge._from == doc._id
            LET software = DOCUMENT(edge._to)
            RETURN software.software_name.normalizedForm
        )
        FILTER LENGTH(softwares) > 0
        RETURN {
            "hal_id": doc.file_hal_id,
            "softwares": UNIQUE(softwares)
        }
    '''
    doc_software = db.AQLQuery(query, rawResults=True)
    return doc_software