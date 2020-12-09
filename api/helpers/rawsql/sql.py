class SQLReader:
    @staticmethod
    def get_sample_long_sql():
        with open("./api/helpers/rawsql/random_sample_long.sql", "r") as f:
            return f.read()

    @staticmethod
    def get_sample_sql():
        with open("./api/helpers/rawsql/random_sample.sql", "r") as f:
            return f.read()
