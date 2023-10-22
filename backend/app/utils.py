import requests
import os
import pathlib

import collections

collections.Iterable = collections.abc.Iterable

from google_auth_oauthlib.flow import Flow
from google.cloud import storage

def setup_google_auth_flow()-> Flow:
    client_secrets_file = os.path.join(
    pathlib.Path(__file__).parent, "../client_secret.json")

    flow = Flow.from_client_secrets_file(
        client_secrets_file=client_secrets_file,
        scopes=[
            "https://www.googleapis.com/auth/userinfo.profile",
            "https://www.googleapis.com/auth/userinfo.email",
            "openid",
        ],
        redirect_uri="http://localhost:4000/callback"
        # redirect_uri="https://gothic-sled-375305.firebaseapp.com/callback"
    )
    return flow

def get_bucket_from_client(
        client: storage.Client, 
        bucket_name: str
        ) -> storage.Bucket:
    photo_bucket = client.bucket(bucket_name)
    return photo_bucket

def setup_gcs_client():
    client = storage.Client()
    return client

def upload_photo_to_bucket(url: str, user_id: str) -> None:
    """Fetches the photo from the given URL and stores it in GCS"""
    client = setup_gcs_client()
    photo_bucket = get_bucket_from_client(client, os.getenv('BUCKET_NAME'))
    image_response = requests.get(url)
    if image_response.status_code == 200:
        blob = photo_bucket.blob(f'photos/{user_id}.jpg')
        blob.upload_from_string(image_response.content, content_type='image/jpeg')
    else:
        raise Exception(f"Failed to fetch image from {url}")
