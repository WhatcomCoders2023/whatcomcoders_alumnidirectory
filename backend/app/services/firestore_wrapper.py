import collections

collections.Iterable = collections.abc.Iterable
 

class FirestoreDBWrapper:
    def __init__(self, firestore_client):
        self.firestore_client = firestore_client 

    def store_user_in_db(self, user_info: dict) -> None:
        """Stores the user info in Firestore"""
        user_ref = self.firestore_client.collection('users').document(user_info.get('email'))
        user_ref.set(user_info)

    def get_user_data_by_email(self, email: str) -> dict:
        """Retrieves user data from Firestore by email"""
        user_ref = self.firestore_client.collection('users').document(email)
        user_data = user_ref.get()

        if user_data.exists:
            return user_data.to_dict()
        else:
            return None   
    
    def get_profile_by_name(self, nameSlug: str) -> dict:
        """Retrieves user data from Firestore by name slug"""
        print(nameSlug)
        user_ref = self.firestore_client.collection('users').where('name', '==', nameSlug)
        docs = user_ref.get()

        # Iterate over the query results
        for doc in docs:
            if doc.exists:
                print(doc.to_dict())
                # Return the whole document data
                return doc.to_dict()
        

        # Return None if no document matches the query
        return None

    def get_all_users(self) -> list:
        """Retrieves all users from Firestore"""
        users = self.firestore_client.collection('users').stream()
        users_list = []
        for user in users:
            users_list.append(user.to_dict())
        return users_list
    
    def update_user_info(self, data: dict) -> None:
        """Updates user info in Firestore"""
        users_ref = self.firestore_client.collection('users')
        user_document = users_ref.document(data.get('email'))
        user_document.update(data)