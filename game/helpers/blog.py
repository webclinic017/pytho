import os
import yaml

class Blog:

    @staticmethod
    def _get_post_text(loc):
        file_path = os.path.join(os.path.dirname(__file__), 'templates/game/markdown/' + loc)
        if (os.path.exists(file_path)):
          with open(file_path) as f:
              return f.read()
        return None

    def get_post_by_slug(self, slug):
        posts_meta = Blog.get_meta()
        post_text = None
        post_meta = None
        for meta in posts_meta:
            if meta['slug'] == slug:
                post_meta = meta
                post_text = get_post_text(meta['location'])
        return post_text, post_meta
     
    @staticmethod
    def get_meta():
        meta_path = os.path.join(os.path.dirname(__file__), 'templates/game/meta/')
        paths = [i for i in os.listdir(meta_path)]
        posts = []
        for meta in paths:
            with open(meta_path + meta, 'r') as f:
                posts.append(yaml.safe_load(f.read()))
        return posts

    def __init__(self):
        return

