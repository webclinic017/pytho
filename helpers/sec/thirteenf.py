from typing import TypedDict, List
from bs4 import BeautifulSoup as bs
from bs4.element import ResultSet


class Position(TypedDict):
    title: str
    cusip: str
    value: int
    shares: int
    shares_type: str


class ThirteenFParser:
    def _parse(self):
        self.positions: List[Position] = []
        for info_table in self.info_tables:
            position = Position(
                title=info_table.find("titleofclass").string,
                cusip=info_table.find("cusip").string,
                value=int(info_table.find("value").string),
                shares=int(info_table.find("sshprnamt").string),
                shares_type=info_table.find("sshprnamttype").string,
            )
            self.positions.append(position)
        return

    def __init__(self, xml):
        self.xml = bs(xml, "lxml")
        self.info_tables: ResultSet = self.xml.find_all("infotable")
        self._parse()
        return

    def get_positions(self) -> List[Position]:
        return self.positions
