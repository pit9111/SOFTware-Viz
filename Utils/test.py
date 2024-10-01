

def function_test_software(db):
    list_software = db.AQLQuery("for soft in softwares return distinct soft.software_name.rawForm", rawResults=True)
    return list_software