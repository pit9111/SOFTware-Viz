
def function_all_authors(db):
    query = '''
        FOR doc IN documents
            FOR author IN doc.author
                RETURN CONCAT(author.forename, " ", author.surname)

    '''
    all_authors = db.AQLQuery(query, rawResults=True)
    return all_authors










