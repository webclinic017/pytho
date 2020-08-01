class SQLReader:

    @staticmethod
    def get_sample_sql():
        with open('./api/helpers/random_sample.sql', 'r') as f:
           return f.read()
