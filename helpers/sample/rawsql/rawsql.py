class SQLReader:
    @staticmethod
    def get_sample_periods():
        with open(
            "./helpers/sample/rawsql/random_periods.sql", "r"
        ) as f:
            return f.read()
