class SQLReader:
    @staticmethod
    def get_sample_periods():
        with open(
            "./api/helpers/sample/rawsql/random_periods.sql", "r"
        ) as f:
            return f.read()
